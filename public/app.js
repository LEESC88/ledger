/**
 * ============================================================================
 * MonetaX — Client Application Engine (Minimalist Pro Max Edition)
 * Pure Vanilla JavaScript • Multi-Page Mobile Architecture • Bilingual (EN/中文)
 * ============================================================================
 */
// Current Client Release Version
const APP_VERSION = '1.5.0';

// Default BaaS Cloud Configuration (Decoded from safe payload, overridable by window.__ENV__)
const SUPABASE_DEFAULT_CONFIG = {
  url:
    window.__ENV__?.SUPABASE_URL ||
    (typeof atob === 'function'
      ? atob('aHR0cHM6Ly9iY2Z0emZvaGhpd2dhYnZmZGV3ZS5zdXBhYmFzZS5jbw==')
      : ''),
  anonKey:
    window.__ENV__?.SUPABASE_ANON_KEY ||
    (typeof atob === 'function'
      ? atob(
          'ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW1KalpuUjZabTlvYUdsM1oyRmlkbVprWlhkbElpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzT1RJM01UZzNNVGtzSW1WNGNDSTZNakV3T0RJNU5EY3hPWDAuaGItd3N2TUlTU0NfdDlBb2JqYnVkNGxyRUNMUVNMbG1Ibzl4MjVBLTJGdw==',
        )
      : ''),
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

// Consistent Line-Art SVG Icons (Matches modern tab bar outline style)
const SVG_ICONS = {
  dining: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
  transport: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>`,
  shopping: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
  housing: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
  entertainment: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"></rect><line x1="7" x2="7" y1="2" y2="22"></line><line x1="17" x2="17" y1="2" y2="22"></line><line x1="2" x2="22" y1="12" y2="12"></line><line x1="2" x2="7" y1="7" y2="7"></line><line x1="2" x2="7" y1="17" y2="17"></line><line x1="17" x2="22" y1="17" y2="17"></line><line x1="17" x2="22" y1="7" y2="7"></line></svg>`,
  medical: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>`,
  subscriptions: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 21h5v-5"></path></svg>`,
  otherExpense: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>`,
  salary: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>`,
  freelance: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"></path></svg>`,
  invest: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>`,
  bonus: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"></rect><path d="M12 8v13"></path><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path></svg>`,
  refund: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path></svg>`,
  otherIncome: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8M8 12h8"></path></svg>`,

  // Accounts
  cash: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>`,
  ewallet: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>`,
  bank: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"></line><line x1="6" x2="6" y1="18" y2="11"></line><line x1="10" x2="10" y1="18" y2="11"></line><line x1="14" x2="14" y1="18" y2="11"></line><line x1="18" x2="18" y1="18" y2="11"></line><polygon points="12 2 20 7 4 7"></polygon></svg>`,
  credit: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>`,

  // Modules & Utilities
  target: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
  claims: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14l2 2 4-4"></path></svg>`,
  calendar: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>`,
  plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  users: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
};

// Visual Category Metadata (Line Icons, High-Contrast Palette Colors & Bilingual Labels)
const CATEGORY_META = {
  'Food & Dining': {
    icon: SVG_ICONS.dining,
    en: 'Dining',
    zh: '餐饮美食',
    color: '#F97316',
  },
  Transportation: {
    icon: SVG_ICONS.transport,
    en: 'Transport',
    zh: '交通出行',
    color: '#0EA5E9',
  },
  Shopping: {
    icon: SVG_ICONS.shopping,
    en: 'Shopping',
    zh: '购物消费',
    color: '#EC4899',
  },
  'Housing & Utilities': {
    icon: SVG_ICONS.housing,
    en: 'Housing',
    zh: '居家水电',
    color: '#EAB308',
  },
  Entertainment: {
    icon: SVG_ICONS.entertainment,
    en: 'Leisure',
    zh: '休闲娱乐',
    color: '#8B5CF6',
  },
  Healthcare: {
    icon: SVG_ICONS.medical,
    en: 'Medical',
    zh: '医疗健康',
    color: '#EF4444',
  },
  Subscriptions: {
    icon: SVG_ICONS.subscriptions,
    en: 'Subscript.',
    zh: '会员订阅',
    color: '#06B6D4',
  },
  'Other Expense': {
    icon: SVG_ICONS.otherExpense,
    en: 'Other',
    zh: '其他支出',
    color: '#64748B',
  },
  Salary: {
    icon: SVG_ICONS.salary,
    en: 'Salary',
    zh: '薪资收入',
    color: '#10B981',
  },
  Freelance: {
    icon: SVG_ICONS.freelance,
    en: 'Freelance',
    zh: '兼职副业',
    color: '#14B8A6',
  },
  'Investment & Dividends': {
    icon: SVG_ICONS.invest,
    en: 'Invest',
    zh: '投资理财',
    color: '#6366F1',
  },
  Bonus: {
    icon: SVG_ICONS.bonus,
    en: 'Bonus',
    zh: '奖金补贴',
    color: '#F59E0B',
  },
  Refund: {
    icon: SVG_ICONS.refund,
    en: 'Refund',
    zh: '退款报销',
    color: '#3B82F6',
  },
  'Other Income': {
    icon: SVG_ICONS.otherIncome,
    en: 'Other',
    zh: '其他收入',
    color: '#A855F7',
  },
};

// Full Bilingual Dictionary (Loaded dynamically from public/i18n.js)
const I18N = window.I18N || { en: {}, zh: {} };

// Application State
let state = {
  user: null,
  lang: localStorage.getItem('ledger_lang') || 'zh',
  activePage: 'ledger',
  currency: localStorage.getItem('ledger_currency') || 'RM',
  currentType: 'expense',
  currentFilter: 'all',
  currentMonth: 'all',
  selectedAccount: 'Cash',
  selectedAccountFilter: 'all',
  accounts: [],
  editingAccountName: null,
  currentStreak: 0,
  searchQuery: '',
  monthlyBudget: 3000,
  isOnline: navigator.onLine,
  isSyncing: false,
  records: [],
  summary: null,
  projects: [],
  claims: [],
  budgetTopUps: {},
  activeProjectTab: 'sinking',
  selectedAccountsMonth: 'current',
  editingRecordId: null,
  isPrivacyMode: localStorage.getItem('ledger_privacy_mode') === 'true',
};

// Default Supported Payment Accounts / Asset Wallets
const DEFAULT_ACCOUNTS = [
  { name: 'Cash', icon: SVG_ICONS.cash, type: 'cash', zh: '现金 (Cash)' },
  { name: 'eWallet', icon: SVG_ICONS.ewallet, type: 'ewallet', zh: '电子钱包' },
  {
    name: 'Bank Card',
    icon: SVG_ICONS.bank,
    type: 'bank',
    zh: '银行卡 (Bank)',
  },
  {
    name: 'Credit Card',
    icon: SVG_ICONS.credit,
    type: 'credit',
    zh: '信用卡 (Credit)',
  },
];

function getAccountMeta(name) {
  let norm = (name || 'Cash').trim();
  if (norm.toLowerCase() === 'tng ewallet' || norm.toLowerCase() === 'tng') {
    norm = 'eWallet';
  }
  const found = DEFAULT_ACCOUNTS.find(
    (a) => a.name.toLowerCase() === norm.toLowerCase(),
  );
  if (found) return found;
  return { name: norm, icon: SVG_ICONS.cash, type: 'general', zh: norm };
}

function getAccountDisplayLabel(name) {
  const meta = getAccountMeta(name);
  if (state.lang === 'zh') return meta.zh || meta.name;
  return meta.name;
}

function getAccountDisplayName(name) {
  return getAccountDisplayLabel(name);
}

// Supabase Client Instance
let supabaseClient = null;

// DOM Elements
const elements = {
  // Views
  loginLandingView: document.getElementById('loginLandingView'),
  appLayout: document.getElementById('appLayout'),
  landingGoogleLoginBtn: document.getElementById('landingGoogleLoginBtn'),

  // Multi-Page Views & Navigation
  appPages: document.querySelectorAll('.app-page'),
  bottomNavItems: document.querySelectorAll(
    '.bottom-nav-item[data-nav-target]',
  ),
  openCreateModalBtn: document.getElementById('openCreateModalBtn'),
  desktopCreateBtn: document.getElementById('desktopCreateBtn'),
  emptyCreateBtn: document.getElementById('emptyCreateBtn'),

  // Create Entry Modal
  createEntryModal: document.getElementById('createEntryModal'),
  closeCreateModalBtn: document.getElementById('closeCreateModalBtn'),
  categoryGridContainer: document.getElementById('categoryGridContainer'),
  createModalTitle: document.querySelector('#createEntryModal .modal-title'),
  createModalSubtitle: document.querySelector(
    '#createEntryModal .modal-subtitle',
  ),
  submitBtnText: document.querySelector('#submitBtn span'),

  // Header Controls
  currencySelector: document.getElementById('currencySelector'),
  monthFilter: document.getElementById('monthFilter'),
  refreshBtn: document.getElementById('refreshBtn'),
  privacyToggleBtn: document.getElementById('privacyToggleBtn'),
  privacyIconEye: document.getElementById('privacyIconEye'),
  privacyIconEyeOff: document.getElementById('privacyIconEyeOff'),
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
  retentionCutoffPrefix: document.getElementById('retentionCutoffPrefix'),
  retentionCutoffDate: document.getElementById('retentionCutoffDate'),
  downloadArchiveBtn: document.getElementById('downloadArchiveBtn'),
  purgeOldRecordsBtn: document.getElementById('purgeOldRecordsBtn'),

  // Search & Filter
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  searchResultCount: document.getElementById('searchResultCount'),

  // Projects & Claims Module Elements
  pageProjects: document.getElementById('pageProjects'),
  openNewProjectBtn: document.getElementById('openNewProjectBtn'),
  tabSinkingFundsBtn: document.getElementById('tabSinkingFundsBtn'),
  tabClaimsBtn: document.getElementById('tabClaimsBtn'),
  sinkingFundsView: document.getElementById('sinkingFundsView'),
  claimsView: document.getElementById('claimsView'),
  sinkingFundsList: document.getElementById('sinkingFundsList'),
  claimsList: document.getElementById('claimsList'),
  claimsPendingTotalVal: document.getElementById('claimsPendingTotalVal'),
  openNewClaimBtn: document.getElementById('openNewClaimBtn'),

  // Budget Top-Up Elements
  quickTopupBudgetBtn: document.getElementById('quickTopupBudgetBtn'),
  budgetFormulaRow: document.getElementById('budgetFormulaRow'),
  budgetFormulaText: document.getElementById('budgetFormulaText'),
  budgetLockedBar: document.getElementById('budgetLockedBar'),
  topupBudgetModal: document.getElementById('topupBudgetModal'),
  closeTopupBudgetModalBtn: document.getElementById('closeTopupBudgetModalBtn'),
  cancelTopupBudgetBtn: document.getElementById('cancelTopupBudgetBtn'),
  saveTopupBudgetBtn: document.getElementById('saveTopupBudgetBtn'),
  budgetTopupAmountInput: document.getElementById('budgetTopupAmountInput'),
  budgetTopupReasonInput: document.getElementById('budgetTopupReasonInput'),

  // New Project Modal Elements
  newProjectModal: document.getElementById('newProjectModal'),
  closeNewProjectModalBtn: document.getElementById('closeNewProjectModalBtn'),
  cancelNewProjectBtn: document.getElementById('cancelNewProjectBtn'),
  saveNewProjectBtn: document.getElementById('saveNewProjectBtn'),
  projectInputTitle: document.getElementById('projectInputTitle'),
  projectInputAmount: document.getElementById('projectInputAmount'),
  btnModeBudgetDeduct: document.getElementById('btnModeBudgetDeduct'),
  btnModeExtraFund: document.getElementById('btnModeExtraFund'),
  projectModeTip: document.getElementById('projectModeTip'),

  // Confirmation Modal Elements
  confirmActionModal: document.getElementById('confirmActionModal'),
  closeConfirmModalBtn: document.getElementById('closeConfirmModalBtn'),
  cancelConfirmBtn: document.getElementById('cancelConfirmBtn'),
  proceedConfirmBtn: document.getElementById('proceedConfirmBtn'),
  confirmModalIcon: document.getElementById('confirmModalIcon'),
  confirmModalTitle: document.getElementById('confirmModalTitle'),
  confirmModalSub: document.getElementById('confirmModalSub'),
  confirmModalDesc: document.getElementById('confirmModalDesc'),

  // Advanced Create Record Toggles & Drawers
  toggleFundLinkBtn: document.getElementById('toggleFundLinkBtn'),
  toggleSplitBillBtn: document.getElementById('toggleSplitBillBtn'),
  sinkingFundDrawer: document.getElementById('sinkingFundDrawer'),
  splitBillDrawer: document.getElementById('splitBillDrawer'),
  entryProjectSelect: document.getElementById('entryProjectSelect'),
  splitMyShareInput: document.getElementById('splitMyShareInput'),
  addFriendRowBtn: document.getElementById('addFriendRowBtn'),
  splitFriendsList: document.getElementById('splitFriendsList'),

  // Network & Cloud Sync Elements
  syncStatusPill: document.getElementById('syncStatusPill'),
  syncStatusText: document.getElementById('syncStatusText'),
  syncSpinnerIcon: document.getElementById('syncSpinnerIcon'),

  // Budget Tracker Elements
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

  // App Version & In-App Auto-Update Elements
  updateNotificationBanner: document.getElementById('updateNotificationBanner'),
  updateBannerText: document.getElementById('updateBannerText'),
  updateBannerApplyBtn: document.getElementById('updateBannerApplyBtn'),
  updateBannerDismissBtn: document.getElementById('updateBannerDismissBtn'),
  appVersionBadge: document.getElementById('appVersionBadge'),
  updateStatusText: document.getElementById('updateStatusText'),
  checkUpdateBtn: document.getElementById('checkUpdateBtn'),
  checkUpdateIcon: document.getElementById('checkUpdateIcon'),
  checkUpdateBtnText: document.getElementById('checkUpdateBtnText'),
  openRetentionFromSettingsBtn: document.getElementById(
    'openRetentionFromSettingsBtn',
  ),

  // Dedicated In-App Update Modal
  inAppUpdateModal: document.getElementById('inAppUpdateModal'),
  closeInAppUpdateModalBtn: document.getElementById('closeInAppUpdateModalBtn'),
  inAppUpdateVersionBadge: document.getElementById('inAppUpdateVersionBadge'),
  inAppUpdateNotes: document.getElementById('inAppUpdateNotes'),
  updateDownloadProgressArea: document.getElementById(
    'updateDownloadProgressArea',
  ),
  updateProgressStatusText: document.getElementById('updateProgressStatusText'),
  updateProgressPercent: document.getElementById('updateProgressPercent'),
  updateProgressBarFill: document.getElementById('updateProgressBarFill'),
  updateProgressBytes: document.getElementById('updateProgressBytes'),
  cancelInAppUpdateBtn: document.getElementById('cancelInAppUpdateBtn'),
  startInAppUpdateBtn: document.getElementById('startInAppUpdateBtn'),
  startInAppUpdateBtnText: document.getElementById('startInAppUpdateBtnText'),

  // Profile Dropdown & Settings Elements
  userProfilePill: document.getElementById('userProfilePill'),
  userAvatar: document.getElementById('userAvatar'),
  userName: document.getElementById('userName'),
  profileDropdown: document.getElementById('profileDropdown'),
  menuViewProfileBtn: document.getElementById('menuViewProfileBtn'),
  dropdownAvatar: document.getElementById('dropdownAvatar'),
  dropdownUserName: document.getElementById('dropdownUserName'),
  menuEditAvatarBtn: document.getElementById('menuEditAvatarBtn'),
  themeSegmentBtns: document.querySelectorAll(
    '.theme-segment-btn:not(.lang-segment-btn)',
  ),
  langSegmentBtns: document.querySelectorAll('.lang-segment-btn'),
  menuSettingsBtn: document.getElementById('menuSettingsBtn'),
  menuLogoutBtn: document.getElementById('menuLogoutBtn'),

  // Inline Account Profile Elements (in Settings Page)
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

  // Accounts & Wallets Elements
  accountFilterSelect: document.getElementById('accountFilterSelect'),
  accountSelectorGrid: document.getElementById('accountSelectorGrid'),
  selectedAccountInput: document.getElementById('selectedAccountInput'),
  settingsAccountsCenterCard: document.getElementById(
    'settingsAccountsCenterCard',
  ),
  accountsWalletsList: document.getElementById('accountsWalletsList'),
  totalNetWorthValue: document.getElementById('totalNetWorthValue'),
  spendingAccountsMonthFilter: document.getElementById(
    'spendingAccountsMonthFilter',
  ),

  // Avatar Lightbox Preview Elements
  avatarLightboxModal: document.getElementById('avatarLightboxModal'),
  avatarLightboxBackdrop: document.getElementById('avatarLightboxBackdrop'),
  closeAvatarLightboxBtn: document.getElementById('closeAvatarLightboxBtn'),
  avatarLightboxImg: document.getElementById('avatarLightboxImg'),
  avatarLightboxName: document.getElementById('avatarLightboxName'),
  avatarLightboxEmail: document.getElementById('avatarLightboxEmail'),

  // Bottom Sheet & Gesture
  createSheetDragHandle: document.getElementById('createSheetDragHandle'),
  createSheetDialog: document.querySelector('.create-sheet-dialog'),

  // Daily Spending Trend Chart
  dailyTrendChart: document.getElementById('dailyTrendChart'),
  trendPeakDayBadge: document.getElementById('trendPeakDayBadge'),
  trendEmptyOverlay: document.getElementById('trendEmptyOverlay'),

  // Streak & Motivation Badges Elements
  streakPill: document.getElementById('streakPill'),
  streakCountText: document.getElementById('streakCountText'),
  settingsStreakCount: document.getElementById('settingsStreakCount'),
  badgesGridContainer: document.getElementById('badgesGridContainer'),
};

/**
 * Translate helper for current language
 */
function t(key) {
  const dict = I18N[state.lang] || I18N.en;
  return dict[key] || I18N.en[key] || '';
}

/**
 * Native Haptic Feedback (Vibration API)
 * @param {number} [duration=10] Vibration duration in milliseconds
 */
function triggerHaptic(duration = 10) {
  try {
    if (
      typeof navigator !== 'undefined' &&
      typeof navigator.vibrate === 'function'
    ) {
      navigator.vibrate(duration);
    }
  } catch (err) {
    // Non-blocking fallback for platforms without vibration hardware
  }
}

/**
 * Get localized category label & icon
 */
function getCategoryDisplayLabel(cat) {
  const meta = CATEGORY_META[cat];
  if (!meta) return cat;
  return state.lang === 'zh' ? meta.zh : meta.en;
}

function getCategoryIcon(cat) {
  return CATEGORY_META[cat]?.icon || SVG_ICONS.otherExpense;
}

/**
 * Switch Application Language (EN / 中文)
 */
function setAppLanguage(lang) {
  const validLang = lang === 'zh' ? 'zh' : 'en';
  state.lang = validLang;
  localStorage.setItem('ledger_lang', validLang);
  document.documentElement.setAttribute(
    'lang',
    validLang === 'zh' ? 'zh-CN' : 'en',
  );

  elements.langSegmentBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.langVal === validLang);
  });

  // Translate all static [data-i18n] elements safely (never overwrite with raw key)
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const translated = key ? t(key) : '';
    if (translated) {
      el.textContent = translated;
    }
  });

  // Translate all [data-i18n-placeholder] inputs safely
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    const translated = key ? t(key) : '';
    if (translated) {
      el.setAttribute('placeholder', translated);
    }
  });

  // Re-render dynamic components with new language
  renderCategoryGrid(state.currentType);
  renderAccountPicker();
  updateMonthFilterDropdown(state.records);
  renderTable();
  renderBudgetTracker();
  renderSinkingFunds();
  renderClaims();
  renderBudgetTopupHistory();
  updateProjectDropdownOptions();
  updateSyncStatusUI();
  updateAccountModalData();
  renderAccountsCenter();
  renderStreakAndBadges();
  updateRetentionDropdownLabels();
  evaluateRetentionEligible();
  if (state.summary) {
    updateSummaryStatusBadge(state.summary.netBalance);
    renderCategoryChart(state.summary.categoryBreakdown);
    updateDailySpendingTrend();
  }
}

/**
 * Global Modal History Stack & Hardware Back Button / Escape Key Guard
 */
let isPoppingModalHistory = false;

function hasAnyOpenModal() {
  const modalEls = [
    elements.avatarLightboxModal,
    elements.confirmActionModal,
    elements.inAppUpdateModal,
    elements.topupBudgetModal,
    elements.newProjectModal,
    elements.budgetModal,
    elements.retentionModal,
    elements.createEntryModal,
  ];
  return modalEls.some((el) => el && !el.classList.contains('hidden'));
}

function pushModalHistoryState() {
  try {
    if (!window.history.state?.ledgerModal) {
      window.history.pushState({ ledgerModal: true }, '');
    }
  } catch (e) {}
}

function popModalHistoryIfCleared(fromPopState = false) {
  if (fromPopState) return;
  try {
    if (!hasAnyOpenModal() && window.history.state?.ledgerModal) {
      isPoppingModalHistory = true;
      window.history.back();
    }
  } catch (e) {
    isPoppingModalHistory = false;
  }
}

function closeTopmostActiveModal(fromPopState = false) {
  if (
    elements.avatarLightboxModal &&
    !elements.avatarLightboxModal.classList.contains('hidden')
  ) {
    closeAvatarLightbox(fromPopState);
    return true;
  }
  if (
    elements.confirmActionModal &&
    !elements.confirmActionModal.classList.contains('hidden')
  ) {
    closeConfirmModal(fromPopState);
    return true;
  }
  if (
    elements.inAppUpdateModal &&
    !elements.inAppUpdateModal.classList.contains('hidden')
  ) {
    closeInAppUpdateModal(fromPopState);
    return true;
  }
  if (
    elements.topupBudgetModal &&
    !elements.topupBudgetModal.classList.contains('hidden')
  ) {
    closeTopupBudgetModal(fromPopState);
    return true;
  }
  if (
    elements.newProjectModal &&
    !elements.newProjectModal.classList.contains('hidden')
  ) {
    closeNewProjectModal(fromPopState);
    return true;
  }
  if (
    elements.budgetModal &&
    !elements.budgetModal.classList.contains('hidden')
  ) {
    closeBudgetModal(fromPopState);
    return true;
  }
  if (
    elements.retentionModal &&
    !elements.retentionModal.classList.contains('hidden')
  ) {
    closeRetentionModal(fromPopState);
    return true;
  }
  if (
    elements.createEntryModal &&
    !elements.createEntryModal.classList.contains('hidden')
  ) {
    closeCreateModal(fromPopState);
    return true;
  }
  if (
    elements.profileDropdown &&
    !elements.profileDropdown.classList.contains('hidden')
  ) {
    closeProfileDropdown();
    return true;
  }
  return false;
}

function initModalBackAndEscapeGuards() {
  window.addEventListener('popstate', () => {
    if (isPoppingModalHistory) {
      isPoppingModalHistory = false;
      return;
    }
    if (hasAnyOpenModal()) {
      closeTopmostActiveModal(true);
      if (hasAnyOpenModal()) {
        pushModalHistoryState();
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeTopmostActiveModal(false);
    }
  });
}

/**
 * Switch Active Page View (ledger | analytics | settings)
 */
function switchAppPage(pageName) {
  triggerHaptic(10);
  const target = ['ledger', 'projects', 'analytics', 'settings'].includes(
    pageName,
  )
    ? pageName
    : 'ledger';
  state.activePage = target;

  elements.appPages.forEach((page) => {
    const isMatch = page.dataset.page === target;
    page.classList.toggle('active', isMatch);
    page.classList.toggle('hidden', !isMatch);
  });

  elements.bottomNavItems.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.navTarget === target);
  });

  closeProfileDropdown();

  if (target === 'analytics') {
    renderBudgetTracker();
    if (state.summary?.categoryBreakdown) {
      setTimeout(
        () => renderCategoryChart(state.summary.categoryBreakdown),
        30,
      );
    }
    setTimeout(() => updateDailySpendingTrend(), 30);
  } else if (target === 'projects') {
    renderProjectsView();
  } else if (target === 'settings') {
    updateAccountModalData();
    loadAccounts();
  }
}

/**
 * Open & Close Create Transaction Modal
 */
/**
 * Open & Close Create / Edit Transaction Modal
 */
function openCreateModal() {
  triggerHaptic(10);
  state.editingRecordId = null;
  closeProfileDropdown();
  updateProjectDropdownOptions();

  // Reset Modal Header and Button
  if (elements.createModalTitle) {
    elements.createModalTitle.textContent = t('create_modal_title');
  }
  if (elements.createModalSubtitle) {
    elements.createModalSubtitle.textContent = t('create_modal_sub');
  }
  if (elements.submitBtnText) {
    elements.submitBtnText.textContent = t('commit_btn');
  }

  // Clear Form Fields
  if (elements.inputAmount) elements.inputAmount.value = '';
  if (elements.inputNote) elements.inputNote.value = '';
  if (elements.inputDate) {
    elements.inputDate.value = getLocalDateString();
  }

  // Reset Advanced Toggles & Drawers
  if (elements.toggleFundLinkBtn)
    elements.toggleFundLinkBtn.classList.remove('active');
  if (elements.toggleSplitBillBtn)
    elements.toggleSplitBillBtn.classList.remove('active');
  elements.sinkingFundDrawer?.classList.add('hidden');
  elements.splitBillDrawer?.classList.add('hidden');
  if (elements.entryProjectSelect) elements.entryProjectSelect.value = '';
  if (elements.splitMyShareInput) elements.splitMyShareInput.value = '';
  if (elements.splitFriendsList) elements.splitFriendsList.innerHTML = '';

  renderCategoryGrid(state.currentType);
  renderAccountPicker();
  elements.createEntryModal?.classList.remove('hidden');
  pushModalHistoryState();
  setTimeout(() => {
    elements.inputAmount?.focus();
  }, 60);
}

function openEditRecordModal(id) {
  triggerHaptic(10);
  const record = state.records.find((r) => String(r.id) === String(id));
  if (!record) return;

  state.editingRecordId = record.id;
  closeProfileDropdown();
  updateProjectDropdownOptions();

  // 1. Update Title and Button for Editing
  if (elements.createModalTitle) {
    elements.createModalTitle.textContent = t('edit_modal_title');
  }
  if (elements.createModalSubtitle) {
    elements.createModalSubtitle.textContent = t('edit_modal_sub');
  }
  if (elements.submitBtnText) {
    elements.submitBtnText.textContent = t('save_changes_btn');
  }

  // 2. Pre-fill Transaction Type
  setEntryType(record.type || 'expense');

  // 3. Pre-fill Amount
  if (elements.inputAmount) {
    elements.inputAmount.value = record.amount;
  }

  // 4. Pre-fill Category & Re-render Grid
  if (elements.selectCategory) {
    elements.selectCategory.value = record.category;
  }
  renderCategoryGrid(record.type || 'expense');
  if (elements.categoryGridContainer) {
    elements.categoryGridContainer
      .querySelectorAll('.cat-grid-btn')
      .forEach((b) => {
        b.classList.toggle(
          'active',
          b.getAttribute('data-cat-val') === record.category,
        );
      });
  }

  // 5. Pre-fill Payment Account
  state.selectedAccount = record.account_name || 'Cash';
  if (elements.selectedAccountInput) {
    elements.selectedAccountInput.value = state.selectedAccount;
  }
  renderAccountPicker();

  // 6. Pre-fill Date & Note
  if (elements.inputDate) {
    elements.inputDate.value = record.date;
  }
  if (elements.inputNote) {
    elements.inputNote.value = formatRecordCleanNote(record.note || '');
  }

  // 7. Hide Project & Split Drawers during basic edit for clarity
  if (elements.toggleFundLinkBtn)
    elements.toggleFundLinkBtn.classList.remove('active');
  if (elements.toggleSplitBillBtn)
    elements.toggleSplitBillBtn.classList.remove('active');
  elements.sinkingFundDrawer?.classList.add('hidden');
  elements.splitBillDrawer?.classList.add('hidden');

  // 8. Open Sheet
  elements.createEntryModal?.classList.remove('hidden');
  pushModalHistoryState();
  setTimeout(() => {
    elements.inputAmount?.focus();
    elements.inputAmount?.select();
  }, 60);
}
window.openEditRecordModal = openEditRecordModal;

function closeCreateModal(fromPopState = false) {
  elements.createEntryModal?.classList.add('hidden');
  state.editingRecordId = null;
  if (elements.createSheetDialog) {
    elements.createSheetDialog.style.transform = '';
  }
  popModalHistoryIfCleared(fromPopState === true);
}

/**
 * Native Bottom Sheet Pull-Down Drag Gesture & Dismissal
 */
function initBottomSheetGestures() {
  const dialog = elements.createSheetDialog;
  const overlay = elements.createEntryModal;
  if (!dialog || !overlay) return;

  let startY = 0;
  let currentDeltaY = 0;
  let isDragging = false;

  const onTouchStart = (e) => {
    if (dialog.scrollTop > 0) return;
    startY = e.touches[0].clientY;
    currentDeltaY = 0;
    isDragging = true;
    dialog.style.transition = 'none';
  };

  const onTouchMove = (e) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;

    if (deltaY > 0) {
      currentDeltaY = deltaY;
      dialog.style.transform = `translateY(${deltaY}px)`;
      if (e.cancelable) e.preventDefault();
    } else {
      currentDeltaY = 0;
      dialog.style.transform = '';
    }
  };

  const onTouchEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    dialog.style.transition = 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)';

    if (currentDeltaY > 80) {
      triggerHaptic(10);
      dialog.style.transform = 'translateY(100%)';
      setTimeout(() => {
        closeCreateModal();
        dialog.style.transform = '';
        dialog.style.transition = '';
      }, 200);
    } else {
      dialog.style.transform = '';
      setTimeout(() => {
        dialog.style.transition = '';
      }, 200);
    }
  };

  const dragHandle = elements.createSheetDragHandle;
  if (dragHandle) {
    dragHandle.addEventListener('touchstart', onTouchStart, { passive: true });
    dragHandle.addEventListener('touchmove', onTouchMove, { passive: false });
    dragHandle.addEventListener('touchend', onTouchEnd);
  }

  const header = dialog.querySelector('.create-sheet-header');
  if (header) {
    header.addEventListener('touchstart', onTouchStart, { passive: true });
    header.addEventListener('touchmove', onTouchMove, { passive: false });
    header.addEventListener('touchend', onTouchEnd);
  }
}

/**
 * Render Visual Category Grid inside Create Modal
 */
function renderCategoryGrid(type) {
  const list = CATEGORIES[type] || [];
  if (!elements.selectCategory) return;

  const currentVal = elements.selectCategory.value;
  elements.selectCategory.innerHTML = list
    .map((cat) => `<option value="${cat}">${cat}</option>`)
    .join('');

  const selectedCat = list.includes(currentVal) ? currentVal : list[0];
  elements.selectCategory.value = selectedCat;

  if (!elements.categoryGridContainer) return;

  elements.categoryGridContainer.innerHTML = list
    .map((cat) => {
      const isSelected = cat === selectedCat;
      const icon = getCategoryIcon(cat);
      const label = getCategoryDisplayLabel(cat);
      return `
        <button type="button" class="cat-grid-btn ${isSelected ? 'active' : ''}" data-cat-val="${escapeHtml(cat)}">
          <span class="cat-grid-icon">${icon}</span>
          <span class="cat-grid-label">${escapeHtml(label)}</span>
        </button>
      `;
    })
    .join('');

  elements.categoryGridContainer
    .querySelectorAll('.cat-grid-btn')
    .forEach((btn) => {
      btn.addEventListener('click', () => {
        const chosen = btn.getAttribute('data-cat-val');
        if (chosen && elements.selectCategory) {
          elements.selectCategory.value = chosen;
        }
        elements.categoryGridContainer
          .querySelectorAll('.cat-grid-btn')
          .forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
}

/**
 * Render Visual Account / Payment Method Chips inside Create Modal
 */
function renderAccountPicker() {
  if (!elements.accountSelectorGrid) return;
  const currentAcc = state.selectedAccount || 'Cash';
  elements.accountSelectorGrid.innerHTML = DEFAULT_ACCOUNTS.map((acc) => {
    const isSelected = acc.name === currentAcc;
    const label = getAccountDisplayLabel(acc.name);
    return `
      <button type="button" class="account-chip-btn ${isSelected ? 'active' : ''}" data-account="${escapeHtml(acc.name)}">
        <span class="account-chip-icon">${acc.icon}</span>
        <span class="account-chip-name">${escapeHtml(label)}</span>
      </button>
    `;
  }).join('');

  elements.accountSelectorGrid
    .querySelectorAll('.account-chip-btn')
    .forEach((btn) => {
      btn.addEventListener('click', () => {
        const chosen = btn.getAttribute('data-account');
        if (chosen) {
          state.selectedAccount = chosen;
          if (elements.selectedAccountInput) {
            elements.selectedAccountInput.value = chosen;
          }
        }
        elements.accountSelectorGrid
          .querySelectorAll('.account-chip-btn')
          .forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
}

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
  }, 2600);
}

/**
 * Switch Active Entry Type (Expense vs Income)
 */
function setEntryType(type) {
  state.currentType = type;
  if (type === 'expense') {
    elements.btnTypeExpense?.classList.add('active');
    elements.btnTypeIncome?.classList.remove('active');
  } else {
    elements.btnTypeIncome?.classList.add('active');
    elements.btnTypeExpense?.classList.remove('active');
  }
  renderCategoryGrid(type);
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
 * Offline Draft Queue & Cloud Synchronization Manager
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
    elements.syncStatusText.textContent = `${t('sync_syncing')} (${queue.length})`;
    return;
  }

  elements.syncSpinnerIcon?.classList.add('hidden');

  if (!state.isOnline) {
    elements.syncStatusPill.className = 'sync-status-pill sync-pill-offline';
    elements.syncStatusText.textContent =
      queue.length > 0
        ? `${t('sync_offline')} (${queue.length})`
        : t('sync_offline');
  } else if (queue.length > 0) {
    elements.syncStatusPill.className = 'sync-status-pill sync-pill-offline';
    elements.syncStatusText.textContent = `${queue.length} Pending`;
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
          account_name: item.payload.account_name || 'Cash',
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
      remainingQueue.push(item);
    }
  }

  saveOfflineQueue(remainingQueue);
  state.isSyncing = false;
  updateSyncStatusUI();

  if (successCount > 0) {
    showToast(
      state.lang === 'zh'
        ? `已同步 ${successCount} 笔离线账单`
        : `Synced ${successCount} offline transaction(s)!`,
    );
    await Promise.all([loadRecords(), loadSummary()]);
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
    isDraft: true,
  };
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
 * Monthly Budget Tracker Helpers & UI Rendering
 */
function getBudgetStorageKey(month) {
  const userKey = state.user?.id || 'guest';
  return `ledger_budget_${userKey}_${month || 'default'}`;
}

async function loadBudget(month) {
  const targetMonth = month === 'all' ? 'default' : month || 'default';
  const cacheKey = getBudgetStorageKey(targetMonth);
  const defaultKey = getBudgetStorageKey('default');

  const cached =
    localStorage.getItem(cacheKey) || localStorage.getItem(defaultKey);
  if (cached && !isNaN(Number(cached))) {
    state.monthlyBudget = Number(cached);
  } else {
    state.monthlyBudget = 3000;
  }
  renderBudgetTracker();

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

      if (
        !error &&
        data &&
        data.amount !== null &&
        !isNaN(Number(data.amount))
      ) {
        state.monthlyBudget = Number(data.amount);
        localStorage.setItem(cacheKey, state.monthlyBudget);
        renderBudgetTracker();
        return;
      }
    }

    const res = await fetch(
      `/api/budgets?month=${encodeURIComponent(targetMonth)}`,
      {
        headers: getAuthHeaders(),
      },
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.amount !== null && !isNaN(Number(data.amount))) {
        state.monthlyBudget = Number(data.amount);
        localStorage.setItem(cacheKey, state.monthlyBudget);
        renderBudgetTracker();
      }
    }
  } catch (err) {
    // Uses cached budget when offline
  }
}

async function persistBudget(amount, month) {
  const targetMonth = month === 'all' ? 'default' : month || 'default';
  const cacheKey = getBudgetStorageKey(targetMonth);

  state.monthlyBudget = Number(amount);
  localStorage.setItem(cacheKey, state.monthlyBudget);
  localStorage.setItem(getBudgetStorageKey('default'), state.monthlyBudget);
  renderBudgetTracker();

  const userId = state.user?.id;
  if (!userId) return;

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
    console.error('Failed to persist budget:', err);
  }
}

function renderBudgetTracker() {
  if (!elements.budgetTrackerBanner) return;

  const totalExpense = Number(state.summary?.totalExpense || 0);
  const baseBudget = Number(state.monthlyBudget || 3000);
  const targetMonth =
    state.currentMonth === 'all' ? getCurrentMonthKey() : state.currentMonth;
  const topUps = getBudgetTopUpTotal(targetMonth);
  const lockedFunds = getLockedSinkingFundAmount(targetMonth);
  const effectiveBudget = Math.max(0, baseBudget + topUps - lockedFunds);
  const sym = state.currency || 'RM';

  // Update Formula Row if topups or locked funds exist
  if (elements.budgetFormulaRow && elements.budgetFormulaText) {
    if (topUps > 0 || lockedFunds > 0) {
      elements.budgetFormulaRow.classList.remove('hidden');
      const effLabel = state.lang === 'zh' ? '有效日常' : 'Effective Daily';
      elements.budgetFormulaText.textContent =
        `${t('budget_base_label')}: ${sym} ${formatNumber(baseBudget)} ` +
        (topUps > 0
          ? `+ ${t('budget_topup_label')}: ${sym} ${formatNumber(topUps)} `
          : '') +
        (lockedFunds > 0
          ? `- ${t('budget_locked_label')}: ${sym} ${formatNumber(lockedFunds)} `
          : '') +
        `= ${effLabel}: ${sym} ${formatNumber(effectiveBudget)}`;
    } else {
      elements.budgetFormulaRow.classList.add('hidden');
    }
  }

  // Update Striped Locked Bar in Track
  if (elements.budgetLockedBar) {
    const totalCapacity = baseBudget + topUps;
    const lockedPct =
      totalCapacity > 0
        ? Math.min(100, Math.round((lockedFunds / totalCapacity) * 100))
        : 0;
    elements.budgetLockedBar.style.width = `${lockedPct}%`;
  }

  // Proactive near-limit / erosion alert
  if (lockedFunds > 0 && totalExpense > effectiveBudget) {
    const eroded = totalExpense - effectiveBudget;
    if (!state._hasAlertedErosion) {
      state._hasAlertedErosion = true;
      showToast(
        state.lang === 'zh'
          ? `注意：日常消费已超标透支 ${sym} ${formatNumber(eroded)}，侵蚀了专款储备！`
          : `Alert: Daily spending exceeded by ${sym} ${formatNumber(eroded)}, eroding sinking funds!`,
        true,
      );
    }
  }

  const budgetLimit = effectiveBudget;
  const percentage =
    budgetLimit > 0 ? Math.round((totalExpense / budgetLimit) * 100) : 0;
  const barWidth = Math.min(Math.max(percentage, 0), 100);

  if (elements.budgetPeriodLabel) {
    elements.budgetPeriodLabel.textContent =
      state.currentMonth === 'all' ? t('all_records') : state.currentMonth;
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

  if (elements.budgetProgressBar) {
    elements.budgetProgressBar.style.width = `${barWidth}%`;
    elements.budgetProgressBar.classList.remove(
      'progress-normal',
      'progress-warning',
      'progress-danger',
    );
  }

  elements.budgetPctVal?.classList.remove('text-warning', 'text-danger');
  elements.budgetRemainingLabel?.classList.remove(
    'text-warning',
    'text-danger',
  );

  if (percentage >= 100) {
    elements.budgetProgressBar?.classList.add('progress-danger');
    elements.budgetPctVal?.classList.add('text-danger');
    elements.budgetRemainingLabel?.classList.add('text-danger');
    const overspend = totalExpense - budgetLimit;
    if (elements.budgetRemainingLabel) {
      elements.budgetRemainingLabel.textContent = `${t('exceeded_by')}: ${sym} ${formatNumber(overspend)}`;
    }
  } else if (percentage >= 85) {
    elements.budgetProgressBar?.classList.add('progress-warning');
    elements.budgetPctVal?.classList.add('text-warning');
    elements.budgetRemainingLabel?.classList.add('text-warning');
    const remaining = budgetLimit - totalExpense;
    if (elements.budgetRemainingLabel) {
      elements.budgetRemainingLabel.textContent = `${t('remaining')}: ${sym} ${formatNumber(remaining)}`;
    }
  } else {
    elements.budgetProgressBar?.classList.add('progress-normal');
    const remaining = budgetLimit - totalExpense;
    if (elements.budgetRemainingLabel) {
      elements.budgetRemainingLabel.textContent = `${t('remaining')}: ${sym} ${formatNumber(remaining)}`;
    }
  }
}

function openBudgetModal() {
  if (!elements.budgetModal) return;
  const targetLabel =
    state.currentMonth === 'all' ? t('all_records') : state.currentMonth;
  if (elements.budgetModalMonthText)
    elements.budgetModalMonthText.textContent = targetLabel;
  if (elements.budgetInputAmount)
    elements.budgetInputAmount.value = state.monthlyBudget || 3000;
  elements.budgetModal.classList.remove('hidden');
  pushModalHistoryState();
  elements.budgetInputAmount?.focus();
}

function closeBudgetModal(fromPopState = false) {
  elements.budgetModal?.classList.add('hidden');
  popModalHistoryIfCleared(fromPopState === true);
}

function handleSaveBudget() {
  const val = parseFloat(elements.budgetInputAmount?.value);
  if (isNaN(val) || val <= 0) {
    return showToast(
      state.lang === 'zh'
        ? '请输入大于 0 的有效预算金额'
        : 'Please enter a valid budget amount',
      true,
    );
  }
  persistBudget(val, state.currentMonth);
  closeBudgetModal();
  showToast(
    state.lang === 'zh'
      ? `预算已更新为 ${state.currency} ${formatNumber(val)}`
      : `Monthly budget updated to ${state.currency} ${formatNumber(val)}`,
  );
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
  const userKey = state.user?.id || 'guest';
  const cacheKey = `ledger_cached_records_${userKey}`;
  const queue = getOfflineQueue();
  const draftRecords = queue.map((item) => ({
    id: item.id,
    type: item.payload.type,
    amount: item.payload.amount,
    category: item.payload.category,
    account_name: item.payload.account_name || 'Cash',
    date: item.payload.date,
    note: item.payload.note,
    isDraft: true,
  }));

  const applyRecords = (serverRecords) => {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(serverRecords));
    } catch (e) {
      // Ignore storage quota warning
    }

    state.records = [...draftRecords, ...serverRecords];
    updateMonthFilterDropdown(state.records);
    renderTable();
    calculateLocalSummaryMetrics();
    updateAccountModalData();
    loadAccounts();
    renderStreakAndBadges();
  };

  const userId = state.user?.id;

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

    state.records = [...draftRecords, ...cachedRecords];
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
 */
function updateMonthFilterDropdown(records) {
  if (!Array.isArray(records) || !elements.monthFilter) return;
  const months = new Set();
  records.forEach((r) => {
    if (r.date && r.date.length >= 7) {
      months.add(r.date.substring(0, 7));
    }
  });

  const sortedMonths = Array.from(months).sort().reverse();
  const currentValue = elements.monthFilter.value;

  let optionsHtml = `<option value="all">${escapeHtml(t('all_months'))}</option>`;
  sortedMonths.forEach((m) => {
    optionsHtml += `<option value="${m}">${m}</option>`;
  });

  elements.monthFilter.innerHTML = optionsHtml;
  if (sortedMonths.includes(currentValue)) {
    elements.monthFilter.value = currentValue;
  }
}

/**
 * Render a single ledger record table row (HTML string)
 */
function renderRecordRowHtml(record, sym) {
  const isIncome = record.type === 'income';
  const sign = isIncome ? `+ ${sym} ` : `− ${sym} `;
  const amountClass = isIncome ? 'amount-income' : 'amount-expense';
  const isDraft = record.isDraft || String(record.id).startsWith('draft-');
  const draftBadge = isDraft
    ? `<span class="tag-draft" title="Pending sync"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polyline></svg></span>`
    : '';
  const catIcon = getCategoryIcon(record.category);
  const catLabel = getCategoryDisplayLabel(record.category);
  const accMeta = getAccountMeta(record.account_name);
  const accLabel = getAccountDisplayLabel(record.account_name);

  const editTooltip =
    state.lang === 'zh' ? '点击编辑账单' : 'Click to edit transaction';

  return `
    <tr data-id="${record.id}" class="record-row ${isDraft ? 'row-draft' : ''}" onclick="openEditRecordModal('${record.id}')" title="${editTooltip}">
      <td class="col-date">${escapeHtml(record.date)}${draftBadge}</td>
      <td class="col-category">
        <span class="category-tag">
          <span>${catIcon}</span>
          ${escapeHtml(catLabel)}
        </span>
      </td>
      <td class="col-account">
        <span class="account-pill-badge" title="${escapeHtml(accLabel)}">
          <span class="account-pill-icon">${accMeta.icon}</span>
          <span>${escapeHtml(accLabel)}</span>
        </span>
      </td>
      <td class="col-note" title="${escapeHtml(record.note || '')}">
        ${renderRecordSourceBadgeHtml(record)}${escapeHtml(formatRecordCleanNote(record.note))}
      </td>
      <td class="col-amount text-right ${amountClass}">
        ${sign}${formatNumber(record.amount)}
      </td>
      <td class="col-actions text-center">
        <button class="btn-del" onclick="event.stopPropagation(); handleDelete('${record.id}')" title="Delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </td>
    </tr>
  `;
}

/**
 * Format a Date object into local 'YYYY-MM-DD' string without UTC timezone offset.
 *
 * @param {Date} [d=new Date()] - The Date instance to format
 * @returns {string} Formatted local date string 'YYYY-MM-DD'
 */
function getLocalDateString(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Format a YYYY-MM-DD date string into a localized human-readable date
 * e.g., "10月26日 周日" or "Sun, Oct 26"
 */
function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month - 1, day);
      if (state.lang === 'zh') {
        const weekdays = [
          '周日',
          '周一',
          '周二',
          '周三',
          '周四',
          '周五',
          '周六',
        ];
        return `${month}月${day}日 ${weekdays[d.getDay()]}`;
      } else {
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return `${weekdays[d.getDay()]}, ${months[month - 1]} ${day}`;
      }
    }
  } catch (e) {}
  return dateStr;
}

/**
 * Transform an array of transaction records into an array of date-grouped
 * objects sorted by date in descending order (newest date first).
 *
 * @param {Array<Object>} records - Array of transaction record objects
 * @returns {Array<Object>} Array of date-grouped objects
 */
function groupRecordsByDate(records) {
  if (!records || records.length === 0) return [];

  const now = new Date();
  const today = getLocalDateString(now);
  const yesterdayDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  );
  const yesterday = getLocalDateString(yesterdayDate);

  const groupsMap = new Map();
  for (const record of records) {
    if (!record.date) continue;
    const normDate = normalizeRecordDateYMD(record.date) || record.date;
    if (!groupsMap.has(normDate)) {
      let relative = '';
      if (normDate === today) {
        relative = state.lang === 'zh' ? '今天' : 'Today';
      } else if (normDate === yesterday) {
        relative = state.lang === 'zh' ? '昨天' : 'Yesterday';
      }
      groupsMap.set(normDate, {
        date: normDate,
        relativeLabel: relative,
        totalExpense: 0,
        totalIncome: 0,
        records: [],
      });
    }

    const group = groupsMap.get(normDate);
    if (record.type === 'expense') {
      group.totalExpense += Number(record.amount || 0);
    } else if (record.type === 'income') {
      group.totalIncome += Number(record.amount || 0);
    }
    group.records.push(record);
  }
  const sortedGroups = Array.from(groupsMap.values()).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  return sortedGroups;
}

/**
 * Render Audit Ledger Table
 */
function renderTable() {
  if (!elements.recordsTbody) return;
  let filtered = state.records;

  if (state.currentMonth !== 'all') {
    filtered = filtered.filter(
      (r) => r.date && r.date.startsWith(state.currentMonth),
    );
  }

  if (state.currentFilter !== 'all') {
    filtered = filtered.filter((r) => r.type === state.currentFilter);
  }

  if (state.selectedAccountFilter && state.selectedAccountFilter !== 'all') {
    filtered = filtered.filter(
      (r) => (r.account_name || 'Cash') === state.selectedAccountFilter,
    );
  }

  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase().trim();
    filtered = filtered.filter((r) => {
      const catEn = (r.category || '').toLowerCase();
      const catLocal = getCategoryDisplayLabel(r.category).toLowerCase();
      const noteStr = (r.note || '').toLowerCase();
      const accStr = (r.account_name || 'Cash').toLowerCase();
      const accLocal = getAccountDisplayLabel(r.account_name).toLowerCase();
      return (
        catEn.includes(q) ||
        catLocal.includes(q) ||
        noteStr.includes(q) ||
        accStr.includes(q) ||
        accLocal.includes(q)
      );
    });
  }

  if (elements.searchResultCount) {
    if (state.searchQuery) {
      elements.searchResultCount.textContent = `${filtered.length}`;
      elements.searchResultCount.classList.remove('hidden');
      elements.clearSearchBtn?.classList.remove('hidden');
    } else {
      elements.searchResultCount.classList.add('hidden');
      elements.clearSearchBtn?.classList.add('hidden');
    }
  }

  if (filtered.length === 0) {
    elements.recordsTbody.innerHTML = '';
    elements.emptyState?.classList.remove('hidden');
    return;
  }

  elements.emptyState?.classList.add('hidden');
  const sym = state.currency;

  const dateGroups = groupRecordsByDate(filtered);
  if (Array.isArray(dateGroups) && dateGroups.length > 0) {
    elements.recordsTbody.innerHTML = dateGroups
      .map((group) => {
        const formattedDate = formatDisplayDate(group.date);
        const relativeTag = group.relativeLabel
          ? `<span class="timeline-relative-tag ${group.relativeLabel === 'Today' || group.relativeLabel === '今天' ? 'tag-today' : group.relativeLabel === 'Yesterday' || group.relativeLabel === '昨天' ? 'tag-yesterday' : ''}">${escapeHtml(group.relativeLabel)}</span>`
          : '';
        const expSum =
          group.totalExpense > 0
            ? `<span class="timeline-sum timeline-sum-expense">−${sym} ${formatNumber(group.totalExpense)}</span>`
            : '';
        const incSum =
          group.totalIncome > 0
            ? `<span class="timeline-sum timeline-sum-income">+${sym} ${formatNumber(group.totalIncome)}</span>`
            : '';

        const headerRow = `
          <tr class="timeline-date-row">
            <td colspan="6" class="timeline-date-cell">
              <div class="timeline-date-inner">
                <div class="timeline-date-left">
                  <span class="timeline-calendar-icon">${SVG_ICONS.calendar}</span>
                  <span class="timeline-date-title">${escapeHtml(formattedDate)}</span>
                  ${relativeTag}
                </div>
                <div class="timeline-date-right">
                  ${expSum}
                  ${incSum}
                </div>
              </div>
            </td>
          </tr>
        `;

        const recordRows = (group.records || [])
          .map((record) => renderRecordRowHtml(record, sym))
          .join('');
        return headerRow + recordRows;
      })
      .join('');
  } else {
    // Fallback: render flat rows if groupRecordsByDate is not yet implemented or returned empty
    elements.recordsTbody.innerHTML = filtered
      .map((record) => renderRecordRowHtml(record, sym))
      .join('');
  }
}

/**
 * Execute Transaction Update in local state, offline queue and Supabase cloud.
 */
async function executeRecordUpdate(editingId, updatedPayload) {
  const record = state.records.find((r) => String(r.id) === String(editingId));
  if (!record)
    throw new Error(
      state.lang === 'zh' ? '未找到对应账单记录' : 'Record not found',
    );
  record.type = updatedPayload.type;
  record.amount = updatedPayload.amount;
  record.category = updatedPayload.category;
  record.account_name = updatedPayload.account_name;
  record.date = updatedPayload.date;
  record.note = updatedPayload.note || '';

  if (String(editingId).startsWith('draft-')) {
    let queue = getOfflineQueue();
    const qIdx = queue.findIndex(
      (item) => String(item.id) === String(editingId),
    );
    if (qIdx !== -1) {
      queue[qIdx] = { ...queue[qIdx], ...updatedPayload };
      saveOfflineQueue(queue);
    }
  }

  if (
    supabaseClient &&
    state.user?.id &&
    !String(editingId).startsWith('draft-')
  ) {
    const { error } = await supabaseClient
      .from('records')
      .update({
        type: updatedPayload.type,
        amount: updatedPayload.amount,
        category: updatedPayload.category,
        account_name: updatedPayload.account_name,
        date: updatedPayload.date,
        note: updatedPayload.note || null,
      })
      .eq('id', editingId)
      .eq('user_id', state.user.id);
    if (error) throw new Error(error.message);
  } else if (!String(editingId).startsWith('draft-')) {
    // Local / SQLite backend persistence fallback
    const res = await fetch(`/api/records/${editingId}`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(updatedPayload),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Local record update failed');
    }
  }

  renderTable();
  calculateLocalSummaryMetrics();
  renderBudgetTracker();
  updateDailySpendingTrend();
  loadAccounts();
  return { success: true };
}

/**
 * Handle Form Submission (Post Transaction or Save Edit)
 */
async function handleRecordSubmit(e) {
  e.preventDefault();

  const amount = parseFloat(elements.inputAmount.value);
  const category = elements.selectCategory.value;
  const date = elements.inputDate.value;
  const note = elements.inputNote.value.trim() || undefined;

  if (!amount || amount <= 0) {
    showToast(
      state.lang === 'zh'
        ? '请输入大于 0 的金额'
        : 'Please enter an amount greater than 0',
      true,
    );
    return;
  }

  if (!date) {
    showToast(
      state.lang === 'zh' ? '请选择有效日期' : 'Please select a valid date',
      true,
    );
    return;
  }

  const account_name =
    elements.selectedAccountInput?.value || state.selectedAccount || 'Cash';

  const payload = {
    type: state.currentType,
    amount,
    category,
    account_name,
    date,
    ...(note ? { note } : {}),
  };

  // Branch: Handle Edit Transaction
  if (state.editingRecordId) {
    try {
      elements.submitBtn.disabled = true;
      elements.submitBtn.style.opacity = '0.7';

      await executeRecordUpdate(state.editingRecordId, payload);

      closeCreateModal();
      showToast(t('transaction_updated_toast'));
    } catch (err) {
      showToast(err.message || 'Update failed', true);
    } finally {
      elements.submitBtn.disabled = false;
      elements.submitBtn.style.opacity = '1';
    }
    return;
  }

  if (!navigator.onLine) {
    saveOfflineRecord(payload);
    return;
  }

  try {
    elements.submitBtn.disabled = true;
    elements.submitBtn.style.opacity = '0.7';

    const userId = state.user?.id;
    let created = false;

    // Check Project & Split Bill Associations
    const selectedProjectId = elements.entryProjectSelect?.value;
    const isSplitActive =
      elements.toggleSplitBillBtn?.classList.contains('active');

    let finalAmount = payload.amount;
    let finalNote = payload.note || '';

    if (selectedProjectId) {
      const fund = (state.projects || []).find(
        (p) => p.id === selectedProjectId,
      );
      if (fund) {
        fund.spent_amount =
          (parseFloat(fund.spent_amount) || 0) + payload.amount;
        saveProjects(state.projects);
        finalNote = `[专款: ${fund.title}] ${finalNote}`.trim();

        // Sync updated spent_amount to Supabase Cloud
        if (supabaseClient && state.user?.id) {
          try {
            await supabaseClient
              .from('projects')
              .update({ spent_amount: fund.spent_amount })
              .eq('id', fund.id)
              .eq('user_id', state.user.id);
          } catch (e) {}
        }

        // Sync updated spent_amount to NestJS backend API
        fetch(`/api/projects/${fund.id}/spent`, {
          method: 'PATCH',
          headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ spentAmount: fund.spent_amount }),
        }).catch(() => {});
      }
    }

    if (isSplitActive) {
      const myShare = parseFloat(elements.splitMyShareInput?.value) || 0;
      finalAmount = myShare;
      finalNote = `[AA分摊: 总付 RM ${payload.amount}] ${finalNote}`.trim();

      // Collect friend rows
      const friendRows =
        elements.splitFriendsList?.querySelectorAll('.split-friend-row') || [];
      const friends = [];
      friendRows.forEach((row) => {
        const name = (
          row.querySelector('.friend-name-input')?.value || ''
        ).trim();
        const amt =
          parseFloat(row.querySelector('.friend-amount-input')?.value) || 0;
        if (name && amt > 0) {
          friends.push({ name, amount: amt, paid: false });
        }
      });

      if (friends.length > 0) {
        const claim = {
          id: 'claim_' + Date.now(),
          title: payload.category + ' ' + (payload.note || '聚餐分摊'),
          total_amount: payload.amount,
          my_share: myShare,
          friends: friends,
          date: payload.date,
          status: 'active',
          created_at: new Date().toISOString(),
        };
        const claims = state.claims || [];
        claims.unshift(claim);
        saveClaims(claims);

        // Sync claim to Supabase Cloud & backend API
        if (supabaseClient && state.user?.id) {
          try {
            await supabaseClient.from('claims').upsert({
              id: claim.id,
              user_id: state.user.id,
              title: claim.title,
              total_amount: claim.total_amount,
              my_share: claim.my_share,
              friends: claim.friends,
              status: claim.status,
              date: claim.date,
            });
          } catch (e) {}
        }

        fetch('/api/claims', {
          method: 'POST',
          headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({
            id: claim.id,
            title: claim.title,
            totalAmount: claim.total_amount,
            myShare: claim.my_share,
            friends: claim.friends,
            date: claim.date,
          }),
        }).catch(() => {});
      }
    }

    payload.amount = finalAmount;
    payload.note = finalNote;
    if (selectedProjectId) {
      payload.project_id = selectedProjectId;
    }

    if (supabaseClient && userId) {
      const { error } = await supabaseClient
        .from('records')
        .insert({
          user_id: userId,
          type: payload.type,
          amount: payload.amount,
          category: payload.category,
          account_name: payload.account_name,
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
      state.lang === 'zh'
        ? `已记账 ${state.currency} ${formatNumber(amount)}`
        : `Recorded ${state.currency} ${formatNumber(amount)}`,
    );
    triggerHaptic(15);
    elements.inputAmount.value = '';
    elements.inputNote.value = '';
    closeCreateModal();

    // Optimistically update local records and streak counter for zero-latency feedback
    const optimisticRecord = {
      id: `temp-${Date.now()}`,
      type: payload.type,
      amount: payload.amount,
      category: payload.category,
      account_name: payload.account_name || 'Cash',
      date: normalizeRecordDateYMD(payload.date) || payload.date,
      note: payload.note,
    };
    state.records = [optimisticRecord, ...(state.records || [])];
    renderStreakAndBadges();
    updateAccountModalData();

    // Immediately refresh claims and sinking funds views
    renderClaims();
    renderSinkingFunds();
    renderBudgetTracker();

    await Promise.all([loadRecords(), loadSummary()]);
  } catch (err) {
    if (
      !navigator.onLine ||
      err.name === 'TypeError' ||
      err.message?.includes('fetch') ||
      err.message?.includes('Failed to fetch') ||
      err.message?.includes('NetworkError')
    ) {
      saveOfflineRecord(payload);
      triggerHaptic(15);
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
window.handleDelete = function (id) {
  const isDraft = String(id).startsWith('draft-');
  const recordToDelete = state.records.find((r) => String(r.id) === String(id));
  const descText = recordToDelete
    ? `${recordToDelete.date} · ${getCategoryDisplayLabel(recordToDelete.category)} · ${state.currency || 'RM'} ${formatNumber(recordToDelete.amount)}`
    : '';

  showConfirmModal({
    title: state.lang === 'zh' ? '删除账单明细' : 'Delete Transaction',
    subtitle: descText,
    desc:
      state.lang === 'zh'
        ? '确定要删除这条账单记录吗？若关联了专款预留池，已用金额将自动退回。'
        : 'Are you sure you want to delete this transaction? Any allocated sinking fund spent amount will be restored.',
    confirmText: state.lang === 'zh' ? '确认删除' : 'Delete',
    danger: true,
    onConfirm: async () => {
      triggerHaptic(12);

      // Rollback linked sinking fund spent amount if applicable
      if (recordToDelete && recordToDelete.type === 'expense') {
        let linkedFund = null;
        if (recordToDelete.project_id) {
          linkedFund = (state.projects || []).find(
            (p) => p.id === recordToDelete.project_id,
          );
        } else if (
          recordToDelete.note &&
          recordToDelete.note.includes('[专款:')
        ) {
          const match = recordToDelete.note.match(/\[专款:\s*([^\]]+)\]/);
          if (match && match[1]) {
            const title = match[1].trim();
            linkedFund = (state.projects || []).find((p) => p.title === title);
          }
        }

        if (linkedFund) {
          const rollbackAmount = parseFloat(recordToDelete.amount) || 0;
          linkedFund.spent_amount = Math.max(
            0,
            (parseFloat(linkedFund.spent_amount) || 0) - rollbackAmount,
          );
          saveProjects(state.projects);
          renderSinkingFunds();
          renderBudgetTracker();

          // Sync rolled back spent_amount to Supabase Cloud
          if (supabaseClient && state.user?.id) {
            try {
              await supabaseClient
                .from('projects')
                .update({ spent_amount: linkedFund.spent_amount })
                .eq('id', linkedFund.id)
                .eq('user_id', state.user.id);
            } catch (e) {}
          }

          // Sync to NestJS backend
          fetch(`/api/projects/${linkedFund.id}/spent`, {
            method: 'PATCH',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ spentAmount: linkedFund.spent_amount }),
          }).catch(() => {});
        }
      }

      if (isDraft) {
        let queue = getOfflineQueue();
        queue = queue.filter((item) => String(item.id) !== String(id));
        saveOfflineQueue(queue);

        state.records = state.records.filter(
          (r) => String(r.id) !== String(id),
        );
        renderTable();
        calculateLocalSummaryMetrics();
        showToast(state.lang === 'zh' ? '已删除离线记录' : 'Draft removed');
        return;
      }

      try {
        const userId = state.user?.id;
        let deleted = false;

        if (supabaseClient && userId) {
          const { error } = await supabaseClient
            .from('records')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

          if (error) throw new Error(error.message);
          deleted = true;
        }

        if (!deleted) {
          const res = await fetch(`/api/records/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          });

          if (!res.ok) throw new Error('Failed to delete transaction');
        }

        showToast(state.lang === 'zh' ? '已删除账单' : 'Transaction deleted');
        await Promise.all([
          loadRecords(),
          loadSummary(),
          fetchProjectsFromBackend(),
          fetchClaimsFromBackend(),
        ]);
      } catch (err) {
        showToast(err.message, true);
      }
    },
  });
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
 * Chart.js Instance & Color Harmony Palette
 */
let categoryChartInstance = null;

const CHART_PALETTE = [
  '#F97316', // Warm Orange
  '#0EA5E9', // Vibrant Sky Blue
  '#EC4899', // Bright Pink
  '#8B5CF6', // Royal Purple
  '#EAB308', // Amber Gold
  '#EF4444', // Red Coral
  '#10B981', // Emerald Green
  '#06B6D4', // Vibrant Cyan
  '#6366F1', // Indigo
  '#64748B', // Slate Grey
];

/**
 * Render Category Breakdown Donut Chart
 */
function renderCategoryChart(breakdown) {
  const chartCanvas = document.getElementById('categoryChart');
  if (!chartCanvas) return;

  const rawCategories = Object.keys(breakdown || {});
  const localizedLabels = rawCategories.map((c) => getCategoryDisplayLabel(c));
  const amounts = Object.values(breakdown || {}).map(Number);
  const totalExpense = amounts.reduce((sum, val) => sum + val, 0);

  if (rawCategories.length === 0 || totalExpense <= 0) {
    if (categoryChartInstance) {
      categoryChartInstance.destroy();
      categoryChartInstance = null;
    }
    elements.chartEmptyOverlay?.classList.remove('hidden');
    if (elements.chartCategoryCount) {
      elements.chartCategoryCount.textContent = `0 ${t('categories_unit')}`;
    }
    return;
  }

  elements.chartEmptyOverlay?.classList.add('hidden');
  if (elements.chartCategoryCount) {
    elements.chartCategoryCount.textContent = `${rawCategories.length} ${t('categories_unit')}`;
  }

  if (categoryChartInstance) {
    categoryChartInstance.destroy();
  }

  const isDark = isDarkModeActive();
  const ctx = chartCanvas.getContext('2d');
  const categoryColors = rawCategories.map(
    (c, idx) =>
      CATEGORY_META[c]?.color || CHART_PALETTE[idx % CHART_PALETTE.length],
  );

  categoryChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: localizedLabels,
      datasets: [
        {
          data: amounts,
          backgroundColor: categoryColors,
          borderWidth: 2,
          borderColor: isDark ? '#111827' : '#FFFFFF',
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 9,
            boxHeight: 9,
            usePointStyle: true,
            pointStyle: 'circle',
            font: {
              family: "'Plus Jakarta Sans', sans-serif",
              size: 11,
              weight: '600',
            },
            color: isDark ? '#F8FAFC' : '#334155',
            padding: 10,
          },
        },
        tooltip: {
          backgroundColor: isDark ? '#1F2937' : '#0F172A',
          padding: 9,
          cornerRadius: 8,
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

let dailyTrendChartInstance = null;

/**
 * Render Month's Daily Spending Trend Line / Area Chart
 */
function renderDailyTrendChart(trendData) {
  const chartCanvas = document.getElementById('dailyTrendChart');
  if (!chartCanvas) return;

  const {
    labels = [],
    data = [],
    peakDay = null,
    peakAmount = 0,
  } = trendData || {};
  const totalSpent = (data || []).reduce((sum, v) => sum + Number(v || 0), 0);

  if (!labels.length || totalSpent <= 0) {
    if (dailyTrendChartInstance) {
      dailyTrendChartInstance.destroy();
      dailyTrendChartInstance = null;
    }
    elements.trendEmptyOverlay?.classList.remove('hidden');
    if (elements.trendPeakDayBadge) {
      elements.trendPeakDayBadge.textContent = `${t('trend_peak')}: —`;
    }
    return;
  }

  elements.trendEmptyOverlay?.classList.add('hidden');
  if (elements.trendPeakDayBadge) {
    if (peakDay && peakAmount > 0) {
      const sym = state.currency || 'RM';
      const dayLabel = state.lang === 'zh' ? `${peakDay}日` : `Day ${peakDay}`;
      elements.trendPeakDayBadge.textContent = `${t('trend_peak')}: ${dayLabel} (${sym} ${formatNumber(peakAmount)})`;
    } else {
      elements.trendPeakDayBadge.textContent = `${t('trend_peak')}: —`;
    }
  }

  if (dailyTrendChartInstance) {
    dailyTrendChartInstance.destroy();
  }

  const isDark = isDarkModeActive();
  const ctx = chartCanvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 180);
  gradient.addColorStop(
    0,
    isDark ? 'rgba(13, 148, 136, 0.4)' : 'rgba(13, 148, 136, 0.25)',
  );
  gradient.addColorStop(
    1,
    isDark ? 'rgba(13, 148, 136, 0.01)' : 'rgba(13, 148, 136, 0.01)',
  );

  dailyTrendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: t('expense'),
          data: data,
          borderColor: '#0D9488',
          borderWidth: 2,
          backgroundColor: gradient,
          fill: true,
          tension: 0.35,
          pointRadius: (ctx) => (Number(ctx.raw) > 0 ? 3 : 0),
          pointHoverRadius: 6,
          pointBackgroundColor: '#0D9488',
          pointBorderColor: isDark ? '#111827' : '#FFFFFF',
          pointBorderWidth: 1.5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? '#1F2937' : '#0F172A',
          titleColor: '#F8FAFC',
          bodyColor: '#E2E8F0',
          padding: 8,
          cornerRadius: 8,
          callbacks: {
            title: (items) => {
              const day = items[0]?.label;
              return state.lang === 'zh' ? `${day}日` : `Day ${day}`;
            },
            label: (item) => {
              const val = Number(item.raw) || 0;
              return ` ${t('expense')}: ${state.currency} ${formatNumber(val)}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: isDark ? '#94A3B8' : '#64748B',
            font: { size: 10, weight: '500' },
            maxTicksLimit: 12,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
          },
          ticks: {
            color: isDark ? '#94A3B8' : '#64748B',
            font: { size: 10 },
            maxTicksLimit: 5,
            callback: (v) => `${v}`,
          },
        },
      },
    },
  });
}

/**
 * Trigger recalculation and re-rendering of the Daily Spending Trend
 */
function updateDailySpendingTrend() {
  const trendData = calculateDailySpendingTrend(
    state.records,
    state.currentMonth,
  );
  renderDailyTrendChart(trendData);
}

/**
 * Calculate daily expense totals across all days of the selected month
 * for the "Daily Spending Trend" area/line chart.
 *
 * @param {Array<Object>} records - All transaction records
 * @param {string} currentMonth - Selected month string (e.g. "2026-10" or "all")
 * @returns {Object} Chart data object { labels, data, peakDay, peakAmount }
 */
function calculateDailySpendingTrend(records, currentMonth) {
  const targetMonth =
    currentMonth && currentMonth !== 'all'
      ? currentMonth
      : new Date().toISOString().slice(0, 7);
  const [year, month] = targetMonth.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const labels = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
  const dailyTotals = new Array(daysInMonth).fill(0);
  const monthExpenses = (records || []).filter(
    (r) => r.type === 'expense' && r.date && r.date.startsWith(targetMonth),
  );

  for (const record of monthExpenses) {
    const dayNum = parseInt(record.date.split('-')[2], 10);
    if (dayNum >= 1 && dayNum <= daysInMonth) {
      dailyTotals[dayNum - 1] += Number(record.amount || 0);
    }
  }

  let peakAmount = 0;
  let peakDay = null;
  dailyTotals.forEach((val, idx) => {
    if (val > peakAmount) {
      peakAmount = val;
      peakDay = idx + 1;
    }
  });

  return { labels, data: dailyTotals, peakDay, peakAmount };
}

/**
 * Save file via Native OS File Picker if supported (allowing custom folder/file selection),
 * or fallback to standard browser download
 * @param {Blob} blob - The file blob
 * @param {string} defaultFileName - Suggested file name
 * @param {string} fileDescription - Description of file type for OS dialog
 * @returns {Promise<{ success?: boolean, canceled?: boolean, fileName: string, isNativePicker?: boolean }>}
 */
async function saveBlobWithPicker(
  blob,
  defaultFileName,
  fileDescription = 'CSV 表格文件 (*.csv)',
) {
  // 1. Android Native APK Share & Save Sheet (FileProvider + Intent.ACTION_SEND)
  if (
    window.NativeUpdater &&
    typeof window.NativeUpdater.shareCsvFile === 'function'
  ) {
    try {
      const csvText = await blob.text();
      window.NativeUpdater.shareCsvFile(
        defaultFileName,
        csvText,
        fileDescription,
      );
      return {
        success: true,
        fileName: defaultFileName,
        isNativeShare: true,
      };
    } catch (err) {
      console.warn('NativeUpdater.shareCsvFile failed:', err);
    }
  }

  // 2. Mobile Browser Web Share API (System Share & Save to Files Sheet)
  const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent || '',
  );
  if (
    isMobileDevice &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function'
  ) {
    try {
      const csvFile = new File([blob], defaultFileName, {
        type: 'text/csv;charset=utf-8',
      });
      if (navigator.canShare({ files: [csvFile] })) {
        await navigator.share({
          files: [csvFile],
          title: defaultFileName,
        });
        return {
          success: true,
          fileName: defaultFileName,
          isNativeShare: true,
        };
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        return { canceled: true, fileName: defaultFileName };
      }
      console.warn('navigator.share failed, falling back:', err);
    }
  }

  // 3. Desktop OS Save File Picker (Chrome / Edge Desktop)
  if (typeof window.showSaveFilePicker === 'function') {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: defaultFileName,
        types: [
          {
            description: fileDescription,
            accept: { 'text/csv': ['.csv'] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return {
        success: true,
        fileName: handle.name || defaultFileName,
        isNativePicker: true,
      };
    } catch (err) {
      if (err.name === 'AbortError') {
        // User deliberately clicked cancel in OS save dialog
        return { canceled: true, fileName: defaultFileName };
      }
      console.warn('showSaveFilePicker failed, falling back to download:', err);
    }
  }

  // 4. Fallback download link for browsers without native picker/share
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.setAttribute('download', defaultFileName);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return { success: true, fileName: defaultFileName, isNativePicker: false };
}

/**
 * Export Filtered Records as Professional RFC 4180 Compliant CSV
 * Supports OS Save-As file location selection and beautiful Excel formatting
 */
async function exportToCSV() {
  let recordsToExport = state.records;

  if (state.currentMonth !== 'all') {
    recordsToExport = recordsToExport.filter(
      (r) => r.date && r.date.startsWith(state.currentMonth),
    );
  }

  if (state.currentFilter !== 'all') {
    recordsToExport = recordsToExport.filter(
      (r) => r.type === state.currentFilter,
    );
  }

  if (recordsToExport.length === 0) {
    showToast(
      state.lang === 'zh'
        ? '暂无可导出的账单记录'
        : 'No records available to export',
      true,
    );
    return;
  }

  const isZh = state.lang === 'zh';
  const headers = isZh
    ? [
        '序号',
        '记账日期',
        '收支类型',
        '消费分类',
        '支付账户',
        '金额',
        '币种',
        '备注说明',
        '关联专款',
        '创建时间',
      ]
    : [
        'No.',
        'Date',
        'Type',
        'Category',
        'Account',
        'Amount',
        'Currency',
        'Note',
        'Linked Project',
        'Created At',
      ];

  let totalExpense = 0;
  let totalIncome = 0;
  let expenseCount = 0;
  let incomeCount = 0;

  const rows = recordsToExport.map((r, idx) => {
    const isExpense = r.type === 'expense';
    const numAmt = Math.abs(Number(r.amount) || 0);
    if (isExpense) {
      totalExpense += numAmt;
      expenseCount++;
    } else {
      totalIncome += numAmt;
      incomeCount++;
    }

    const typeLabel = isExpense
      ? isZh
        ? '支出'
        : 'Expense'
      : isZh
        ? '收入'
        : 'Income';
    const catLabel = getCategoryDisplayLabel(r.category);
    const accLabel = getAccountDisplayName(r.account_name);
    const amtStr = (isExpense ? -numAmt : numAmt).toFixed(2);
    const noteStr = (r.note || '').replace(/"/g, '""');
    const proj = r.project_id
      ? state.projects?.find((p) => p.id === r.project_id)?.title || ''
      : '';
    const projStr = proj.replace(/"/g, '""');
    const createdAtStr = r.createdAt
      ? new Date(r.createdAt).toLocaleString(isZh ? 'zh-CN' : 'en-US', {
          hour12: false,
        })
      : '';

    return [
      idx + 1,
      `"${r.date}"`,
      `"${typeLabel}"`,
      `"${catLabel}"`,
      `"${accLabel}"`,
      amtStr,
      `"${state.currency || 'MYR'}"`,
      `"${noteStr}"`,
      `"${projStr}"`,
      `"${createdAtStr}"`,
    ];
  });

  const netBalance = totalIncome - totalExpense;
  const periodLabel =
    state.currentMonth === 'all'
      ? isZh
        ? '全部月份'
        : 'All Months'
      : state.currentMonth;

  // Professional summary footer block
  const summaryEmptyRow = [
    '""',
    '""',
    '""',
    '""',
    '""',
    '""',
    '""',
    '""',
    '""',
    '""',
  ];
  const summaryHeaderRow = isZh
    ? [
        '""',
        '""',
        '""',
        '"【数据统计汇总】"',
        '""',
        '""',
        '""',
        '""',
        '""',
        '""',
      ]
    : [
        '""',
        '""',
        '""',
        '"【Summary Metrics】"',
        '""',
        '""',
        '""',
        '""',
        '""',
        '""',
      ];
  const summaryExpenseRow = [
    '""',
    '""',
    '""',
    `"${isZh ? '总支出 (Total Expense)' : 'Total Expense'}"`,
    '""',
    (-totalExpense).toFixed(2),
    `"${state.currency || 'MYR'}"`,
    `"${isZh ? `共 ${expenseCount} 笔支出` : `${expenseCount} expenses`}"`,
    '""',
    '""',
  ];
  const summaryIncomeRow = [
    '""',
    '""',
    '""',
    `"${isZh ? '总收入 (Total Income)' : 'Total Income'}"`,
    '""',
    totalIncome.toFixed(2),
    `"${state.currency || 'MYR'}"`,
    `"${isZh ? `共 ${incomeCount} 笔收入` : `${incomeCount} incomes`}"`,
    '""',
    '""',
  ];
  const summaryNetRow = [
    '""',
    '""',
    '""',
    `"${isZh ? '收支净额 (Net Balance)' : 'Net Balance'}"`,
    '""',
    netBalance.toFixed(2),
    `"${state.currency || 'MYR'}"`,
    `"${isZh ? (netBalance >= 0 ? '结余盈余' : '净支出超支') : netBalance >= 0 ? 'Surplus' : 'Deficit'}"`,
    '""',
    '""',
  ];
  const summaryMetaRow = [
    '""',
    '""',
    '""',
    `"${isZh ? '统计周期' : 'Period'}"`,
    '""',
    `"${periodLabel}"`,
    '""',
    `"${isZh ? '导出时间: ' + new Date().toLocaleString('zh-CN', { hour12: false }) : 'Exported: ' + new Date().toISOString()}"`,
    '""',
    '""',
  ];

  const allRows = [
    headers.join(','),
    ...rows.map((e) => e.join(',')),
    summaryEmptyRow.join(','),
    summaryHeaderRow.join(','),
    summaryExpenseRow.join(','),
    summaryIncomeRow.join(','),
    summaryNetRow.join(','),
    summaryMetaRow.join(','),
  ];

  const csvContent = '\uFEFF' + allRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const defaultFileName = `monetax_export_${state.currentMonth === 'all' ? 'all' : state.currentMonth}_${new Date().toISOString().slice(0, 10)}.csv`;

  const saveRes = await saveBlobWithPicker(
    blob,
    defaultFileName,
    isZh ? 'MonetaX 账单明细 CSV 表格 (*.csv)' : 'MonetaX Export CSV (*.csv)',
  );

  if (saveRes.canceled) {
    showToast(isZh ? '已取消导出' : 'Export canceled');
    return;
  }

  if (saveRes.isNativeShare) {
    showToast(
      isZh
        ? `已唤起系统分享与转存面板：${saveRes.fileName}`
        : `Opened system share & save sheet: ${saveRes.fileName}`,
    );
  } else if (saveRes.isNativePicker) {
    showToast(
      isZh
        ? `已成功保存 ${recordsToExport.length} 笔账单至：${saveRes.fileName}`
        : `Successfully saved ${recordsToExport.length} records to ${saveRes.fileName}`,
    );
  } else {
    showToast(
      isZh
        ? `已导出 ${recordsToExport.length} 笔账单至默认「下载」文件夹`
        : `Exported ${recordsToExport.length} records to Downloads folder`,
    );
  }
}

// ============================================================================
// Data Retention & Archiving Modal Controller
// ============================================================================

function getRetentionCutoffDate(years) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return date.toISOString().split('T')[0];
}

function updateRetentionDropdownLabels() {
  if (!elements.retentionYearsSelect) return;
  const isZh = state.lang === 'zh';
  const currentYear = new Date().getFullYear();
  const currentVal = elements.retentionYearsSelect.value || 'current_year';

  elements.retentionYearsSelect.innerHTML = `
    <option value="current_year">${isZh ? `📅 本年度账单 (${currentYear}年)` : `📅 Current Year (${currentYear})`}</option>
    <option value="1">${isZh ? '⏳ 1 年前历史数据 (> 1年)' : '> 1 Year (365 Days)'}</option>
    <option value="2">${isZh ? '⏳ 2 年前历史数据 (> 2年)' : '> 2 Years (730 Days)'}</option>
    <option value="3">${isZh ? '⏳ 3 年前历史数据 (> 3年推荐)' : '> 3 Years (1095 Days)'}</option>
    <option value="5">${isZh ? '⏳ 5 年前历史数据 (> 5年)' : '> 5 Years (1825 Days)'}</option>
  `;
  elements.retentionYearsSelect.value = currentVal;
}

function evaluateRetentionEligible() {
  if (!elements.retentionYearsSelect) return;
  const isZh = state.lang === 'zh';
  const val = elements.retentionYearsSelect.value;
  const currentYear = new Date().getFullYear();

  let matchingRecords = [];
  const isCurrentYear = val === 'current_year';

  if (isCurrentYear) {
    matchingRecords = (state.records || []).filter(
      (r) => r.date && r.date.startsWith(String(currentYear)),
    );
    if (elements.retentionCutoffPrefix) {
      elements.retentionCutoffPrefix.textContent = isZh ? '范围：' : 'Range: ';
    }
    if (elements.retentionCutoffDate) {
      elements.retentionCutoffDate.textContent = isZh
        ? `${currentYear}年度 (1月1日 - 至今)`
        : `Year ${currentYear} (YTD)`;
    }
  } else {
    const years = parseInt(val) || 3;
    const cutoffDate = getRetentionCutoffDate(years);
    if (elements.retentionCutoffPrefix) {
      elements.retentionCutoffPrefix.textContent = isZh ? '早于：' : 'before ';
    }
    if (elements.retentionCutoffDate) {
      elements.retentionCutoffDate.textContent = cutoffDate;
    }
    matchingRecords = (state.records || []).filter((r) => r.date < cutoffDate);
  }

  if (elements.retentionMatchCount) {
    elements.retentionMatchCount.textContent = matchingRecords.length;
  }

  if (elements.downloadArchiveBtn) {
    elements.downloadArchiveBtn.disabled = matchingRecords.length === 0;
  }

  if (elements.purgeOldRecordsBtn) {
    if (isCurrentYear) {
      elements.purgeOldRecordsBtn.disabled = true;
      elements.purgeOldRecordsBtn.style.opacity = '0.35';
      elements.purgeOldRecordsBtn.style.cursor = 'not-allowed';
      elements.purgeOldRecordsBtn.title = isZh
        ? '本年度当前账单受安全保护，不可清理'
        : 'Current year records are protected from purging';
    } else {
      const isDisabled = matchingRecords.length === 0;
      elements.purgeOldRecordsBtn.disabled = isDisabled;
      elements.purgeOldRecordsBtn.style.opacity = isDisabled ? '0.35' : '1';
      elements.purgeOldRecordsBtn.style.cursor = isDisabled
        ? 'not-allowed'
        : 'pointer';
      elements.purgeOldRecordsBtn.title = '';
    }
  }
}

function openRetentionModal() {
  updateRetentionDropdownLabels();
  evaluateRetentionEligible();
  elements.retentionModal?.classList.remove('hidden');
  pushModalHistoryState();
}

function closeRetentionModal(fromPopState = false) {
  elements.retentionModal?.classList.add('hidden');
  popModalHistoryIfCleared(fromPopState === true);
}

async function downLoadArchiveCSV() {
  const isZh = state.lang === 'zh';
  const val = elements.retentionYearsSelect?.value || '3';
  const currentYear = new Date().getFullYear();

  let matchingRecords = [];
  let defaultFileName = '';
  let fileDesc = '';

  if (val === 'current_year') {
    matchingRecords = (state.records || []).filter(
      (r) => r.date && r.date.startsWith(String(currentYear)),
    );
    defaultFileName = `monetax_export_year_${currentYear}_${getLocalDateString()}.csv`;
    fileDesc = isZh ? '本年度账单 CSV (*.csv)' : 'Current Year CSV (*.csv)';
  } else {
    const years = parseInt(val) || 3;
    const cutoffDate = getRetentionCutoffDate(years);
    matchingRecords = (state.records || []).filter((r) => r.date < cutoffDate);
    defaultFileName = `monetax_archive_older_than_${years}y_${cutoffDate}.csv`;
    fileDesc = isZh ? '归档账单 CSV (*.csv)' : 'Archive Records CSV (*.csv)';
  }

  if (matchingRecords.length === 0) {
    showToast(
      isZh
        ? val === 'current_year'
          ? '本年度暂无可导出的账单记录'
          : '没有符合归档年限的历史账单'
        : 'No records available for archiving',
      true,
    );
    return;
  }

  const headers = isZh
    ? [
        '序号',
        '记账日期',
        '收支类型',
        '消费分类',
        '支付账户',
        '金额',
        '币种',
        '备注说明',
        '创建时间',
      ]
    : [
        'No.',
        'Date',
        'Type',
        'Category',
        'Account',
        'Amount',
        'Currency',
        'Note',
        'Created At',
      ];

  const rows = matchingRecords.map((r, idx) => [
    idx + 1,
    `"${r.date}"`,
    `"${r.type === 'expense' ? (isZh ? '支出' : 'Expense') : isZh ? '收入' : 'Income'}"`,
    `"${getCategoryDisplayLabel(r.category)}"`,
    `"${getAccountDisplayName(r.account_name)}"`,
    (r.type === 'expense' ? -Number(r.amount) : Number(r.amount)).toFixed(2),
    `"${state.currency || 'MYR'}"`,
    `"${(r.note || '').replace(/"/g, '""')}"`,
    `"${r.createdAt ? new Date(r.createdAt).toLocaleString(isZh ? 'zh-CN' : 'en-US', { hour12: false }) : ''}"`,
  ]);

  const csvContent =
    '\uFEFF' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const saveRes = await saveBlobWithPicker(blob, defaultFileName, fileDesc);

  if (saveRes.canceled) {
    showToast(isZh ? '已取消导出' : 'Export canceled');
    return;
  }

  showToast(
    isZh
      ? val === 'current_year'
        ? `已成功导出本年度共 ${matchingRecords.length} 笔账单`
        : `已成功归档导出 ${matchingRecords.length} 笔历史账单`
      : `Downloaded ${matchingRecords.length} records`,
  );
}

function purgeOldRecords() {
  const isZh = state.lang === 'zh';
  const val = elements.retentionYearsSelect?.value || '3';

  if (val === 'current_year') {
    showToast(
      isZh
        ? '本年度在用账单受安全保护，不可清理'
        : 'Current year records are protected from purging',
      true,
    );
    return;
  }

  const years = parseInt(val) || 3;
  const cutoffDate = getRetentionCutoffDate(years);

  showConfirmModal({
    title:
      state.lang === 'zh'
        ? '确认永久清理历史记录？'
        : 'Purge Historical Records?',
    subtitle: `Before ${cutoffDate}`,
    desc:
      state.lang === 'zh'
        ? `确定要永久清理早于 ${years} 年前的所有历史记录吗？此操作不可撤销。`
        : `Permanently delete all records older than ${years} years? This action cannot be undone.`,
    confirmText: state.lang === 'zh' ? '永久清理' : 'Purge',
    danger: true,
    onConfirm: async () => {
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

        showToast(
          state.lang === 'zh'
            ? `已清理 ${years} 年前的历史记录`
            : `Purged records older than ${years} years`,
        );
        closeRetentionModal();
        await Promise.all([
          loadRecords(),
          loadSummary(),
          fetchProjectsFromBackend(),
          fetchClaimsFromBackend(),
        ]);
      } catch (err) {
        showToast(err.message, true);
      }
    },
  });
}

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

function normalizeRecordDateYMD(raw) {
  if (!raw) return '';
  const str = String(raw).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    return str.slice(0, 10);
  }
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return getLocalDateString(parsed);
  }
  return '';
}

function parseLocalMidnight(ymdOrIso) {
  if (!ymdOrIso) return null;
  const str = String(ymdOrIso).trim();
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    return new Date(
      parseInt(m[1], 10),
      parseInt(m[2], 10) - 1,
      parseInt(m[3], 10),
    );
  }
  const d = new Date(str);
  if (isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
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
    // Standalone mobile APK uses default BaaS config
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
 * Service Worker & In-App Auto-Update Engine
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
          if (
            newWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            showUpdateAvailablePrompt(APP_VERSION);
          }
        });
      });
    } catch (err) {
      // Service worker optional
    }
  }
}

let pendingUpdateVersion = null;
let pendingApkDownloadUrl =
  'https://github.com/LEESC88/ledger/releases/latest/download/MonetaX.apk';

function openInAppUpdateModal() {
  elements.updateDownloadProgressArea?.classList.add('hidden');
  if (elements.startInAppUpdateBtn) {
    elements.startInAppUpdateBtn.disabled = false;
  }
  if (elements.cancelInAppUpdateBtn) {
    elements.cancelInAppUpdateBtn.disabled = false;
  }
  elements.inAppUpdateModal?.classList.remove('hidden');
  pushModalHistoryState();
}

function closeInAppUpdateModal() {
  elements.inAppUpdateModal?.classList.add('hidden');
  popModalHistoryIfCleared();
}

function showUpdateAvailablePrompt(versionLabel, apkUrl, notes) {
  pendingUpdateVersion = versionLabel;
  if (apkUrl) pendingApkDownloadUrl = apkUrl;

  if (elements.inAppUpdateVersionBadge) {
    elements.inAppUpdateVersionBadge.textContent = `v${versionLabel}`;
  }
  if (elements.inAppUpdateNotes) {
    elements.inAppUpdateNotes.textContent =
      notes ||
      (state.lang === 'zh'
        ? `发现新版本 v${versionLabel}，支持应用内极速下载与自动安装。`
        : `New version v${versionLabel} is ready with in-app fast download and auto-install.`);
  }

  if (elements.updateBannerText) {
    elements.updateBannerText.textContent =
      state.lang === 'zh'
        ? `发现新版本 (v${versionLabel})！点击立即更新。`
        : `New update available (v${versionLabel})! Tap Update Now.`;
  }
  elements.updateNotificationBanner?.classList.remove('hidden');
  if (elements.updateStatusText) {
    elements.updateStatusText.textContent = `v${versionLabel} ready!`;
  }
  if (elements.checkUpdateBtnText) {
    elements.checkUpdateBtnText.textContent = `Update v${versionLabel}`;
  }

  openInAppUpdateModal();
}

/**
 * Native Android Download Progress Callbacks
 */
window.__onNativeDownloadProgress = function (
  percent,
  currentBytes,
  totalBytes,
) {
  const pct = Math.min(Math.max(Number(percent) || 0, 0), 100);
  if (elements.updateProgressBarFill) {
    elements.updateProgressBarFill.style.width = pct + '%';
  }
  if (elements.updateProgressPercent) {
    elements.updateProgressPercent.textContent = pct + '%';
  }
  if (elements.updateProgressBytes) {
    const curMb = (Number(currentBytes || 0) / (1024 * 1024)).toFixed(1);
    const totMb =
      totalBytes > 0 ? (Number(totalBytes) / (1024 * 1024)).toFixed(1) : '?';
    elements.updateProgressBytes.textContent = `${curMb} MB / ${totMb} MB`;
  }
  if (pct >= 100 && elements.updateProgressStatusText) {
    elements.updateProgressStatusText.textContent = t('installing_update');
  }
};

window.__onNativeDownloadError = function (errorMsg) {
  showToast(`${t('download_error')}: ${errorMsg}`, true);
  if (elements.updateProgressStatusText) {
    elements.updateProgressStatusText.textContent = `${t('download_error')}: ${errorMsg}`;
  }
  if (elements.startInAppUpdateBtn)
    elements.startInAppUpdateBtn.disabled = false;
  if (elements.cancelInAppUpdateBtn)
    elements.cancelInAppUpdateBtn.disabled = false;
};

/**
 * Execute in-app auto-update
 */
async function applyAppUpdate() {
  // If running inside Android container with NativeUpdater interface
  if (
    window.NativeUpdater &&
    typeof window.NativeUpdater.downloadAndInstall === 'function'
  ) {
    elements.updateDownloadProgressArea?.classList.remove('hidden');
    if (elements.startInAppUpdateBtn) {
      elements.startInAppUpdateBtn.disabled = true;
    }
    if (elements.cancelInAppUpdateBtn) {
      elements.cancelInAppUpdateBtn.disabled = true;
    }
    if (elements.updateProgressBarFill)
      elements.updateProgressBarFill.style.width = '0%';
    if (elements.updateProgressPercent)
      elements.updateProgressPercent.textContent = '0%';
    if (elements.updateProgressBytes)
      elements.updateProgressBytes.textContent = '0 MB / ...';
    if (elements.updateProgressStatusText) {
      elements.updateProgressStatusText.textContent = t('downloading_package');
    }
    window.NativeUpdater.downloadAndInstall(pendingApkDownloadUrl);
    return;
  }

  // Web Browser Fallback
  if (swRegistration && swRegistration.waiting) {
    showToast('Applying latest update...');
    swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
    setTimeout(() => {
      window.location.reload();
    }, 450);
    return;
  }

  // Standalone web download
  window.open(pendingApkDownloadUrl, '_system');
}

async function checkForAppUpdates(isManual = false) {
  if (elements.appVersionBadge) {
    elements.appVersionBadge.textContent = `v${APP_VERSION}`;
  }

  if (isManual) {
    if (elements.checkUpdateBtn) elements.checkUpdateBtn.disabled = true;
    if (elements.checkUpdateIcon)
      elements.checkUpdateIcon.classList.add('sync-spinner-icon');
    if (elements.checkUpdateBtnText)
      elements.checkUpdateBtnText.textContent =
        state.lang === 'zh' ? '检查中...' : 'Checking...';
  }

  try {
    if (swRegistration) {
      await swRegistration.update().catch(() => {});
    }

    let remoteData = null;
    // 1. Try GitHub Releases API first (instant, real-time, no 5-minute Fastly CDN cache)
    try {
      const relRes = await fetch(
        'https://api.github.com/repos/LEESC88/ledger/releases/latest',
        { headers: { Accept: 'application/vnd.github.v3+json' } },
      );
      if (relRes.ok) {
        const relData = await relRes.json();
        const tagVer = (relData.tag_name || '').replace(/^v/, '');
        if (tagVer) {
          const apkAsset = (relData.assets || []).find(
            (a) => a.name && a.name.endsWith('.apk'),
          );
          remoteData = {
            version: tagVer,
            apkUrl: apkAsset?.browser_download_url || pendingApkDownloadUrl,
            notes: relData.body || '',
          };
        }
      }
    } catch (e) {
      // Fallback to raw / jsdelivr
    }

    // 2. Try raw.githubusercontent.com as secondary
    if (!remoteData) {
      try {
        const ghRes = await fetch(
          `https://raw.githubusercontent.com/LEESC88/ledger/master/public/version.json?t=${Date.now()}`,
          { cache: 'no-store' },
        );
        if (ghRes.ok) {
          remoteData = await ghRes.json();
        }
      } catch (e) {
        // Fallback to jsdelivr
      }
    }

    // 3. Try jsDelivr as tertiary fallback
    if (!remoteData) {
      try {
        const jsdRes = await fetch(
          `https://cdn.jsdelivr.net/gh/LEESC88/ledger@master/public/version.json?t=${Date.now()}`,
          { cache: 'no-store' },
        );
        if (jsdRes.ok) {
          remoteData = await jsdRes.json();
        }
      } catch (e) {
        // Fallback
      }
    }

    // 4. Local version.json fallback ONLY in web browser mode (not in native APK wrapper)
    const isNativeApp = !!(window.NativeUpdater || window.Capacitor);
    if (!remoteData && !isNativeApp) {
      const localRes = await fetch(`/version.json?t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (localRes.ok) {
        remoteData = await localRes.json();
      }
    }

    if (remoteData) {
      const remoteVersion = remoteData.version || APP_VERSION;
      const apkUrl = remoteData.apkUrl || pendingApkDownloadUrl;

      if (
        remoteVersion !== APP_VERSION ||
        (swRegistration && swRegistration.waiting)
      ) {
        showUpdateAvailablePrompt(remoteVersion, apkUrl);
        if (isManual) {
          await applyAppUpdate();
        }
        return;
      }
    }

    if (isManual) {
      if (elements.updateStatusText) {
        elements.updateStatusText.textContent = `${t('up_to_date')} (v${APP_VERSION})`;
      }
      showToast(`${t('up_to_date')} (v${APP_VERSION})`);
    }
  } catch (err) {
    if (isManual) {
      showToast('Could not reach update server.', true);
    }
  } finally {
    if (isManual) {
      if (elements.checkUpdateBtn) elements.checkUpdateBtn.disabled = false;
      if (elements.checkUpdateIcon)
        elements.checkUpdateIcon.classList.remove('sync-spinner-icon');
      if (
        elements.checkUpdateBtnText &&
        (!pendingUpdateVersion || pendingUpdateVersion === APP_VERSION)
      ) {
        elements.checkUpdateBtnText.textContent = t('btn_check_update');
      }
    }
  }
}

/**
 * Application Bootstrapper
 */
async function init() {
  // 1. Multi-Page Navigation Listeners
  elements.bottomNavItems.forEach((btn) => {
    btn.addEventListener('click', () => {
      switchAppPage(btn.dataset.navTarget);
    });
  });

  // 2. Create Modal Triggers
  elements.openCreateModalBtn?.addEventListener('click', openCreateModal);
  elements.desktopCreateBtn?.addEventListener('click', openCreateModal);
  elements.emptyCreateBtn?.addEventListener('click', openCreateModal);
  elements.closeCreateModalBtn?.addEventListener('click', closeCreateModal);
  elements.createEntryModal?.addEventListener('click', (e) => {
    if (e.target === elements.createEntryModal) closeCreateModal();
  });
  initBottomSheetGestures();
  initModalBackAndEscapeGuards();

  // 3. Transaction form submission
  elements.recordForm?.addEventListener('submit', handleRecordSubmit);

  // 4. Currency setup
  if (elements.currencySelector) {
    elements.currencySelector.value = state.currency;
    elements.currencySelector.addEventListener('change', (e) => {
      state.currency = e.target.value;
      localStorage.setItem('ledger_currency', state.currency);
      updateCurrencySymbols();
      renderTable();
      renderBudgetTracker();
      updateDailySpendingTrend();
      if (state.user) {
        syncUserProfileToCloud({ currency: state.currency });
      }
    });
  }
  updateCurrencySymbols();

  // 5. Default date to today
  const today = getLocalDateString();
  if (elements.inputDate) elements.inputDate.value = today;

  // 6. Category options & initial entry type
  setEntryType('expense');

  elements.btnTypeExpense?.addEventListener('click', () => {
    triggerHaptic(8);
    setEntryType('expense');
  });
  elements.btnTypeIncome?.addEventListener('click', () => {
    triggerHaptic(8);
    setEntryType('income');
  });

  // 7. Filter tabs
  elements.filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      triggerHaptic(8);
      elements.filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      state.currentFilter = tab.dataset.filter;
      renderTable();
    });
  });

  // 8. Month selector
  elements.monthFilter?.addEventListener('change', (e) => {
    state.currentMonth = e.target.value;
    loadSummary();
    renderTable();
    updateDailySpendingTrend();
  });

  // 9. Search Input and Clear Button
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

  // 10. Refresh button & Privacy Mode Toggle
  elements.refreshBtn?.addEventListener('click', () => {
    loadSummary();
    loadRecords();
    loadAccounts();
    fetchProjectsFromBackend();
    fetchClaimsFromBackend();
    showToast(state.lang === 'zh' ? '数据已刷新' : 'MonetaX data synced');
  });

  elements.privacyToggleBtn?.addEventListener('click', () => {
    togglePrivacyMode();
  });

  // Account Filter Select in Search Bar
  elements.accountFilterSelect?.addEventListener('change', (e) => {
    state.selectedAccountFilter = e.target.value;
    renderTable();
  });

  // Monthly Spending by Account Month Filter
  elements.spendingAccountsMonthFilter?.addEventListener('change', (e) => {
    state.selectedAccountsMonth = e.target.value;
    renderAccountsCenter();
  });

  // Avatar Lightbox Preview Click Listeners
  elements.userAvatar?.addEventListener('click', (e) => {
    e.stopPropagation();
    openAvatarLightbox(elements.userAvatar.src);
  });
  elements.accountModalAvatar?.addEventListener('click', (e) => {
    e.stopPropagation();
    openAvatarLightbox(elements.accountModalAvatar.src);
  });
  elements.dropdownAvatar?.addEventListener('click', (e) => {
    e.stopPropagation();
    openAvatarLightbox(elements.dropdownAvatar.src);
  });
  elements.closeAvatarLightboxBtn?.addEventListener(
    'click',
    closeAvatarLightbox,
  );
  elements.avatarLightboxBackdrop?.addEventListener(
    'click',
    closeAvatarLightbox,
  );

  // 11. Export CSV & Retention Modal
  elements.exportCsvBtn?.addEventListener('click', exportToCSV);
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

  // 12. Profile Dropdown & Inline Settings Profile Event Listeners
  setupProjectsModuleEventListeners();
  loadProjects();
  loadClaims();
  loadBudgetTopUps();
  elements.landingGoogleLoginBtn?.addEventListener('click', signInWithGoogle);
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

  elements.menuViewProfileBtn?.addEventListener('click', () => {
    closeProfileDropdown();
    switchAppPage('settings');
  });
  elements.menuSettingsBtn?.addEventListener('click', () => {
    closeProfileDropdown();
    switchAppPage('settings');
  });
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

  // Budget Tracker Event Listeners
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

  // Settings: App Update & Data Retention Shortcut
  elements.openRetentionFromSettingsBtn?.addEventListener('click', () => {
    openRetentionModal();
  });

  elements.checkUpdateBtn?.addEventListener('click', () => {
    checkForAppUpdates(true);
  });

  elements.updateBannerApplyBtn?.addEventListener('click', () => {
    openInAppUpdateModal();
  });

  elements.updateBannerDismissBtn?.addEventListener('click', () => {
    elements.updateNotificationBanner?.classList.add('hidden');
  });

  // Dedicated In-App Update Modal Listeners
  elements.closeInAppUpdateModalBtn?.addEventListener(
    'click',
    closeInAppUpdateModal,
  );
  elements.cancelInAppUpdateBtn?.addEventListener(
    'click',
    closeInAppUpdateModal,
  );
  elements.startInAppUpdateBtn?.addEventListener('click', applyAppUpdate);
  elements.inAppUpdateModal?.addEventListener('click', (e) => {
    if (e.target === elements.inAppUpdateModal) closeInAppUpdateModal();
  });

  // Tucked-away Logout Button inside Settings
  elements.menuLogoutBtn?.addEventListener('click', signOutUser);

  // Theme switcher segmented controls
  elements.themeSegmentBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      setAppTheme(btn.dataset.themeVal);
    });
  });

  // Language switcher segmented controls (EN / 中文)
  elements.langSegmentBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      setAppLanguage(btn.dataset.langVal);
    });
  });

  // Apply initial theme, language & privacy mode from localStorage
  const savedTheme = localStorage.getItem('ledger_theme') || 'system';
  setAppTheme(savedTheme);
  setAppLanguage(state.lang);
  togglePrivacyMode(state.isPrivacyMode);

  // Initial data fetch
  loadSummary();
  loadRecords();
  loadAccounts();
  renderAccountPicker();
  fetchProjectsFromBackend();
  fetchClaimsFromBackend();

  // Network & Cloud Sync Listeners
  window.addEventListener('online', () => {
    state.isOnline = true;
    updateSyncStatusUI();
    syncOfflineDrafts();
  });

  window.addEventListener('offline', () => {
    state.isOnline = false;
    updateSyncStatusUI();
  });

  elements.syncStatusPill?.addEventListener('click', () => {
    if (!navigator.onLine) {
      showToast(t('sync_offline'), true);
      return;
    }
    const queue = getOfflineQueue();
    if (queue.length > 0) {
      syncOfflineDrafts();
    } else {
      showToast(t('sync_synced'));
    }
  });

  updateSyncStatusUI();
  if (navigator.onLine && getOfflineQueue().length > 0) {
    syncOfflineDrafts();
  }

  await registerServiceWorker();
  checkForAppUpdates(false);

  // Initialize Supabase Auth & Session Listener
  try {
    await initSupabaseClient();

    if (supabaseClient) {
      supabaseClient.auth.onAuthStateChange(async (event, session) => {
        state.user = session?.user || null;
        updateAuthUI(state.user);
        if (event === 'SIGNED_IN' && state.user) {
          await Promise.all([
            loadRecords(),
            loadSummary(),
            fetchProjectsFromBackend(),
            fetchClaimsFromBackend(),
          ]);
        }
      });

      const { data } = await supabaseClient.auth.getSession();
      if (data?.session?.user) {
        state.user = data.session.user;
        updateAuthUI(state.user);
        await Promise.all([
          loadRecords(),
          loadSummary(),
          fetchProjectsFromBackend(),
          fetchClaimsFromBackend(),
        ]);
      } else {
        updateAuthUI(null);
      }
    } else {
      updateAuthUI(null);
    }
  } catch (authErr) {
    updateAuthUI(null);
  }
}

// ============================================================================
// 13. PROJECTS, SINKING FUNDS & SPLIT BILL CLAIMS MODULE
// ============================================================================

function getCurrentMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function getProjectsStorageKey() {
  const userKey = state.user?.id || 'guest';
  return `ledger_projects_${userKey}`;
}

function getDeletedProjectsStorageKey() {
  const userKey = state.user?.id || 'guest';
  return `ledger_deleted_projects_${userKey}`;
}

function getClaimsStorageKey() {
  const userKey = state.user?.id || 'guest';
  return `ledger_claims_${userKey}`;
}

function getDeletedClaimsStorageKey() {
  const userKey = state.user?.id || 'guest';
  return `ledger_deleted_claims_${userKey}`;
}

function getBudgetTopUpsStorageKey() {
  const userKey = state.user?.id || 'guest';
  return `ledger_budget_topups_${userKey}`;
}

function getDeletedIdsSet(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch (e) {
    return new Set();
  }
}

function addDeletedId(storageKey, id) {
  if (!id) return;
  try {
    const set = getDeletedIdsSet(storageKey);
    set.add(String(id));
    localStorage.setItem(storageKey, JSON.stringify(Array.from(set)));
  } catch (e) {}
}

function loadProjects() {
  try {
    const raw = localStorage.getItem(getProjectsStorageKey());
    const parsed = raw ? JSON.parse(raw) : [];
    const deleted = getDeletedIdsSet(getDeletedProjectsStorageKey());
    state.projects = (Array.isArray(parsed) ? parsed : []).filter(
      (p) => p && p.id && !deleted.has(String(p.id)),
    );
  } catch (e) {
    state.projects = [];
  }
}

function saveProjects(projects, syncCloudMeta = true) {
  const deleted = getDeletedIdsSet(getDeletedProjectsStorageKey());
  const clean = (Array.isArray(projects) ? projects : []).filter(
    (p) => p && p.id && !deleted.has(String(p.id)),
  );
  state.projects = clean;
  try {
    localStorage.setItem(getProjectsStorageKey(), JSON.stringify(clean));
  } catch (e) {}
  if (syncCloudMeta && state.user?.id) {
    syncUserProfileToCloud({
      ledger_projects: clean.map((p) => ({
        id: p.id,
        title: p.title,
        target_amount: p.target_amount,
        spent_amount: p.spent_amount,
        mode: p.mode,
        month: p.month,
        status: p.status,
        created_at: p.created_at,
      })),
    });
  }
}

function loadClaims() {
  try {
    const raw = localStorage.getItem(getClaimsStorageKey());
    const parsed = raw ? JSON.parse(raw) : [];
    const deleted = getDeletedIdsSet(getDeletedClaimsStorageKey());
    state.claims = (Array.isArray(parsed) ? parsed : []).filter(
      (c) => c && c.id && !deleted.has(String(c.id)),
    );
  } catch (e) {
    state.claims = [];
  }
}

function saveClaims(claims, syncCloudMeta = true) {
  const deleted = getDeletedIdsSet(getDeletedClaimsStorageKey());
  const clean = (Array.isArray(claims) ? claims : []).filter(
    (c) => c && c.id && !deleted.has(String(c.id)),
  );
  state.claims = clean;
  try {
    localStorage.setItem(getClaimsStorageKey(), JSON.stringify(clean));
  } catch (e) {}
  if (syncCloudMeta && state.user?.id) {
    syncUserProfileToCloud({ ledger_claims: clean });
  }
}

function loadBudgetTopUps() {
  try {
    const raw = localStorage.getItem(getBudgetTopUpsStorageKey());
    state.budgetTopUps = raw ? JSON.parse(raw) : {};
  } catch (e) {
    state.budgetTopUps = {};
  }
}

function saveBudgetTopUps(topups, syncCloudMeta = true) {
  state.budgetTopUps = topups || {};
  try {
    localStorage.setItem(
      getBudgetTopUpsStorageKey(),
      JSON.stringify(state.budgetTopUps),
    );
  } catch (e) {}
  if (syncCloudMeta && state.user?.id) {
    syncUserProfileToCloud({ ledger_budget_topups: state.budgetTopUps });
  }
}

function getBudgetTopUpTotal(month) {
  if (!month || month === 'all') month = getCurrentMonthKey();
  const list = state.budgetTopUps[month];
  if (!Array.isArray(list)) return 0;
  return list.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
}

function getLockedSinkingFundAmount(month) {
  if (!month || month === 'all') month = getCurrentMonthKey();
  if (!Array.isArray(state.projects)) return 0;
  return state.projects
    .filter((p) => p.status === 'active' && p.mode === 'budget_deduct')
    .reduce((sum, p) => {
      const target = parseFloat(p.target_amount) || 0;
      const spent = parseFloat(p.spent_amount) || 0;
      const lockedRemaining = Math.max(0, target - spent);
      return sum + lockedRemaining;
    }, 0);
}

function renderRecordSourceBadgeHtml(record) {
  if (!record) return '';
  const note = record.note || '';
  if (record.project_title) {
    return `<span class="badge-source-fund">${SVG_ICONS.target} ${escapeHtml(record.project_title)}</span> `;
  }
  if (note.includes('[🎯') || note.includes('[专款:')) {
    const m = note.match(/\[(?:🎯|专款:)\s*([^\]]+)\]/);
    if (m)
      return `<span class="badge-source-fund">${SVG_ICONS.target} ${escapeHtml(m[1])}</span> `;
  }
  if (
    note.includes('[👥') ||
    note.includes('[AA分摊:') ||
    note.includes('[代垫:')
  ) {
    const m = note.match(/\[(?:👥|AA分摊:|代垫:)\s*([^\]]+)\]/);
    if (m)
      return `<span class="badge-source-claim">${SVG_ICONS.users} ${escapeHtml(m[1])}</span> `;
  }
  return '';
}

function formatRecordCleanNote(note) {
  if (!note) return '—';
  // Strip out bracket tags for cleaner secondary subtitle
  return (
    note.replace(/\[(?:🎯|👥|专款:|AA分摊:|代垫:)[^\]]+\]/g, '').trim() || '—'
  );
}

function normalizeProjectItem(d) {
  if (!d || !d.id) return null;
  return {
    id: String(d.id),
    title: d.title || '',
    icon: SVG_ICONS.target,
    target_amount: parseFloat(d.target_amount ?? d.targetAmount) || 0,
    spent_amount: parseFloat(d.spent_amount ?? d.spentAmount) || 0,
    mode: d.mode || 'budget_deduct',
    month: d.month || getCurrentMonthKey(),
    status: d.status || 'active',
    created_at: d.created_at || d.createdAt || new Date().toISOString(),
  };
}

function normalizeClaimItem(c) {
  if (!c || !c.id) return null;
  let friends = [];
  if (Array.isArray(c.friends)) {
    friends = c.friends;
  } else if (typeof c.friends === 'string') {
    try {
      friends = JSON.parse(c.friends);
    } catch (e) {
      friends = [];
    }
  }
  return {
    id: String(c.id),
    title: c.title || '',
    total_amount: parseFloat(c.total_amount ?? c.totalAmount) || 0,
    my_share: parseFloat(c.my_share ?? c.myShare) || 0,
    friends: friends,
    status: c.status || 'active',
    date: c.date || getLocalDateString(),
    created_at: c.created_at || c.createdAt || new Date().toISOString(),
  };
}

async function fetchProjectsFromBackend() {
  loadProjects();
  const deleted = getDeletedIdsSet(getDeletedProjectsStorageKey());
  const mergedMap = new Map();

  // 1. Seed from user_metadata cloud backup if present
  const metaProjects = state.user?.user_metadata?.ledger_projects;
  if (Array.isArray(metaProjects)) {
    metaProjects.forEach((item) => {
      const norm = normalizeProjectItem(item);
      if (norm && !deleted.has(norm.id)) {
        mergedMap.set(norm.id, norm);
      }
    });
  }

  // 2. Seed from current local state
  (state.projects || []).forEach((item) => {
    const norm = normalizeProjectItem(item);
    if (norm && !deleted.has(norm.id)) {
      mergedMap.set(norm.id, norm);
    }
  });

  const userId = state.user?.id;
  const supabaseIds = new Set();

  // 3. Fetch from Supabase Cloud Table
  if (supabaseClient && userId) {
    try {
      const { data, error } = await supabaseClient
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        data.forEach((d) => {
          const norm = normalizeProjectItem(d);
          if (norm && !deleted.has(norm.id)) {
            supabaseIds.add(norm.id);
            mergedMap.set(norm.id, norm);
          }
        });
      }
    } catch (e) {}
  }

  // 4. Fetch from NestJS Backend API
  const backendIds = new Set();
  try {
    const res = await fetch('/api/projects', {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        data.forEach((d) => {
          const norm = normalizeProjectItem(d);
          if (norm && !deleted.has(norm.id)) {
            backendIds.add(norm.id);
            if (!mergedMap.has(norm.id)) {
              mergedMap.set(norm.id, norm);
            }
          }
        });
      }
    }
  } catch (e) {}

  const finalProjects = Array.from(mergedMap.values()).sort((a, b) =>
    String(b.created_at || '').localeCompare(String(a.created_at || '')),
  );

  saveProjects(finalProjects, false);
  renderSinkingFunds();
  renderBudgetTracker();
  updateProjectDropdownOptions();

  // Backfill any unsynced local projects to Supabase Cloud & Backend API
  for (const proj of finalProjects) {
    if (supabaseClient && userId && !supabaseIds.has(proj.id)) {
      try {
        await supabaseClient.from('projects').upsert({
          id: proj.id,
          user_id: userId,
          title: proj.title,
          icon: 'target',
          target_amount: proj.target_amount,
          spent_amount: proj.spent_amount,
          mode: proj.mode,
          month: proj.month,
          status: proj.status,
        });
      } catch (e) {}
    }
    if (!backendIds.has(proj.id)) {
      fetch('/api/projects', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          id: proj.id,
          title: proj.title,
          targetAmount: proj.target_amount,
          mode: proj.mode,
          month: proj.month,
        }),
      }).catch(() => {});
    }
  }
}

async function fetchClaimsFromBackend() {
  loadClaims();
  const deleted = getDeletedIdsSet(getDeletedClaimsStorageKey());
  const mergedMap = new Map();

  // 1. Seed from user_metadata cloud backup if present
  const metaClaims = state.user?.user_metadata?.ledger_claims;
  if (Array.isArray(metaClaims)) {
    metaClaims.forEach((item) => {
      const norm = normalizeClaimItem(item);
      if (norm && !deleted.has(norm.id)) {
        mergedMap.set(norm.id, norm);
      }
    });
  }

  // 2. Seed from current local state
  (state.claims || []).forEach((item) => {
    const norm = normalizeClaimItem(item);
    if (norm && !deleted.has(norm.id)) {
      mergedMap.set(norm.id, norm);
    }
  });

  const userId = state.user?.id;
  const supabaseIds = new Set();

  // 3. Fetch from Supabase Cloud Table
  if (supabaseClient && userId) {
    try {
      const { data, error } = await supabaseClient
        .from('claims')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        data.forEach((c) => {
          const norm = normalizeClaimItem(c);
          if (norm && !deleted.has(norm.id)) {
            supabaseIds.add(norm.id);
            mergedMap.set(norm.id, norm);
          }
        });
      }
    } catch (e) {}
  }

  // 4. Fetch from NestJS Backend API
  const backendIds = new Set();
  try {
    const res = await fetch('/api/claims', {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        data.forEach((c) => {
          const norm = normalizeClaimItem(c);
          if (norm && !deleted.has(norm.id)) {
            backendIds.add(norm.id);
            if (!mergedMap.has(norm.id)) {
              mergedMap.set(norm.id, norm);
            }
          }
        });
      }
    }
  } catch (e) {}

  const finalClaims = Array.from(mergedMap.values()).sort((a, b) =>
    String(b.created_at || '').localeCompare(String(a.created_at || '')),
  );

  saveClaims(finalClaims, false);
  renderClaims();

  // Backfill any unsynced local claims to Supabase Cloud & Backend API
  for (const claim of finalClaims) {
    if (supabaseClient && userId && !supabaseIds.has(claim.id)) {
      try {
        await supabaseClient.from('claims').upsert({
          id: claim.id,
          user_id: userId,
          title: claim.title,
          total_amount: claim.total_amount,
          my_share: claim.my_share,
          friends: claim.friends,
          status: claim.status,
          date: claim.date,
        });
      } catch (e) {}
    }
    if (!backendIds.has(claim.id)) {
      fetch('/api/claims', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          id: claim.id,
          title: claim.title,
          totalAmount: claim.total_amount,
          myShare: claim.my_share,
          friends: claim.friends,
          date: claim.date,
        }),
      }).catch(() => {});
    }
  }
}

function renderProjectsView() {
  loadProjects();
  loadClaims();
  loadBudgetTopUps();

  renderSinkingFunds();
  renderClaims();

  fetchProjectsFromBackend();
  fetchClaimsFromBackend();
}

function renderSinkingFunds() {
  const container = elements.sinkingFundsList;
  if (!container) return;

  const sym = state.currency || 'RM';
  const activeFunds = (state.projects || []).filter(
    (p) => p.status === 'active',
  );
  const settledFunds = (state.projects || []).filter(
    (p) => p.status === 'settled',
  );

  if (state.projects.length === 0) {
    container.innerHTML = `
      <div class="empty-state-card" style="text-align: center; padding: 36px 16px; background: var(--bg-surface); border: 1px dashed var(--border-card); border-radius: 16px;">
        <div class="empty-icon-wrap" style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 50%; background: var(--brand-cyan-subtle); color: var(--brand-cyan); margin-bottom: 12px;">
          ${SVG_ICONS.target}
        </div>
        <h4 style="font-weight: 700; color: var(--text-primary); margin: 0;">${t('sinking_fund_empty')}</h4>
      </div>
    `;
    return;
  }

  const allFunds = [...activeFunds, ...settledFunds];
  container.innerHTML = allFunds
    .map((fund) => {
      const target = parseFloat(fund.target_amount) || 0;
      const spent = parseFloat(fund.spent_amount) || 0;
      const remaining = Math.max(0, target - spent);
      const pct =
        target > 0 ? Math.min(100, Math.round((spent / target) * 100)) : 0;
      const isSettled = fund.status === 'settled';
      const isBudgetMode = fund.mode === 'budget_deduct';

      const modePill = isBudgetMode
        ? `<span class="project-mode-pill mode-budget">${t('fund_mode_budget')}</span>`
        : `<span class="project-mode-pill mode-extra">${t('fund_mode_extra')}</span>`;

      const statusPill = isSettled
        ? `<span style="font-size: 0.72rem; padding: 2px 8px; border-radius: 9999px; background: rgba(34, 197, 94, 0.1); color: #16a34a; font-weight: 600;">${t('fund_settled')}</span>`
        : `<span style="font-size: 0.72rem; padding: 2px 8px; border-radius: 9999px; background: rgba(13, 148, 136, 0.1); color: var(--brand-cyan); font-weight: 600;">${t('fund_status_active')}</span>`;

      // Equation breakdown
      const isZh = state.lang === 'zh';
      let equationText = '';
      if (spent > 0) {
        const remLabel = isZh ? '待结算' : 'Remaining';
        equationText = `${t('fund_target')} ${sym} ${formatNumber(target)} - ${t('fund_spent')} ${sym} ${formatNumber(spent)} = ${remLabel} ${sym} ${formatNumber(remaining)}`;
      } else if (isBudgetMode) {
        const base = Number(state.monthlyBudget || 3000);
        equationText = isZh
          ? `日常可用 ${sym} ${formatNumber(base - target)} + 专款 ${sym} ${formatNumber(target)} = 总基准 ${sym} ${formatNumber(base)}`
          : `Daily Avail ${sym} ${formatNumber(base - target)} + Fund ${sym} ${formatNumber(target)} = Base ${sym} ${formatNumber(base)}`;
      } else {
        equationText = isZh
          ? `预定储备 ${sym} ${formatNumber(target)} (不占用日常预算)`
          : `Reserved ${sym} ${formatNumber(target)} (Outside monthly budget)`;
      }

      const releaseBtn =
        !isSettled && remaining > 0 && isBudgetMode
          ? `<button type="button" class="btn-card-action" onclick="releaseFundRemainingToBudget('${fund.id}')">${t('btn_release_to_budget')}</button>`
          : '';

      const settleBtn = !isSettled
        ? `<button type="button" class="btn-card-action btn-action-settle" onclick="settleFund('${fund.id}')">${t('btn_settle_fund')}</button>`
        : '';

      return `
      <div class="project-card" data-fund-id="${fund.id}">
        <div class="project-card-header">
          <div class="project-title-group">
            <div class="project-icon-badge">${SVG_ICONS.target}</div>
            <div>
              <h4 class="project-name-text">${escapeHtml(fund.title)}</h4>
              <div style="display: flex; gap: 6px; align-items: center; margin-top: 2px;">
                ${modePill}
                ${statusPill}
              </div>
            </div>
          </div>
          <button type="button" class="btn-del" onclick="deleteProject('${fund.id}')" title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>

        <div class="project-math-equation">${equationText}</div>

        <div class="project-progress-track">
          <div class="project-progress-spent" style="width: ${pct}%; background: ${pct > 100 ? '#ef4444' : 'var(--brand-cyan)'};"></div>
        </div>

        <div class="project-card-stats">
          <span>${t('fund_spent')}: <strong>${sym} ${formatNumber(spent)}</strong></span>
          <span>${pct}%</span>
          <span>${t('fund_remaining')}: <strong>${sym} ${formatNumber(remaining)}</strong></span>
        </div>

        <div class="project-card-actions">
          ${releaseBtn}
          ${settleBtn}
        </div>
      </div>
    `;
    })
    .join('');
}

function renderClaims() {
  const container = elements.claimsList;
  if (!container) return;

  const sym = state.currency || 'RM';
  const claims = state.claims || [];

  // Compute total pending across all unpaid friend shares
  let totalPending = 0;
  claims.forEach((claim) => {
    (claim.friends || []).forEach((f) => {
      if (!f.paid) totalPending += parseFloat(f.amount) || 0;
    });
  });

  if (elements.claimsPendingTotalVal) {
    elements.claimsPendingTotalVal.textContent = `${sym} ${formatNumber(totalPending)}`;
  }

  if (claims.length === 0) {
    container.innerHTML = `
      <div class="empty-state-card" style="text-align: center; padding: 36px 16px; background: var(--bg-surface); border: 1px dashed var(--border-card); border-radius: 16px;">
        <div class="empty-icon-wrap" style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 50%; background: var(--brand-cyan-subtle); color: var(--brand-cyan); margin-bottom: 12px;">
          ${SVG_ICONS.claims}
        </div>
        <h4 style="font-weight: 700; color: var(--text-primary); margin: 0;">${t('claims_empty')}</h4>
      </div>
    `;
    return;
  }

  container.innerHTML = claims
    .map((claim) => {
      const totalAmount = parseFloat(claim.total_amount) || 0;
      const myShare = parseFloat(claim.my_share) || 0;
      const friends = claim.friends || [];
      const allPaid = friends.length > 0 && friends.every((f) => f.paid);

      const isZh = state.lang === 'zh';
      const friendsHtml = friends
        .map((f, idx) => {
          const isPaid = f.paid;
          const statusBtn = isPaid
            ? `<button type="button" class="btn-mark-paid paid" onclick="toggleClaimFriendPaid('${claim.id}', ${idx})">${isZh ? '已收回' : 'Paid'}</button>`
            : `<button type="button" class="btn-mark-paid" onclick="toggleClaimFriendPaid('${claim.id}', ${idx})">${isZh ? '点我收款' : 'Mark Paid'}</button>`;

          return `
        <div class="claim-friend-row">
          <div class="claim-friend-info">
            <span class="claim-friend-avatar" style="display: inline-flex; align-items: center; color: var(--text-secondary);">${SVG_ICONS.users}</span>
            <span style="font-weight: 600; color: var(--text-primary);">${escapeHtml(f.name)}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <strong style="font-family: var(--font-mono, monospace);">${sym} ${formatNumber(f.amount)}</strong>
            ${statusBtn}
          </div>
        </div>
      `;
        })
        .join('');

      const settleAllBtn = !allPaid
        ? `<button type="button" class="btn-card-action btn-action-settle" onclick="settleAllClaim('${claim.id}')">${t('btn_all_settled')}</button>`
        : `<span style="font-size: 0.78rem; font-weight: 700; color: #16a34a; background: rgba(34, 197, 94, 0.1); padding: 4px 10px; border-radius: 9999px;">${isZh ? '全员结清归档' : 'All Settled'}</span>`;

      return `
      <div class="claim-card" data-claim-id="${claim.id}">
        <div class="claim-card-header">
          <div>
            <h4 class="claim-title-text">${escapeHtml(claim.title)}</h4>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(claim.date || '')} · ${isZh ? '我自己消费' : 'My Share'}: ${sym} ${formatNumber(myShare)}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="claim-total-badge">${isZh ? '垫付总额' : 'Advanced'}: ${sym} ${formatNumber(totalAmount - myShare)}</span>
            <button type="button" class="btn-del" onclick="deleteClaim('${claim.id}')" title="Delete">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>

        <div class="claim-friend-list">
          ${friendsHtml}
        </div>

        <div class="project-card-actions">
          ${settleAllBtn}
        </div>
      </div>
    `;
    })
    .join('');
}

// Open Transaction Modal specifically in Split mode
function openCreateModalWithSplit() {
  openCreateModal();
  if (
    elements.toggleSplitBillBtn &&
    !elements.toggleSplitBillBtn.classList.contains('active')
  ) {
    elements.toggleSplitBillBtn.click();
  }
}

// Modals: New Project
function openNewProjectModal() {
  triggerHaptic(10);
  if (!elements.newProjectModal) return;
  if (elements.projectInputTitle) elements.projectInputTitle.value = '';
  if (elements.projectInputAmount) elements.projectInputAmount.value = '500';
  elements.newProjectModal.classList.remove('hidden');
  pushModalHistoryState();
}

function closeNewProjectModal() {
  triggerHaptic(10);
  elements.newProjectModal?.classList.add('hidden');
  popModalHistoryIfCleared();
}

async function saveNewProject() {
  const title = (elements.projectInputTitle?.value || '').trim();
  const amount = parseFloat(elements.projectInputAmount?.value) || 0;
  const isBudget = elements.btnModeBudgetDeduct?.classList.contains('active');
  const mode = isBudget ? 'budget_deduct' : 'extra';
  const isZh = state.lang === 'zh';

  if (!title) {
    return showToast(
      isZh
        ? '请输入专款名称 (例如：修车保养、年度旅行)'
        : 'Please enter a project name (e.g., Car Service, Trip)',
      true,
    );
  }
  if (amount <= 0) {
    return showToast(
      isZh ? '请输入有效的预留金额' : 'Please enter a valid target amount',
      true,
    );
  }

  const newProject = {
    id: 'proj_' + Date.now(),
    title: title,
    icon: SVG_ICONS.target,
    target_amount: amount,
    spent_amount: 0,
    mode: mode,
    month: getCurrentMonthKey(),
    status: 'active',
    created_at: new Date().toISOString(),
  };

  const list = state.projects || [];
  list.unshift(newProject);
  saveProjects(list);
  renderSinkingFunds();
  renderBudgetTracker();
  updateProjectDropdownOptions();

  triggerHaptic(15);
  closeNewProjectModal();
  showToast(
    state.lang === 'zh'
      ? `专款【${title}】建立成功`
      : `Project ${title} created!`,
  );

  // Sync to Supabase Cloud
  if (supabaseClient && state.user?.id) {
    try {
      await supabaseClient.from('projects').upsert({
        id: newProject.id,
        user_id: state.user.id,
        title: newProject.title,
        icon: 'target',
        target_amount: newProject.target_amount,
        spent_amount: newProject.spent_amount,
        mode: newProject.mode,
        month: newProject.month,
        status: newProject.status,
      });
    } catch (e) {}
  }

  // Sync to backend API
  try {
    await fetch('/api/projects', {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        id: newProject.id,
        title: newProject.title,
        targetAmount: newProject.target_amount,
        mode: newProject.mode,
        month: newProject.month,
      }),
    });
  } catch (e) {}
}

// Release Remaining Sinking Fund to Budget
function releaseFundRemainingToBudget(fundId) {
  triggerHaptic(10);
  const fund = (state.projects || []).find((p) => p.id === fundId);
  if (!fund) return;

  const target = parseFloat(fund.target_amount) || 0;
  const spent = parseFloat(fund.spent_amount) || 0;
  const remaining = Math.max(0, target - spent);
  const isZh = state.lang === 'zh';

  showConfirmModal({
    title: isZh ? '确认提前释放结余？' : 'Release Remaining Balance?',
    subtitle: fund.title,
    desc: isZh
      ? `当前专款预留 ${state.currency} ${formatNumber(target)}，实际已用 ${state.currency} ${formatNumber(spent)}。提前释放后，剩余未用的 ${state.currency} ${formatNumber(remaining)} 将立即归还回日常月度预算，专款将标为已结清。`
      : `Reserved ${state.currency} ${formatNumber(target)}, spent ${state.currency} ${formatNumber(spent)}. The remaining ${state.currency} ${formatNumber(remaining)} will be returned to your monthly daily budget and the fund marked as settled.`,
    confirmText: isZh ? '确认释放并结清' : 'Release & Settle',
    danger: false,
    onConfirm: async () => {
      fund.target_amount = spent;
      fund.status = 'settled';
      saveProjects(state.projects);
      renderSinkingFunds();
      renderBudgetTracker();
      updateProjectDropdownOptions();

      if (supabaseClient && state.user?.id) {
        try {
          await supabaseClient
            .from('projects')
            .update({
              target_amount: spent,
              status: 'settled',
              updated_at: new Date().toISOString(),
            })
            .eq('id', fundId)
            .eq('user_id', state.user.id);
        } catch (e) {}
      }

      try {
        await fetch('/api/projects/' + fundId + '/release', {
          method: 'PATCH',
          headers: getAuthHeaders(),
        });
      } catch (e) {}
      showToast(
        isZh
          ? `结余 ${state.currency} ${formatNumber(remaining)} 已释放回日常预算`
          : `Released ${state.currency} ${formatNumber(remaining)} back to daily budget`,
      );
    },
  });
}

function settleFund(fundId) {
  triggerHaptic(10);
  const fund = (state.projects || []).find((p) => p.id === fundId);
  if (!fund) return;
  const isZh = state.lang === 'zh';

  showConfirmModal({
    title: isZh ? '确认结案平账？' : 'Settle Sinking Fund?',
    subtitle: fund.title,
    desc: isZh
      ? `确定要将专款【${fund.title}】结案平账吗？平账后此项目将正式归档。`
      : `Are you sure you want to settle and archive "${fund.title}"?`,
    confirmText: isZh ? '确认结案' : 'Settle Fund',
    danger: false,
    onConfirm: async () => {
      fund.status = 'settled';
      saveProjects(state.projects);
      renderSinkingFunds();
      renderBudgetTracker();
      updateProjectDropdownOptions();

      if (supabaseClient && state.user?.id) {
        try {
          await supabaseClient
            .from('projects')
            .update({
              status: 'settled',
              updated_at: new Date().toISOString(),
            })
            .eq('id', fundId)
            .eq('user_id', state.user.id);
        } catch (e) {}
      }

      try {
        await fetch('/api/projects/' + fundId + '/settle', {
          method: 'PATCH',
          headers: getAuthHeaders(),
        });
      } catch (e) {}
      triggerHaptic(15);
      showToast(
        isZh
          ? `专款【${fund.title}】已结案平账`
          : `Fund "${fund.title}" settled`,
      );
    },
  });
}

function deleteProject(fundId) {
  triggerHaptic(10);
  const fund = (state.projects || []).find((p) => p.id === fundId);
  if (!fund) return;

  const remaining = Math.max(0, fund.target_amount - fund.spent_amount);
  const isZh = state.lang === 'zh';

  showConfirmModal({
    title: isZh ? '确认撤销该专款？' : 'Delete Sinking Fund?',
    subtitle: fund.title,
    desc: isZh
      ? `确定要撤销【${fund.title}】专款吗？撤销后，剩余未用的 ${state.currency} ${formatNumber(remaining)} 将原路释放回日常预算，已产生的流水不受影响。`
      : `Delete "${fund.title}"? Any unused ${state.currency} ${formatNumber(remaining)} will be returned to your daily budget. Existing transactions remain intact.`,
    confirmText: isZh ? '确认撤销' : 'Delete Fund',
    danger: true,
    onConfirm: async () => {
      addDeletedId(getDeletedProjectsStorageKey(), fundId);
      state.projects = (state.projects || []).filter((p) => p.id !== fundId);
      saveProjects(state.projects);
      renderSinkingFunds();
      renderBudgetTracker();
      updateProjectDropdownOptions();

      if (supabaseClient && state.user?.id) {
        try {
          await supabaseClient
            .from('projects')
            .delete()
            .eq('id', fundId)
            .eq('user_id', state.user.id);
        } catch (e) {}
      }

      try {
        await fetch('/api/projects/' + fundId, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
      } catch (e) {}
      triggerHaptic(15);
      showToast(isZh ? '专款已撤销' : 'Sinking fund deleted');
    },
  });
}

// Claims Actions
async function toggleClaimFriendPaid(claimId, friendIdx) {
  triggerHaptic(12);
  const claim = (state.claims || []).find((c) => c.id === claimId);
  if (!claim || !claim.friends?.[friendIdx]) return;

  const friend = claim.friends[friendIdx];
  friend.paid = !friend.paid;
  saveClaims(state.claims);
  renderClaims();

  if (supabaseClient && state.user?.id) {
    try {
      await supabaseClient
        .from('claims')
        .update({
          friends: claim.friends,
          updated_at: new Date().toISOString(),
        })
        .eq('id', claimId)
        .eq('user_id', state.user.id);
    } catch (e) {}
  }

  try {
    await fetch(`/api/claims/${claimId}/friend/${friendIdx}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
  } catch (e) {}

  const isZh = state.lang === 'zh';
  const statusMsg = friend.paid
    ? isZh
      ? `已收到 ${friend.name} 的 ${state.currency} ${formatNumber(friend.amount)}`
      : `Received ${state.currency} ${formatNumber(friend.amount)} from ${friend.name}`
    : isZh
      ? `已标记为待收`
      : `Marked as pending`;
  showToast(statusMsg);
}

function settleAllClaim(claimId) {
  triggerHaptic(15);
  const claim = (state.claims || []).find((c) => c.id === claimId);
  if (!claim) return;
  const isZh = state.lang === 'zh';

  showConfirmModal({
    title: isZh ? '确认全额结清？' : 'Mark All as Settled?',
    subtitle: claim.title,
    desc: isZh
      ? '确定要将此笔账单的所有分摊款项标记为全额结清吗？'
      : 'Mark all friend shares on this split bill as paid and settled?',
    confirmText: isZh ? '确认结清' : 'Settle All',
    danger: false,
    onConfirm: async () => {
      (claim.friends || []).forEach((f) => {
        f.paid = true;
      });
      claim.status = 'settled';
      saveClaims(state.claims);
      renderClaims();

      if (supabaseClient && state.user?.id) {
        try {
          await supabaseClient
            .from('claims')
            .update({
              friends: claim.friends,
              status: 'settled',
              updated_at: new Date().toISOString(),
            })
            .eq('id', claimId)
            .eq('user_id', state.user.id);
        } catch (e) {}
      }

      try {
        await fetch(`/api/claims/${claimId}/settle-all`, {
          method: 'PATCH',
          headers: getAuthHeaders(),
        });
      } catch (e) {}
      showToast(
        isZh ? '该笔代垫款项已全额结清' : 'All shares marked as settled',
      );
    },
  });
}

function deleteClaim(claimId) {
  triggerHaptic(10);
  const claim = (state.claims || []).find((c) => c.id === claimId);
  if (!claim) return;
  const isZh = state.lang === 'zh';

  showConfirmModal({
    title: isZh ? '确认删除该待收账单？' : 'Delete Split Bill Claim?',
    subtitle: claim.title,
    desc: isZh
      ? '确定要删除此笔代垫记录吗？此操作不可撤销。'
      : 'Are you sure you want to delete this split bill claim? This cannot be undone.',
    confirmText: isZh ? '确认删除' : 'Delete Claim',
    danger: true,
    onConfirm: async () => {
      addDeletedId(getDeletedClaimsStorageKey(), claimId);
      state.claims = (state.claims || []).filter((c) => c.id !== claimId);
      saveClaims(state.claims);
      renderClaims();

      if (supabaseClient && state.user?.id) {
        try {
          await supabaseClient
            .from('claims')
            .delete()
            .eq('id', claimId)
            .eq('user_id', state.user.id);
        } catch (e) {}
      }

      try {
        await fetch(`/api/claims/${claimId}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
      } catch (e) {}
      showToast(isZh ? '已删除待收账单' : 'Claim deleted');
    },
  });
}

// Budget Top-Up Management (History, Add, Delete)
function renderBudgetTopupHistory() {
  const container = document.getElementById('budgetTopupHistoryContainer');
  if (!container) return;

  const month =
    state.currentMonth === 'all' ? getCurrentMonthKey() : state.currentMonth;
  const topups =
    state.budgetTopUps && Array.isArray(state.budgetTopUps[month])
      ? state.budgetTopUps[month]
      : [];

  const sym = state.currency || 'RM';
  const isZh = state.lang === 'zh';

  if (topups.length === 0) {
    container.innerHTML = `
      <div class="topup-history-empty" style="text-align: center; padding: 12px 8px; color: var(--text-muted); font-size: 0.8rem;">
        ${isZh ? '本月暂无追加记录' : 'No budget top-ups this month'}
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); margin: 16px 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">
      ${isZh ? `本月已追加记录 (${topups.length})` : `Top-Up History (${topups.length})`}
    </div>
    <div class="topup-history-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 180px; overflow-y: auto;">
      ${topups
        .map(
          (item) => `
        <div class="topup-history-item" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: var(--bg-surface); border: 1px solid var(--border-card); border-radius: 8px;">
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <strong style="font-size: 0.85rem; color: var(--text-primary); font-weight: 600;">${escapeHtml(item.reason || (isZh ? '临时追加额度' : 'Temporary Top-Up'))}</strong>
            <span style="font-size: 0.72rem; color: var(--text-muted);">${escapeHtml((item.date || '').slice(0, 10))}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-weight: 700; color: #16a34a; font-family: var(--font-mono, monospace); font-size: 0.9rem;">+ ${sym} ${formatNumber(item.amount)}</span>
            <button type="button" class="btn-del-topup" onclick="deleteBudgetTopup('${item.id}')" title="${isZh ? '删除此笔追加' : 'Delete top-up'}" style="background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; transition: all 0.15s ease;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `,
        )
        .join('')}
    </div>
  `;
}

function deleteBudgetTopup(topupId) {
  triggerHaptic(10);
  const month =
    state.currentMonth === 'all' ? getCurrentMonthKey() : state.currentMonth;
  const topups = state.budgetTopUps || {};
  if (!Array.isArray(topups[month])) return;

  const idx = topups[month].findIndex((t) => t.id === topupId);
  if (idx === -1) return;

  const [removed] = topups[month].splice(idx, 1);
  saveBudgetTopUps(topups);
  triggerHaptic(15);
  showToast(
    state.lang === 'zh'
      ? `已删除追加预算 ${state.currency} ${formatNumber(removed.amount)}`
      : `Removed budget top-up of ${state.currency} ${formatNumber(removed.amount)}`,
  );
  renderBudgetTopupHistory();
  renderBudgetTracker();
}

function openTopupBudgetModal() {
  triggerHaptic(10);
  if (!elements.topupBudgetModal) return;
  if (elements.budgetTopupAmountInput)
    elements.budgetTopupAmountInput.value = '300';
  if (elements.budgetTopupReasonInput)
    elements.budgetTopupReasonInput.value = '';
  renderBudgetTopupHistory();
  elements.topupBudgetModal.classList.remove('hidden');
  pushModalHistoryState();
}

function closeTopupBudgetModal() {
  triggerHaptic(10);
  elements.topupBudgetModal?.classList.add('hidden');
  popModalHistoryIfCleared();
}

function saveBudgetTopup() {
  const isZh = state.lang === 'zh';
  const amount = parseFloat(elements.budgetTopupAmountInput?.value) || 0;
  const reason =
    (elements.budgetTopupReasonInput?.value || '').trim() ||
    (isZh ? '临时追加额度' : 'Temporary Top-Up');
  const month =
    state.currentMonth === 'all' ? getCurrentMonthKey() : state.currentMonth;

  if (amount <= 0) {
    return showToast(
      isZh ? '请输入有效的追加金额' : 'Please enter a valid top-up amount',
      true,
    );
  }

  const topups = state.budgetTopUps || {};
  if (!Array.isArray(topups[month])) topups[month] = [];

  topups[month].push({
    id: 'topup_' + Date.now(),
    amount: amount,
    reason: reason,
    date: new Date().toISOString(),
  });

  saveBudgetTopUps(topups);
  triggerHaptic(15);
  closeTopupBudgetModal();
  showToast(
    isZh
      ? `已为本月追加预算 ${state.currency} ${formatNumber(amount)}`
      : `Added ${state.currency} ${formatNumber(amount)} to monthly budget`,
  );
  renderBudgetTracker();
}

// Safe Action Confirmation Modal
let currentConfirmCallback = null;
function showConfirmModal({
  title,
  subtitle,
  desc,
  onConfirm,
  confirmText,
  danger,
}) {
  if (!elements.confirmActionModal) return;
  const isZh = state.lang === 'zh';
  if (elements.confirmModalTitle)
    elements.confirmModalTitle.textContent =
      title || (isZh ? '请确认' : 'Please Confirm');
  if (elements.confirmModalSub)
    elements.confirmModalSub.textContent = subtitle || '';
  if (elements.confirmModalDesc)
    elements.confirmModalDesc.textContent = desc || '';
  if (elements.proceedConfirmBtn) {
    elements.proceedConfirmBtn.textContent =
      confirmText || (isZh ? '确认' : 'Confirm');
    elements.proceedConfirmBtn.className = danger
      ? 'btn-modal-danger'
      : 'btn-modal-primary';
  }
  currentConfirmCallback = onConfirm;
  elements.confirmActionModal.classList.remove('hidden');
  pushModalHistoryState();
}

function closeConfirmModal() {
  triggerHaptic(10);
  elements.confirmActionModal?.classList.add('hidden');
  currentConfirmCallback = null;
  popModalHistoryIfCleared();
}

// Populate Project Select in Transaction Creation Modal
function updateProjectDropdownOptions() {
  const select = elements.entryProjectSelect;
  if (!select) return;

  const isZh = state.lang === 'zh';
  const activeFunds = (state.projects || []).filter(
    (p) => p.status === 'active',
  );
  select.innerHTML =
    `<option value="">${isZh ? '-- 无关联 (日常生活预算) --' : '-- None (Daily Budget) --'}</option>` +
    activeFunds
      .map(
        (f) =>
          `<option value="${f.id}">${escapeHtml(f.title)} (${
            f.mode === 'budget_deduct'
              ? isZh
                ? '从本月预算扣除'
                : 'From Monthly Budget'
              : isZh
                ? '额外专项'
                : 'Extra Fund'
          })</option>`,
      )
      .join('');
}

// Add a Dynamic Friend Row in Split Bill Drawer
function addSplitFriendRow(defaultName = '', defaultAmount = '') {
  const list = elements.splitFriendsList;
  if (!list) return;

  const row = document.createElement('div');
  row.className = 'split-friend-row';
  row.innerHTML = `
    <input type="text" placeholder="${t('friend_name_placeholder')}" value="${escapeHtml(defaultName)}" class="clean-form-input friend-name-input" style="flex: 2;" required />
    <div style="display: flex; align-items: center; gap: 4px; flex: 1.5;">
      <span class="currency-sym">RM</span>
      <input type="number" step="0.01" min="0" placeholder="0.00" value="${defaultAmount}" class="clean-form-input friend-amount-input" required />
    </div>
    <button type="button" class="btn-friend-delete" title="Remove">&times;</button>
  `;

  row.querySelector('.btn-friend-delete').addEventListener('click', () => {
    row.remove();
  });

  list.appendChild(row);
}

// Setup Event Listeners for the Projects & Claims Module
function setupProjectsModuleEventListeners() {
  // 1. Projects Page Segmented Switch
  elements.tabSinkingFundsBtn?.addEventListener('click', () => {
    triggerHaptic(10);
    elements.tabSinkingFundsBtn.classList.add('active');
    elements.tabClaimsBtn?.classList.remove('active');
    elements.sinkingFundsView?.classList.remove('hidden');
    elements.claimsView?.classList.add('hidden');
    renderSinkingFunds();
  });

  elements.tabClaimsBtn?.addEventListener('click', () => {
    triggerHaptic(10);
    elements.tabClaimsBtn.classList.add('active');
    elements.tabSinkingFundsBtn?.classList.remove('active');
    elements.claimsView?.classList.remove('hidden');
    elements.sinkingFundsView?.classList.add('hidden');
    renderClaims();
  });

  // 2. New Project Modal Triggers
  elements.openNewProjectBtn?.addEventListener('click', openNewProjectModal);
  elements.closeNewProjectModalBtn?.addEventListener(
    'click',
    closeNewProjectModal,
  );
  elements.cancelNewProjectBtn?.addEventListener('click', closeNewProjectModal);
  elements.newProjectModal?.addEventListener('click', (e) => {
    if (e.target === elements.newProjectModal) closeNewProjectModal();
  });
  elements.saveNewProjectBtn?.addEventListener('click', saveNewProject);

  elements.btnModeBudgetDeduct?.addEventListener('click', () => {
    triggerHaptic(8);
    elements.btnModeBudgetDeduct.classList.add('active');
    elements.btnModeExtraFund?.classList.remove('active');
  });

  elements.btnModeExtraFund?.addEventListener('click', () => {
    triggerHaptic(8);
    elements.btnModeExtraFund.classList.add('active');
    elements.btnModeBudgetDeduct?.classList.remove('active');
  });

  // 3. Budget Top-up Triggers
  elements.quickTopupBudgetBtn?.addEventListener('click', openTopupBudgetModal);
  elements.closeTopupBudgetModalBtn?.addEventListener(
    'click',
    closeTopupBudgetModal,
  );
  elements.cancelTopupBudgetBtn?.addEventListener(
    'click',
    closeTopupBudgetModal,
  );
  elements.topupBudgetModal?.addEventListener('click', (e) => {
    if (e.target === elements.topupBudgetModal) closeTopupBudgetModal();
  });
  elements.saveTopupBudgetBtn?.addEventListener('click', saveBudgetTopup);

  // 4. Safe Confirmation Modal Triggers
  elements.closeConfirmModalBtn?.addEventListener('click', closeConfirmModal);
  elements.cancelConfirmBtn?.addEventListener('click', closeConfirmModal);
  elements.confirmActionModal?.addEventListener('click', (e) => {
    if (e.target === elements.confirmActionModal) closeConfirmModal();
  });
  elements.proceedConfirmBtn?.addEventListener('click', async () => {
    if (typeof currentConfirmCallback === 'function') {
      const cb = currentConfirmCallback;
      currentConfirmCallback = null;
      await cb();
    }
    closeConfirmModal();
  });

  // 5. Create Transaction Advanced Toggles
  elements.toggleFundLinkBtn?.addEventListener('click', () => {
    triggerHaptic(10);
    const isOpen = !elements.sinkingFundDrawer?.classList.contains('hidden');
    elements.sinkingFundDrawer?.classList.toggle('hidden', isOpen);
    elements.toggleFundLinkBtn?.classList.toggle('active', !isOpen);
  });

  elements.toggleSplitBillBtn?.addEventListener('click', () => {
    triggerHaptic(10);
    const isOpen = !elements.splitBillDrawer?.classList.contains('hidden');
    elements.splitBillDrawer?.classList.toggle('hidden', isOpen);
    elements.toggleSplitBillBtn?.classList.toggle('active', !isOpen);

    if (
      !isOpen &&
      elements.splitFriendsList &&
      elements.splitFriendsList.children.length === 0
    ) {
      addSplitFriendRow();
    }
  });

  elements.addFriendRowBtn?.addEventListener('click', () => {
    triggerHaptic(8);
    addSplitFriendRow();
  });

  elements.openNewClaimBtn?.addEventListener('click', openCreateModalWithSplit);

  // Refresh current local date, relative day tags, and streak when returning from background across midnight
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      if (
        elements.inputDate &&
        (!elements.createEntryModal ||
          elements.createEntryModal.classList.contains('hidden'))
      ) {
        elements.inputDate.value = getLocalDateString();
      }
      renderTable();
      renderStreakAndBadges();
      updateAccountModalData();
    }
  });
}

// Start Application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
