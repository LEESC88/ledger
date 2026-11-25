/* MonetaX Engine - Offline Queue, Local Hydration, Cloud Sync & Supabase Auth */

/**
 * Offline Draft Queue & Cloud Synchronization Manager
 */
function getOfflineQueueStorageKey() {
  const userKey = state.user?.id || 'guest';
  return `ledger_offline_queue_${userKey}`;
}

function getLocalReceiptMapKey(userId = state.user?.id) {
  return `ledger_local_receipt_map_${userId || 'guest'}`;
}

function getReceiptGraceKey(userId = state.user?.id) {
  return `ledger_receipt_grace_started_at_${userId || 'guest'}`;
}

function getOfflineQueue() {
  try {
    const raw = localStorage.getItem(getOfflineQueueStorageKey());
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveOfflineQueue(queue) {
  try {
    localStorage.setItem(getOfflineQueueStorageKey(), JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to save offline queue:', e);
  }
  updateSyncStatusUI();
}

function getMetaSyncQueueStorageKey() {
  const userKey = state.user?.id || 'guest';
  return `ledger_meta_sync_queue_${userKey}`;
}

function getMetaSyncQueue() {
  try {
    const raw = localStorage.getItem(getMetaSyncQueueStorageKey());
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveMetaSyncQueue(queue) {
  try {
    localStorage.setItem(getMetaSyncQueueStorageKey(), JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to save meta sync queue:', e);
  }
  updateSyncStatusUI();
}

function enqueueMetaSync(entityType, action, payload) {
  if (!payload || !payload.id) return;
  const key = `${entityType}:${payload.id}`;
  const queue = getMetaSyncQueue().filter((item) => item.key !== key);
  queue.push({
    key,
    entityType,
    action,
    payload,
    updatedAt: new Date().toISOString(),
  });
  saveMetaSyncQueue(queue);
}

function removeMetaSync(entityType, id) {
  if (!id) return;
  const key = `${entityType}:${id}`;
  const queue = getMetaSyncQueue();
  const next = queue.filter((item) => item.key !== key);
  if (next.length !== queue.length) {
    saveMetaSyncQueue(next);
  }
}

function getTotalPendingSyncCount() {
  return getOfflineQueue().length + getMetaSyncQueue().length;
}

async function syncClaimToCloud(claim, options = {}) {
  /**
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS (sync.js Spot 1 - 委托给 LedgerStore.claims.upsert):
   * 1. 删除下面从 `if (!claim || !claim.id) return false;` 一直到 `return false;` 的全部代码
   * 2. 保留函数结尾的 `}` 不动
   * 3. 原地写成一行：
   *      return LedgerStore.claims.upsert(claim, options);
   * ============================================================================
   */
  // ✍️ YOUR TURN: Delete the inline Supabase + fetch block below and delegate to LedgerStore:
  return LedgerStore.claims.upsert(claim, options);
}
async function deleteClaimInCloud(claimId, options = {}) {
  /**
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS (sync.js Spot 2 - 委托给 LedgerStore.claims.remove):
   * 1. 删除下面从 `if (!claimId) return false;` 一直到 `return false;` 的全部代码
   * 2. 保留函数结尾的 `}` 不动
   * 3. 原地写成一行：
   *      return LedgerStore.claims.remove(claimId, options);
   * ============================================================================
   */
  // ✍️ YOUR TURN: Delete the inline delete block below and delegate to LedgerStore:

  return LedgerStore.claims.remove(claimId, options);
}
function updateSyncStatusUI() {
  if (!elements.syncStatusPill || !elements.syncStatusText) return;

  const pendingCount = getTotalPendingSyncCount();
  state.isOnline = navigator.onLine;

  if (state.isSyncing) {
    elements.syncStatusPill.className = 'sync-status-pill sync-pill-syncing';
    elements.syncSpinnerIcon?.classList.remove('hidden');
    elements.syncStatusText.textContent = `${t('sync_syncing')} (${pendingCount})`;
    return;
  }

  elements.syncSpinnerIcon?.classList.add('hidden');

  if (!state.isOnline) {
    elements.syncStatusPill.className = 'sync-status-pill sync-pill-offline';
    elements.syncStatusText.textContent =
      pendingCount > 0
        ? `${t('sync_offline')} (${pendingCount})`
        : t('sync_offline');
  } else if (pendingCount > 0) {
    elements.syncStatusPill.className = 'sync-status-pill sync-pill-offline';
    elements.syncStatusText.textContent = `${pendingCount} Pending`;
  } else {
    elements.syncStatusPill.className = 'sync-status-pill sync-pill-online';
    elements.syncStatusText.textContent = t('sync_synced');
  }
}

async function syncOfflineDrafts() {
  if (state.isSyncing) return;
  if (!navigator.onLine) {
    showToast(
      state.lang === 'zh'
        ? '当前处于离线状态，无法同步'
        : 'Cannot sync while offline',
      true,
    );
    return;
  }

  const queue = getOfflineQueue();
  const metaQueue = getMetaSyncQueue();
  if (queue.length === 0 && metaQueue.length === 0) {
    updateSyncStatusUI();
    return;
  }

  state.isSyncing = true;
  updateSyncStatusUI();

  let successCount = 0;
  const remainingQueue = [];
  const userId = state.user?.id;

  for (const item of queue) {
    try {
      if (
        item.payload.image_url &&
        String(item.payload.image_url).startsWith('data:image/') &&
        typeof uploadReceiptToCloud === 'function'
      ) {
        item.payload.image_url = await uploadReceiptToCloud(
          item.payload.image_url,
        );
      }

      if (supabaseClient && userId) {
        const baseInsert = {
          user_id: userId,
          type: item.payload.type,
          amount: item.payload.amount,
          category: item.payload.category,
          account_name: item.payload.account_name || 'Cash',
          date: item.payload.date,
          note: item.payload.note || null,
        };
        let { error } = await supabaseClient.from('records').insert({
          ...baseInsert,
          image_url: item.payload.image_url || null,
          image_size_kb: item.payload.image_size_kb || 0,
        });
        if (error && error.message?.includes('image_')) {
          const retry = await supabaseClient.from('records').insert(baseInsert);
          error = retry.error;
        }

        if (error) {
          remainingQueue.push(item);
        } else {
          successCount++;
        }
      } else {
        const res = await fetch('/api/records', {
          method: 'POST',
          headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(item.payload),
        });

        if (!res.ok) {
          remainingQueue.push(item);
        } else {
          successCount++;
        }
      }
    } catch (err) {
      remainingQueue.push(item);
    }
  }

  const remainingMetaQueue = [];
  let metaSuccessCount = 0;
  for (const item of metaQueue) {
    try {
      let ok = false;
      if (item.entityType === 'project') {
        if (item.action === 'delete') {
          ok =
            typeof deleteProjectInCloud === 'function'
              ? await deleteProjectInCloud(item.payload.id, { fromQueue: true })
              : false;
        } else if (typeof syncProjectChangeToCloud === 'function') {
          ok = await syncProjectChangeToCloud(
            item.payload,
            {},
            { fromQueue: true },
          );
        }
      } else if (item.entityType === 'claim') {
        if (item.action === 'delete') {
          ok = await deleteClaimInCloud(item.payload.id, { fromQueue: true });
        } else {
          ok = await syncClaimToCloud(item.payload, { fromQueue: true });
        }
      }
      if (ok) {
        metaSuccessCount++;
      } else {
        remainingMetaQueue.push(item);
      }
    } catch (err) {
      remainingMetaQueue.push(item);
    }
  }

  saveOfflineQueue(remainingQueue);
  saveMetaSyncQueue(remainingMetaQueue);
  state.isSyncing = false;
  updateSyncStatusUI();

  const totalSynced = successCount + metaSuccessCount;
  if (totalSynced > 0) {
    showToast(
      state.lang === 'zh'
        ? `已同步 ${totalSynced} 条离线记录`
        : `Synced ${totalSynced} offline item(s)!`,
    );
    const refreshTasks = [];
    if (successCount > 0) {
      refreshTasks.push(loadRecords(), loadSummary());
    }
    if (metaSuccessCount > 0) {
      if (typeof fetchProjectsFromBackend === 'function') {
        refreshTasks.push(fetchProjectsFromBackend());
      }
      if (typeof fetchClaimsFromBackend === 'function') {
        refreshTasks.push(fetchClaimsFromBackend());
      }
    }
    if (refreshTasks.length > 0) {
      await Promise.all(refreshTasks);
    }
  }
}

function updateSummaryStatusBadge(netBalance) {
  if (!elements.balanceTrendBadge) return;
  const net = Number(netBalance || 0);
  if (net > 0) {
    elements.balanceTrendBadge.className = 'status-pill status-positive';
    elements.balanceTrendBadge.textContent = t('status_surplus');
  } else if (net < 0) {
    elements.balanceTrendBadge.className = 'status-pill status-negative';
    elements.balanceTrendBadge.textContent = t('status_deficit');
  } else {
    elements.balanceTrendBadge.className = 'status-pill status-neutral';
    elements.balanceTrendBadge.textContent = t('status_balanced');
  }
}

function calculateLocalSummaryMetrics() {
  let records = state.records;
  if (state.currentMonth !== 'all') {
    records = records.filter(
      (r) => r.date && r.date.startsWith(state.currentMonth),
    );
  }

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryBreakdown = {};

  for (const record of records) {
    const amt = Number(record.amount || 0);
    if (record.type === 'income') {
      totalIncome += amt;
    } else {
      totalExpense += amt;
      categoryBreakdown[record.category] =
        (categoryBreakdown[record.category] || 0) + amt;
    }
  }

  state.summary = {
    month: state.currentMonth,
    totalIncome: Number(totalIncome.toFixed(2)),
    totalExpense: Number(totalExpense.toFixed(2)),
    netBalance: Number((totalIncome - totalExpense).toFixed(2)),
    categoryBreakdown,
  };

  if (elements.netBalanceValue)
    elements.netBalanceValue.textContent = formatNumber(
      state.summary.netBalance,
    );
  if (elements.totalIncomeValue)
    elements.totalIncomeValue.textContent = formatNumber(
      state.summary.totalIncome,
    );
  if (elements.totalExpenseValue)
    elements.totalExpenseValue.textContent = formatNumber(
      state.summary.totalExpense,
    );
  fitKpiMiniValues();

  updateSummaryStatusBadge(state.summary.netBalance);
  renderCategoryChart(categoryBreakdown);
  updateDailySpendingTrend();
  renderBudgetTracker();
}

function saveOfflineRecord(payload) {
  const queue = getOfflineQueue();
  const draftId = `draft-${Date.now()}`;
  const draftItem = {
    id: draftId,
    payload,
    createdAt: new Date().toISOString(),
  };
  queue.unshift(draftItem);
  saveOfflineQueue(queue);

  const draftRecord = {
    id: draftId,
    type: payload.type,
    amount: payload.amount,
    category: payload.category,
    account_name: payload.account_name || 'Cash',
    date: payload.date,
    note: payload.note,
    image_url: payload.image_url || null,
    image_size_kb: payload.image_size_kb || 0,
    isDraft: true,
  };
  state.pendingReceiptDataUrl = null;
  state.pendingReceiptSizeKb = 0;
  state.records = [draftRecord, ...state.records];

  updateMonthFilterDropdown(state.records);
  renderTable();
  calculateLocalSummaryMetrics();
  updateAccountModalData();
  renderStreakAndBadges();

  showToast(
    state.lang === 'zh'
      ? `已离线保存（待同步 ${queue.length} 笔）`
      : `Offline: Saved locally (${queue.length} pending)`,
  );
  if (elements.inputAmount) elements.inputAmount.value = '';
  if (elements.inputNote) elements.inputNote.value = '';
  closeCreateModal();
}

/**
 * Fetch and Render Financial Summary
 */
async function loadSummary() {
  try {
    if (supabaseClient && state.user?.id) {
      calculateLocalSummaryMetrics();
      await loadBudget(state.currentMonth);
      return;
    }

    const url =
      state.currentMonth === 'all'
        ? '/api/records/summary'
        : `/api/records/summary?month=${state.currentMonth}`;

    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch summary');
    const data = await res.json();
    state.summary = data;

    elements.netBalanceValue.textContent = formatNumber(data.netBalance);
    elements.totalIncomeValue.textContent = formatNumber(data.totalIncome);
    elements.totalExpenseValue.textContent = formatNumber(data.totalExpense);
    fitKpiMiniValues();

    updateSummaryStatusBadge(data.netBalance);
    renderCategoryChart(data.categoryBreakdown);
    updateDailySpendingTrend();
    await loadBudget(state.currentMonth);
  } catch (err) {
    calculateLocalSummaryMetrics();
    await loadBudget(state.currentMonth);
  }
}

/**
 * Fetch and Render All Records
 */
async function loadRecords() {
  const requestUserId = state.user?.id || null;
  if (!requestUserId) {
    return;
  }
  const userKey = requestUserId;
  const cacheKey = `ledger_cached_records_${userKey}`;
  try {
    localStorage.removeItem('ledger_cached_records_guest');
  } catch (e) {}
  const queue = getOfflineQueue();
  const draftRecords = queue.map((item) => ({
    id: item.id,
    type: item.payload.type,
    amount: item.payload.amount,
    category: item.payload.category,
    account_name: item.payload.account_name || 'Cash',
    date: item.payload.date,
    note: item.payload.note,
    image_url: item.payload.image_url || null,
    image_size_kb: item.payload.image_size_kb || 0,
    isDraft: true,
  }));

  const normalizeRecordList = (list) => {
    let localReceipts = {};
    try {
      localReceipts = JSON.parse(
        localStorage.getItem(getLocalReceiptMapKey(requestUserId)) || '{}',
      );
    } catch (e) {}
    return (Array.isArray(list) ? list : [])
      .filter((r) => {
        const ownerId = r?.user_id || r?.userId;
        return !ownerId || String(ownerId) === String(requestUserId);
      })
      .map((r) => {
        const normDate = normalizeRecordDateYMD(r?.date) || r?.date || '';
        const fallbackKey = `${normDate}_${r?.type}_${Number(r?.amount)}_${r?.category}`;
        const localEntry =
          (r?.id && localReceipts[String(r.id)]) ||
          localReceipts[fallbackKey] ||
          null;
        return {
          ...r,
          date: normDate,
          image_url:
            r?.image_url !== undefined
              ? r.image_url
              : localEntry?.image_url || null,
          image_size_kb:
            r?.image_size_kb !== undefined
              ? r.image_size_kb
              : localEntry?.image_size_kb || 0,
          image_archived:
            r?.image_archived !== undefined
              ? r.image_archived
              : Boolean(localEntry?.image_archived),
        };
      });
  };

  const applyRecords = (serverRecords) => {
    if ((state.user?.id || null) !== requestUserId) {
      return;
    }
    const cleanServerRecords = normalizeRecordList(serverRecords);
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cleanServerRecords));
    } catch (e) {
      // Ignore storage quota warning
    }

    state.records = [
      ...normalizeRecordList(draftRecords),
      ...cleanServerRecords,
    ];
    updateMonthFilterDropdown(state.records);
    renderTable();
    calculateLocalSummaryMetrics();
    updateAccountModalData();
    loadAccounts();
    renderStreakAndBadges();
    if (typeof checkTwoYearReceiptRetention === 'function') {
      checkTwoYearReceiptRetention();
    }
  };

  const userId = requestUserId;

  try {
    if (supabaseClient && userId) {
      const { data, error } = await supabaseClient
        .from('records')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        applyRecords(data);
        return;
      }
    }

    const res = await fetch('/api/records', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch records');
    const data = await res.json();
    applyRecords(Array.isArray(data) ? data : []);
  } catch (err) {
    let cachedRecords = [];
    try {
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw) cachedRecords = JSON.parse(cachedRaw);
    } catch (e) {
      // Ignore parse error
    }

    state.records = [
      ...normalizeRecordList(draftRecords),
      ...normalizeRecordList(cachedRecords),
    ];
    updateMonthFilterDropdown(state.records);
    renderTable();
    calculateLocalSummaryMetrics();
    updateAccountModalData();
    loadAccounts();
    renderStreakAndBadges();
  }
}

/**
 * Populate Month Selector dynamically
 * Always includes the current calendar month (YYYY-MM) and defaults selection to state.currentMonth.
 */
function updateMonthFilterDropdown(records) {
  if (!elements.monthFilter) return;
  const currentMonthKey = getCurrentMonthKey();
  const months = new Set([currentMonthKey]);
  if (Array.isArray(records)) {
    records.forEach((r) => {
      if (r.date && r.date.length >= 7) {
        months.add(r.date.substring(0, 7));
      }
    });
  }
  if (Array.isArray(state.claims)) {
    state.claims.forEach((c) => {
      if (c.date && c.date.length >= 7) {
        months.add(c.date.substring(0, 7));
      }
    });
  }

  const sortedMonths = Array.from(months).sort().reverse();
  const desiredValue = state.currentMonth || currentMonthKey;

  let optionsHtml = `<option value="all">${escapeHtml(t('all_months'))}</option>`;
  sortedMonths.forEach((m) => {
    optionsHtml += `<option value="${m}">${m}</option>`;
  });

  elements.monthFilter.innerHTML = optionsHtml;
  if (desiredValue === 'all' || sortedMonths.includes(desiredValue)) {
    elements.monthFilter.value = desiredValue;
  } else {
    state.currentMonth = currentMonthKey;
    elements.monthFilter.value = currentMonthKey;
  }
}

/**
 * Sync User Profile & Preferences to Cloud Supabase Auth metadata
 */
async function syncUserProfileToCloud(updates) {
  if (!supabaseClient || !state.user?.id) return;
  try {
    const { data, error } = await supabaseClient.auth.updateUser({
      data: updates,
    });
    if (!error && data?.user) {
      state.user = data.user;
    }
  } catch (err) {
    console.warn('Could not sync user profile to cloud:', err);
  }
}

/**
 * Dynamically fetch public configuration and initialize Supabase client
 */
async function initSupabaseClient() {
  if (!window.supabase) return;

  let url = SUPABASE_DEFAULT_CONFIG.url;
  let anonKey = SUPABASE_DEFAULT_CONFIG.anonKey;

  const isNative = !!(window.NativeUpdater || window.Capacitor);
  if (!isNative) {
    try {
      const res = await fetch('/api/records/config');
      if (res.ok) {
        const config = await res.json();
        if (config.supabaseUrl && config.supabaseAnonKey) {
          url = config.supabaseUrl;
          anonKey = config.supabaseAnonKey;
        }
      }
    } catch (err) {
      // Standalone mobile APK uses default BaaS config
    }
  }

  try {
    supabaseClient = window.supabase.createClient(url, anonKey);
  } catch (err) {
    console.error('Failed to create Supabase client:', err);
  }
}

/**
 * Native Android OAuth Deep-Link Callback Receiver (com.leesc88.ledger://oauth)
 */
window.__handleNativeOAuthCallback = async function (payloadStr) {
  if (!payloadStr || !supabaseClient) return;
  try {
    const clean = String(payloadStr).replace(/^[#?]+/, '');
    const params = new URLSearchParams(clean);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (access_token && refresh_token) {
      const { data, error } = await supabaseClient.auth.setSession({
        access_token,
        refresh_token,
      });
      if (!error && data?.session?.user) {
        state.user = data.session.user;
        updateAuthUI(state.user);
        showToast(
          `Welcome, ${state.user.user_metadata?.full_name || state.user.email}!`,
        );
        await Promise.all([
          loadRecords(),
          loadSummary(),
          fetchProjectsFromBackend(),
          fetchClaimsFromBackend(),
        ]);
      }
    }
  } catch (err) {
    console.error('Native OAuth callback error:', err);
  }
};

/**
 * Initiate Google OAuth Sign-in Flow
 */
async function signInWithGoogle() {
  if (!supabaseClient)
    return showToast('Supabase client not initialized', true);
  const redirectTarget = window.Capacitor
    ? 'com.leesc88.ledger://oauth'
    : window.location.origin;
  await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTarget,
    },
  });
}

/**
 * Sign out current authenticated user session
 */
function signOutUser() {
  showConfirmModal({
    title: state.lang === 'zh' ? '确认退出登录？' : 'Sign Out?',
    subtitle: state.user?.email || '',
    desc:
      state.lang === 'zh'
        ? '确定要退出当前登录的 Google 账号吗？'
        : 'Are you sure you want to sign out of your account?',
    confirmText: state.lang === 'zh' ? '退出登录' : 'Sign Out',
    danger: true,
    onConfirm: async () => {
      if (supabaseClient) {
        await supabaseClient.auth.signOut().catch(() => {});
      }
      state.user = null;
      state.records = [];
      state.projects = [];
      state.claims = [];
      state.summary = null;
      localStorage.removeItem('ledger_last_active_user_id');
      elements.receiptRetentionBanner?.classList.add('hidden');
      renderTable();
      switchAppPage('ledger');
      updateAuthUI(null);
      showToast(
        state.lang === 'zh' ? '已安全退出登录' : 'Signed out successfully',
      );
    },
  });
}

/**
 * Update UI presentation based on authentication state
 */
function updateAuthUI(user) {
  if (user) {
    localStorage.setItem('ledger_has_session', 'true');
    document.documentElement.classList.add('has-auth-session');
    elements.loginLandingView?.classList.add('hidden');
    elements.appLayout?.classList.remove('hidden');

    const meta = user.user_metadata || {};

    // 1. Restore Custom Name from Cloud metadata
    if (meta.custom_name && meta.custom_name.trim()) {
      localStorage.setItem(
        'ledger_custom_name_' + user.id,
        meta.custom_name.trim(),
      );
    }

    // 2. Restore Custom Avatar from Cloud metadata
    if (meta.custom_avatar) {
      localStorage.setItem(
        'ledger_custom_avatar_' + user.id,
        meta.custom_avatar,
      );
    }

    // 3. Restore or Anchor First Login Date (Active Days) in Cloud
    const firstLoginKey = 'ledger_first_login_' + user.id;
    let firstLogin = meta.first_login_at || localStorage.getItem(firstLoginKey);
    if (!firstLogin) {
      firstLogin = new Date().toISOString();
      localStorage.setItem(firstLoginKey, firstLogin);
      syncUserProfileToCloud({ first_login_at: firstLogin });
    } else {
      localStorage.setItem(firstLoginKey, firstLogin);
      if (!meta.first_login_at) {
        syncUserProfileToCloud({ first_login_at: firstLogin });
      }
    }

    // 4. Restore Preferences from Cloud if present
    if (meta.currency && meta.currency !== state.currency) {
      state.currency = meta.currency;
      localStorage.setItem('ledger_currency', state.currency);
      if (elements.currencySelector)
        elements.currencySelector.value = state.currency;
      updateCurrencySymbols();
    }
    if (meta.lang && meta.lang !== state.lang) {
      setAppLanguage(meta.lang);
    }
    if (
      meta.theme &&
      meta.theme !== (localStorage.getItem('ledger_theme') || 'system')
    ) {
      setAppTheme(meta.theme);
    }
    if (
      meta.ledger_budget_topups &&
      typeof meta.ledger_budget_topups === 'object'
    ) {
      loadBudgetTopUps();
      state.budgetTopUps = {
        ...meta.ledger_budget_topups,
        ...(state.budgetTopUps || {}),
      };
      localStorage.setItem(
        getBudgetTopUpsStorageKey(),
        JSON.stringify(state.budgetTopUps),
      );
      renderBudgetTracker();
    }

    const displayName = getUserDisplayName(user);
    if (elements.userName) elements.userName.textContent = displayName;
    if (elements.dropdownUserName) {
      elements.dropdownUserName.textContent = displayName;
    }

    setAvatarWithFallback(elements.userAvatar, user);
    setAvatarWithFallback(elements.dropdownAvatar, user);
    updateAccountModalData();
  } else {
    localStorage.removeItem('ledger_has_session');
    document.documentElement.classList.remove('has-auth-session');
    elements.loginLandingView?.classList.remove('hidden');
    elements.appLayout?.classList.add('hidden');
    closeProfileDropdown();
    closeCreateModal();
    closeInAppUpdateModal();
  }
  updateSyncStatusUI();
}

/**
 * Instant Local Cache Hydration (<16ms 0-delay first-frame render)
 * Restores previous active session's records, summary, projects, and claims directly from localStorage
 * so the user sees full UI immediately without waiting for network/cloud round-trips.
 */
function hydrateLocalCacheImmediately() {
  try {
    // Purge any legacy unauthenticated guest cache to guarantee strict tenant isolation
    localStorage.removeItem('ledger_cached_records_guest');
    localStorage.removeItem('ledger_projects_guest');
    localStorage.removeItem('ledger_claims_guest');
    localStorage.removeItem('ledger_local_receipt_map');
    localStorage.removeItem('ledger_receipt_grace_started_at');

    const userKey = localStorage.getItem('ledger_last_active_user_id');
    if (!userKey) return;

    // Synchronously hydrate projects, claims, and budget top-ups before metric/budget render
    try {
      const rawProjects = localStorage.getItem(`ledger_projects_${userKey}`);
      const parsedProjects = rawProjects ? JSON.parse(rawProjects) : [];
      const deletedProjects = getDeletedIdsSet(
        `ledger_deleted_projects_${userKey}`,
      );
      if (Array.isArray(parsedProjects)) {
        state.projects = parsedProjects.filter(
          (p) => p && p.id && !deletedProjects.has(String(p.id)),
        );
      }
    } catch (e) {}

    try {
      const rawClaims = localStorage.getItem(`ledger_claims_${userKey}`);
      const parsedClaims = rawClaims ? JSON.parse(rawClaims) : [];
      const deletedClaims = getDeletedIdsSet(
        `ledger_deleted_claims_${userKey}`,
      );
      if (Array.isArray(parsedClaims)) {
        state.claims = parsedClaims.filter(
          (c) => c && c.id && !deletedClaims.has(String(c.id)),
        );
      }
    } catch (e) {}

    try {
      const rawTopUps = localStorage.getItem(`ledger_budget_topups_${userKey}`);
      const parsedTopUps = rawTopUps ? JSON.parse(rawTopUps) : null;
      if (parsedTopUps && typeof parsedTopUps === 'object') {
        state.budgetTopUps = parsedTopUps;
      }
    } catch (e) {}

    const cacheKey = `ledger_cached_records_${userKey}`;
    const raw = localStorage.getItem(cacheKey);
    if (raw) {
      try {
        const cachedRecords = JSON.parse(raw);
        if (Array.isArray(cachedRecords) && cachedRecords.length > 0) {
          state.records = cachedRecords.filter((r) => {
            const ownerId = r?.user_id || r?.userId;
            return !ownerId || String(ownerId) === String(userKey);
          });
          updateMonthFilterDropdown(state.records);
          renderTable();
          calculateLocalSummaryMetrics();
          renderStreakAndBadges();
          updateAccountModalData();
          loadAccounts();
        }
      } catch (e) {
        console.error('Error parsing cached records:', e);
      }
    }
    if (typeof renderBudgetTracker === 'function') renderBudgetTracker();
    if (typeof renderSinkingFunds === 'function') renderSinkingFunds();
    if (typeof renderClaims === 'function') renderClaims();
  } catch (err) {
    console.warn('Local cache hydration fallback:', err);
  }
}
