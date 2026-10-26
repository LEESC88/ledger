/**
 * ============================================================================
 * LEDGER — Client Application Engine (Cyan-White Theme Edition)
 * Pure Vanilla JavaScript • Zero External Dependencies
 * ============================================================================
 */

// Current Client Release Version
const APP_VERSION = '1.2.1';

// Default Public Supabase BaaS Cloud Configuration (Enables standalone Mobile APK without Node server)
const SUPABASE_DEFAULT_CONFIG = {
  url: 'https://bcftzfohhiwgabvfdewe.supabase.co',
  anonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjZnR6Zm9oaGl3Z2FidmZkZXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3MTg3MTksImV4cCI6MjEwODI5NDcxOX0.hb-wsvMISSC_t9Aobjbud4lrECLQSLlmHo9x25A-2Fw',
};

// Preset Categories
const CATEGORIES = {
  expense: [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Housing & Utilities',
    'Entertainment',
    'Healthcare',
    'Subscriptions',
    'Other Expense',
  ],
  income: [
    'Salary',
    'Freelance',
    'Investment & Dividends',
    'Bonus',
    'Refund',
    'Other Income',
  ],
};

// Application State
let state = {
  user: null, // Track currently authenticated Google user
  currency: localStorage.getItem('ledger_currency') || 'RM',
  currentType: 'expense',
  currentFilter: 'all',
  currentMonth: 'all',
  searchQuery: '',
  monthlyBudget: 3000, // P2: Default monthly budget ceiling
  isOnline: navigator.onLine, // P3: Network connectivity state
  isSyncing: false, // P3: Active background synchronization flag
  records: [],
  summary: null,
};

// Supabase Client Instance (Dynamically loaded from backend)
let supabaseClient = null;

// DOM Elements
const elements = {
  // Views
  loginLandingView: document.getElementById('loginLandingView'),
  appLayout: document.getElementById('appLayout'),
  landingGoogleLoginBtn: document.getElementById('landingGoogleLoginBtn'),
  landingSyncIdInput: document.getElementById('landingSyncIdInput'),
  landingSyncIdBtn: document.getElementById('landingSyncIdBtn'),

  // Header Controls
  currencySelector: document.getElementById('currencySelector'),
  monthFilter: document.getElementById('monthFilter'),
  refreshBtn: document.getElementById('refreshBtn'),
  btnTypeExpense: document.getElementById('btnTypeExpense'),
  btnTypeIncome: document.getElementById('btnTypeIncome'),
  inputAmount: document.getElementById('inputAmount'),
  selectCategory: document.getElementById('selectCategory'),
  inputDate: document.getElementById('inputDate'),
  inputNote: document.getElementById('inputNote'),
  recordForm: document.getElementById('recordForm'),
  submitBtn: document.getElementById('submitBtn'),
  recordsTbody: document.getElementById('recordsTbody'),
  emptyState: document.getElementById('emptyState'),
  filterTabs: document.querySelectorAll('.tab-btn'),
  netBalanceValue: document.getElementById('netBalanceValue'),
  totalIncomeValue: document.getElementById('totalIncomeValue'),
  totalExpenseValue: document.getElementById('totalExpenseValue'),
  balanceTrendBadge: document.getElementById('balanceTrendBadge'),
  exportCsvBtn: document.getElementById('exportCsvBtn'),
  chartEmptyOverlay: document.getElementById('chartEmptyOverlay'),
  chartCategoryCount: document.getElementById('chartCategoryCount'),
  toast: document.getElementById('toastNotification'),
  toastMessage: document.getElementById('toastMessage'),

  // Retention Modal
  retentionModal: document.getElementById('retentionModal'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  retentionYearsSelect: document.getElementById('retentionYearsSelect'),
  retentionMatchCount: document.getElementById('retentionMatchCount'),
  retentionCutoffDate: document.getElementById('retentionCutoffDate'),
  downloadArchiveBtn: document.getElementById('downloadArchiveBtn'),
  purgeOldRecordsBtn: document.getElementById('purgeOldRecordsBtn'),

  // Search & Filter
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  searchResultCount: document.getElementById('searchResultCount'),

  // P3: Network & Cloud Sync Elements
  syncStatusPill: document.getElementById('syncStatusPill'),
  syncStatusText: document.getElementById('syncStatusText'),
  syncSpinnerIcon: document.getElementById('syncSpinnerIcon'),

  // P2: Budget Tracker Elements
  budgetTrackerBanner: document.getElementById('budgetTrackerBanner'),
  budgetPeriodLabel: document.getElementById('budgetPeriodLabel'),
  quickEditBudgetBtn: document.getElementById('quickEditBudgetBtn'),
  budgetSpentVal: document.getElementById('budgetSpentVal'),
  budgetLimitVal: document.getElementById('budgetLimitVal'),
  budgetProgressBar: document.getElementById('budgetProgressBar'),
  budgetPctVal: document.getElementById('budgetPctVal'),
  budgetRemainingLabel: document.getElementById('budgetRemainingLabel'),
  budgetModal: document.getElementById('budgetModal'),
  budgetModalMonthText: document.getElementById('budgetModalMonthText'),
  closeBudgetModalBtn: document.getElementById('closeBudgetModalBtn'),
  cancelBudgetBtn: document.getElementById('cancelBudgetBtn'),
  saveBudgetBtn: document.getElementById('saveBudgetBtn'),
  budgetInputAmount: document.getElementById('budgetInputAmount'),
  budgetPresetBtns: document.querySelectorAll('.preset-pill'),
  quickAmtChips: document.querySelectorAll('.quick-amt-chip'),

  // App Version & One-Click Update Elements
  updateNotificationBanner: document.getElementById('updateNotificationBanner'),
  updateBannerText: document.getElementById('updateBannerText'),
  updateBannerApplyBtn: document.getElementById('updateBannerApplyBtn'),
  updateBannerDismissBtn: document.getElementById('updateBannerDismissBtn'),
  appVersionBadge: document.getElementById('appVersionBadge'),
  updateStatusText: document.getElementById('updateStatusText'),
  checkUpdateBtn: document.getElementById('checkUpdateBtn'),
  checkUpdateIcon: document.getElementById('checkUpdateIcon'),
  checkUpdateBtnText: document.getElementById('checkUpdateBtnText'),
  openRetentionFromSettingsBtn: document.getElementById('openRetentionFromSettingsBtn'),

  // Reddit-Inspired Profile Dropdown Elements
  userProfilePill: document.getElementById('userProfilePill'),
  userAvatar: document.getElementById('userAvatar'),
  userName: document.getElementById('userName'),
  profileDropdown: document.getElementById('profileDropdown'),
  menuViewProfileBtn: document.getElementById('menuViewProfileBtn'),
  dropdownAvatar: document.getElementById('dropdownAvatar'),
  dropdownUserName: document.getElementById('dropdownUserName'),
  menuEditAvatarBtn: document.getElementById('menuEditAvatarBtn'),
  themeSegmentBtns: document.querySelectorAll('.theme-segment-btn'),
  menuSettingsBtn: document.getElementById('menuSettingsBtn'),
  menuLogoutBtn: document.getElementById('menuLogoutBtn'),

  // Account Information Modal Elements
  accountModal: document.getElementById('accountModal'),
  closeAccountModalBtn: document.getElementById('closeAccountModalBtn'),
  closeAccountModalFooterBtn: document.getElementById(
    'closeAccountModalFooterBtn',
  ),
  accountModalAvatar: document.getElementById('accountModalAvatar'),
  accountAvatarUploadBtn: document.getElementById('accountAvatarUploadBtn'),
  avatarFileInput: document.getElementById('avatarFileInput'),
  accountModalName: document.getElementById('accountModalName'),
  accountModalEmail: document.getElementById('accountModalEmail'),
  usernameViewRow: document.getElementById('usernameViewRow'),
  usernameEditRow: document.getElementById('usernameEditRow'),
  editUsernameBtn: document.getElementById('editUsernameBtn'),
  usernameInput: document.getElementById('usernameInput'),
  saveUsernameBtn: document.getElementById('saveUsernameBtn'),
  cancelUsernameBtn: document.getElementById('cancelUsernameBtn'),
  uploadAvatarTextBtn: document.getElementById('uploadAvatarTextBtn'),
  resetAvatarBtn: document.getElementById('resetAvatarBtn'),
  accountMemberSince: document.getElementById('accountMemberSince'),
  accountUsageDuration: document.getElementById('accountUsageDuration'),
  accountTransactionCount: document.getElementById('accountTransactionCount'),
};

/**
 * Format numeric value with commas and 2 decimals
 */
function formatNumber(amount) {
  const num = Math.abs(Number(amount) || 0);
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Update all currency symbols across the UI
 */
function updateCurrencySymbols() {
  const sym = state.currency;
  document.querySelectorAll('.currency-sym').forEach((el) => {
    const text = el.textContent || '';
    if (text.includes('+')) {
      el.textContent = `+ ${sym}`;
    } else if (text.includes('-') || text.includes('−')) {
      el.textContent = `− ${sym}`;
    } else {
      el.textContent = sym;
    }
  });
}

/**
 * Display Floating Toast Notification
 */
let toastTimeout;
function showToast(message, isError = false) {
  clearTimeout(toastTimeout);
  elements.toastMessage.textContent = message;
  elements.toast.classList.remove('hidden');
  if (isError) {
    elements.toast.classList.add('toast-error');
  } else {
    elements.toast.classList.remove('toast-error');
  }

  toastTimeout = setTimeout(() => {
    elements.toast.classList.add('hidden');
  }, 2800);
}

/**
 * Switch Active Entry Type (Expense vs Income)
 */
function setEntryType(type) {
  state.currentType = type;
  if (type === 'expense') {
    elements.btnTypeExpense.classList.add('active');
    elements.btnTypeIncome.classList.remove('active');
  } else {
    elements.btnTypeIncome.classList.add('active');
    elements.btnTypeExpense.classList.remove('active');
  }

  const list = CATEGORIES[type] || [];
  elements.selectCategory.innerHTML = list
    .map((cat) => `<option value="${cat}">${cat}</option>`)
    .join('');
}

/**
 * Generates authentication and tenant isolation headers
 */
function getAuthHeaders(extraHeaders = {}) {
  const headers = { ...extraHeaders };
  if (state.user?.id) {
    headers['x-user-id'] = state.user.id;
  }
  return headers;
}

/**
 * P3: Offline Draft Queue & Cloud Synchronization Manager
 */
function getOfflineQueueStorageKey() {
  const userKey = state.user?.id || 'guest';
  return `ledger_offline_queue_${userKey}`;
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

function updateSyncStatusUI() {
  if (!elements.syncStatusPill || !elements.syncStatusText) return;

  const queue = getOfflineQueue();
  state.isOnline = navigator.onLine;

  if (state.isSyncing) {
    elements.syncStatusPill.className = 'sync-status-pill sync-pill-syncing';
    elements.syncSpinnerIcon?.classList.remove('hidden');
    elements.syncStatusText.textContent = `Syncing (${queue.length})...`;
    elements.syncStatusPill.title = `Syncing ${queue.length} offline records to cloud...`;
    return;
  }

  elements.syncSpinnerIcon?.classList.add('hidden');

  if (!state.isOnline) {
    elements.syncStatusPill.className = 'sync-status-pill sync-pill-offline';
    elements.syncStatusText.textContent =
      queue.length > 0 ? `Offline (${queue.length})` : 'Offline Mode';
    elements.syncStatusPill.title =
      'Offline: Network disconnected. Transactions are queued locally and will sync once reconnected.';
  } else if (queue.length > 0) {
    elements.syncStatusPill.className = 'sync-status-pill sync-pill-offline';
    elements.syncStatusText.textContent = `${queue.length} Pending (Click to Sync)`;
    elements.syncStatusPill.title = `${queue.length} offline drafts waiting to upload. Click to sync now.`;
  } else {
    elements.syncStatusPill.className = 'sync-status-pill sync-pill-online';
    elements.syncStatusText.textContent = 'Cloud Synced';
    elements.syncStatusPill.title = 'Online: All records are fully synchronized with cloud.';
  }
}

async function syncOfflineDrafts() {
  if (state.isSyncing) return;
  if (!navigator.onLine) {
    showToast('Cannot sync: Device is currently offline', true);
    return;
  }

  const queue = getOfflineQueue();
  if (queue.length === 0) {
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
      if (supabaseClient && userId) {
        const { error } = await supabaseClient.from('records').insert({
          user_id: userId,
          type: item.payload.type,
          amount: item.payload.amount,
          category: item.payload.category,
          date: item.payload.date,
          note: item.payload.note || null,
        });

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
      console.warn('Sync failed for draft item:', err);
      remainingQueue.push(item);
    }
  }

  saveOfflineQueue(remainingQueue);
  state.isSyncing = false;
  updateSyncStatusUI();

  if (successCount > 0) {
    showToast(`✅ Synced ${successCount} offline transaction(s) to cloud!`);
    await Promise.all([loadRecords(), loadSummary()]);
  }
}

function calculateLocalSummaryMetrics() {
  let records = state.records;
  if (state.currentMonth !== 'all') {
    records = records.filter((r) => r.date && r.date.startsWith(state.currentMonth));
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
      categoryBreakdown[record.category] = (categoryBreakdown[record.category] || 0) + amt;
    }
  }

  state.summary = {
    month: state.currentMonth,
    totalIncome: Number(totalIncome.toFixed(2)),
    totalExpense: Number(totalExpense.toFixed(2)),
    netBalance: Number((totalIncome - totalExpense).toFixed(2)),
    categoryBreakdown,
  };

  if (elements.netBalanceValue) elements.netBalanceValue.textContent = formatNumber(state.summary.netBalance);
  if (elements.totalIncomeValue) elements.totalIncomeValue.textContent = formatNumber(state.summary.totalIncome);
  if (elements.totalExpenseValue) elements.totalExpenseValue.textContent = formatNumber(state.summary.totalExpense);

  renderCategoryChart(categoryBreakdown);
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

  // Prepend draft to state.records for instant UI rendering
  const draftRecord = {
    id: draftId,
    type: payload.type,
    amount: payload.amount,
    category: payload.category,
    date: payload.date,
    note: payload.note,
    isDraft: true,
  };
  state.records = [draftRecord, ...state.records];

  updateMonthFilterDropdown(state.records);
  renderTable();
  calculateLocalSummaryMetrics();

  showToast(`⚡ Offline: Saved locally (${queue.length} pending sync)`);
  if (elements.inputAmount) elements.inputAmount.value = '';
  if (elements.inputNote) elements.inputNote.value = '';
}

/**
 * P2: Monthly Budget Tracker Helpers & UI Rendering
 */
function getBudgetStorageKey(month) {
  const userKey = state.user?.id || 'guest';
  return `ledger_budget_${userKey}_${month || 'default'}`;
}

async function loadBudget(month) {
  const targetMonth = month === 'all' ? 'default' : (month || 'default');
  const cacheKey = getBudgetStorageKey(targetMonth);
  const defaultKey = getBudgetStorageKey('default');

  // 1. Initial read from local cache for instant UI feedback
  const cached = localStorage.getItem(cacheKey) || localStorage.getItem(defaultKey);
  if (cached && !isNaN(Number(cached))) {
    state.monthlyBudget = Number(cached);
  } else {
    state.monthlyBudget = 3000;
  }
  renderBudgetTracker();

  // 2. Sync with cloud (Direct Supabase BaaS or fallback to local endpoint)
  const userId = state.user?.id;
  if (!userId) return;

  try {
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('budgets')
        .select('amount')
        .eq('user_id', userId)
        .eq('month', targetMonth)
        .maybeSingle();

      if (!error && data && data.amount !== null && !isNaN(Number(data.amount))) {
        state.monthlyBudget = Number(data.amount);
        localStorage.setItem(cacheKey, state.monthlyBudget);
        renderBudgetTracker();
        return;
      }
    }

    const res = await fetch(`/api/budgets?month=${encodeURIComponent(targetMonth)}`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.amount !== null && !isNaN(Number(data.amount))) {
        state.monthlyBudget = Number(data.amount);
        localStorage.setItem(cacheKey, state.monthlyBudget);
        renderBudgetTracker();
      }
    }
  } catch (err) {
    console.warn('Could not sync budget with cloud:', err);
  }
}

async function persistBudget(amount, month) {
  const targetMonth = month === 'all' ? 'default' : (month || 'default');
  const cacheKey = getBudgetStorageKey(targetMonth);

  // Update memory state & localStorage immediately
  state.monthlyBudget = Number(amount);
  localStorage.setItem(cacheKey, state.monthlyBudget);
  localStorage.setItem(getBudgetStorageKey('default'), state.monthlyBudget);
  renderBudgetTracker();

  const userId = state.user?.id;
  if (!userId) return;

  // Persist directly to Supabase BaaS
  try {
    if (supabaseClient) {
      const { error } = await supabaseClient
        .from('budgets')
        .upsert(
          { user_id: userId, month: targetMonth, amount: state.monthlyBudget },
          { onConflict: 'user_id,month' },
        );
      if (!error) return;
    }

    await fetch('/api/budgets', {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        month: targetMonth,
        amount: state.monthlyBudget,
      }),
    });
  } catch (err) {
    console.error('Failed to persist budget to database:', err);
  }
}

function renderBudgetTracker() {
  if (!elements.budgetTrackerBanner) return;

  const totalExpense = Number(state.summary?.totalExpense || 0);
  const budgetLimit = Number(state.monthlyBudget || 3000);
  const sym = state.currency || 'RM';

  // Calculate percentage (can exceed 100%)
  const percentage = budgetLimit > 0 ? Math.round((totalExpense / budgetLimit) * 100) : 0;
  const barWidth = Math.min(Math.max(percentage, 0), 100);

  // Update Labels
  if (elements.budgetPeriodLabel) {
    elements.budgetPeriodLabel.textContent =
      state.currentMonth === 'all' ? 'All Records' : state.currentMonth;
  }
  if (elements.budgetSpentVal) {
    elements.budgetSpentVal.textContent = `${sym} ${formatNumber(totalExpense)}`;
  }
  if (elements.budgetLimitVal) {
    elements.budgetLimitVal.textContent = `${sym} ${formatNumber(budgetLimit)}`;
  }
  if (elements.budgetPctVal) {
    elements.budgetPctVal.textContent = `${percentage}%`;
  }

  // Update Progress Bar Width
  if (elements.budgetProgressBar) {
    elements.budgetProgressBar.style.width = `${barWidth}%`;
    elements.budgetProgressBar.classList.remove('progress-normal', 'progress-warning', 'progress-danger');
  }

  elements.budgetPctVal?.classList.remove('text-warning', 'text-danger');
  elements.budgetRemainingLabel?.classList.remove('text-warning', 'text-danger');

  // Apply Dynamic Status Colors: <85% Normal Green, 85%-99% Warning Orange, >=100% Danger Red
  if (percentage >= 100) {
    elements.budgetProgressBar?.classList.add('progress-danger');
    elements.budgetPctVal?.classList.add('text-danger');
    elements.budgetRemainingLabel?.classList.add('text-danger');
    const overspend = totalExpense - budgetLimit;
    if (elements.budgetRemainingLabel) {
      elements.budgetRemainingLabel.textContent = `Exceeded by: ${sym} ${formatNumber(overspend)}`;
    }
  } else if (percentage >= 85) {
    elements.budgetProgressBar?.classList.add('progress-warning');
    elements.budgetPctVal?.classList.add('text-warning');
    elements.budgetRemainingLabel?.classList.add('text-warning');
    const remaining = budgetLimit - totalExpense;
    if (elements.budgetRemainingLabel) {
      elements.budgetRemainingLabel.textContent = `Remaining: ${sym} ${formatNumber(remaining)}`;
    }
  } else {
    elements.budgetProgressBar?.classList.add('progress-normal');
    const remaining = budgetLimit - totalExpense;
    if (elements.budgetRemainingLabel) {
      elements.budgetRemainingLabel.textContent = `Remaining: ${sym} ${formatNumber(remaining)}`;
    }
  }
}

function openBudgetModal() {
  if (!elements.budgetModal) return;
  const targetLabel = state.currentMonth === 'all' ? 'Default / All Months' : state.currentMonth;
  if (elements.budgetModalMonthText) elements.budgetModalMonthText.textContent = targetLabel;
  if (elements.budgetInputAmount) elements.budgetInputAmount.value = state.monthlyBudget || 3000;
  elements.budgetModal.classList.remove('hidden');
  elements.budgetInputAmount?.focus();
}

function closeBudgetModal() {
  elements.budgetModal?.classList.add('hidden');
}

function handleSaveBudget() {
  const val = parseFloat(elements.budgetInputAmount?.value);
  if (isNaN(val) || val <= 0) {
    return showToast('Please enter a valid positive budget limit', true);
  }
  persistBudget(val, state.currentMonth);
  closeBudgetModal();
  showToast(`Monthly budget limit updated to ${state.currency} ${formatNumber(val)}`);
}

/**
 * Fetch and Render Financial Summary
 */
async function loadSummary() {
  try {
    const url =
      state.currentMonth === 'all'
        ? '/api/records/summary'
        : `/api/records/summary?month=${state.currentMonth}`;

    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch summary');
    const data = await res.json();
    state.summary = data;

    // Render Metrics
    elements.netBalanceValue.textContent = formatNumber(data.netBalance);
    elements.totalIncomeValue.textContent = formatNumber(data.totalIncome);
    elements.totalExpenseValue.textContent = formatNumber(data.totalExpense);

    // Update Status Pill
    const net = Number(data.netBalance);
    if (net > 0) {
      elements.balanceTrendBadge.className = 'status-pill status-positive';
      elements.balanceTrendBadge.textContent = 'Surplus';
    } else if (net < 0) {
      elements.balanceTrendBadge.className = 'status-pill status-negative';
      elements.balanceTrendBadge.textContent = 'Deficit';
    } else {
      elements.balanceTrendBadge.className = 'status-pill status-neutral';
      elements.balanceTrendBadge.textContent = 'Balanced';
    }

    // Render Category Breakdown Donut Chart
    renderCategoryChart(data.categoryBreakdown);

    // Render P2 Monthly Budget Tracker
    await loadBudget(state.currentMonth);
  } catch (err) {
    console.warn('Error loading summary (offline fallback):', err);
    calculateLocalSummaryMetrics();
  }
}

/**
 * Fetch and Render All Records
 */
async function loadRecords() {
  const userKey = state.user?.id || 'guest';
  const cacheKey = `ledger_cached_records_${userKey}`;
  const queue = getOfflineQueue();
  const draftRecords = queue.map((item) => ({
    id: item.id,
    type: item.payload.type,
    amount: item.payload.amount,
    category: item.payload.category,
    date: item.payload.date,
    note: item.payload.note,
    isDraft: true,
  }));

  const applyRecords = (serverRecords) => {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(serverRecords));
    } catch (e) {
      console.warn('Failed to cache records to localStorage:', e);
    }

    state.records = [...draftRecords, ...serverRecords];
    updateMonthFilterDropdown(state.records);
    renderTable();
    calculateLocalSummaryMetrics();
  };

  const userId = state.user?.id;

  try {
    // 1. Direct Supabase Query (Fastest, zero server dependency)
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

    // 2. Fallback to local server endpoint
    const res = await fetch('/api/records', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch records');
    const data = await res.json();
    applyRecords(Array.isArray(data) ? data : []);
  } catch (err) {
    console.warn('Network offline or fetch failed, loading from local cache:', err);
    let cachedRecords = [];
    try {
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw) cachedRecords = JSON.parse(cachedRaw);
    } catch (e) {
      console.warn('Failed to parse cached records:', e);
    }

    state.records = [...draftRecords, ...cachedRecords];
    updateMonthFilterDropdown(state.records);
    renderTable();
    calculateLocalSummaryMetrics();
  }
}

/**
 * Populate Month Selector dynamically
 */
function updateMonthFilterDropdown(records) {
  if (!Array.isArray(records)) return;
  const months = new Set();
  records.forEach((r) => {
    if (r.date && r.date.length >= 7) {
      months.add(r.date.substring(0, 7));
    }
  });

  const sortedMonths = Array.from(months).sort().reverse();
  const currentValue = elements.monthFilter.value;

  let optionsHtml = '<option value="all">All Records</option>';
  sortedMonths.forEach((m) => {
    optionsHtml += `<option value="${m}">${m}</option>`;
  });

  elements.monthFilter.innerHTML = optionsHtml;
  if (sortedMonths.includes(currentValue)) {
    elements.monthFilter.value = currentValue;
  }
}

/**
 * Render Audit Ledger Table
 */
function renderTable() {
  let filtered = state.records;

  // Filter by Month
  if (state.currentMonth !== 'all') {
    filtered = filtered.filter((r) => r.date.startsWith(state.currentMonth));
  }

  // Filter by Tab (all / expense / income)
  if (state.currentFilter !== 'all') {
    filtered = filtered.filter((r) => r.type === state.currentFilter);
  }

  // Filter by Search Keyword (note or category)
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (r) =>
        (r.category && r.category.toLowerCase().includes(q)) ||
        (r.note && r.note.toLowerCase().includes(q)),
    );
  }

  // Update search UI indicator & clear button
  if (elements.searchResultCount) {
    if (state.searchQuery) {
      elements.searchResultCount.textContent = `${filtered.length} found`;
      elements.searchResultCount.classList.remove('hidden');
      elements.clearSearchBtn?.classList.remove('hidden');
    } else {
      elements.searchResultCount.classList.add('hidden');
      elements.clearSearchBtn?.classList.add('hidden');
    }
  }

  if (filtered.length === 0) {
    elements.recordsTbody.innerHTML = '';
    elements.emptyState.classList.remove('hidden');
    return;
  }

  elements.emptyState.classList.add('hidden');
  const sym = state.currency;

  elements.recordsTbody.innerHTML = filtered
    .map((record) => {
      const isIncome = record.type === 'income';
      const sign = isIncome ? `+ ${sym} ` : `− ${sym} `;
      const amountClass = isIncome ? 'amount-income' : 'amount-expense';
      const isDraft = record.isDraft || String(record.id).startsWith('draft-');
      const draftBadge = isDraft
        ? `<span class="tag-draft" title="Saved locally. Pending upload to cloud.">⚡ Pending</span>`
        : '';

      return `
        <tr data-id="${record.id}" class="${isDraft ? 'row-draft' : ''}">
          <td class="col-date">${escapeHtml(record.date)}${draftBadge}</td>
          <td class="col-category">
            <span class="category-tag">
              <span class="category-dot" style="background: ${isIncome ? '#059669' : '#0D9488'}"></span>
              ${escapeHtml(record.category)}
            </span>
          </td>
          <td class="col-note" title="${escapeHtml(record.note || '')}">
            ${escapeHtml(record.note || '—')}
          </td>
          <td class="col-amount text-right ${amountClass}">
            ${sign}${formatNumber(record.amount)}
          </td>
          <td class="col-actions text-center">
            <button class="btn-del" onclick="handleDelete('${record.id}')" title="Delete entry">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </td>
        </tr>
      `;
    })
    .join('');
}

/**
 * Handle Form Submission (Post Transaction)
 */
async function handleRecordSubmit(e) {
  e.preventDefault();

  const amount = parseFloat(elements.inputAmount.value);
  const category = elements.selectCategory.value;
  const date = elements.inputDate.value;
  const note = elements.inputNote.value.trim() || undefined;

  if (!amount || amount <= 0) {
    showToast('Please enter an amount greater than 0', true);
    elements.inputAmount.focus();
    return;
  }

  if (!date) {
    showToast('Please specify a valid transaction date', true);
    return;
  }

  const payload = {
    type: state.currentType,
    amount,
    category,
    date,
    ...(note ? { note } : {}),
  };

  // P3: Save immediately to local queue if device is offline
  if (!navigator.onLine) {
    saveOfflineRecord(payload);
    return;
  }

  try {
    elements.submitBtn.disabled = true;
    elements.submitBtn.style.opacity = '0.7';

    const userId = state.user?.id;
    let created = false;

    // 1. Direct Supabase Insert (Zero server dependency)
    if (supabaseClient && userId) {
      const { data, error } = await supabaseClient
        .from('records')
        .insert({
          user_id: userId,
          type: payload.type,
          amount: payload.amount,
          category: payload.category,
          date: payload.date,
          note: payload.note || null,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      created = true;
    }

    // 2. Fallback to local server endpoint
    if (!created) {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const msg = Array.isArray(errorData.message)
          ? errorData.message.join(', ')
          : errorData.message || 'Transaction failed';
        throw new Error(msg);
      }
    }

    showToast(
      `Recorded ${state.currency} ${formatNumber(amount)} ${state.currentType}`,
    );
    elements.inputAmount.value = '';
    elements.inputNote.value = '';

    await Promise.all([loadRecords(), loadSummary()]);
  } catch (err) {
    console.error('Network or server error during record creation:', err);
    // Graceful fallback to offline draft on connection error or network drop
    if (
      !navigator.onLine ||
      err.name === 'TypeError' ||
      err.message?.includes('fetch') ||
      err.message?.includes('Failed to fetch') ||
      err.message?.includes('NetworkError')
    ) {
      saveOfflineRecord(payload);
    } else {
      showToast(err.message, true);
    }
  } finally {
    elements.submitBtn.disabled = false;
    elements.submitBtn.style.opacity = '1';
  }
}

/**
 * Delete Record Action
 */
window.handleDelete = async function (id) {
  const isDraft = String(id).startsWith('draft-');
  if (!confirm(`Are you sure you want to delete transaction #${id}?`)) {
    return;
  }

  if (isDraft) {
    let queue = getOfflineQueue();
    queue = queue.filter((item) => String(item.id) !== String(id));
    saveOfflineQueue(queue);

    state.records = state.records.filter((r) => String(r.id) !== String(id));
    renderTable();
    calculateLocalSummaryMetrics();
    showToast('Draft transaction removed');
    return;
  }

  try {
    const userId = state.user?.id;
    let deleted = false;

    // 1. Direct Supabase Delete
    if (supabaseClient && userId) {
      const { error } = await supabaseClient
        .from('records')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw new Error(error.message);
      deleted = true;
    }

    // 2. Fallback to local server endpoint
    if (!deleted) {
      const res = await fetch(`/api/records/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error('Failed to delete transaction');
    }

    showToast(`Transaction #${id} deleted`);
    await Promise.all([loadRecords(), loadSummary()]);
  } catch (err) {
    console.error('Error deleting record:', err);
    showToast(err.message, true);
  }
};

/**
 * XSS Defense: Safe HTML Escaper
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Chart.js Instance & Color Harmony Palette (Cyan-White Theme)
 */
let categoryChartInstance = null;

const CHART_PALETTE = [
  '#0D9488', // Teal Cyan (Brand Main)
  '#059669', // Emerald Green
  '#F59E0B', // Amber Gold
  '#E11D48', // Rose Pink
  '#6366F1', // Indigo Blue
  '#0284C7', // Sky Blue
  '#8B5CF6', // Purple Accent
  '#64748B', // Neutral Slate
];

/**
 * Render Category Breakdown Donut Chart
 */
function renderCategoryChart(breakdown) {
  const chartCanvas = document.getElementById('categoryChart');
  if (!chartCanvas) return;

  const categories = Object.keys(breakdown || {});
  const amounts = Object.values(breakdown || {}).map(Number);
  const totalExpense = amounts.reduce((sum, val) => sum + val, 0);

  // If no expenses exist, display empty state placeholder
  if (categories.length === 0 || totalExpense <= 0) {
    if (categoryChartInstance) {
      categoryChartInstance.destroy();
      categoryChartInstance = null;
    }
    if (elements.chartEmptyOverlay)
      elements.chartEmptyOverlay.classList.remove('hidden');
    if (elements.chartCategoryCount)
      elements.chartCategoryCount.textContent = '0 Categories';
    return;
  }

  // Active chart rendering
  if (elements.chartEmptyOverlay)
    elements.chartEmptyOverlay.classList.add('hidden');
  if (elements.chartCategoryCount) {
    elements.chartCategoryCount.textContent = `${categories.length} Categories`;
  }

  // Destroy previous chart instance to prevent memory leaks and ghost canvas renders
  if (categoryChartInstance) {
    categoryChartInstance.destroy();
  }

  const isDark = isDarkModeActive();
  const ctx = chartCanvas.getContext('2d');
  categoryChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: categories,
      datasets: [
        {
          data: amounts,
          backgroundColor: CHART_PALETTE.slice(0, categories.length),
          borderWidth: 2,
          borderColor: isDark ? '#111827' : '#FFFFFF',
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true,
            pointStyle: 'circle',
            font: {
              family: "'Plus Jakarta Sans', sans-serif",
              size: 11,
              weight: '600',
            },
            color: isDark ? '#F8FAFC' : '#334155',
            padding: 8,
          },
        },
        tooltip: {
          backgroundColor: isDark ? '#1F2937' : '#0F172A',
          padding: 8,
          cornerRadius: 6,
          callbacks: {
            label: function (context) {
              const val = Number(context.raw) || 0;
              const pct =
                totalExpense > 0 ? ((val / totalExpense) * 100).toFixed(1) : 0;
              return ` ${state.currency} ${formatNumber(val)} (${pct}%)`;
            },
          },
        },
      },
    },
  });
}

/**
 * Export Filtered Records as RFC 4180 Compliant CSV
 */
function exportToCSV() {
  let recordsToExport = state.records;

  // Filter according to active period selection
  if (state.currentMonth !== 'all') {
    recordsToExport = recordsToExport.filter((r) =>
      r.date.startsWith(state.currentMonth),
    );
  }

  // Filter according to active type tab
  if (state.currentFilter !== 'all') {
    recordsToExport = recordsToExport.filter(
      (r) => r.type === state.currentFilter,
    );
  }

  if (recordsToExport.length === 0) {
    showToast('No records available to export', true);
    return;
  }

  // CSV Standard Header Row
  const headers = [
    'ID',
    'Date',
    'Type',
    'Category',
    'Amount',
    'Currency',
    'Note',
  ];

  // Format data rows with quotation escaping
  const rows = recordsToExport.map((r) => [
    r.id,
    `"${r.date}"`,
    `"${r.type}"`,
    `"${(r.category || '').replace(/"/g, '""')}"`,
    Number(r.amount).toFixed(2),
    `"${state.currency}"`,
    `"${(r.note || '').replace(/"/g, '""')}"`,
  ]);

  // Prepend UTF-8 BOM (\uFEFF) to guarantee Excel opens Chinese and Unicode cleanly without garbled characters
  const csvContent =
    '\uFEFF' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');

  // Generate downloadable Blob and trigger programmatic click
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');

  const periodLabel = state.currentMonth === 'all' ? 'all' : state.currentMonth;
  downloadLink.href = url;
  downloadLink.setAttribute(
    'download',
    `ledger_export_${periodLabel}_${new Date().toISOString().slice(0, 10)}.csv`,
  );
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);

  showToast(`Exported ${recordsToExport.length} transactions to CSV`);
}

// ============================================================================
// Data Retention & Archiving Modal Controller
// ============================================================================

/**
 * Calculates cutoff date string in YYYY-MM-DD format based on retention threshold.
 */
function getRetentionCutoffDate(years) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return date.toISOString().split('T')[0];
}

function evaluateRetentionEligible() {
  const years = parseInt(elements.retentionYearsSelect.value) || 3;
  const cutoffDate = getRetentionCutoffDate(years);
  elements.retentionCutoffDate.textContent = cutoffDate;

  const matchingRecords = state.records.filter((r) => r.date < cutoffDate);
  elements.retentionMatchCount.textContent = matchingRecords.length;

  elements.downloadArchiveBtn.disabled = matchingRecords.length === 0;
  elements.purgeOldRecordsBtn.disabled = matchingRecords.length === 0;
}

function openRetentionModal() {
  evaluateRetentionEligible();
  elements.retentionModal.classList.remove('hidden');
}

function closeRetentionModal() {
  elements.retentionModal.classList.add('hidden');
}

function downLoadArchiveCSV() {
  const years = parseInt(elements.retentionYearsSelect.value) || 3;
  const cutoffDate = getRetentionCutoffDate(years);
  const matchingRecords = state.records.filter((r) => r.date < cutoffDate);

  if (matchingRecords.length === 0) {
    showToast('No records available for archiving', true);
    return;
  }

  const headers = [
    'ID',
    'Date',
    'Type',
    'Category',
    'Amount',
    'Currency',
    'Note',
  ];
  const rows = matchingRecords.map((r) => [
    r.id,
    `"${r.date}"`,
    `"${r.type}"`,
    `"${(r.category || '').replace(/"/g, '""')}"`,
    Number(r.amount).toFixed(2),
    `"${state.currency}"`,
    `"${(r.note || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    '\uFEFF' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.setAttribute(
    'download',
    `ledger_archive_older_than_${years}y_${cutoffDate}.csv`,
  );
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);

  showToast(
    `Downloaded ${matchingRecords.length} archived transactions to CSV`,
  );
}

async function purgeOldRecords() {
  const years = parseInt(elements.retentionYearsSelect.value) || 3;
  if (
    !confirm(
      `Are you sure you want to permanently delete all records older than ${years} years? This action cannot be undone.`,
    )
  ) {
    return;
  }

  const cutoffDate = getRetentionCutoffDate(years);
  const userId = state.user?.id;

  try {
    if (supabaseClient && userId) {
      const { error } = await supabaseClient
        .from('records')
        .delete()
        .eq('user_id', userId)
        .lt('date', cutoffDate);

      if (error) throw new Error(error.message);
    } else {
      const res = await fetch(`/api/records/purge?years=${years}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to purge old records');
    }

    showToast(`Purged records older than ${years} years`);
    closeRetentionModal();
    await Promise.all([loadRecords(), loadSummary()]);
  } catch (err) {
    console.error('Error purging old records:', err);
    showToast(err.message, true);
  }
}

// ============================================================================
// 🎯 YOUR TURN: Step 3 - Google OAuth Authentication Handlers
// ============================================================================
// Implement the following 3 functions below:
//
// 1. async function signInWithGoogle()
//    - Triggers Google OAuth sign-in via Supabase:
//      if (!supabase) return showToast('Supabase client not initialized', true);
//      await supabase.auth.signInWithOAuth({
//        provider: 'google',
//        options: {
//          redirectTo: window.location.origin,
//        },
//      });
//
// ============================================================================
// Google OAuth & Supabase Authentication Handlers
// ============================================================================

/**
 * Determine if Dark Theme is actively rendered
 */
function isDarkModeActive() {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark') return true;
  if (attr === 'light') return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Generate a pristine vector SVG initials avatar as a fallback
 */
function getInitialsAvatar(name) {
  const initial = (name || 'U').trim().charAt(0).toUpperCase();
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="50" fill="#0D9488"/>
      <text x="50" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="700" fill="#FFFFFF" text-anchor="middle" dominant-baseline="central">${initial}</text>
    </svg>
  `)}`;
}

/**
 * Get the current user display name with custom override support
 */
function getUserDisplayName(user) {
  if (!user) return 'User';
  const customName = localStorage.getItem('ledger_custom_name_' + user.id);
  if (customName && customName.trim()) return customName.trim();
  const meta = user.user_metadata || {};
  return meta.full_name || meta.name || user.email?.split('@')[0] || 'User';
}

/**
 * Resolve user avatar with custom avatar fallback to Google metadata or SVG initials
 */
function getUserAvatar(user) {
  if (!user) return getInitialsAvatar('U');
  const custom = localStorage.getItem('ledger_custom_avatar_' + user.id);
  if (custom) return custom;
  const meta = user.user_metadata || {};
  const googlePic = meta.avatar_url || meta.picture;
  if (googlePic) return googlePic;
  const name = getUserDisplayName(user);
  return getInitialsAvatar(name);
}

/**
 * Safely assign avatar source with fallback on image error
 */
function setAvatarWithFallback(imgEl, user) {
  if (!imgEl) return;
  const url = getUserAvatar(user);
  imgEl.onerror = () => {
    imgEl.onerror = null;
    imgEl.src = getInitialsAvatar(getUserDisplayName(user));
  };
  imgEl.src = url;
}

/**
 * Calculate user cumulative usage duration in days
 */
function formatUsageDuration(firstLoginIso) {
  if (!firstLoginIso) return '1 Day';
  const diffMs = Math.max(0, Date.now() - new Date(firstLoginIso).getTime());
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
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
    return showToast('Username cannot be empty', true);
  }
  localStorage.setItem('ledger_custom_name_' + state.user.id, newName);
  updateAuthUI(state.user);
  updateAccountModalData();
  cancelUsernameEdit();
  showToast(`Username updated to "${newName}"`);
}

/**
 * Set application visual theme (Light / Dark / System with High Contrast)
 */
function setAppTheme(themeVal) {
  const mode = ['light', 'dark', 'system'].includes(themeVal) ? themeVal : 'system';
  localStorage.setItem('ledger_theme', mode);

  elements.themeSegmentBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.themeVal === mode);
  });

  const prefersDark =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const resolved = mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode;

  document.documentElement.setAttribute('data-theme', resolved);
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) {
    meta.content = mode === 'system' ? 'light dark' : resolved;
  }

  if (categoryChartInstance && state.summary?.categoryBreakdown) {
    renderCategoryChart(state.summary.categoryBreakdown);
  }
}

/**
 * Profile Dropdown Toggle and Close Handlers (Reddit-Style)
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
 * Account Information Modal Handlers
 */
function openAccountModal() {
  closeProfileDropdown();
  updateAccountModalData();
  elements.accountModal?.classList.remove('hidden');
}

function closeAccountModal() {
  cancelUsernameEdit();
  elements.accountModal?.classList.add('hidden');
}

function updateAccountModalData() {
  if (!state.user) return;
  setAvatarWithFallback(elements.accountModalAvatar, state.user);
  const displayName = getUserDisplayName(state.user);

  if (elements.accountModalName)
    elements.accountModalName.textContent = displayName;
  if (elements.accountModalEmail)
    elements.accountModalEmail.textContent = state.user.email;

  cancelUsernameEdit();

  const firstLoginKey = 'ledger_first_login_' + state.user.id;
  let firstLogin = localStorage.getItem(firstLoginKey);
  if (!firstLogin) {
    firstLogin = new Date().toISOString();
    localStorage.setItem(firstLoginKey, firstLogin);
  }

  if (elements.accountMemberSince) {
    elements.accountMemberSince.textContent = new Date(
      firstLogin,
    ).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  if (elements.accountUsageDuration) {
    elements.accountUsageDuration.textContent = formatUsageDuration(firstLogin);
  }
  if (elements.accountTransactionCount) {
    elements.accountTransactionCount.textContent = `${state.records.length} Records`;
  }
}

/**
 * Custom Avatar Upload & Reset Handlers
 */
function handleAvatarFileSelected(e) {
  const file = e.target.files?.[0];
  if (!file || !state.user) return;
  if (!file.type.startsWith('image/')) {
    return showToast('Please select a valid image file', true);
  }
  if (file.size > 2 * 1024 * 1024) {
    return showToast('Image file too large (max 2MB)', true);
  }

  const reader = new FileReader();
  reader.onload = (evt) => {
    const dataUrl = evt.target.result;
    localStorage.setItem('ledger_custom_avatar_' + state.user.id, dataUrl);
    updateAuthUI(state.user);
    updateAccountModalData();
    showToast('Custom avatar updated successfully');
  };
  reader.readAsDataURL(file);
}

function resetToGoogleAvatar() {
  if (!state.user) return;
  localStorage.removeItem('ledger_custom_avatar_' + state.user.id);
  updateAuthUI(state.user);
  updateAccountModalData();
  showToast('Reset to original Google profile photo');
}

/**
 * Dynamically fetch public configuration and initialize Supabase client
 */
async function initSupabaseClient() {
  if (!window.supabase) return;

  let url = SUPABASE_DEFAULT_CONFIG.url;
  let anonKey = SUPABASE_DEFAULT_CONFIG.anonKey;

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
    // Mobile standalone APK or local server offline: successfully uses default BaaS config
  }

  try {
    supabaseClient = window.supabase.createClient(url, anonKey);
  } catch (err) {
    console.error('Failed to create Supabase client:', err);
  }
}

/**
 * Create a lightweight user session object for direct Cloud Sync ID login
 */
function createSyncIdUserObject(syncId) {
  return {
    id: syncId,
    email: `${syncId}@ledger.cloud`,
    isSyncIdUser: true,
    user_metadata: {
      full_name: syncId,
    },
  };
}

/**
 * Direct Sign-In with Custom Cloud Sync ID (No OAuth Redirect Required)
 */
async function signInWithSyncId() {
  const raw = (elements.landingSyncIdInput?.value || '').trim();
  if (!raw) {
    return showToast('Please enter a Sync User ID (e.g. souchen)', true);
  }
  localStorage.setItem('ledger_sync_id_user', raw);
  state.user = createSyncIdUserObject(raw);
  updateAuthUI(state.user);
  showToast(`✅ Cloud Sync active for ID: ${raw}`);
  await Promise.all([loadRecords(), loadSummary()]);
}

/**
 * Native Android OAuth Loopback & Deep-Link Callback Receiver
 */
window.__handleNativeOAuthCallback = async function (payloadStr) {
  if (!payloadStr || !supabaseClient) return;
  try {
    const clean = String(payloadStr).replace(/^[#?]+/, '');
    const params = new URLSearchParams(clean);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (access_token && refresh_token) {
      localStorage.removeItem('ledger_sync_id_user');
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
        await Promise.all([loadRecords(), loadSummary()]);
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
    ? 'http://localhost:3000'
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
async function signOutUser() {
  localStorage.removeItem('ledger_sync_id_user');
  if (supabaseClient) {
    await supabaseClient.auth.signOut().catch(() => {});
  }
  state.user = null;
  updateAuthUI(null);
  showToast('Signed out successfully');
  await Promise.all([loadRecords(), loadSummary()]);
}

/**
 * Update UI presentation based on authentication state
 */
function updateAuthUI(user) {
  if (user) {
    elements.loginLandingView?.classList.add('hidden');
    elements.appLayout?.classList.remove('hidden');

    const displayName = getUserDisplayName(user);

    if (elements.userName) elements.userName.textContent = displayName;
    if (elements.dropdownUserName)
      elements.dropdownUserName.textContent = `u/${displayName.replace(/\s+/g, '_')}`;

    setAvatarWithFallback(elements.userAvatar, user);
    setAvatarWithFallback(elements.dropdownAvatar, user);

    // Track first login date for usage duration
    const firstLoginKey = 'ledger_first_login_' + user.id;
    if (!localStorage.getItem(firstLoginKey)) {
      localStorage.setItem(firstLoginKey, new Date().toISOString());
    }
  } else {
    elements.loginLandingView?.classList.remove('hidden');
    elements.appLayout?.classList.add('hidden');
    closeProfileDropdown();
    closeAccountModal();
  }
  updateSyncStatusUI();
}

/**
 * Service Worker & One-Click App Update Engine
 */
let swRegistration = null;

async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      swRegistration = await navigator.serviceWorker.register('/sw.js');
      swRegistration.addEventListener('updatefound', () => {
        const newWorker = swRegistration.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateAvailablePrompt(APP_VERSION);
          }
        });
      });
    } catch (err) {
      console.warn('Service worker registration skipped:', err);
    }
  }
}

let pendingUpdateVersion = null;
let pendingApkDownloadUrl = 'https://github.com/LEESC88/ledger/releases/latest/download/LEDGER.apk';

function showUpdateAvailablePrompt(versionLabel, apkUrl) {
  pendingUpdateVersion = versionLabel;
  if (apkUrl) pendingApkDownloadUrl = apkUrl;

  if (elements.updateBannerText) {
    elements.updateBannerText.textContent = `🎉 New update available (v${versionLabel})! Tap Update Now to apply.`;
  }
  elements.updateNotificationBanner?.classList.remove('hidden');
  if (elements.updateStatusText) {
    elements.updateStatusText.textContent = `New version v${versionLabel} is ready to install!`;
  }
  if (elements.checkUpdateBtnText) {
    elements.checkUpdateBtnText.textContent = `Update to v${versionLabel}`;
  }
}

async function applyAppUpdate() {
  // If running inside Capacitor Android APK and a remote GitHub update exists, trigger APK download
  if (window.Capacitor && pendingUpdateVersion && pendingUpdateVersion !== APP_VERSION) {
    showToast(`🚀 Downloading latest APK (v${pendingUpdateVersion})...`);
    window.open(pendingApkDownloadUrl, '_system');
    return;
  }

  showToast('🚀 Applying latest update and refreshing...');
  try {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch (e) {
    console.warn('Cache cleanup warning:', e);
  }
  setTimeout(() => {
    window.location.reload();
  }, 450);
}

async function checkForAppUpdates(isManual = false) {
  if (elements.appVersionBadge) {
    elements.appVersionBadge.textContent = `v${APP_VERSION}`;
  }

  if (isManual) {
    if (elements.checkUpdateBtn) elements.checkUpdateBtn.disabled = true;
    if (elements.checkUpdateIcon) elements.checkUpdateIcon.classList.add('sync-spinner-icon');
    if (elements.checkUpdateBtnText) elements.checkUpdateBtnText.textContent = 'Checking...';
  }

  try {
    if (swRegistration) {
      await swRegistration.update().catch(() => {});
    }

    let remoteData = null;
    try {
      const ghRes = await fetch(
        `https://raw.githubusercontent.com/LEESC88/ledger/master/public/version.json?t=${Date.now()}`,
        { cache: 'no-store' },
      );
      if (ghRes.ok) {
        remoteData = await ghRes.json();
      }
    } catch (e) {
      // Fallback to local version.json
    }

    if (!remoteData) {
      const localRes = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
      if (localRes.ok) {
        remoteData = await localRes.json();
      }
    }

    if (remoteData) {
      const remoteVersion = remoteData.version || APP_VERSION;
      const apkUrl = remoteData.apkUrl || pendingApkDownloadUrl;

      if (remoteVersion !== APP_VERSION || (swRegistration && swRegistration.waiting)) {
        showUpdateAvailablePrompt(remoteVersion, apkUrl);
        if (isManual) {
          await applyAppUpdate();
        }
        return;
      }
    }

    if (isManual) {
      if (elements.updateStatusText) {
        elements.updateStatusText.textContent = `✅ Up to date (v${APP_VERSION}) — Checked just now`;
      }
      showToast(`✅ App is up to date (v${APP_VERSION})!`);
    }
  } catch (err) {
    if (isManual) {
      showToast('Could not reach update server. Using cached version.', true);
    }
  } finally {
    if (isManual) {
      if (elements.checkUpdateBtn) elements.checkUpdateBtn.disabled = false;
      if (elements.checkUpdateIcon) elements.checkUpdateIcon.classList.remove('sync-spinner-icon');
      if (elements.checkUpdateBtnText && (!pendingUpdateVersion || pendingUpdateVersion === APP_VERSION)) {
        elements.checkUpdateBtnText.textContent = 'Check & Update';
      }
    }
  }
}

/**
 * Application Bootstrapper
 */
async function init() {
  // 1. Transaction form submission
  elements.recordForm?.addEventListener('submit', handleRecordSubmit);

  // 2. Currency setup
  elements.currencySelector.value = state.currency;
  updateCurrencySymbols();

  elements.currencySelector.addEventListener('change', (e) => {
    state.currency = e.target.value;
    localStorage.setItem('ledger_currency', state.currency);
    updateCurrencySymbols();
    renderTable();
  });

  // 3. Default date to today
  const today = new Date().toISOString().split('T')[0];
  elements.inputDate.value = today;

  // 4. Category options & initial entry type
  setEntryType('expense');

  // 5. Toggle buttons (Expense / Income)
  elements.btnTypeExpense.addEventListener('click', () =>
    setEntryType('expense'),
  );
  elements.btnTypeIncome.addEventListener('click', () =>
    setEntryType('income'),
  );

  // 6. Filter tabs
  elements.filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      elements.filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      state.currentFilter = tab.dataset.filter;
      renderTable();
    });
  });

  // 7. Month selector
  elements.monthFilter.addEventListener('change', (e) => {
    state.currentMonth = e.target.value;
    loadSummary();
    renderTable();
  });

  // 8. Search Input and Clear Button
  elements.searchInput?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim();
    renderTable();
  });

  elements.clearSearchBtn?.addEventListener('click', () => {
    if (elements.searchInput) elements.searchInput.value = '';
    state.searchQuery = '';
    renderTable();
    elements.searchInput?.focus();
  });

  // 9. Refresh button
  elements.refreshBtn.addEventListener('click', () => {
    loadSummary();
    loadRecords();
    showToast('Ledger data synced');
  });

  // 9. Export CSV button
  elements.exportCsvBtn?.addEventListener('click', exportToCSV);

  // 10. Retention modal event listeners
  elements.closeModalBtn?.addEventListener('click', closeRetentionModal);
  elements.retentionYearsSelect?.addEventListener(
    'change',
    evaluateRetentionEligible,
  );
  elements.downloadArchiveBtn?.addEventListener('click', downLoadArchiveCSV);
  elements.purgeOldRecordsBtn?.addEventListener('click', purgeOldRecords);
  elements.retentionModal?.addEventListener('click', (e) => {
    if (e.target === elements.retentionModal) closeRetentionModal();
  });

  // 11. Reddit-Style Profile Dropdown & Modal Event Listeners
  elements.landingGoogleLoginBtn?.addEventListener('click', signInWithGoogle);
  elements.landingSyncIdBtn?.addEventListener('click', signInWithSyncId);
  elements.landingSyncIdInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      signInWithSyncId();
    }
  });
  elements.userProfilePill?.addEventListener('click', toggleProfileDropdown);
  document.addEventListener('click', (e) => {
    if (
      !elements.profileDropdown?.classList.contains('hidden') &&
      !elements.profileDropdown?.contains(e.target) &&
      !elements.userProfilePill?.contains(e.target)
    ) {
      closeProfileDropdown();
    }
  });

  elements.menuViewProfileBtn?.addEventListener('click', openAccountModal);
  elements.menuEditAvatarBtn?.addEventListener('click', () => {
    closeProfileDropdown();
    elements.avatarFileInput?.click();
  });
  elements.accountAvatarUploadBtn?.addEventListener('click', () =>
    elements.avatarFileInput?.click(),
  );
  elements.uploadAvatarTextBtn?.addEventListener('click', () =>
    elements.avatarFileInput?.click(),
  );
  elements.avatarFileInput?.addEventListener(
    'change',
    handleAvatarFileSelected,
  );
  elements.resetAvatarBtn?.addEventListener('click', resetToGoogleAvatar);

  // Username Editing Event Listeners
  elements.editUsernameBtn?.addEventListener('click', showUsernameEdit);
  elements.saveUsernameBtn?.addEventListener('click', saveUsername);
  elements.cancelUsernameBtn?.addEventListener('click', cancelUsernameEdit);
  elements.usernameInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveUsername();
    if (e.key === 'Escape') cancelUsernameEdit();
  });

  elements.closeAccountModalBtn?.addEventListener('click', closeAccountModal);
  elements.closeAccountModalFooterBtn?.addEventListener(
    'click',
    closeAccountModal,
  );
  elements.accountModal?.addEventListener('click', (e) => {
    if (e.target === elements.accountModal) closeAccountModal();
  });

  // P2: Budget Tracker Event Listeners
  elements.quickEditBudgetBtn?.addEventListener('click', openBudgetModal);
  elements.closeBudgetModalBtn?.addEventListener('click', closeBudgetModal);
  elements.cancelBudgetBtn?.addEventListener('click', closeBudgetModal);
  elements.saveBudgetBtn?.addEventListener('click', handleSaveBudget);
  elements.budgetModal?.addEventListener('click', (e) => {
    if (e.target === elements.budgetModal) closeBudgetModal();
  });
  elements.budgetPresetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const amt = btn.dataset.amount;
      if (elements.budgetInputAmount && amt) {
        elements.budgetInputAmount.value = amt;
      }
    });
  });
  elements.budgetInputAmount?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSaveBudget();
    if (e.key === 'Escape') closeBudgetModal();
  });

  // Quick Amount Chips in Entry Form
  elements.quickAmtChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      if (!elements.inputAmount) return;
      const action = chip.dataset.quickAmt;
      if (action === 'clear') {
        elements.inputAmount.value = '';
        elements.inputAmount.focus();
        return;
      }
      const increment = parseFloat(action) || 0;
      const current = parseFloat(elements.inputAmount.value) || 0;
      elements.inputAmount.value = (current + increment).toFixed(2);
    });
  });

  // Settings Modal: App Update & Data Retention Shortcut
  elements.openRetentionFromSettingsBtn?.addEventListener('click', () => {
    closeBudgetModal();
    openRetentionModal();
  });

  elements.checkUpdateBtn?.addEventListener('click', () => {
    checkForAppUpdates(true);
  });

  elements.updateBannerApplyBtn?.addEventListener('click', () => {
    applyAppUpdate();
  });

  elements.updateBannerDismissBtn?.addEventListener('click', () => {
    elements.updateNotificationBanner?.classList.add('hidden');
  });

  elements.menuSettingsBtn?.addEventListener('click', () => {
    closeProfileDropdown();
    openBudgetModal();
  });
  elements.menuLogoutBtn?.addEventListener('click', signOutUser);

  // Theme switcher segmented controls
  elements.themeSegmentBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      setAppTheme(btn.dataset.themeVal);
    });
  });

  // Apply initial theme from localStorage
  const savedTheme = localStorage.getItem('ledger_theme') || 'system';
  setAppTheme(savedTheme);

  // 12. Initial data fetch (Loads records for offline or active database)
  loadSummary();
  loadRecords();

  // P3: Network & Cloud Sync Listeners
  window.addEventListener('online', () => {
    state.isOnline = true;
    updateSyncStatusUI();
    showToast('🌐 Network reconnected! Syncing drafts...');
    syncOfflineDrafts();
  });

  window.addEventListener('offline', () => {
    state.isOnline = false;
    updateSyncStatusUI();
    showToast('⚡ Device is offline. Transactions will be saved locally.', true);
  });

  elements.syncStatusPill?.addEventListener('click', () => {
    if (!navigator.onLine) {
      showToast('Device is offline. Will automatically sync once reconnected.', true);
      return;
    }
    const queue = getOfflineQueue();
    if (queue.length > 0) {
      syncOfflineDrafts();
    } else {
      showToast('All transactions are up to date with cloud.');
    }
  });

  updateSyncStatusUI();
  if (navigator.onLine && getOfflineQueue().length > 0) {
    syncOfflineDrafts();
  }

  // Register Service Worker & Check for Updates
  await registerServiceWorker();
  checkForAppUpdates(false);

  // 13. Dynamically load Supabase configuration and listen for auth state
  try {
    await initSupabaseClient();
    const savedSyncId = localStorage.getItem('ledger_sync_id_user');

    if (supabaseClient) {
      supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          localStorage.removeItem('ledger_sync_id_user');
          state.user = session.user;
          updateAuthUI(state.user);
          if (event === 'SIGNED_IN') {
            showToast(
              `Welcome, ${state.user.user_metadata?.full_name || state.user.email}!`,
            );
            await Promise.all([loadRecords(), loadSummary()]);
          }
        } else if (!localStorage.getItem('ledger_sync_id_user')) {
          state.user = null;
          updateAuthUI(null);
        }
      });

      const { data } = await supabaseClient.auth.getSession();
      if (data?.session?.user) {
        state.user = data.session.user;
        updateAuthUI(state.user);
        await Promise.all([loadRecords(), loadSummary()]);
      } else if (savedSyncId) {
        state.user = createSyncIdUserObject(savedSyncId);
        updateAuthUI(state.user);
        await Promise.all([loadRecords(), loadSummary()]);
      } else {
        updateAuthUI(null);
      }
    } else if (savedSyncId) {
      state.user = createSyncIdUserObject(savedSyncId);
      updateAuthUI(state.user);
      await Promise.all([loadRecords(), loadSummary()]);
    } else {
      updateAuthUI(null);
    }
  } catch (authErr) {
    console.warn('Supabase Auth init skipped:', authErr);
    const savedSyncId = localStorage.getItem('ledger_sync_id_user');
    if (savedSyncId) {
      state.user = createSyncIdUserObject(savedSyncId);
      updateAuthUI(state.user);
      await Promise.all([loadRecords(), loadSummary()]);
    } else {
      updateAuthUI(null);
    }
  }
}

// Start Application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
