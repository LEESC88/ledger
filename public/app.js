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
  currency: localStorage.getItem('ledger_currency') || 'RM',
  currentType: 'expense',
  currentFilter: 'all',
  currentMonth: 'all',
  records: [],
  summary: null,
};

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
  toast: document.getElementById('toastNotification'),
  toastMessage: document.getElementById('toastMessage'),
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
    if (el.textContent.includes('+')) {
      el.textContent = `+ ${sym}`;
    } else if (el.textContent.includes('-') || el.textContent.includes('−')) {
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
    const url = state.currentMonth === 'all'
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
    state.records = data;

    updateMonthFilterDropdown(data);
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
elements.recordForm.addEventListener('submit', async (e) => {
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

    showToast(`Recorded ${state.currency} ${formatNumber(amount)} ${state.currentType}`);
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
});

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
 * Application Bootstrapper
 */
function init() {
  // 1. Currency setup
  elements.currencySelector.value = state.currency;
  updateCurrencySymbols();

  elements.currencySelector.addEventListener('change', (e) => {
    state.currency = e.target.value;
    localStorage.setItem('ledger_currency', state.currency);
    updateCurrencySymbols();
    renderTable();
  });

  // 2. Default date to today
  const today = new Date().toISOString().split('T')[0];
  elements.inputDate.value = today;

  // 3. Category options
  setEntryType('expense');

  // 4. Toggle buttons
  elements.btnTypeExpense.addEventListener('click', () => setEntryType('expense'));
  elements.btnTypeIncome.addEventListener('click', () => setEntryType('income'));

  // 5. Filter tabs
  elements.filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      elements.filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      state.currentFilter = tab.dataset.filter;
      renderTable();
    });
  });

  // 6. Month selector
  elements.monthFilter.addEventListener('change', (e) => {
    state.currentMonth = e.target.value;
    loadSummary();
    renderTable();
  });

  // 7. Refresh button
  elements.refreshBtn.addEventListener('click', () => {
    loadSummary();
    loadRecords();
    showToast('Ledger data synced');
  });

  // 8. Initial data fetch
  loadSummary();
  loadRecords();
}

// Start
document.addEventListener('DOMContentLoaded', init);
