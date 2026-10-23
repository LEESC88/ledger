/**
 * ============================================================================
 * LEDGER — Client Application Engine (Cyan-White Theme Edition)
 * Pure Vanilla JavaScript • Zero External Dependencies
 * ============================================================================
 */

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
  records: [],
  summary: null,
};

// Supabase Client Instance (Dynamically loaded from backend)
let supabaseClient = null;

// DOM Elements
const elements = {
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
  maintenanceBtn: document.getElementById('maintenanceBtn'),
  retentionModal: document.getElementById('retentionModal'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  retentionYearsSelect: document.getElementById('retentionYearsSelect'),
  retentionMatchCount: document.getElementById('retentionMatchCount'),
  retentionCutoffDate: document.getElementById('retentionCutoffDate'),
  downloadArchiveBtn: document.getElementById('downloadArchiveBtn'),
  purgeOldRecordsBtn: document.getElementById('purgeOldRecordsBtn'),
  userProfilePill: document.getElementById('userProfilePill'),
  userAvatar: document.getElementById('userAvatar'),
  userName: document.getElementById('userName'),
  googleLoginBtn: document.getElementById('googleLoginBtn'),
  logoutBtn: document.getElementById('logoutBtn'),
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
 * Fetch and Render Financial Summary
 */
async function loadSummary() {
  try {
    const url =
      state.currentMonth === 'all'
        ? '/api/records/summary'
        : `/api/records/summary?month=${state.currentMonth}`;

    const res = await fetch(url);
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
  } catch (err) {
    console.error('Error loading summary:', err);
  }
}

/**
 * Fetch and Render All Records
 */
async function loadRecords() {
  try {
    const res = await fetch('/api/records');
    if (!res.ok) throw new Error('Failed to fetch records');
    const data = await res.json();
    state.records = Array.isArray(data) ? data : [];

    updateMonthFilterDropdown(state.records);
    renderTable();
  } catch (err) {
    console.error('Error loading records:', err);
    showToast('Failed to load transaction history', true);
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

      return `
        <tr data-id="${record.id}">
          <td class="col-date">${escapeHtml(record.date)}</td>
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
            <button class="btn-del" onclick="handleDelete(${record.id})" title="Delete entry">
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

  try {
    elements.submitBtn.disabled = true;
    elements.submitBtn.style.opacity = '0.7';

    const res = await fetch('/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      const msg = Array.isArray(errorData.message)
        ? errorData.message.join(', ')
        : errorData.message || 'Transaction failed';
      throw new Error(msg);
    }

    showToast(
      `Recorded ${state.currency} ${formatNumber(amount)} ${state.currentType}`,
    );
    elements.inputAmount.value = '';
    elements.inputNote.value = '';

    await Promise.all([loadRecords(), loadSummary()]);
  } catch (err) {
    console.error('Error creating record:', err);
    showToast(err.message, true);
  } finally {
    elements.submitBtn.disabled = false;
    elements.submitBtn.style.opacity = '1';
  }
}

/**
 * Delete Record Action
 */
window.handleDelete = async function (id) {
  if (!confirm(`Are you sure you want to delete transaction #${id}?`)) {
    return;
  }

  try {
    const res = await fetch(`/api/records/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Failed to delete transaction');

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
          borderColor: '#FFFFFF',
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
              weight: '500',
            },
            color: '#475569',
            padding: 8,
          },
        },
        tooltip: {
          backgroundColor: '#0F172A',
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

function purgeOldRecords() {
  const years = parseInt(elements.retentionYearsSelect.value) || 3;
  if (
    !confirm(
      `Are you sure you want to permanetly delete all records older than ${years} years? This action cannot be undone.`,
    )
  ) {
    return;
  }

  fetch(`/api/records/purge?years=${years}`, {
    method: 'DELETE',
  })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to purge old records');
      showToast(`Purged records older than ${years} years`);
      closeRetentionModal();
      loadSummary();
      loadRecords();
    })
    .catch((err) => {
      console.error('Error purging old records:', err);
      showToast(err.message, true);
    });
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
 * Dynamically fetch public configuration and initialize Supabase client
 */
async function initSupabaseClient() {
  try {
    const res = await fetch('/api/records/config');
    if (!res.ok) return;
    const config = await res.json();
    if (config.supabaseUrl && config.supabaseAnonKey && window.supabase) {
      supabaseClient = window.supabase.createClient(
        config.supabaseUrl,
        config.supabaseAnonKey,
      );
    }
  } catch (err) {
    console.error('Failed to load client configuration:', err);
  }
}

/**
 * Initiate Google OAuth Sign-in Flow
 */
async function signInWithGoogle() {
  if (!supabaseClient) return showToast('Supabase client not initialized', true);
  await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
}

/**
 * Sign out current authenticated user session
 */
async function signOutUser() {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
  showToast('Signed out successfully');
}

/**
 * Update UI presentation based on authentication state
 */
function updateAuthUI(user) {
  if (user) {
    elements.googleLoginBtn?.classList.add('hidden');
    elements.userProfilePill?.classList.remove('hidden');
    if (elements.userName)
      elements.userName.textContent =
        user.user_metadata?.full_name || user.email;
    if (elements.userAvatar)
      elements.userAvatar.src =
        user.user_metadata?.avatar_url ||
        'https://www.gravatar.com/avatar/?d=mp';
  } else {
    elements.googleLoginBtn?.classList.remove('hidden');
    elements.userProfilePill?.classList.add('hidden');
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

  // 8. Refresh button
  elements.refreshBtn.addEventListener('click', () => {
    loadSummary();
    loadRecords();
    showToast('Ledger data synced');
  });

  // 9. Export CSV button
  elements.exportCsvBtn?.addEventListener('click', exportToCSV);

  // 10. Retention modal event listeners
  elements.maintenanceBtn?.addEventListener('click', openRetentionModal);
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

  // 11. Google Auth event listeners
  elements.googleLoginBtn?.addEventListener('click', signInWithGoogle);
  elements.logoutBtn?.addEventListener('click', signOutUser);

  // 12. Initial data fetch
  loadSummary();
  loadRecords();

  // 13. Dynamically load Supabase configuration and listen for auth state
  try {
    await initSupabaseClient();
    if (supabaseClient) {
      supabaseClient.auth.onAuthStateChange((event, session) => {
        state.user = session?.user || null;
        updateAuthUI(state.user);
        if (event === 'SIGNED_IN') {
          showToast(
            `Welcome, ${state.user.user_metadata?.full_name || state.user.email}!`,
          );
        }
      });

      const { data } = await supabaseClient.auth.getSession();
      if (data?.session?.user) {
        state.user = data.session.user;
        updateAuthUI(state.user);
      }
    }
  } catch (authErr) {
    console.warn('Supabase Auth init skipped:', authErr);
  }
}

// Start Application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
