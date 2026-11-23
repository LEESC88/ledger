/* MonetaX Engine - Profile, Theme, Privacy, Accounts, Streaks & 2-Year Retention */

// ============================================================================
// Google OAuth & Supabase Authentication Handlers
// ============================================================================

/**
 * Compress Avatar Image using HTML5 Canvas (128x128 JPEG, ~6-10 KB)
 */
function compressAvatarImage(file, maxSize = 128, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function isDarkModeActive() {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark') return true;
  if (attr === 'light') return false;
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

function getInitialsAvatar(name) {
  const initial = (name || 'U').trim().charAt(0).toUpperCase();
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="50" fill="#0D9488"/>
      <text x="50" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="700" fill="#FFFFFF" text-anchor="middle" dominant-baseline="central">${initial}</text>
    </svg>
  `)}`;
}

function getUserDisplayName(user) {
  if (!user) return 'User';
  const customName = localStorage.getItem('ledger_custom_name_' + user.id);
  if (customName && customName.trim()) return customName.trim();
  const meta = user.user_metadata || {};
  return (
    meta.custom_name ||
    meta.full_name ||
    meta.name ||
    user.email?.split('@')[0] ||
    'User'
  );
}

function getUserAvatar(user) {
  if (!user) return getInitialsAvatar('U');
  const custom = localStorage.getItem('ledger_custom_avatar_' + user.id);
  if (custom) return custom;
  const meta = user.user_metadata || {};
  if (meta.custom_avatar) return meta.custom_avatar;
  const googlePic = meta.avatar_url || meta.picture;
  if (googlePic) return googlePic;
  const name = getUserDisplayName(user);
  return getInitialsAvatar(name);
}

function setAvatarWithFallback(imgEl, user) {
  if (!imgEl) return;
  const url = getUserAvatar(user);
  imgEl.onerror = () => {
    imgEl.onerror = null;
    imgEl.src = getInitialsAvatar(getUserDisplayName(user));
  };
  imgEl.src = url;
}

function formatUsageDuration(firstLoginIso) {
  let days = 1;
  if (firstLoginIso) {
    const startMidnight = parseLocalMidnight(firstLoginIso);
    const todayMidnight = parseLocalMidnight(getLocalDateString());
    if (startMidnight && todayMidnight) {
      days =
        Math.max(
          0,
          Math.round(
            (todayMidnight.getTime() - startMidnight.getTime()) / 86400000,
          ),
        ) + 1;
    }
  }
  if (state.records && state.records.length > 0) {
    const streakDays = calculateStreak(state.records);
    if (streakDays > days) {
      days = streakDays;
    }
  }
  if (state.lang === 'zh') return `${days} 天`;
  return `${days} ${days === 1 ? 'Day' : 'Days'}`;
}

/**
 * Username Inline Edit Handlers
 */
function showUsernameEdit() {
  elements.usernameViewRow?.classList.add('hidden');
  elements.usernameEditRow?.classList.remove('hidden');
  if (elements.usernameInput) {
    elements.usernameInput.value = getUserDisplayName(state.user);
    elements.usernameInput.focus();
    elements.usernameInput.select();
  }
}

function cancelUsernameEdit() {
  elements.usernameEditRow?.classList.add('hidden');
  elements.usernameViewRow?.classList.remove('hidden');
}

function saveUsername() {
  if (!state.user) return;
  const newName = (elements.usernameInput?.value || '').trim();
  if (!newName) {
    return showToast(
      state.lang === 'zh' ? '用户名不能为空' : 'Username cannot be empty',
      true,
    );
  }
  localStorage.setItem('ledger_custom_name_' + state.user.id, newName);
  updateAuthUI(state.user);
  updateAccountModalData();
  cancelUsernameEdit();
  syncUserProfileToCloud({ custom_name: newName });
  showToast(
    state.lang === 'zh'
      ? `用户名已更新为 "${newName}" 并同步至云端`
      : `Username updated to "${newName}" & synced`,
  );
}

/**
 * Set application visual theme (Light / Dark / System with High Contrast)
 */
function setAppTheme(themeVal) {
  const mode = ['light', 'dark', 'system'].includes(themeVal)
    ? themeVal
    : 'system';
  localStorage.setItem('ledger_theme', mode);

  elements.themeSegmentBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.themeVal === mode);
  });

  const prefersDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const resolved = mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode;

  document.documentElement.setAttribute('data-theme', resolved);
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) {
    meta.content = mode === 'system' ? 'light dark' : resolved;
  }

  if (categoryChartInstance && state.summary?.categoryBreakdown) {
    renderCategoryChart(state.summary.categoryBreakdown);
  }
  if (dailyTrendChartInstance) {
    updateDailySpendingTrend();
  }

  if (state.user) {
    syncUserProfileToCloud({ theme: mode });
  }
}

/**
 * Toggle Financial Privacy Mode (Mask sensitive numbers with blur)
 * @param {boolean} [forceState] - Optional explicit state (used during initialization)
 */
function togglePrivacyMode(forceState) {
  const nextState =
    typeof forceState === 'boolean' ? forceState : !state.isPrivacyMode;
  state.isPrivacyMode = nextState;
  localStorage.setItem('ledger_privacy_mode', String(nextState));
  document.body.classList.toggle('privacy-active', nextState);

  if (elements.privacyIconEye && elements.privacyIconEyeOff) {
    elements.privacyIconEye.classList.toggle('hidden', nextState);
    elements.privacyIconEyeOff.classList.toggle('hidden', !nextState);
  }
  elements.privacyToggleBtn?.classList.toggle('privacy-on', nextState);

  if (typeof forceState !== 'boolean') {
    triggerHaptic(8);
    showToast(
      nextState ? t('privacy_enabled_toast') : t('privacy_disabled_toast'),
    );
  }
  return nextState;
}
window.togglePrivacyMode = togglePrivacyMode;

/**
 * Profile Dropdown Toggle and Close Handlers
 */
function toggleProfileDropdown(e) {
  e?.stopPropagation();
  const isHidden = elements.profileDropdown?.classList.contains('hidden');
  if (isHidden) {
    elements.profileDropdown?.classList.remove('hidden');
    elements.userProfilePill?.setAttribute('aria-expanded', 'true');
  } else {
    closeProfileDropdown();
  }
}

function closeProfileDropdown() {
  elements.profileDropdown?.classList.add('hidden');
  elements.userProfilePill?.setAttribute('aria-expanded', 'false');
}

/**
 * Update Inline Account Profile Card inside Settings Page
 */
function updateAccountModalData() {
  if (!state.user) return;
  setAvatarWithFallback(elements.accountModalAvatar, state.user);
  const displayName = getUserDisplayName(state.user);

  if (elements.accountModalName)
    elements.accountModalName.textContent = displayName;
  if (elements.accountModalEmail)
    elements.accountModalEmail.textContent = state.user.email;

  const firstLoginKey = 'ledger_first_login_' + state.user.id;
  const meta = state.user.user_metadata || {};
  let firstLogin = meta.first_login_at || localStorage.getItem(firstLoginKey);
  if (!firstLogin) {
    firstLogin = new Date().toISOString();
    localStorage.setItem(firstLoginKey, firstLogin);
    syncUserProfileToCloud({ first_login_at: firstLogin });
  }

  if (elements.accountMemberSince) {
    elements.accountMemberSince.textContent = new Date(
      firstLogin,
    ).toLocaleDateString(state.lang === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  if (elements.accountUsageDuration) {
    elements.accountUsageDuration.textContent = formatUsageDuration(firstLogin);
  }
  if (elements.accountTransactionCount) {
    elements.accountTransactionCount.textContent = `${state.records.length}`;
  }
  renderStreakAndBadges();
}

// ============================================================================
// Accounts Monthly Spending Breakdown Controller (Payment Channels & Expenses)
// ============================================================================

/**
 * Update the Month Selector inside the Account Spending Breakdown Card
 */
function updateSpendingAccountsMonthOptions() {
  const select = elements.spendingAccountsMonthFilter;
  if (!select) return;

  const currentKey = getCurrentMonthKey();
  if (!state.selectedAccountsMonth) {
    state.selectedAccountsMonth = 'current';
  }

  // Extract all distinct months from expense records
  const monthsSet = new Set();
  monthsSet.add(currentKey);
  (state.records || []).forEach((r) => {
    if (r.date && r.date.length >= 7) {
      monthsSet.add(r.date.substring(0, 7));
    }
  });

  const sortedMonths = Array.from(monthsSet).sort().reverse();
  const prevVal = state.selectedAccountsMonth;

  select.innerHTML = `
    <option value="current">${state.lang === 'zh' ? `本月 (${currentKey})` : `This Month (${currentKey})`}</option>
    ${sortedMonths
      .filter((m) => m !== currentKey)
      .map((m) => `<option value="${m}">${m}</option>`)
      .join('')}
    <option value="all">${state.lang === 'zh' ? '全部历史汇总' : 'All Time'}</option>
  `;

  if (prevVal === 'all') {
    select.value = 'all';
  } else if (prevVal === currentKey || prevVal === 'current') {
    select.value = 'current';
  } else if (sortedMonths.includes(prevVal)) {
    select.value = prevVal;
  } else {
    select.value = 'current';
    state.selectedAccountsMonth = 'current';
  }
}

/**
 * Load Accounts & Wallets
 */
function loadAccounts() {
  renderAccountsCenter();
}

/**
 * Render Account Monthly Spending Breakdown in Settings page
 */
function renderAccountsCenter() {
  if (!elements.accountsWalletsList) return;
  const sym = state.currency || 'RM';

  updateSpendingAccountsMonthOptions();

  const selectedMonth =
    state.selectedAccountsMonth === 'current'
      ? getCurrentMonthKey()
      : state.selectedAccountsMonth;

  // Filter records by selected month and expense type
  const matchingRecords = (state.records || []).filter((r) => {
    if (r.type !== 'expense') return false;
    if (selectedMonth === 'all') return true;
    return r.date && r.date.startsWith(selectedMonth);
  });

  // Calculate total expense for this selected period
  const totalPeriodExpense = matchingRecords.reduce(
    (sum, r) => sum + Number(r.amount || 0),
    0,
  );

  if (elements.totalNetWorthValue) {
    elements.totalNetWorthValue.textContent = formatNumber(totalPeriodExpense);
  }

  elements.accountsWalletsList.innerHTML = DEFAULT_ACCOUNTS.map((acc) => {
    const label = getAccountDisplayLabel(acc.name);
    // Find all expense records for this account in the selected month
    const accExpenses = matchingRecords.filter(
      (r) => (r.account_name || 'Cash') === acc.name,
    );
    const spentAmount = accExpenses.reduce(
      (sum, r) => sum + Number(r.amount || 0),
      0,
    );
    const txCount = accExpenses.length;
    const pct =
      totalPeriodExpense > 0
        ? Math.round((spentAmount / totalPeriodExpense) * 100)
        : 0;

    let subText = '';
    if (spentAmount > 0) {
      subText =
        state.lang === 'zh'
          ? `${txCount} 笔消费 · 占当期 ${pct}%`
          : `${txCount} record(s) · ${pct}% of total`;
    } else {
      subText = state.lang === 'zh' ? '暂无支出' : 'No spending';
    }

    return `
      <div class="wallet-card">
        <div class="wallet-card-left">
          <div class="wallet-icon-box">${acc.icon}</div>
          <div class="wallet-meta">
            <div class="wallet-name-row">
              <span class="wallet-name">${escapeHtml(label)}</span>
            </div>
            <span class="wallet-subtext">${subText}</span>
          </div>
        </div>
        <div class="wallet-card-right">
          <span class="wallet-spending-amount">${sym} ${formatNumber(spentAmount)}</span>
        </div>
      </div>
    `;
  }).join('');
}

// ============================================================================
// Avatar Lightbox Preview (Social Media Full-Size Modal)
// ============================================================================
function openAvatarLightbox(imgSrc) {
  triggerHaptic(10);
  if (!elements.avatarLightboxModal) return;

  const currentAvatarSrc =
    imgSrc ||
    elements.accountModalAvatar?.src ||
    elements.userAvatar?.src ||
    '';

  if (!currentAvatarSrc) return;

  if (elements.avatarLightboxImg) {
    elements.avatarLightboxImg.src = currentAvatarSrc;
  }
  if (elements.avatarLightboxName) {
    elements.avatarLightboxName.textContent =
      getUserDisplayName(state.user) || 'User';
  }
  if (elements.avatarLightboxEmail) {
    elements.avatarLightboxEmail.textContent = state.user?.email || '';
  }

  elements.avatarLightboxModal.classList.remove('hidden');
  pushModalHistoryState();
}

function closeAvatarLightbox(fromPopState = false) {
  triggerHaptic(10);
  elements.avatarLightboxModal?.classList.add('hidden');
  popModalHistoryIfCleared(fromPopState === true);
}

// ============================================================================
// Module: 2-Year Rolling Retention, 7-Day Grace & ZIP Backup (Phase 3)
// ============================================================================

/**
 * Filter records that have an active receipt photo older than `retentionDays` (default: 730 days / 2 years).
 */
function getExpiredReceiptRecords(retentionDays = 730) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - retentionDays);
  const cutoffDateStr = cutoff.toISOString().slice(0, 10);
  return (state.records || []).filter((r) => {
    const recDate = normalizeRecordDateYMD(r?.date) || '';
    return (
      Boolean(r?.image_url) &&
      !r?.image_archived &&
      recDate &&
      recDate < cutoffDateStr
    );
  });
}

/**
 * Check for receipt photos older than 2 years and manage the 7-day grace countdown banner.
 */
function checkTwoYearReceiptRetention() {
  const expiredList = getExpiredReceiptRecords(730);
  const graceKey = getReceiptGraceKey();
  if (expiredList.length === 0) {
    localStorage.removeItem(graceKey);
    elements.receiptRetentionBanner?.classList.add('hidden');
    return;
  }
  let startedAt = Number(localStorage.getItem(graceKey) || 0);
  if (!startedAt) {
    startedAt = Date.now();
    localStorage.setItem(graceKey, String(startedAt));
  }
  const elapsedDays = Math.floor(
    (Date.now() - startedAt) / (1000 * 60 * 60 * 24),
  );
  const remainingDays = Math.max(0, 7 - elapsedDays);
  if (remainingDays <= 0) {
    purgeExpiredReceiptsOnly(expiredList, true);
    return;
  }
  if (elements.receiptRetentionBannerDesc) {
    elements.receiptRetentionBannerDesc.textContent =
      state.lang === 'zh'
        ? `检测到 ${expiredList.length} 张满 2 年的旧凭证图片，将于 ${remainingDays} 天后自动释放云端空间（账单文字与金额永久保留）。`
        : `${expiredList.length} receipt photo(s) older than 2 years will be auto-cleaned in ${remainingDays} day(s) (bill text & amounts are kept forever).`;
  }
  elements.receiptRetentionBanner?.classList.remove('hidden');
}

/**
 * Purge expired receipt photos from cloud & local storage while keeping bill text & amounts forever.
 */
async function purgeExpiredReceiptsOnly(expiredRecords, isAutoSilent = false) {
  const targetList = Array.isArray(expiredRecords)
    ? expiredRecords
    : getExpiredReceiptRecords(730);
  if (targetList.length === 0) return;

  let localReceipts = {};
  try {
    localReceipts = JSON.parse(
      localStorage.getItem(getLocalReceiptMapKey()) || '{}',
    );
  } catch (e) {}

  for (const rec of targetList) {
    if (rec.image_url) {
      await deleteReceiptFromCloud(rec.image_url);
    }
    rec.image_url = null;
    rec.image_size_kb = 0;
    rec.image_archived = true;

    const normDate = normalizeRecordDateYMD(rec.date) || rec.date || '';
    const fallbackKey = `${normDate}_${rec.type}_${Number(rec.amount)}_${rec.category}`;
    localReceipts[String(rec.id)] = {
      image_url: null,
      image_size_kb: 0,
      image_archived: true,
    };
    localReceipts[fallbackKey] = {
      image_url: null,
      image_size_kb: 0,
      image_archived: true,
    };

    if (
      supabaseClient &&
      state.user?.id &&
      !String(rec.id).startsWith('draft-')
    ) {
      try {
        await supabaseClient
          .from('records')
          .update({
            image_url: null,
            image_size_kb: 0,
            image_archived: true,
          })
          .eq('id', rec.id)
          .eq('user_id', state.user.id);
      } catch (e) {}
    } else if (!String(rec.id).startsWith('draft-')) {
      fetch(`/api/records/${rec.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          image_url: null,
          image_size_kb: 0,
          image_archived: true,
        }),
      }).catch(() => {});
    }
  }

  try {
    localStorage.setItem(
      getLocalReceiptMapKey(),
      JSON.stringify(localReceipts),
    );
    localStorage.removeItem(getReceiptGraceKey());
  } catch (e) {}

  elements.receiptRetentionBanner?.classList.add('hidden');
  renderTable();
  if (!isAutoSilent) {
    showToast(t('receipt_retention_done_toast'));
  }
}

/**
 * Package all expired receipt photos + CSV manifest into a local ZIP download, then clean cloud storage.
 */
async function backupAndCleanExpiredReceipts() {
  const expiredList = getExpiredReceiptRecords(730);
  if (expiredList.length === 0) return;
  if (typeof window.JSZip !== 'function') {
    showToast(
      state.lang === 'zh'
        ? 'ZIP 组件未就绪，请检查网络'
        : 'JSZip library not loaded',
      true,
    );
    return;
  }

  try {
    if (elements.backupAndCleanReceiptsBtn) {
      elements.backupAndCleanReceiptsBtn.disabled = true;
    }
    const zip = new window.JSZip();
    const folder = zip.folder('MonetaX_Receipts_Archive');
    const csvLines = ['Date,Type,Category,Account,Amount,Note,Filename'];
    const packedRecords = [];
    let failedCount = 0;

    for (let i = 0; i < expiredList.length; i++) {
      const rec = expiredList[i];
      const safeCat = String(rec.category || 'Item').replace(
        /[^a-zA-Z0-9_\u4e00-\u9fa5-]/g,
        '_',
      );
      let blob = null;
      try {
        if (String(rec.image_url).startsWith('data:image/')) {
          blob = dataUrlToBlob(rec.image_url);
        } else {
          const res = await fetch(rec.image_url);
          if (res.ok) blob = await res.blob();
        }
      } catch (e) {}
      if (!blob) {
        failedCount++;
        continue;
      }
      const lowerUrl = String(rec.image_url || '').toLowerCase();
      const mimeHint =
        blob?.type ||
        (lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg')
          ? 'image/jpeg'
          : 'image/webp');
      const fileName = `${rec.date || 'unknown'}_${safeCat}_${rec.amount}_${i + 1}${getReceiptExtFromMime(mimeHint)}`;
      folder.file(fileName, blob);
      packedRecords.push(rec);
      const safeNote = String(rec.note || '').replace(/"/g, '""');
      csvLines.push(
        `${rec.date},${rec.type},"${rec.category}","${rec.account_name || 'Cash'}",${rec.amount},"${safeNote}","${fileName}"`,
      );
    }

    if (packedRecords.length === 0) {
      showToast(
        state.lang === 'zh'
          ? '收据图片获取失败，已取消清理以防数据丢失'
          : 'Failed to fetch receipts; cleanup aborted',
        true,
      );
      return;
    }

    folder.file('receipt_manifest.csv', '\uFEFF' + csvLines.join('\n'));
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const fileName = `MonetaX_Receipts_Archive_${new Date().toISOString().slice(0, 10)}.zip`;
    const saveRes = await saveBlobWithPicker(
      zipBlob,
      fileName,
      'ZIP 凭证归档包 (*.zip)',
      'application/zip',
      ['.zip'],
    );
    if (saveRes?.canceled) return;

    await purgeExpiredReceiptsOnly(packedRecords, false);
    if (failedCount > 0) {
      showToast(
        state.lang === 'zh'
          ? `有 ${failedCount} 张图片未成功导出，已保留在云端`
          : `${failedCount} receipt(s) failed to export and were kept`,
        true,
      );
    }
  } catch (err) {
    showToast(err.message || 'ZIP backup failed', true);
  } finally {
    if (elements.backupAndCleanReceiptsBtn) {
      elements.backupAndCleanReceiptsBtn.disabled = false;
    }
  }
}

// ============================================================================
// Module: Streak Counter & Motivation Badges
// ============================================================================

const MOTIVATION_BADGES = [
  {
    id: 'first_record',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>`,
    name_en: 'First Step',
    name_zh: '新人起航',
    desc_en: 'Recorded 1st entry',
    desc_zh: '记下第1笔账单',
  },
  {
    id: 'streak_3',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>`,
    name_en: '3-Day Spark',
    name_zh: '连记 3 天',
    desc_en: '3 consecutive days',
    desc_zh: '连续记账坚持3天',
  },
  {
    id: 'streak_7',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>`,
    name_en: 'Week Hero',
    name_zh: '连记 7 天',
    desc_en: '7 consecutive days',
    desc_zh: '连续记账坚持7天',
  },
  {
    id: 'streak_30',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>`,
    name_en: 'Habit Master',
    name_zh: '连记 30 天',
    desc_en: '30 consecutive days',
    desc_zh: '连续记账坚持30天',
  },
  {
    id: 'streak_100',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path></svg>`,
    name_en: 'Century Legend',
    name_zh: '百日达人',
    desc_en: '100 consecutive days',
    desc_zh: '连续记账坚持100天',
  },
];

/**
 * ----------------------------------------------------------------------------
 * Task 1: calculateStreak(records)
 * ----------------------------------------------------------------------------
 * Compute active daily recording streak.
 *
 * @param {Array<Object>} records - List of all records (each has r.date: 'YYYY-MM-DD')
 * @returns {number} Active streak count in days (0 if broken or no records)
 *
 * 💡 Hints:
 * 1. If !records || records.length === 0, return 0.
 * 2. Extract unique dates:
 *    const uniqueDates = Array.from(new Set(records.map(r => r.date).filter(Boolean)));
 * 3. Sort dates descending (newest first):
 *    uniqueDates.sort((a, b) => b.localeCompare(a));
 * 4. Get today and yesterday in ISO 'YYYY-MM-DD':
 *    const now = new Date();
 *    const today = now.toISOString().split('T')[0];
 *    now.setDate(now.getDate() - 1);
 *    const yesterday = now.toISOString().split('T')[0];
 * 5. Check if uniqueDates[0] is either today or yesterday:
 *    If not, streak is broken -> return 0.
 * 6. Start streak = 1.
 * 7. Loop through dates from i = 0 to uniqueDates.length - 2:
 *    Calculate day difference between uniqueDates[i] and uniqueDates[i + 1]:
 *    const diffDays = Math.round((new Date(uniqueDates[i]) - new Date(uniqueDates[i + 1])) / 86400000);
 *    If diffDays === 1, streak++; else break;
 * 8. Return streak.
 */
function calculateStreak(records) {
  if (!records || records.length === 0) return 0;
  const uniqueDates = Array.from(
    new Set(
      records.map((r) => normalizeRecordDateYMD(r?.date)).filter(Boolean),
    ),
  );
  uniqueDates.sort((a, b) => b.localeCompare(a));

  if (uniqueDates.length === 0) return 0;

  const now = new Date();
  const today = getLocalDateString(now);
  const yesterdayDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  );
  const yesterday = getLocalDateString(yesterdayDate);

  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const d1 = parseLocalMidnight(uniqueDates[i]);
    const d2 = parseLocalMidnight(uniqueDates[i + 1]);
    if (!d1 || !d2) break;
    const diffDays = Math.round((d1.getTime() - d2.getTime()) / 86400000);
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  // Synchronize streak with calendar usage days up to the latest active record date
  const latestActiveMidnight = parseLocalMidnight(uniqueDates[0]);
  let usageDays = 0;
  if (latestActiveMidnight) {
    if (state.user) {
      const firstLoginKey = 'ledger_first_login_' + state.user.id;
      const meta = state.user.user_metadata || {};
      const firstLogin =
        meta.first_login_at || localStorage.getItem(firstLoginKey);
      const startMidnight = parseLocalMidnight(firstLogin);
      if (startMidnight) {
        usageDays =
          Math.max(
            0,
            Math.round(
              (latestActiveMidnight.getTime() - startMidnight.getTime()) /
                86400000,
            ),
          ) + 1;
      }
    } else {
      for (let k = 0; k < localStorage.length; k++) {
        const key = localStorage.key(k);
        if (key && key.startsWith('ledger_first_login_')) {
          const val = localStorage.getItem(key);
          const startMidnight = parseLocalMidnight(val);
          if (startMidnight) {
            const candidate =
              Math.max(
                0,
                Math.round(
                  (latestActiveMidnight.getTime() - startMidnight.getTime()) /
                    86400000,
                ),
              ) + 1;
            usageDays = Math.max(usageDays, candidate);
          }
        }
      }
    }
  }

  if (usageDays > 0 && usageDays > streak) {
    streak = usageDays;
  }

  return streak;
}

/**
 * ----------------------------------------------------------------------------
 * Task 2: evaluateBadges(streakDays, totalRecords)
 * ----------------------------------------------------------------------------
 * Evaluate which milestone badges are unlocked.
 *
 * @param {number} streakDays - Current active consecutive days
 * @param {number} totalRecords - Total transaction records count
 * @returns {Array<string>} Array of unlocked badge IDs (e.g. ['first_record', 'streak_3'])
 *
 * 💡 Hints:
 * 1. Initialize an empty array: const unlocked = [];
 * 2. Check each milestone threshold:
 *    - if (totalRecords >= 1) unlocked.push('first_record');
 *    - if (streakDays >= 3)   unlocked.push('streak_3');
 *    - if (streakDays >= 7)   unlocked.push('streak_7');
 *    - if (streakDays >= 30)  unlocked.push('streak_30');
 *    - if (streakDays >= 100) unlocked.push('streak_100');
 * 3. Return unlocked.
 */
function evaluateBadges(streakDays, totalRecords) {
  const unlocked = [];
  if (totalRecords >= 1) unlocked.push('first_record');
  if (streakDays >= 3) unlocked.push('streak_3');
  if (streakDays >= 7) unlocked.push('streak_7');
  if (streakDays >= 30) unlocked.push('streak_30');
  if (streakDays >= 100) unlocked.push('streak_100');
  return unlocked;
}

/**
 * Render streak counter and achievement badges to the UI.
 */
function renderStreakAndBadges() {
  state.streakDays = calculateStreak(state.records);
  state.unlockedBadges = evaluateBadges(state.streakDays, state.records.length);

  if (elements.streakCountText) {
    elements.streakCountText.textContent = `${state.streakDays}d`;
  }
  if (elements.streakPill) {
    if (state.streakDays > 0) {
      elements.streakPill.classList.add('streak-active');
    } else {
      elements.streakPill.classList.remove('streak-active');
    }
  }
  if (elements.settingsStreakCount) {
    elements.settingsStreakCount.textContent = `${state.streakDays} ${state.lang === 'zh' ? '天连记' : 'Days'}`;
  }
  if (elements.badgesGridContainer) {
    elements.badgesGridContainer.innerHTML = MOTIVATION_BADGES.map((badge) => {
      const isUnlocked = state.unlockedBadges.includes(badge.id);
      const name = state.lang === 'zh' ? badge.name_zh : badge.name_en;
      const desc = state.lang === 'zh' ? badge.desc_zh : badge.desc_en;
      const status = isUnlocked
        ? state.lang === 'zh'
          ? '已解锁'
          : 'Unlocked'
        : state.lang === 'zh'
          ? '未解锁'
          : 'Locked';
      return `
        <div class="badge-item ${isUnlocked ? 'unlocked' : 'locked'}">
          <span class="badge-icon">${badge.icon}</span>
          <span class="badge-name">${name}</span>
          <span class="badge-desc">${desc}</span>
          <span class="badge-status">${status}</span>
        </div>
        `;
    }).join('');
  }
}

/**
 * Custom Avatar Upload & Reset Handlers
 */
async function handleAvatarFileSelected(e) {
  const file = e.target.files?.[0];
  if (!file || !state.user) return;
  if (!file.type.startsWith('image/')) {
    return showToast('Please select a valid image file', true);
  }

  try {
    showToast(
      state.lang === 'zh'
        ? '正在优化并同步头像...'
        : 'Optimizing and syncing avatar...',
    );
    const compressed = await compressAvatarImage(file, 128, 0.82);
    localStorage.setItem('ledger_custom_avatar_' + state.user.id, compressed);
    updateAuthUI(state.user);
    updateAccountModalData();
    syncUserProfileToCloud({ custom_avatar: compressed });
    showToast(
      state.lang === 'zh' ? '头像已同步至云端' : 'Avatar synced to cloud',
    );
  } catch (err) {
    showToast('Failed to process avatar image', true);
  }
}

function resetToGoogleAvatar() {
  if (!state.user) return;
  localStorage.removeItem('ledger_custom_avatar_' + state.user.id);
  updateAuthUI(state.user);
  updateAccountModalData();
  syncUserProfileToCloud({ custom_avatar: null });
  showToast(
    state.lang === 'zh'
      ? '已恢复 Google 原始头像'
      : 'Reset to Google profile photo',
  );
}
