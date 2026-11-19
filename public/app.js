/**
 * ============================================================================
 * MonetaX — Client Application Engine (Minimalist Pro Max Edition)
 * Pure Vanilla JavaScript • Multi-Page Mobile Architecture • Bilingual (EN/中文)
 * ============================================================================
 */
// Current Client Release Version
const APP_VERSION = '1.5.8';

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
  camera: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`,
  receipt: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>`,
  download: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  archive: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"></rect><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path><path d="M10 12h4"></path></svg>`,
  copy: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>`,
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

function getCurrentMonthKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// Application State
let state = {
  user: null,
  lang: localStorage.getItem('ledger_lang') || 'zh',
  activePage: 'ledger',
  currency: localStorage.getItem('ledger_currency') || 'RM',
  currentType: 'expense',
  currentFilter: 'all',
  currentMonth: getCurrentMonthKey(),
  lastActiveMonth: getCurrentMonthKey(),
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
  activeProjectId: null,
  editingProjectEntryId: null,
  selectedProjectEntryCategory: 'Food & Dining',
  selectedProjectEntryAccount: 'Cash',
  pendingProjectReceiptDataUrl: null,
  pendingProjectReceiptSizeKb: 0,
  entryDestination: 'daily',
  selectedEntryFundId: null,
  newProjectTimeframe: 'indefinite',
  editProjectTimeframe: 'indefinite',
  editingClaimId: null,
  claimsSettledExpanded: false,
  lastClaimReceiveMethod: 'eWallet',
  pendingClaimReceiveAction: null,
  selectedAccountsMonth: 'current',
  editingRecordId: null,
  pendingReceiptDataUrl: null,
  pendingReceiptSizeKb: 0,
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
  budgetCombinedOverview: document.getElementById('budgetCombinedOverview'),
  budgetCombinedFormula: document.getElementById('budgetCombinedFormula'),
  budgetCombinedUsage: document.getElementById('budgetCombinedUsage'),
  budgetFundsSection: document.getElementById('budgetFundsSection'),
  budgetFundsCountBadge: document.getElementById('budgetFundsCountBadge'),
  budgetFundsSummaryText: document.getElementById('budgetFundsSummaryText'),
  budgetFundsList: document.getElementById('budgetFundsList'),
  entryDestinationWrap: document.getElementById('entryDestinationWrap'),
  btnDestDaily: document.getElementById('btnDestDaily'),
  btnDestFund: document.getElementById('btnDestFund'),
  entryFundTargetPicker: document.getElementById('entryFundTargetPicker'),
  entryFundCardsGrid: document.getElementById('entryFundCardsGrid'),
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
  newProjectIncludeBudgetCheck: document.getElementById(
    'newProjectIncludeBudgetCheck',
  ),
  newProjectTimeframePills: document.getElementById('newProjectTimeframePills'),
  newProjectDatesRow: document.getElementById('newProjectDatesRow'),
  newProjectStartInput: document.getElementById('newProjectStartInput'),
  newProjectDeadlineInput: document.getElementById('newProjectDeadlineInput'),
  newProjectTimeframeHint: document.getElementById('newProjectTimeframeHint'),
  projectDetailModal: document.getElementById('projectDetailModal'),
  closeProjectDetailModalBtn: document.getElementById(
    'closeProjectDetailModalBtn',
  ),
  projectDetailTitle: document.getElementById('projectDetailTitle'),
  projectDetailStatusBadge: document.getElementById('projectDetailStatusBadge'),
  toggleEditProjectMetaBtn: document.getElementById('toggleEditProjectMetaBtn'),
  projectMetaEditPanel: document.getElementById('projectMetaEditPanel'),
  projectDetailEditTitle: document.getElementById('projectDetailEditTitle'),
  projectDetailEditTarget: document.getElementById('projectDetailEditTarget'),
  editProjectIncludeBudgetCheck: document.getElementById(
    'editProjectIncludeBudgetCheck',
  ),
  editProjectTimeframePills: document.getElementById(
    'editProjectTimeframePills',
  ),
  editProjectDatesRow: document.getElementById('editProjectDatesRow'),
  editProjectStartInput: document.getElementById('editProjectStartInput'),
  editProjectDeadlineInput: document.getElementById('editProjectDeadlineInput'),
  cancelProjectMetaBtn: document.getElementById('cancelProjectMetaBtn'),
  saveProjectMetaBtn: document.getElementById('saveProjectMetaBtn'),
  projectDetailTargetVal: document.getElementById('projectDetailTargetVal'),
  projectDetailSpentVal: document.getElementById('projectDetailSpentVal'),
  projectDetailOutcomeLabel: document.getElementById(
    'projectDetailOutcomeLabel',
  ),
  projectDetailOutcomeVal: document.getElementById('projectDetailOutcomeVal'),
  projectDetailProgressFill: document.getElementById(
    'projectDetailProgressFill',
  ),
  projectEntryForm: document.getElementById('projectEntryForm'),
  projectEntryCategoryGrid: document.getElementById('projectEntryCategoryGrid'),
  projectEntryAccountGrid: document.getElementById('projectEntryAccountGrid'),
  projectEntryTitleInput: document.getElementById('projectEntryTitleInput'),
  projectEntryAmountInput: document.getElementById('projectEntryAmountInput'),
  projectEntryDateInput: document.getElementById('projectEntryDateInput'),
  triggerProjectReceiptBtn: document.getElementById('triggerProjectReceiptBtn'),
  projectReceiptFileInput: document.getElementById('projectReceiptFileInput'),
  projectReceiptPreviewDrawer: document.getElementById(
    'projectReceiptPreviewDrawer',
  ),
  previewProjectReceiptThumbWrap: document.getElementById(
    'previewProjectReceiptThumbWrap',
  ),
  projectReceiptPreviewImg: document.getElementById('projectReceiptPreviewImg'),
  projectReceiptPreviewMeta: document.getElementById(
    'projectReceiptPreviewMeta',
  ),
  removeProjectReceiptBtn: document.getElementById('removeProjectReceiptBtn'),
  cancelProjectEntryEditBtn: document.getElementById(
    'cancelProjectEntryEditBtn',
  ),
  saveProjectEntryBtn: document.getElementById('saveProjectEntryBtn'),
  projectSettledNotice: document.getElementById('projectSettledNotice'),
  projectEntriesCountLabel: document.getElementById('projectEntriesCountLabel'),
  projectEntriesList: document.getElementById('projectEntriesList'),
  detailDeleteProjectBtn: document.getElementById('detailDeleteProjectBtn'),
  detailCompleteProjectBtn: document.getElementById('detailCompleteProjectBtn'),
  detailResumeProjectBtn: document.getElementById('detailResumeProjectBtn'),

  // Edit Claim Modal Elements
  editClaimModal: document.getElementById('editClaimModal'),
  closeEditClaimModalBtn: document.getElementById('closeEditClaimModalBtn'),
  editClaimTitleInput: document.getElementById('editClaimTitleInput'),
  editClaimTotalInput: document.getElementById('editClaimTotalInput'),
  editClaimDateInput: document.getElementById('editClaimDateInput'),
  editClaimFriendsList: document.getElementById('editClaimFriendsList'),
  editClaimSplitEvenlyBtn: document.getElementById('editClaimSplitEvenlyBtn'),
  addEditClaimFriendBtn: document.getElementById('addEditClaimFriendBtn'),
  editClaimMyShareInput: document.getElementById('editClaimMyShareInput'),
  editClaimOverSumWarn: document.getElementById('editClaimOverSumWarn'),
  deleteClaimInModalBtn: document.getElementById('deleteClaimInModalBtn'),
  cancelEditClaimBtn: document.getElementById('cancelEditClaimBtn'),
  saveEditClaimBtn: document.getElementById('saveEditClaimBtn'),

  // Claim Receive Method Modal Elements
  claimReceiveModal: document.getElementById('claimReceiveModal'),
  closeClaimReceiveModalBtn: document.getElementById(
    'closeClaimReceiveModalBtn',
  ),
  claimReceiveModalSub: document.getElementById('claimReceiveModalSub'),
  claimReceiveMethodGrid: document.getElementById('claimReceiveMethodGrid'),
  confirmClaimReceiveBtn: document.getElementById('confirmClaimReceiveBtn'),

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
  toggleSplitBillBtn: document.getElementById('toggleSplitBillBtn'),
  splitBillDrawer: document.getElementById('splitBillDrawer'),
  splitMyShareInput: document.getElementById('splitMyShareInput'),
  splitCalcFormula: document.getElementById('splitCalcFormula'),
  splitOverSumWarn: document.getElementById('splitOverSumWarn'),
  splitEvenlyBtn: document.getElementById('splitEvenlyBtn'),
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

  // Receipt Photo Upload & Lightbox Elements
  triggerReceiptUploadBtn: document.getElementById('triggerReceiptUploadBtn'),
  receiptFileInput: document.getElementById('receiptFileInput'),
  receiptPreviewDrawer: document.getElementById('receiptPreviewDrawer'),
  previewReceiptThumbWrap: document.getElementById('previewReceiptThumbWrap'),
  receiptPreviewImg: document.getElementById('receiptPreviewImg'),
  receiptPreviewMeta: document.getElementById('receiptPreviewMeta'),
  removeReceiptBtn: document.getElementById('removeReceiptBtn'),
  receiptLightboxModal: document.getElementById('receiptLightboxModal'),
  receiptLightboxBackdrop: document.getElementById('receiptLightboxBackdrop'),
  receiptLightboxFrame: document.getElementById('receiptLightboxFrame'),
  closeReceiptLightboxBtn: document.getElementById('closeReceiptLightboxBtn'),
  downloadReceiptLightboxBtn: document.getElementById(
    'downloadReceiptLightboxBtn',
  ),
  zoomInReceiptBtn: document.getElementById('zoomInReceiptBtn'),
  zoomOutReceiptBtn: document.getElementById('zoomOutReceiptBtn'),
  zoomResetReceiptBtn: document.getElementById('zoomResetReceiptBtn'),
  receiptLightboxImg: document.getElementById('receiptLightboxImg'),
  receiptLightboxTitle: document.getElementById('receiptLightboxTitle'),
  receiptLightboxSub: document.getElementById('receiptLightboxSub'),
  receiptRetentionBanner: document.getElementById('receiptRetentionBanner'),
  receiptRetentionBannerTitle: document.getElementById(
    'receiptRetentionBannerTitle',
  ),
  receiptRetentionBannerDesc: document.getElementById(
    'receiptRetentionBannerDesc',
  ),
  backupAndCleanReceiptsBtn: document.getElementById(
    'backupAndCleanReceiptsBtn',
  ),
  cleanReceiptsOnlyBtn: document.getElementById('cleanReceiptsOnlyBtn'),

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
      typeof navigator.vibrate === 'function' &&
      (!navigator.userActivation || navigator.userActivation.hasBeenActive)
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

  // Translate all [data-i18n-title] tooltips safely
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    const translated = key ? t(key) : '';
    if (translated) {
      el.setAttribute('title', translated);
    }
  });

  // Re-render dynamic components with new language
  renderCategoryGrid(state.currentType);
  renderAccountPicker();
  renderEntryFundCardsPicker();
  recalcSplitBillMyShare();
  updateMonthFilterDropdown(state.records);
  renderTable();
  renderBudgetTracker();
  renderSinkingFunds();
  renderClaims();
  renderBudgetTopupHistory();
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
    elements.receiptLightboxModal,
    elements.avatarLightboxModal,
    elements.confirmActionModal,
    elements.claimReceiveModal,
    elements.inAppUpdateModal,
    elements.topupBudgetModal,
    elements.editClaimModal,
    elements.projectDetailModal,
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
    elements.receiptLightboxModal &&
    !elements.receiptLightboxModal.classList.contains('hidden')
  ) {
    if (typeof closeReceiptLightbox === 'function') {
      closeReceiptLightbox(fromPopState);
    } else {
      elements.receiptLightboxModal.classList.add('hidden');
    }
    return true;
  }
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
    elements.claimReceiveModal &&
    !elements.claimReceiveModal.classList.contains('hidden')
  ) {
    closeClaimReceiveModal(fromPopState);
    return true;
  }
  if (
    elements.inAppUpdateModal &&
    !elements.inAppUpdateModal.classList.contains('hidden')
  ) {
    if (isForceUpdateRequired) return true;
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
    elements.editClaimModal &&
    !elements.editClaimModal.classList.contains('hidden')
  ) {
    closeEditClaimModal(fromPopState);
    return true;
  }
  if (
    elements.projectDetailModal &&
    !elements.projectDetailModal.classList.contains('hidden')
  ) {
    closeProjectDetailModal(fromPopState);
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

  if (target === 'ledger') {
    setTimeout(fitKpiMiniValues, 10);
  } else if (target === 'analytics') {
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
  if (elements.toggleSplitBillBtn)
    elements.toggleSplitBillBtn.classList.remove('active');
  elements.splitBillDrawer?.classList.add('hidden');
  elements.splitCalcFormula?.classList.add('hidden');
  elements.splitOverSumWarn?.classList.add('hidden');
  if (elements.splitMyShareInput) elements.splitMyShareInput.value = '';
  if (elements.splitFriendsList) elements.splitFriendsList.innerHTML = '';
  if (typeof clearPendingReceipt === 'function') {
    clearPendingReceipt();
  }

  renderCategoryGrid(state.currentType);
  renderAccountPicker();
  if (typeof setEntryDestination === 'function') {
    setEntryDestination('daily');
  }
  elements.entryDestinationWrap?.classList.toggle(
    'hidden',
    state.currentType !== 'expense',
  );
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

  // 7. Hide Split Drawer & Destination Selector during basic edit for clarity
  if (elements.toggleSplitBillBtn)
    elements.toggleSplitBillBtn.classList.remove('active');
  elements.splitBillDrawer?.classList.add('hidden');
  elements.entryDestinationWrap?.classList.add('hidden');
  state.entryDestination = 'daily';

  // 7b. Pre-fill Receipt Photo Preview if attached (skip archived placeholders)
  if (typeof clearPendingReceipt === 'function') {
    clearPendingReceipt();
  }
  if (
    record.image_url &&
    record.image_url !== 'archived' &&
    !record.image_archived
  ) {
    state.pendingReceiptDataUrl = record.image_url;
    state.pendingReceiptSizeKb = record.image_size_kb || 0;
    if (elements.receiptPreviewImg) {
      elements.receiptPreviewImg.src = record.image_url;
    }
    if (elements.receiptPreviewMeta) {
      elements.receiptPreviewMeta.textContent = record.image_size_kb
        ? `WebP · ${record.image_size_kb} KB`
        : 'WebP';
    }
    elements.receiptPreviewDrawer?.classList.remove('hidden');
    elements.triggerReceiptUploadBtn?.classList.add('active');
  }

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
  if (typeof clearPendingReceipt === 'function') {
    clearPendingReceipt();
  }
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
    const formEl = dialog.querySelector('.create-sheet-form');
    if (dialog.scrollTop > 0 || (formEl && formEl.scrollTop > 0)) return;
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
    const isKpiSym = Boolean(el.closest('.kpi-mini-val'));
    const sep = isKpiSym ? '' : ' ';
    const text = el.textContent || '';
    if (text.includes('+')) {
      el.textContent = `+${sep}${sym}`;
    } else if (text.includes('-') || text.includes('−')) {
      el.textContent = `−${sep}${sym}`;
    } else {
      el.textContent = sym;
    }
  });
  fitKpiMiniValues();
}

/**
 * Dynamically scale KPI mini card font size so full numbers & decimals are always visible without truncation.
 */
function fitKpiMiniValues() {
  const kpiVals = document.querySelectorAll('.kpi-mini-val');
  if (!kpiVals.length) return;
  kpiVals.forEach((el) => {
    el.style.fontSize = '';
    el.style.flexWrap = 'nowrap';
    const maxW = el.clientWidth;
    if (!maxW) return;

    let currentPx = parseFloat(window.getComputedStyle(el).fontSize) || 14;
    const minPx = 9.5;
    while (el.scrollWidth > maxW && currentPx > minPx) {
      currentPx = Math.max(minPx, currentPx - 0.5);
      el.style.fontSize = `${currentPx}px`;
    }
    if (el.scrollWidth > maxW) {
      el.style.flexWrap = 'wrap';
    }
  });
}
window.addEventListener('resize', fitKpiMiniValues);

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
  const showDestSwitch = type === 'expense' && !state.editingRecordId;
  elements.entryDestinationWrap?.classList.toggle('hidden', !showDestSwitch);
  if (!showDestSwitch && typeof setEntryDestination === 'function') {
    setEntryDestination('daily');
  }
  const canShowSplit =
    type === 'expense' &&
    !state.editingRecordId &&
    state.entryDestination !== 'fund';
  elements.toggleSplitBillBtn?.classList.toggle('hidden', !canShowSplit);
  if (!canShowSplit) {
    elements.toggleSplitBillBtn?.classList.remove('active');
    elements.splitBillDrawer?.classList.add('hidden');
  }
  renderCategoryGrid(type);
}

function renderEntryFundCardsPicker() {
  const container = elements.entryFundCardsGrid;
  if (!container) return;

  const isZh = state.lang === 'zh';
  const sym = state.currency || 'RM';
  const activeFunds = (state.projects || []).filter(
    (p) => p.status === 'active',
  );

  if (activeFunds.length === 0) {
    state.selectedEntryFundId = null;
    container.innerHTML = `
      <div class="entry-fund-empty-hint" style="grid-column: 1 / -1;">
        <span>${isZh ? '暂无进行中的专款卡片' : 'No active dedicated funds'}</span>
        <button type="button" class="btn-modal-secondary" onclick="closeCreateModal(); switchAppPage('projects'); openNewProjectModal();">
          ${t('btn_new_project')}
        </button>
      </div>
    `;
    return;
  }

  if (
    !state.selectedEntryFundId ||
    !activeFunds.some((f) => String(f.id) === String(state.selectedEntryFundId))
  ) {
    state.selectedEntryFundId = String(activeFunds[0].id);
  }

  container.innerHTML = activeFunds
    .map((fund) => {
      const isSelected = String(fund.id) === String(state.selectedEntryFundId);
      const target = parseFloat(fund.target_amount) || 0;
      const spent = getProjectSpentAmount(fund);
      const outcome = formatProjectOutcomeSummary(target, spent, false);
      const tf = formatProjectTimeframeBadge(fund);
      return `
        <button
          type="button"
          class="entry-fund-card-btn ${isSelected ? 'active' : ''}"
          data-entry-fund-id="${fund.id}"
        >
          <span class="entry-fund-card-name"><span class="inline-svg-icon">${SVG_ICONS.target}</span><span>${escapeHtml(fund.title)}</span></span>
          <span class="entry-fund-card-meta ${outcome.isOverBudget ? 'is-over-budget' : ''}">
            ${outcome.label} ${sym} ${outcome.absAmount} · ${tf.text}
          </span>
        </button>
      `;
    })
    .join('');

  container.querySelectorAll('.entry-fund-card-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const chosenId = btn.getAttribute('data-entry-fund-id');
      if (chosenId) {
        state.selectedEntryFundId = chosenId;
      }
      container
        .querySelectorAll('.entry-fund-card-btn')
        .forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function setEntryDestination(dest) {
  const targetDest = dest === 'fund' ? 'fund' : 'daily';
  state.entryDestination = targetDest;
  const isFund = targetDest === 'fund';

  elements.btnDestDaily?.classList.toggle('active', !isFund);
  elements.btnDestFund?.classList.toggle('active', isFund);
  elements.entryFundTargetPicker?.classList.toggle('hidden', !isFund);

  if (isFund) {
    elements.toggleSplitBillBtn?.classList.remove('active');
    elements.toggleSplitBillBtn?.classList.add('hidden');
    elements.splitBillDrawer?.classList.add('hidden');
    renderEntryFundCardsPicker();
  } else {
    elements.toggleSplitBillBtn?.classList.remove('hidden');
  }
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
      let { data, error } = await supabaseClient
        .from('budgets')
        .select('amount')
        .eq('user_id', userId)
        .eq('month', targetMonth)
        .maybeSingle();

      // If no specific budget set for this new month yet, inherit user's default base budget from cloud
      if ((!data || data.amount === null) && targetMonth !== 'default') {
        const fallbackRes = await supabaseClient
          .from('budgets')
          .select('amount')
          .eq('user_id', userId)
          .eq('month', 'default')
          .maybeSingle();
        if (!fallbackRes.error && fallbackRes.data) {
          data = fallbackRes.data;
          error = null;
        }
      }

      if (
        !error &&
        data &&
        data.amount !== null &&
        !isNaN(Number(data.amount))
      ) {
        state.monthlyBudget = Number(data.amount);
        localStorage.setItem(cacheKey, state.monthlyBudget);
        localStorage.setItem(defaultKey, state.monthlyBudget);
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
      const rowsToUpsert = [
        { user_id: userId, month: targetMonth, amount: state.monthlyBudget },
      ];
      if (targetMonth !== 'default') {
        rowsToUpsert.push({
          user_id: userId,
          month: 'default',
          amount: state.monthlyBudget,
        });
      }
      const { error } = await supabaseClient
        .from('budgets')
        .upsert(rowsToUpsert, { onConflict: 'user_id,month' });
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

  if (typeof renderBudgetFundsSection === 'function') {
    renderBudgetFundsSection(targetMonth, totalExpense, budgetLimit);
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
 * Open Receipt Lightbox by Record ID
 */
function openReceiptLightboxByRecordId(recordId) {
  const record = state.records.find((r) => String(r.id) === String(recordId));
  if (!record) return;
  if (record.image_archived || record.image_url === 'archived') {
    showToast(t('receipt_archived_toast'));
    return;
  }
  if (!record.image_url) return;

  const sym = state.currency || 'RM';
  const catLabel = getCategoryDisplayLabel(record.category);
  const titleText = `${catLabel} · ${sym} ${formatNumber(record.amount)}`;
  const cleanNote = formatRecordCleanNote(record.note);
  const subText = `${record.date}${cleanNote && cleanNote !== '—' ? ' · ' + cleanNote : ''}`;
  if (typeof openReceiptLightbox === 'function') {
    openReceiptLightbox(record.image_url, titleText, subText);
  }
}
window.openReceiptLightboxByRecordId = openReceiptLightboxByRecordId;

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

  let receiptBadgeHtml = '';
  if (record.image_archived || record.image_url === 'archived') {
    receiptBadgeHtml = `<span class="badge-receipt-archived" onclick="event.stopPropagation(); openReceiptLightboxByRecordId('${record.id}')" title="${escapeHtml(t('receipt_archived_toast'))}">${SVG_ICONS.archive}<span>${escapeHtml(t('receipt_archived_tag'))}</span></span>`;
  } else if (record.image_url) {
    receiptBadgeHtml = `<span class="badge-receipt-photo" onclick="event.stopPropagation(); openReceiptLightboxByRecordId('${record.id}')" title="${escapeHtml(t('view_receipt'))}">${SVG_ICONS.receipt}</span>`;
  }

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
        ${renderRecordSourceBadgeHtml(record)}${escapeHtml(formatRecordCleanNote(record.note))}${receiptBadgeHtml}
      </td>
      <td class="col-amount text-right ${amountClass}">
        ${sign}${formatNumber(record.amount)}
      </td>
      <td class="col-actions text-center" onclick="event.stopPropagation()">
        <button type="button" class="btn-del" onclick="event.stopPropagation(); handleDelete('${record.id}')" title="Delete" aria-label="Delete">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
    const isFiltered = Boolean(
      state.searchQuery ||
      (state.selectedAccountFilter && state.selectedAccountFilter !== 'all'),
    );
    const emptyTextEl = elements.emptyState?.querySelector('.empty-text');
    if (emptyTextEl) {
      emptyTextEl.textContent = isFiltered
        ? state.lang === 'zh'
          ? '未找到匹配的账单'
          : 'No matching records found'
        : t('empty_records');
    }
    elements.emptyCreateBtn?.classList.toggle('hidden', isFiltered);

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
  const previousImageUrl = record.image_url || null;
  const previousNote = record.note || '';

  const tagRegex = new RegExp(
    '^(\\[(?:🎯|👥|专款:|AA分摊:|代垫:)[^\\]]+\\])\\s*',
  );
  const tagMatch = previousNote.match(tagRegex);
  if (tagMatch) {
    const rawNewNote = (updatedPayload.note || '').trim();
    const cleanNewNote =
      rawNewNote === '—' || rawNewNote === '-' ? '' : rawNewNote;
    if (!cleanNewNote.startsWith(tagMatch[1])) {
      updatedPayload.note = cleanNewNote
        ? `${tagMatch[1]} ${cleanNewNote}`
        : tagMatch[1];
    }
  }
  if (
    updatedPayload.image_url &&
    String(updatedPayload.image_url).startsWith('data:image/') &&
    typeof uploadReceiptToCloud === 'function'
  ) {
    updatedPayload.image_url = await uploadReceiptToCloud(
      updatedPayload.image_url,
    );
  }

  if (
    previousImageUrl &&
    previousImageUrl !== updatedPayload.image_url &&
    typeof deleteReceiptFromCloud === 'function'
  ) {
    deleteReceiptFromCloud(previousImageUrl).catch(() => {});
  }

  record.type = updatedPayload.type;
  record.amount = updatedPayload.amount;
  record.category = updatedPayload.category;
  record.account_name = updatedPayload.account_name;
  record.date = updatedPayload.date;
  record.note = updatedPayload.note || '';
  // Reset archived flag when a new receipt photo is attached; otherwise preserve it
  const nextImageUrl =
    updatedPayload.image_url !== undefined ? updatedPayload.image_url : null;
  const nextImageArchived = nextImageUrl
    ? false
    : Boolean(record.image_archived);
  record.image_url = nextImageUrl;
  record.image_size_kb = updatedPayload.image_size_kb || 0;
  record.image_archived = nextImageArchived;
  updatedPayload.image_archived = nextImageArchived;

  try {
    const receiptMapKey = getLocalReceiptMapKey();
    const localReceipts = JSON.parse(
      localStorage.getItem(receiptMapKey) || '{}',
    );
    const normDate =
      normalizeRecordDateYMD(updatedPayload.date) || updatedPayload.date || '';
    const fallbackKey = `${normDate}_${updatedPayload.type}_${Number(updatedPayload.amount)}_${updatedPayload.category}`;
    if (record.image_url) {
      const entry = {
        image_url: record.image_url,
        image_size_kb: record.image_size_kb,
        image_archived: false,
      };
      localReceipts[String(editingId)] = entry;
      localReceipts[fallbackKey] = entry;
    } else if (nextImageArchived) {
      const entry = {
        image_url: null,
        image_size_kb: 0,
        image_archived: true,
      };
      localReceipts[String(editingId)] = entry;
      localReceipts[fallbackKey] = entry;
    } else {
      delete localReceipts[String(editingId)];
      delete localReceipts[fallbackKey];
    }
    localStorage.setItem(receiptMapKey, JSON.stringify(localReceipts));
  } catch (e) {}

  if (String(editingId).startsWith('draft-')) {
    let queue = getOfflineQueue();
    const qIdx = queue.findIndex(
      (item) => String(item.id) === String(editingId),
    );
    if (qIdx !== -1) {
      // Merge edits into nested payload so syncOfflineDrafts() uploads latest values
      queue[qIdx] = {
        ...queue[qIdx],
        payload: {
          ...(queue[qIdx].payload || {}),
          ...updatedPayload,
          note: updatedPayload.note || undefined,
        },
      };
      saveOfflineQueue(queue);
    }
  }

  if (
    supabaseClient &&
    state.user?.id &&
    !String(editingId).startsWith('draft-')
  ) {
    const baseUpdate = {
      type: updatedPayload.type,
      amount: updatedPayload.amount,
      category: updatedPayload.category,
      account_name: updatedPayload.account_name,
      date: updatedPayload.date,
      note: updatedPayload.note || null,
    };
    let { error } = await supabaseClient
      .from('records')
      .update({
        ...baseUpdate,
        image_url: updatedPayload.image_url || null,
        image_size_kb: updatedPayload.image_size_kb || 0,
        image_archived: nextImageArchived,
      })
      .eq('id', editingId)
      .eq('user_id', state.user.id);

    // Graceful fallback if Supabase schema columns have not been migrated yet
    if (error && error.message?.includes('image_')) {
      const retry = await supabaseClient
        .from('records')
        .update(baseUpdate)
        .eq('id', editingId)
        .eq('user_id', state.user.id);
      error = retry.error;
    }
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
  if (typeof checkTwoYearReceiptRetention === 'function') {
    checkTwoYearReceiptRetention();
  }
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
    image_url: state.pendingReceiptDataUrl || null,
    image_size_kb: state.pendingReceiptSizeKb || 0,
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

  // Branch: Expense logged directly into a Dedicated Project Fund (Plan 1: kept strictly separate from daily records)
  if (state.currentType === 'expense' && state.entryDestination === 'fund') {
    const isZh = state.lang === 'zh';
    const targetFund = (state.projects || []).find(
      (p) =>
        p.status === 'active' &&
        String(p.id) === String(state.selectedEntryFundId),
    );
    if (!targetFund) {
      showToast(
        isZh
          ? '请先选择或创建一个进行中的专款对象'
          : 'Please select or create an active dedicated fund first',
        true,
      );
      return;
    }

    try {
      elements.submitBtn.disabled = true;
      elements.submitBtn.style.opacity = '0.7';

      let nextImageUrl = payload.image_url || null;
      const nextImageSizeKb = payload.image_size_kb || 0;
      if (
        nextImageUrl &&
        String(nextImageUrl).startsWith('data:image/') &&
        typeof uploadReceiptToCloud === 'function'
      ) {
        nextImageUrl = await uploadReceiptToCloud(nextImageUrl);
      }

      const entries = normalizeProjectEntries(targetFund.entries);
      if (
        entries.length === 0 &&
        (parseFloat(targetFund.spent_amount) || 0) > 0
      ) {
        entries.push({
          id: 'pentry_legacy_' + Date.now(),
          title: isZh ? '历史已用金额' : 'Previous Spent Balance',
          category: 'Other Expense',
          account_name: 'Cash',
          amount: Number((parseFloat(targetFund.spent_amount) || 0).toFixed(2)),
          date: getLocalDateString(),
          created_at: targetFund.created_at || new Date().toISOString(),
        });
      }

      entries.unshift({
        id:
          'pentry_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        title: (payload.note || '').trim(),
        category: payload.category || 'Other Expense',
        account_name: payload.account_name || 'Cash',
        amount: Number((parseFloat(payload.amount) || 0).toFixed(2)),
        date: payload.date || getLocalDateString(),
        image_url: nextImageUrl,
        image_size_kb: nextImageSizeKb,
        created_at: new Date().toISOString(),
      });

      targetFund.entries = entries;
      targetFund.spent_amount = getProjectSpentAmount(targetFund);

      saveProjects(state.projects);
      renderSinkingFunds();
      renderBudgetTracker();
      closeCreateModal();
      triggerHaptic(15);
      showToast(
        isZh
          ? `已记入专款【${targetFund.title}】`
          : `Added to "${targetFund.title}"`,
      );
      await syncProjectChangeToCloud(targetFund);
    } catch (err) {
      showToast(err.message || 'Save failed', true);
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

    // Check Split Bill Association
    const isSplitActive =
      elements.toggleSplitBillBtn?.classList.contains('active');

    let finalAmount = payload.amount;
    let finalNote = payload.note || '';

    if (isSplitActive) {
      // Collect friend rows first so we can validate against total paid amount
      const friendRows =
        elements.splitFriendsList?.querySelectorAll('.split-friend-row') || [];
      const friends = [];
      let rawFriendsSum = 0;
      let hasUnnamedAmountRow = false;
      friendRows.forEach((row) => {
        const name = (
          row.querySelector('.friend-name-input')?.value || ''
        ).trim();
        const amt =
          parseFloat(row.querySelector('.friend-amount-input')?.value) || 0;
        if (!name && amt > 0) {
          hasUnnamedAmountRow = true;
          return;
        }
        if (name && amt > 0) {
          rawFriendsSum += amt;
          friends.push({ name, amount: Number(amt.toFixed(2)), paid: false });
        }
      });

      if (hasUnnamedAmountRow) {
        showToast(
          state.lang === 'zh'
            ? '请填写分摊对象的名称'
            : 'Please enter a name for each split amount',
          true,
        );
        return;
      }
      if (friends.length === 0) {
        showToast(
          state.lang === 'zh'
            ? '请至少填写一位有效分摊对象及金额'
            : 'Please add at least one valid split party',
          true,
        );
        return;
      }

      if (rawFriendsSum > payload.amount + 0.001) {
        showToast(t('split_over_sum_warn'), true);
        return;
      }

      const rawMyShare = parseFloat(elements.splitMyShareInput?.value);
      const myShare = Number.isNaN(rawMyShare)
        ? Math.max(0, Number((payload.amount - rawFriendsSum).toFixed(2)))
        : Math.max(0, Number(rawMyShare.toFixed(2)));
      finalAmount = myShare;
      finalNote =
        `[AA分摊: 总付 ${state.currency || 'RM'} ${payload.amount}] ${finalNote}`.trim();

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

        // Pure advance payment (personal share = 0): do not insert a 0-amount expense record
        if (finalAmount <= 0) {
          state.pendingReceiptDataUrl = null;
          state.pendingReceiptSizeKb = 0;
          if (elements.inputAmount) elements.inputAmount.value = '';
          if (elements.inputNote) elements.inputNote.value = '';
          updateMonthFilterDropdown(state.records);
          renderClaims();
          closeCreateModal();
          triggerHaptic(15);
          showToast(
            state.lang === 'zh'
              ? `已生成全额代垫账单 ${state.currency} ${formatNumber(amount)}`
              : `Advance claim recorded (${state.currency} ${formatNumber(amount)})`,
          );
          return;
        }
      }
    }

    payload.amount = finalAmount;
    payload.note = finalNote;

    if (
      payload.image_url &&
      String(payload.image_url).startsWith('data:image/') &&
      typeof uploadReceiptToCloud === 'function'
    ) {
      payload.image_url = await uploadReceiptToCloud(payload.image_url);
    }

    if (supabaseClient && userId) {
      const baseInsert = {
        user_id: userId,
        type: payload.type,
        amount: payload.amount,
        category: payload.category,
        account_name: payload.account_name,
        date: payload.date,
        note: payload.note || null,
      };
      let { error } = await supabaseClient
        .from('records')
        .insert({
          ...baseInsert,
          image_url: payload.image_url || null,
          image_size_kb: payload.image_size_kb || 0,
        })
        .select()
        .single();

      // Graceful fallback if Supabase schema columns have not been migrated yet
      if (error && error.message?.includes('image_')) {
        const retry = await supabaseClient
          .from('records')
          .insert(baseInsert)
          .select()
          .single();
        error = retry.error;
      }

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

    // Persist receipt photo locally (Phase 1 local bridge before Phase 2 Supabase Storage sync)
    if (payload.image_url) {
      try {
        const receiptMapKey = getLocalReceiptMapKey();
        const localReceipts = JSON.parse(
          localStorage.getItem(receiptMapKey) || '{}',
        );
        const normDate =
          normalizeRecordDateYMD(payload.date) || payload.date || '';
        const fallbackKey = `${normDate}_${payload.type}_${Number(payload.amount)}_${payload.category}`;
        localReceipts[fallbackKey] = {
          image_url: payload.image_url,
          image_size_kb: payload.image_size_kb || 0,
        };
        localStorage.setItem(receiptMapKey, JSON.stringify(localReceipts));
      } catch (e) {}
    }

    // Optimistically update local records and streak counter for zero-latency feedback
    const optimisticRecord = {
      id: `temp-${Date.now()}`,
      type: payload.type,
      amount: payload.amount,
      category: payload.category,
      account_name: payload.account_name || 'Cash',
      date: normalizeRecordDateYMD(payload.date) || payload.date,
      note: payload.note,
      image_url: payload.image_url || null,
      image_size_kb: payload.image_size_kb || 0,
    };
    state.pendingReceiptDataUrl = null;
    state.pendingReceiptSizeKb = 0;
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
        ? '确定要删除这条账单记录吗？删除后将同步更新当月支出统计。'
        : 'Are you sure you want to delete this transaction?',
    confirmText: state.lang === 'zh' ? '确认删除' : 'Delete',
    danger: true,
    onConfirm: async () => {
      triggerHaptic(12);

      if (isDraft) {
        let queue = getOfflineQueue();
        queue = queue.filter((item) => String(item.id) !== String(id));
        saveOfflineQueue(queue);

        state.records = state.records.filter(
          (r) => String(r.id) !== String(id),
        );
        renderTable();
        calculateLocalSummaryMetrics();
        updateAccountModalData();
        loadAccounts();
        renderStreakAndBadges();
        showToast(state.lang === 'zh' ? '已删除离线记录' : 'Draft removed');
        return;
      }

      // Optimistically remove from local state & re-render immediately for zero-latency one-tap feel
      if (recordToDelete?.image_url) {
        if (typeof deleteReceiptFromCloud === 'function') {
          deleteReceiptFromCloud(recordToDelete.image_url).catch(() => {});
        }
        try {
          const receiptMapKey = getLocalReceiptMapKey();
          const localReceipts = JSON.parse(
            localStorage.getItem(receiptMapKey) || '{}',
          );
          const normDate =
            normalizeRecordDateYMD(recordToDelete.date) ||
            recordToDelete.date ||
            '';
          const fallbackKey = `${normDate}_${recordToDelete.type}_${Number(recordToDelete.amount)}_${recordToDelete.category}`;
          delete localReceipts[String(id)];
          delete localReceipts[fallbackKey];
          localStorage.setItem(receiptMapKey, JSON.stringify(localReceipts));
        } catch (e) {}
      }
      const previousRecords = [...state.records];
      state.records = state.records.filter((r) => String(r.id) !== String(id));
      const userKey = state.user?.id || 'guest';
      const cacheKey = `ledger_cached_records_${userKey}`;
      try {
        const serverOnly = state.records.filter((r) => !r.isDraft);
        localStorage.setItem(cacheKey, JSON.stringify(serverOnly));
      } catch (e) {}
      updateMonthFilterDropdown(state.records);
      renderTable();
      calculateLocalSummaryMetrics();
      updateAccountModalData();
      loadAccounts();
      renderStreakAndBadges();
      showToast(state.lang === 'zh' ? '已删除账单' : 'Transaction deleted');

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

        await Promise.all([
          loadRecords(),
          loadSummary(),
          fetchProjectsFromBackend(),
          fetchClaimsFromBackend(),
        ]);
      } catch (err) {
        state.records = previousRecords;
        renderTable();
        calculateLocalSummaryMetrics();
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
      : getCurrentMonthKey();
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
 * Save file via Native OS File Picker or Android native share sheet if supported,
 * falling back to standard browser download.
 * @param {Blob} blob - The file blob
 * @param {string} defaultFileName - Suggested file name
 * @param {string} fileDescription - Description of file type for OS dialog
 * @param {string} mimeType - MIME type of the file
 * @param {string[]} extensions - Accepted file extensions for showSaveFilePicker
 * @returns {Promise<{ success?: boolean, canceled?: boolean, fileName: string, isNativePicker?: boolean, isNativeShare?: boolean }>}
 */
async function saveBlobWithPicker(
  blob,
  defaultFileName,
  fileDescription = 'CSV 表格文件 (*.csv)',
  mimeType = 'text/csv;charset=utf-8',
  extensions = ['.csv'],
) {
  const baseMime = String(mimeType || 'application/octet-stream')
    .split(';')[0]
    .trim();

  // 1. Android Native APK Share & Save Sheet (FileProvider + Intent.ACTION_SEND)
  if (
    window.NativeUpdater &&
    typeof window.NativeUpdater.shareBinaryFile === 'function'
  ) {
    try {
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const resultStr = String(reader.result || '');
          const commaIdx = resultStr.indexOf(',');
          resolve(commaIdx !== -1 ? resultStr.slice(commaIdx + 1) : resultStr);
        };
        reader.onerror = () =>
          reject(reader.error || new Error('FileReader failed'));
        reader.readAsDataURL(blob);
      });
      window.NativeUpdater.shareBinaryFile(
        defaultFileName,
        base64Data,
        baseMime,
        fileDescription,
      );
      return {
        success: true,
        fileName: defaultFileName,
        isNativeShare: true,
      };
    } catch (err) {
      console.warn('NativeUpdater.shareBinaryFile failed:', err);
    }
  } else if (
    baseMime === 'text/csv' &&
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
      const shareFile = new File([blob], defaultFileName, {
        type: baseMime,
      });
      if (navigator.canShare({ files: [shareFile] })) {
        await navigator.share({
          files: [shareFile],
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
      const acceptedExts =
        Array.isArray(extensions) && extensions.length > 0
          ? extensions
          : ['.bin'];
      const handle = await window.showSaveFilePicker({
        suggestedName: defaultFileName,
        types: [
          {
            description: fileDescription,
            accept: { [baseMime]: acceptedExts },
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
    <option value="current_year">${isZh ? `本年度账单 (${currentYear}年)` : `Current Year (${currentYear})`}</option>
    <option value="1">${isZh ? '1 年前历史数据 (> 1年)' : '> 1 Year (365 Days)'}</option>
    <option value="2">${isZh ? '2 年前历史数据 (> 2年)' : '> 2 Years (730 Days)'}</option>
    <option value="3">${isZh ? '3 年前历史数据 (> 3年推荐)' : '> 3 Years (1095 Days)'}</option>
    <option value="5">${isZh ? '5 年前历史数据 (> 5年)' : '> 5 Years (1825 Days)'}</option>
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
        const recordsToPurge = (state.records || []).filter(
          (r) => r.date && r.date < cutoffDate && r.image_url,
        );
        for (const rec of recordsToPurge) {
          if (typeof deleteReceiptFromCloud === 'function') {
            await deleteReceiptFromCloud(rec.image_url);
          }
        }

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
// Module: Receipt & Purchase Photo Compression, Preview & Lightbox (Phase 1)
// ============================================================================

/**
 * Compress a receipt/purchase image client-side using ObjectURL + HTML5 Canvas to WebP (with JPEG fallback).
 */
async function compressReceiptImage(file, maxDimension = 1080, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to decode image'));
    };
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      let dataUrl = canvas.toDataURL('image/webp', quality);
      if (!dataUrl.startsWith('data:image/webp')) {
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }
      const approxBytes = Math.round((dataUrl.length * 3) / 4);
      const sizeKb = Math.max(1, Math.round(approxBytes / 1024));
      resolve({ dataUrl, sizeKb, width, height });
    };
    img.src = objectUrl;
  });
}

/**
 * Handle receipt file selection, compress image, and populate the preview drawer.
 */
async function handleReceiptFileSelected(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast(
      state.lang === 'zh' ? '请选择有效的图片' : 'Please select a valid image',
      true,
    );
    return;
  }
  try {
    const { dataUrl, sizeKb, width, height } = await compressReceiptImage(file);
    state.pendingReceiptDataUrl = dataUrl;
    state.pendingReceiptSizeKb = sizeKb;
    if (elements.receiptPreviewImg) elements.receiptPreviewImg.src = dataUrl;
    if (elements.receiptPreviewMeta) {
      const formatLabel = dataUrl.startsWith('data:image/webp')
        ? 'WebP'
        : 'JPEG';
      elements.receiptPreviewMeta.textContent = `${formatLabel} · ${width}×${height} · ~${sizeKb} KB`;
    }
    elements.receiptPreviewDrawer?.classList.remove('hidden');
    elements.triggerReceiptUploadBtn?.classList.add('active');
    triggerHaptic(10);
  } catch (err) {
    showToast(err.message || 'Image compression failed', true);
  }
}

/**
 * Clear pending receipt image from state and hide the preview drawer.
 */
function clearPendingReceipt() {
  state.pendingReceiptDataUrl = null;
  state.pendingReceiptSizeKb = 0;
  if (elements.receiptFileInput) elements.receiptFileInput.value = '';
  if (elements.receiptPreviewImg) elements.receiptPreviewImg.src = '';
  elements.receiptPreviewDrawer?.classList.add('hidden');
  elements.triggerReceiptUploadBtn?.classList.remove('active');
  triggerHaptic(8);
}

let receiptZoomState = {
  scale: 1,
  panX: 0,
  panY: 0,
  isDragging: false,
  startX: 0,
  startY: 0,
  initialPinchDist: 0,
  initialPinchScale: 1,
  moved: false,
};

function setReceiptLightboxZoom(scale, panX = 0, panY = 0) {
  const clampedScale = Math.min(4, Math.max(1, Number(scale) || 1));
  if (clampedScale <= 1.01) {
    receiptZoomState.scale = 1;
    receiptZoomState.panX = 0;
    receiptZoomState.panY = 0;
  } else {
    receiptZoomState.scale = clampedScale;
    const maxPan = (clampedScale - 1) * 260;
    receiptZoomState.panX = Math.max(-maxPan, Math.min(maxPan, panX));
    receiptZoomState.panY = Math.max(-maxPan, Math.min(maxPan, panY));
  }
  if (elements.receiptLightboxImg) {
    elements.receiptLightboxImg.style.transform = `translate(${receiptZoomState.panX}px, ${receiptZoomState.panY}px) scale(${receiptZoomState.scale})`;
    elements.receiptLightboxImg.classList.toggle(
      'is-zoomed',
      receiptZoomState.scale > 1.01,
    );
  }
  if (elements.zoomResetReceiptBtn) {
    elements.zoomResetReceiptBtn.textContent = `${Math.round(receiptZoomState.scale * 100)}%`;
  }
}

function initReceiptLightboxZoomGestures() {
  const img = elements.receiptLightboxImg;
  const frame = elements.receiptLightboxFrame;
  if (!img || !frame) return;

  elements.zoomInReceiptBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerHaptic(6);
    setReceiptLightboxZoom(
      receiptZoomState.scale + 0.5,
      receiptZoomState.panX,
      receiptZoomState.panY,
    );
  });

  elements.zoomOutReceiptBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerHaptic(6);
    setReceiptLightboxZoom(
      receiptZoomState.scale - 0.5,
      receiptZoomState.panX,
      receiptZoomState.panY,
    );
  });

  elements.zoomResetReceiptBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerHaptic(6);
    setReceiptLightboxZoom(1, 0, 0);
  });

  // Wheel zoom on desktop
  frame.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.25 : -0.25;
      setReceiptLightboxZoom(
        receiptZoomState.scale + delta,
        receiptZoomState.panX,
        receiptZoomState.panY,
      );
    },
    { passive: false },
  );

  // Mouse drag to pan & click to toggle zoom
  img.addEventListener('mousedown', (e) => {
    e.preventDefault();
    receiptZoomState.moved = false;
    if (receiptZoomState.scale <= 1.01) return;
    receiptZoomState.isDragging = true;
    receiptZoomState.startX = e.clientX - receiptZoomState.panX;
    receiptZoomState.startY = e.clientY - receiptZoomState.panY;
    img.classList.add('is-dragging');
  });

  window.addEventListener('mousemove', (e) => {
    if (!receiptZoomState.isDragging) return;
    const dx = e.clientX - receiptZoomState.startX;
    const dy = e.clientY - receiptZoomState.startY;
    if (
      Math.abs(dx - receiptZoomState.panX) > 3 ||
      Math.abs(dy - receiptZoomState.panY) > 3
    ) {
      receiptZoomState.moved = true;
    }
    setReceiptLightboxZoom(receiptZoomState.scale, dx, dy);
  });

  window.addEventListener('mouseup', () => {
    if (receiptZoomState.isDragging) {
      receiptZoomState.isDragging = false;
      img.classList.remove('is-dragging');
    }
  });

  img.addEventListener('click', (e) => {
    e.stopPropagation();
    if (receiptZoomState.moved) {
      receiptZoomState.moved = false;
      return;
    }
    triggerHaptic(6);
    if (receiptZoomState.scale > 1.05) {
      setReceiptLightboxZoom(1, 0, 0);
    } else {
      setReceiptLightboxZoom(2.25, 0, 0);
    }
  });

  // Touch pinch-to-zoom & single-finger pan on mobile
  frame.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        receiptZoomState.isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        receiptZoomState.initialPinchDist = Math.hypot(dx, dy);
        receiptZoomState.initialPinchScale = receiptZoomState.scale;
      } else if (e.touches.length === 1 && receiptZoomState.scale > 1.01) {
        receiptZoomState.isDragging = true;
        receiptZoomState.moved = false;
        receiptZoomState.startX = e.touches[0].clientX - receiptZoomState.panX;
        receiptZoomState.startY = e.touches[0].clientY - receiptZoomState.panY;
        img.classList.add('is-dragging');
      }
    },
    { passive: false },
  );

  frame.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length === 2 && receiptZoomState.initialPinchDist > 0) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const newScale =
          receiptZoomState.initialPinchScale *
          (dist / receiptZoomState.initialPinchDist);
        setReceiptLightboxZoom(
          newScale,
          receiptZoomState.panX,
          receiptZoomState.panY,
        );
      } else if (e.touches.length === 1 && receiptZoomState.isDragging) {
        e.preventDefault();
        const dx = e.touches[0].clientX - receiptZoomState.startX;
        const dy = e.touches[0].clientY - receiptZoomState.startY;
        if (
          Math.abs(dx - receiptZoomState.panX) > 4 ||
          Math.abs(dy - receiptZoomState.panY) > 4
        ) {
          receiptZoomState.moved = true;
        }
        setReceiptLightboxZoom(receiptZoomState.scale, dx, dy);
      }
    },
    { passive: false },
  );

  frame.addEventListener('touchend', () => {
    receiptZoomState.isDragging = false;
    receiptZoomState.initialPinchDist = 0;
    img.classList.remove('is-dragging');
  });
}

/**
 * Open full-screen receipt lightbox modal with history stack integration.
 */
function openReceiptLightbox(imgSrc, titleText = '', subText = '') {
  if (!imgSrc || !elements.receiptLightboxModal) return;
  triggerHaptic(10);
  setReceiptLightboxZoom(1, 0, 0);
  if (elements.receiptLightboxImg) elements.receiptLightboxImg.src = imgSrc;
  if (elements.receiptLightboxTitle) {
    elements.receiptLightboxTitle.textContent = titleText || t('view_receipt');
  }
  if (elements.receiptLightboxSub) {
    elements.receiptLightboxSub.textContent = subText || '';
  }
  elements.receiptLightboxModal.classList.remove('hidden');
  pushModalHistoryState();
}

/**
 * Close full-screen receipt lightbox modal.
 */
function closeReceiptLightbox(fromPopState = false) {
  triggerHaptic(10);
  setReceiptLightboxZoom(1, 0, 0);
  elements.receiptLightboxModal?.classList.add('hidden');
  popModalHistoryIfCleared(fromPopState === true);
}

// ============================================================================
// Module: Receipt Cloud Storage Sync (Phase 2 — Supabase Storage & SQLite)
// ============================================================================

/**
 * Convert a Base64 DataURL string into a binary Blob for Supabase Storage upload.
 */
function dataUrlToBlob(dataUrl) {
  const [header, base64Data] = dataUrl.split(',');
  const mimeMatch = header.match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/webp';
  const byteChars = atob(base64Data);
  const byteArray = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteArray[i] = byteChars.charCodeAt(i);
  }
  return new Blob([byteArray], { type: mimeType });
}

function getReceiptExtFromMime(mime) {
  const lower = String(mime || '').toLowerCase();
  if (lower.includes('png')) return '.png';
  if (lower.includes('jpeg') || lower.includes('jpg')) return '.jpg';
  return '.webp';
}

/**
 * Upload compressed receipt image to Supabase Storage bucket `receipt-images`,
 * falling back to the compressed DataURL when offline or in local SQLite mode.
 */
async function uploadReceiptToCloud(dataUrl) {
  if (!dataUrl || !String(dataUrl).startsWith('data:image/')) return dataUrl;
  const userId = state.user?.id;
  if (!supabaseClient || !userId || !navigator.onLine) {
    return dataUrl;
  }
  try {
    const blob = dataUrlToBlob(dataUrl);
    const contentType = blob.type || 'image/webp';
    const ext = getReceiptExtFromMime(contentType);
    const yearMonth = new Date().toISOString().slice(0, 7);
    const rand = Math.random().toString(36).slice(2, 7);
    const filePath = `${userId}/${yearMonth}/${Date.now()}_${rand}${ext}`;
    const { error: uploadError } = await supabaseClient.storage
      .from('receipt-images')
      .upload(filePath, blob, {
        contentType,
        upsert: false,
      });
    if (uploadError) return dataUrl;
    const { data } = supabaseClient.storage
      .from('receipt-images')
      .getPublicUrl(filePath);
    return data?.publicUrl || dataUrl;
  } catch (err) {
    return dataUrl;
  }
}

/**
 * Remove a receipt image file from Supabase Storage bucket `receipt-images`.
 */
async function deleteReceiptFromCloud(imageUrl) {
  if (!imageUrl || !supabaseClient || !state.user?.id) return;
  const marker = '/receipt-images/';
  const idx = String(imageUrl).indexOf(marker);
  if (idx === -1) return;
  const storagePath = decodeURIComponent(
    String(imageUrl)
      .slice(idx + marker.length)
      .split('?')[0],
  );
  if (!storagePath.startsWith(`${state.user.id}/`)) return;
  try {
    await supabaseClient.storage.from('receipt-images').remove([storagePath]);
  } catch (err) {
    // Ignore cloud storage deletion errors
  }
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
let isForceUpdateRequired = false;
let lastAutoUpdateCheckAt = 0;
const AUTO_UPDATE_CHECK_COOLDOWN_MS = 15 * 60 * 1000;

function compareSemver(a, b) {
  const pa = String(a || '')
    .replace(/^v/i, '')
    .split('.')
    .map((n) => parseInt(n, 10) || 0);
  const pb = String(b || '')
    .replace(/^v/i, '')
    .split('.')
    .map((n) => parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length, 3);
  for (let i = 0; i < len; i++) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x > y) return 1;
    if (x < y) return -1;
  }
  return 0;
}

function openInAppUpdateModal(forceMode = isForceUpdateRequired) {
  elements.updateDownloadProgressArea?.classList.add('hidden');
  elements.inAppUpdateModal?.classList.toggle(
    'is-force-update',
    Boolean(forceMode),
  );
  if (elements.startInAppUpdateBtn) {
    elements.startInAppUpdateBtn.disabled = false;
  }
  if (elements.cancelInAppUpdateBtn) {
    elements.cancelInAppUpdateBtn.disabled = false;
  }
  elements.inAppUpdateModal?.classList.remove('hidden');
  pushModalHistoryState();
}

function closeInAppUpdateModal(fromPopState = false) {
  if (isForceUpdateRequired) return;
  elements.inAppUpdateModal?.classList.add('hidden');
  popModalHistoryIfCleared(fromPopState === true);
}

function showUpdateAvailablePrompt(
  versionLabel,
  apkUrl,
  notes,
  isForced = false,
) {
  pendingUpdateVersion = versionLabel;
  if (apkUrl) pendingApkDownloadUrl = apkUrl;
  isForceUpdateRequired = Boolean(isForced);

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
        ? `目前有最新版本 (v${versionLabel})，点击前往更新。`
        : `Latest version available (v${versionLabel}). Tap Go Update.`;
  }
  elements.updateBannerDismissBtn?.classList.toggle(
    'hidden',
    isForceUpdateRequired,
  );
  elements.updateNotificationBanner?.classList.remove('hidden');
  if (elements.updateStatusText) {
    elements.updateStatusText.textContent = `v${versionLabel} ready!`;
  }
  if (elements.checkUpdateBtnText) {
    elements.checkUpdateBtnText.textContent = `Update v${versionLabel}`;
  }

  if (isForceUpdateRequired) {
    openInAppUpdateModal(true);
  }
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
  lastAutoUpdateCheckAt = Date.now();
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
      const notes = remoteData.notes || '';
      const hasNewerVersion = compareSemver(remoteVersion, APP_VERSION) > 0;
      const hasSwUpdate = Boolean(swRegistration && swRegistration.waiting);
      const minSupported = remoteData.minSupportedVersion || '';
      const isForced =
        Boolean(remoteData.forceUpdate) ||
        (Boolean(minSupported) &&
          compareSemver(APP_VERSION, minSupported) < 0) ||
        /\[FORCE\]/i.test(notes);

      if (hasNewerVersion || hasSwUpdate) {
        showUpdateAvailablePrompt(remoteVersion, apkUrl, notes, isForced);
        if (isManual) {
          openInAppUpdateModal(isForced);
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

/**
 * Application Bootstrapper
 */
async function init() {
  // 0. Instant Local Cache Hydration (<16ms 0-delay first render)
  hydrateLocalCacheImmediately();
  const versionText = `v${APP_VERSION}`;
  if (elements.appVersionBadge) {
    elements.appVersionBadge.textContent = versionText;
  }
  if (elements.inAppUpdateVersionBadge) {
    elements.inAppUpdateVersionBadge.textContent = versionText;
  }
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

  // 8. Month selector (defaults to current calendar month YYYY-MM)
  state.currentMonth = getCurrentMonthKey();
  state.lastActiveMonth = state.currentMonth;
  try {
    localStorage.setItem('ledger_last_active_month', state.currentMonth);
  } catch (e) {}
  updateMonthFilterDropdown(state.records);

  elements.monthFilter?.addEventListener('change', (e) => {
    state.currentMonth = e.target.value;
    loadSummary();
    renderTable();
    renderClaims();
    updateDailySpendingTrend();
  });

  // 9. Search Input and Clear Button
  let searchDebounceTimer = null;
  elements.searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      state.searchQuery = query;
      renderTable();
    }, 150);
  });

  elements.clearSearchBtn?.addEventListener('click', () => {
    if (elements.searchInput) elements.searchInput.value = '';
    state.searchQuery = '';
    renderTable();
    elements.searchInput?.focus();
  });

  // 10. Refresh button & Privacy Mode Toggle
  elements.refreshBtn?.addEventListener('click', async () => {
    if (elements.refreshBtn) elements.refreshBtn.disabled = true;
    try {
      await Promise.allSettled([
        loadSummary(),
        loadRecords(),
        loadAccounts(),
        fetchProjectsFromBackend(),
        fetchClaimsFromBackend(),
      ]);
      showToast(
        navigator.onLine
          ? state.lang === 'zh'
            ? '数据已刷新'
            : 'MonetaX data synced'
          : state.lang === 'zh'
            ? '当前离线，显示本地缓存'
            : 'Offline: showing local cache',
        !navigator.onLine,
      );
    } finally {
      if (elements.refreshBtn) elements.refreshBtn.disabled = false;
    }
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

  // Receipt Photo Upload, Preview & Lightbox Event Listeners
  elements.triggerReceiptUploadBtn?.addEventListener('click', () => {
    triggerHaptic(8);
    elements.receiptFileInput?.click();
  });
  elements.receiptFileInput?.addEventListener('change', (e) => {
    if (typeof handleReceiptFileSelected === 'function') {
      handleReceiptFileSelected(e);
    }
  });
  elements.removeReceiptBtn?.addEventListener('click', () => {
    if (typeof clearPendingReceipt === 'function') {
      clearPendingReceipt();
    }
  });
  elements.previewReceiptThumbWrap?.addEventListener('click', () => {
    if (
      state.pendingReceiptDataUrl &&
      typeof openReceiptLightbox === 'function'
    ) {
      openReceiptLightbox(
        state.pendingReceiptDataUrl,
        t('receipt_attached'),
        elements.receiptPreviewMeta?.textContent || '',
      );
    }
  });
  elements.closeReceiptLightboxBtn?.addEventListener('click', () => {
    if (typeof closeReceiptLightbox === 'function') {
      closeReceiptLightbox();
    }
  });
  elements.receiptLightboxBackdrop?.addEventListener('click', () => {
    if (typeof closeReceiptLightbox === 'function') {
      closeReceiptLightbox();
    }
  });
  elements.downloadReceiptLightboxBtn?.addEventListener('click', async () => {
    const src = elements.receiptLightboxImg?.src;
    if (!src) return;
    triggerHaptic(10);
    let blob = null;
    try {
      if (src.startsWith('data:image/')) {
        blob = dataUrlToBlob(src);
      } else {
        const res = await fetch(src);
        if (res.ok) blob = await res.blob();
      }
    } catch (e) {}
    if (!blob) return;

    const mime = blob.type || 'image/webp';
    const ext = getReceiptExtFromMime(mime);
    const fileName = `MonetaX_Receipt_${new Date().toISOString().slice(0, 10)}${ext}`;
    await saveBlobWithPicker(blob, fileName, `Receipt Image (${ext})`, mime, [
      ext,
    ]);
  });
  elements.backupAndCleanReceiptsBtn?.addEventListener('click', () => {
    triggerHaptic(10);
    if (typeof backupAndCleanExpiredReceipts === 'function') {
      backupAndCleanExpiredReceipts();
    }
  });
  elements.cleanReceiptsOnlyBtn?.addEventListener('click', () => {
    triggerHaptic(10);
    if (typeof purgeExpiredReceiptsOnly === 'function') {
      purgeExpiredReceiptsOnly();
    }
  });

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
    if (e.target === elements.inAppUpdateModal && !isForceUpdateRequired) {
      closeInAppUpdateModal();
    }
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
  initReceiptLightboxZoomGestures();

  // Render local account picker; cloud data fetch waits for authenticated session
  loadAccounts();
  renderAccountPicker();

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
          localStorage.setItem('ledger_last_active_user_id', state.user.id);
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
        localStorage.setItem('ledger_last_active_user_id', state.user.id);
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

function normalizeProjectEntries(rawEntries) {
  let list = rawEntries;
  if (typeof list === 'string') {
    try {
      list = JSON.parse(list);
    } catch (e) {
      list = [];
    }
  }
  if (!Array.isArray(list)) return [];
  return list
    .filter((item) => item && item.id)
    .map((item) => ({
      id: String(item.id),
      title: String(item.title || '').trim(),
      category: item.category || 'Other Expense',
      account_name: item.account_name || item.accountName || 'Cash',
      amount: Number((parseFloat(item.amount) || 0).toFixed(2)),
      date: item.date || getLocalDateString(),
      image_url: item.image_url || item.imageUrl || null,
      image_size_kb: Number(item.image_size_kb ?? item.imageSizeKb) || 0,
      created_at: item.created_at || item.createdAt || new Date().toISOString(),
    }))
    .filter((item) => item.amount > 0);
}

function getProjectSpentAmount(project) {
  if (!project) return 0;
  const entries = normalizeProjectEntries(project.entries);
  if (entries.length > 0) {
    return Number(
      entries.reduce((sum, item) => sum + item.amount, 0).toFixed(2),
    );
  }
  return Number((parseFloat(project.spent_amount) || 0).toFixed(2));
}

function saveProjects(projects, syncCloudMeta = true) {
  const deleted = getDeletedIdsSet(getDeletedProjectsStorageKey());
  const clean = (Array.isArray(projects) ? projects : [])
    .filter((p) => p && p.id && !deleted.has(String(p.id)))
    .map((p) => {
      const entries = normalizeProjectEntries(p.entries);
      const spentAmount =
        entries.length > 0
          ? Number(entries.reduce((sum, e) => sum + e.amount, 0).toFixed(2))
          : Number((parseFloat(p.spent_amount) || 0).toFixed(2));
      return {
        ...p,
        entries,
        spent_amount: spentAmount,
      };
    });
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
        mode: p.mode || 'extra',
        month: p.month,
        status: p.status,
        include_in_budget: Boolean(p.include_in_budget),
        timeframe_type: p.timeframe_type || 'indefinite',
        start_date: p.start_date || null,
        deadline: p.deadline || null,
        entries: (p.entries || []).map((e) => ({
          ...e,
          image_url:
            e.image_url && !String(e.image_url).startsWith('data:image/')
              ? e.image_url
              : null,
        })),
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

function getLockedSinkingFundAmount() {
  // Independent project budget cards no longer lock or deduct from monthly daily budget
  return 0;
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
  const entries = normalizeProjectEntries(d.entries);
  const rawSpent = parseFloat(d.spent_amount ?? d.spentAmount) || 0;
  const spent =
    entries.length > 0
      ? Number(entries.reduce((sum, e) => sum + e.amount, 0).toFixed(2))
      : Number(rawSpent.toFixed(2));
  const rawCreatedDate =
    d.created_at || d.createdAt
      ? String(d.created_at || d.createdAt).slice(0, 10)
      : getLocalDateString();
  return {
    id: String(d.id),
    title: d.title || '',
    icon: SVG_ICONS.target,
    target_amount: parseFloat(d.target_amount ?? d.targetAmount) || 0,
    spent_amount: spent,
    mode: d.mode || 'extra',
    month: d.month || getCurrentMonthKey(),
    status: d.status || 'active',
    include_in_budget: Boolean(d.include_in_budget ?? d.includeInBudget),
    timeframe_type: d.timeframe_type || d.timeframeType || 'indefinite',
    start_date: d.start_date || d.startDate || rawCreatedDate,
    deadline: d.deadline || null,
    entries,
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
  const normalizedFriends = (Array.isArray(friends) ? friends : []).map((f) => {
    const paid = Boolean(f && f.paid);
    const paidVia = paid && f.paid_via ? String(f.paid_via).trim() : '';
    return {
      name: String((f && f.name) || ''),
      amount: Number((parseFloat(f && f.amount) || 0).toFixed(2)),
      paid,
      ...(paidVia ? { paid_via: paidVia } : {}),
    };
  });
  return {
    id: String(c.id),
    title: c.title || '',
    total_amount: parseFloat(c.total_amount ?? c.totalAmount) || 0,
    my_share: parseFloat(c.my_share ?? c.myShare) || 0,
    friends: normalizedFriends,
    status: c.status || 'active',
    date: c.date || getLocalDateString(),
    created_at: c.created_at || c.createdAt || new Date().toISOString(),
  };
}

async function fetchProjectsFromBackend() {
  const userId = state.user?.id;
  if (!userId) return;

  const deleted = getDeletedIdsSet(getDeletedProjectsStorageKey());
  const existingById = new Map();

  // Seed migration fallback from user_metadata snapshot first, then localStorage cache (local takes priority)
  const metaProjects = state.user?.user_metadata?.ledger_projects;
  if (Array.isArray(metaProjects)) {
    metaProjects.forEach((mp) => {
      const norm = normalizeProjectItem(mp);
      if (norm && !deleted.has(norm.id)) {
        existingById.set(norm.id, norm);
      }
    });
  }
  (state.projects || []).forEach((lp) => {
    const norm = normalizeProjectItem(lp);
    if (norm && !deleted.has(norm.id)) {
      existingById.set(norm.id, norm);
    }
  });

  const mergedMap = new Map();
  const projectsNeedingCloudBackfill = [];

  const mergeWithLocalFallback = (norm) => {
    const prev = existingById.get(norm.id);
    let needsBackfill = false;
    if (prev) {
      if (norm.entries.length === 0 && prev.entries?.length > 0) {
        norm.entries = normalizeProjectEntries(prev.entries);
        norm.spent_amount = getProjectSpentAmount(norm);
        needsBackfill = true;
      }
      if (!norm.include_in_budget && prev.include_in_budget) {
        norm.include_in_budget = prev.include_in_budget;
        needsBackfill = true;
      }
      if (
        norm.timeframe_type === 'indefinite' &&
        !norm.deadline &&
        (prev.deadline ||
          (prev.timeframe_type && prev.timeframe_type !== 'indefinite'))
      ) {
        norm.timeframe_type = prev.timeframe_type;
        norm.start_date = prev.start_date;
        norm.deadline = prev.deadline;
        needsBackfill = true;
      }
    }
    if (needsBackfill) {
      projectsNeedingCloudBackfill.push(norm);
    }
    return norm;
  };

  // Fetch authoritatively from Supabase Cloud Table for current userId
  if (supabaseClient && userId) {
    try {
      const { data, error } = await supabaseClient
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        data.forEach((d) => {
          if (d.user_id && String(d.user_id) !== String(userId)) return;
          const norm = normalizeProjectItem(d);
          if (norm && !deleted.has(norm.id)) {
            mergedMap.set(norm.id, mergeWithLocalFallback(norm));
          }
        });
        // Preserve & promote any local/metadata projects created before Supabase sync
        existingById.forEach((localProj, id) => {
          if (!mergedMap.has(id) && !deleted.has(id)) {
            mergedMap.set(id, localProj);
            projectsNeedingCloudBackfill.push(localProj);
          }
        });

        const finalProjects = Array.from(mergedMap.values()).sort((a, b) =>
          String(b.created_at || '').localeCompare(String(a.created_at || '')),
        );
        saveProjects(finalProjects, true);
        renderSinkingFunds();
        renderBudgetTracker();

        if (projectsNeedingCloudBackfill.length > 0) {
          Promise.allSettled(
            projectsNeedingCloudBackfill.map((p) =>
              syncProjectChangeToCloud(p),
            ),
          ).catch(() => {});
        }
        return;
      }
    } catch (e) {}
  }

  // Fallback to NestJS Backend API (strictly scoped by x-user-id header)
  try {
    const res = await fetch('/api/projects', {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        data.forEach((d) => {
          const ownerId = d.user_id || d.userId;
          if (ownerId && String(ownerId) !== String(userId)) return;
          const norm = normalizeProjectItem(d);
          if (norm && !deleted.has(norm.id)) {
            mergedMap.set(norm.id, mergeWithLocalFallback(norm));
          }
        });
      }
    }
  } catch (e) {}

  existingById.forEach((localProj, id) => {
    if (!mergedMap.has(id) && !deleted.has(id)) {
      mergedMap.set(id, localProj);
    }
  });

  const finalProjects = Array.from(mergedMap.values()).sort((a, b) =>
    String(b.created_at || '').localeCompare(String(a.created_at || '')),
  );

  saveProjects(finalProjects, false);
  renderSinkingFunds();
  renderBudgetTracker();
}

async function fetchClaimsFromBackend() {
  const userId = state.user?.id;
  if (!userId) return;

  const deleted = getDeletedIdsSet(getDeletedClaimsStorageKey());
  const existingById = new Map();
  const metaClaims = state.user?.user_metadata?.ledger_claims;
  if (Array.isArray(metaClaims)) {
    metaClaims.forEach((mc) => {
      const norm = normalizeClaimItem(mc);
      if (norm && !deleted.has(norm.id)) existingById.set(norm.id, norm);
    });
  }
  (state.claims || []).forEach((lc) => {
    const norm = normalizeClaimItem(lc);
    if (norm && !deleted.has(norm.id)) existingById.set(norm.id, norm);
  });

  const mergedMap = new Map();

  // Fetch authoritatively from Supabase Cloud Table for current userId
  if (supabaseClient && userId) {
    try {
      const { data, error } = await supabaseClient
        .from('claims')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        data.forEach((c) => {
          if (c.user_id && String(c.user_id) !== String(userId)) return;
          const norm = normalizeClaimItem(c);
          if (norm && !deleted.has(norm.id)) {
            mergedMap.set(norm.id, norm);
          }
        });
        existingById.forEach((localClaim, id) => {
          if (!mergedMap.has(id) && !deleted.has(id)) {
            mergedMap.set(id, localClaim);
          }
        });
        const finalClaims = Array.from(mergedMap.values()).sort((a, b) =>
          String(b.created_at || '').localeCompare(String(a.created_at || '')),
        );
        saveClaims(finalClaims, true);
        updateMonthFilterDropdown(state.records);
        renderClaims();
        return;
      }
    } catch (e) {}
  }

  // Fallback to NestJS Backend API (strictly scoped by x-user-id header)
  try {
    const res = await fetch('/api/claims', {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        data.forEach((c) => {
          const ownerId = c.user_id || c.userId;
          if (ownerId && String(ownerId) !== String(userId)) return;
          const norm = normalizeClaimItem(c);
          if (norm && !deleted.has(norm.id)) {
            mergedMap.set(norm.id, norm);
          }
        });
      }
    }
  } catch (e) {}
  existingById.forEach((localClaim, id) => {
    if (!mergedMap.has(id) && !deleted.has(id)) {
      mergedMap.set(id, localClaim);
    }
  });
  const finalClaims = Array.from(mergedMap.values()).sort((a, b) =>
    String(b.created_at || '').localeCompare(String(a.created_at || '')),
  );

  saveClaims(finalClaims, false);
  updateMonthFilterDropdown(state.records);
  renderClaims();
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

function formatProjectOutcomeSummary(target, spent, isSettled) {
  const sym = state.currency || 'RM';
  const diff = Number((target - spent).toFixed(2));
  const isOverBudget = diff < 0;
  const absAmount = formatNumber(Math.abs(diff));
  const label = isOverBudget ? t('fund_over_budget') : t('fund_remaining');
  const fullText = isSettled
    ? `${t('fund_settled')} · ${label} ${sym} ${absAmount}`
    : `${label} ${sym} ${absAmount}`;
  return { diff, isOverBudget, absAmount, label, fullText };
}

function formatLocalDateObj(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseLocalDateStr(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function addMonthsSafe(dateObj, months) {
  const targetMonth = dateObj.getMonth() + months;
  const targetYear = dateObj.getFullYear() + Math.floor(targetMonth / 12);
  const normMonth = ((targetMonth % 12) + 12) % 12;
  const lastDayOfTargetMonth = new Date(targetYear, normMonth + 1, 0).getDate();
  return new Date(
    targetYear,
    normMonth,
    Math.min(dateObj.getDate(), lastDayOfTargetMonth),
  );
}

function computeTimeframeDates(
  timeframeType,
  startStr,
  currentDeadlineStr = null,
) {
  const startDate = parseLocalDateStr(startStr) || new Date();
  const normalizedStart = formatLocalDateObj(startDate);

  if (timeframeType === 'indefinite') {
    return { start_date: normalizedStart, deadline: null };
  }
  if (timeframeType === '2w') {
    const end = new Date(startDate);
    end.setDate(end.getDate() + 14);
    return { start_date: normalizedStart, deadline: formatLocalDateObj(end) };
  }
  if (timeframeType === 'this_month') {
    const end = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    return { start_date: normalizedStart, deadline: formatLocalDateObj(end) };
  }
  if (timeframeType === '1m') {
    return {
      start_date: normalizedStart,
      deadline: formatLocalDateObj(addMonthsSafe(startDate, 1)),
    };
  }
  if (timeframeType === '3m') {
    return {
      start_date: normalizedStart,
      deadline: formatLocalDateObj(addMonthsSafe(startDate, 3)),
    };
  }
  // Custom timeframe
  let deadline = currentDeadlineStr;
  if (!deadline || !parseLocalDateStr(deadline)) {
    const fallbackEnd = new Date(startDate);
    fallbackEnd.setDate(fallbackEnd.getDate() + 14);
    deadline = formatLocalDateObj(fallbackEnd);
  }
  return { start_date: normalizedStart, deadline };
}

function applyProjectTimeframeUI(prefix, timeframeType, startVal, deadlineVal) {
  const isNew = prefix === 'new';
  const pillsEl = isNew
    ? elements.newProjectTimeframePills
    : elements.editProjectTimeframePills;
  const datesRowEl = isNew
    ? elements.newProjectDatesRow
    : elements.editProjectDatesRow;
  const startInput = isNew
    ? elements.newProjectStartInput
    : elements.editProjectStartInput;
  const deadlineInput = isNew
    ? elements.newProjectDeadlineInput
    : elements.editProjectDeadlineInput;

  const tf = timeframeType || 'indefinite';
  if (isNew) {
    state.newProjectTimeframe = tf;
  } else {
    state.editProjectTimeframe = tf;
  }

  pillsEl?.querySelectorAll('.timeframe-pill-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-timeframe') === tf);
  });

  const computed = computeTimeframeDates(tf, startVal, deadlineVal);
  if (startInput) startInput.value = computed.start_date;
  if (deadlineInput) deadlineInput.value = computed.deadline || '';

  const isIndefinite = tf === 'indefinite';
  datesRowEl?.classList.toggle('hidden', isIndefinite);
  if (isNew && elements.newProjectTimeframeHint) {
    elements.newProjectTimeframeHint.classList.toggle('hidden', !isIndefinite);
  }
}

function formatProjectTimeframeBadge(fund) {
  const isZh = state.lang === 'zh';
  const deadline = fund?.deadline || null;
  if (!deadline || fund?.timeframe_type === 'indefinite') {
    return {
      text: isZh ? '长期未定' : 'Flexible',
      isOverdue: false,
    };
  }

  if (fund.status === 'settled') {
    return {
      text: isZh ? `期限至 ${deadline}` : `Due ${deadline}`,
      isOverdue: false,
    };
  }

  const today = parseLocalDateStr(getLocalDateString());
  const due = parseLocalDateStr(deadline);
  if (!today || !due) {
    return { text: deadline, isOverdue: false };
  }
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000);
  if (diffDays > 0) {
    return {
      text: isZh
        ? `剩 ${diffDays} 天 (${deadline.slice(5)})`
        : `${diffDays}d left (${deadline.slice(5)})`,
      isOverdue: false,
    };
  }
  if (diffDays === 0) {
    return {
      text: isZh ? '今日到期' : 'Due today',
      isOverdue: false,
    };
  }
  return {
    text: isZh
      ? `已超期 ${Math.abs(diffDays)} 天`
      : `${Math.abs(diffDays)}d overdue`,
    isOverdue: true,
  };
}

function isProjectVisibleInBudgetMonth(fund, targetMonth) {
  if (!fund || fund.status !== 'active' || !fund.include_in_budget) {
    return false;
  }
  if (!fund.deadline || fund.timeframe_type === 'indefinite') {
    // Active ongoing dedicated funds stay visible every month until completed
    return true;
  }
  const monthKey =
    !targetMonth || targetMonth === 'all' ? getCurrentMonthKey() : targetMonth;
  const parts = monthKey.split('-').map(Number);
  if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) return true;
  const monthStart = `${parts[0]}-${String(parts[1]).padStart(2, '0')}-01`;
  const lastDay = new Date(parts[0], parts[1], 0).getDate();
  const monthEnd = `${parts[0]}-${String(parts[1]).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const startStr = fund.start_date || monthStart;
  // Overlaps viewed calendar month, OR still active/overdue in current real month
  const overlapsMonth = startStr <= monthEnd && fund.deadline >= monthStart;
  const isCurrentRealMonth = monthKey === getCurrentMonthKey();
  return overlapsMonth || isCurrentRealMonth;
}

function renderBudgetFundsSection(
  targetMonth,
  dailyExpense = 0,
  dailyBudget = 0,
) {
  const section = elements.budgetFundsSection;
  const listEl = elements.budgetFundsList;
  const overviewEl = elements.budgetCombinedOverview;
  if (!section || !listEl) return;

  const includedFunds = (state.projects || []).filter((p) =>
    isProjectVisibleInBudgetMonth(p, targetMonth),
  );

  if (includedFunds.length === 0) {
    section.classList.add('hidden');
    overviewEl?.classList.add('hidden');
    listEl.innerHTML = '';
    return;
  }

  section.classList.remove('hidden');
  const sym = state.currency || 'RM';
  const isZh = state.lang === 'zh';

  let totalTarget = 0;
  let totalSpent = 0;
  includedFunds.forEach((f) => {
    totalTarget += parseFloat(f.target_amount) || 0;
    totalSpent += getProjectSpentAmount(f);
  });

  if (overviewEl) {
    overviewEl.classList.remove('hidden');
    const combinedBudget = Number((dailyBudget + totalTarget).toFixed(2));
    const combinedSpent = Number((dailyExpense + totalSpent).toFixed(2));
    if (elements.budgetCombinedFormula) {
      elements.budgetCombinedFormula.textContent = isZh
        ? `日常 ${sym} ${formatNumber(dailyBudget)} + 专款 ${sym} ${formatNumber(totalTarget)} = ${sym} ${formatNumber(combinedBudget)}`
        : `Daily ${sym} ${formatNumber(dailyBudget)} + Funds ${sym} ${formatNumber(totalTarget)} = ${sym} ${formatNumber(combinedBudget)}`;
    }
    if (elements.budgetCombinedUsage) {
      elements.budgetCombinedUsage.textContent = isZh
        ? `总已用 ${sym} ${formatNumber(combinedSpent)} / ${sym} ${formatNumber(combinedBudget)}`
        : `Total Spent ${sym} ${formatNumber(combinedSpent)} / ${sym} ${formatNumber(combinedBudget)}`;
    }
  }

  if (elements.budgetFundsCountBadge) {
    elements.budgetFundsCountBadge.textContent = isZh
      ? `${includedFunds.length} 项进行中`
      : `${includedFunds.length} active`;
  }
  if (elements.budgetFundsSummaryText) {
    elements.budgetFundsSummaryText.textContent = isZh
      ? `专款已用 ${sym} ${formatNumber(totalSpent)} / ${sym} ${formatNumber(totalTarget)}`
      : `Spent ${sym} ${formatNumber(totalSpent)} / ${sym} ${formatNumber(totalTarget)}`;
  }

  listEl.innerHTML = includedFunds
    .map((fund) => {
      const target = parseFloat(fund.target_amount) || 0;
      const spent = getProjectSpentAmount(fund);
      const pctBar =
        target > 0 ? Math.min(100, Math.round((spent / target) * 100)) : 0;
      const outcome = formatProjectOutcomeSummary(target, spent, false);
      const tf = formatProjectTimeframeBadge(fund);

      return `
        <div
          class="budget-fund-row"
          role="button"
          tabindex="0"
          onclick="openProjectDetailModal('${fund.id}')"
          onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openProjectDetailModal('${fund.id}');}"
        >
          <div class="budget-fund-row-top">
            <div class="budget-fund-row-left">
              <span class="budget-fund-row-title"><span class="inline-svg-icon">${SVG_ICONS.target}</span><span>${escapeHtml(fund.title)}</span></span>
              <span class="project-badge-timeframe ${tf.isOverdue ? 'is-overdue' : ''}">${escapeHtml(tf.text)}</span>
            </div>
            <div class="budget-fund-row-right">
              <span class="budget-fund-numbers">${sym} ${formatNumber(spent)} / ${sym} ${formatNumber(target)}</span>
              <span class="budget-fund-outcome ${outcome.isOverBudget ? 'is-over-budget' : 'is-remaining'}">
                ${outcome.label} ${sym} ${outcome.absAmount}
              </span>
            </div>
          </div>
          <div class="budget-fund-bar-track">
            <div
              class="budget-fund-bar-fill ${outcome.isOverBudget ? 'is-over-budget' : ''}"
              style="width: ${pctBar}%;"
            ></div>
          </div>
        </div>
      `;
    })
    .join('');
}

function renderSinkingFunds() {
  const container = elements.sinkingFundsList;
  if (!container) return;

  const sym = state.currency || 'RM';
  const isZh = state.lang === 'zh';
  const activeFunds = (state.projects || []).filter(
    (p) => p.status === 'active',
  );
  const settledFunds = (state.projects || []).filter(
    (p) => p.status === 'settled',
  );

  if (!state.projects || state.projects.length === 0) {
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
      const entries = normalizeProjectEntries(fund.entries);
      const spent = getProjectSpentAmount(fund);
      const isSettled = fund.status === 'settled';
      const pctRaw = target > 0 ? Math.round((spent / target) * 100) : 0;
      const pctBar = Math.min(100, Math.max(0, pctRaw));
      const outcome = formatProjectOutcomeSummary(target, spent, isSettled);
      const tf = formatProjectTimeframeBadge(fund);

      const statusPill = isSettled
        ? `<span class="project-status-badge status-completed">${t('fund_settled')}</span>`
        : `<span class="project-status-badge status-active">${t('fund_status_active')}</span>`;

      const scopePill = fund.include_in_budget
        ? `<span class="project-badge-included">${t('badge_in_monthly_budget')}</span>`
        : '';

      const timeframePill = `<span class="project-badge-timeframe ${tf.isOverdue ? 'is-overdue' : ''}">${escapeHtml(tf.text)}</span>`;

      const entryCountText = isZh
        ? `${entries.length} ${t('project_entry_count_suffix')}`
        : `${entries.length} ${entries.length === 1 ? 'entry' : t('project_entry_count_suffix')}`;

      const equationText = `${t('fund_target')} ${sym} ${formatNumber(target)} · ${t('fund_spent')} ${sym} ${formatNumber(spent)} · ${entryCountText}`;

      const actionBtn = isSettled
        ? `<button type="button" class="btn-card-action" onclick="event.stopPropagation(); resumeProject('${fund.id}')">${t('btn_resume_fund')}</button>`
        : `<button type="button" class="btn-card-action btn-action-settle" onclick="event.stopPropagation(); completeProject('${fund.id}')">${t('btn_complete_fund')}</button>`;

      return `
      <div
        class="project-card is-clickable ${isSettled ? 'is-completed' : ''}"
        data-fund-id="${fund.id}"
        tabindex="0"
        role="button"
        aria-label="${escapeHtml(fund.title)}"
        onclick="openProjectDetailModal('${fund.id}')"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openProjectDetailModal('${fund.id}');}"
      >
        <div class="project-card-header">
          <div class="project-title-group">
            <div class="project-icon-badge">${SVG_ICONS.target}</div>
            <div>
              <h4 class="project-name-text">${escapeHtml(fund.title)}</h4>
              <div class="project-card-top-badges" style="margin-top: 4px; flex-wrap: wrap;">
                ${statusPill}
                ${scopePill}
                ${timeframePill}
              </div>
            </div>
          </div>
          <div class="project-card-header-actions">
            ${
              !isSettled
                ? `<button
                    type="button"
                    class="btn-card-edit-icon"
                    onclick="event.stopPropagation(); openProjectSettingsEdit('${fund.id}')"
                    title="${t('project_edit_meta')}"
                    aria-label="${t('project_edit_meta')}"
                  >✎</button>`
                : ''
            }
            <button
              type="button"
              class="btn-del"
              onclick="event.stopPropagation(); deleteProject('${fund.id}')"
              title="${t('btn_delete_project')}"
              aria-label="${t('btn_delete_project')}"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>

        <div class="project-math-equation">${equationText}</div>

        <div class="project-progress-track">
          <div
            class="project-progress-spent ${outcome.isOverBudget ? 'is-over-budget' : ''}"
            style="width: ${pctBar}%;"
          ></div>
        </div>

        <div class="project-card-stats">
          <span class="project-outcome-pill ${outcome.isOverBudget ? 'is-over-budget' : 'is-remaining'}">
            ${outcome.fullText}
          </span>
          <span class="mono-amount">${pctRaw}%</span>
        </div>

        <div class="project-card-footer-meta">
          <span class="project-card-hint">${t('project_card_tap_hint')}</span>
          <div class="project-card-actions" style="margin-top: 0;">
            ${actionBtn}
          </div>
        </div>
      </div>
    `;
    })
    .join('');
}

function renderClaimCardHtml(claim) {
  const sym = state.currency || 'RM';
  const totalAmount = parseFloat(claim.total_amount) || 0;
  const myShare = parseFloat(claim.my_share) || 0;
  const friends = claim.friends || [];
  const allPaid = friends.length > 0 && friends.every((f) => f.paid);
  const paidCount = friends.filter((f) => f.paid).length;
  const pendingAmt = friends.reduce(
    (sum, f) => sum + (f.paid ? 0 : parseFloat(f.amount) || 0),
    0,
  );

  const isZh = state.lang === 'zh';
  const progressText =
    friends.length > 0
      ? isZh
        ? allPaid
          ? `已全额收回 (${paidCount}/${friends.length})`
          : `已收 ${paidCount}/${friends.length} · 待收 ${sym} ${formatNumber(pendingAmt)}`
        : allPaid
          ? `All paid (${paidCount}/${friends.length})`
          : `Paid ${paidCount}/${friends.length} · Pending ${sym} ${formatNumber(pendingAmt)}`
      : '';
  const friendsHtml = friends
    .map((f, idx) => {
      const isPaid = f.paid;
      const statusBtn = isPaid
        ? `<button type="button" class="btn-mark-paid paid" onclick="event.stopPropagation(); toggleClaimFriendPaid('${claim.id}', ${idx})">${isZh ? '已收回' : 'Paid'}</button>`
        : `<button type="button" class="btn-mark-paid" onclick="event.stopPropagation(); toggleClaimFriendPaid('${claim.id}', ${idx})">${isZh ? '点我收款' : 'Mark Paid'}</button>`;

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
    ? `<button type="button" class="btn-card-action btn-action-settle" onclick="event.stopPropagation(); settleAllClaim('${claim.id}')">${t('btn_all_settled')}</button>`
    : `<span style="font-size: 0.78rem; font-weight: 700; color: #16a34a; background: rgba(34, 197, 94, 0.1); padding: 4px 10px; border-radius: 9999px;">${isZh ? '全员结清归档' : 'All Settled'}</span>`;

  return `
      <div
        class="claim-card is-clickable"
        data-claim-id="${claim.id}"
        tabindex="0"
        role="button"
        aria-label="${escapeHtml(claim.title)}"
        onclick="openEditClaimModal('${claim.id}')"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openEditClaimModal('${claim.id}');}"
      >
        <div class="claim-card-header">
          <div>
            <h4 class="claim-title-text">${escapeHtml(claim.title)}</h4>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(claim.date || '')} · ${isZh ? '我自己消费' : 'My Share'}: ${sym} ${formatNumber(myShare)}${progressText ? ` · ${progressText}` : ''}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="claim-total-badge">${isZh ? '垫付总额' : 'Advanced'}: ${sym} ${formatNumber(totalAmount - myShare)}</span>
            <button
              type="button"
              class="btn-card-edit-icon"
              onclick="event.stopPropagation(); openEditClaimModal('${claim.id}')"
              title="${isZh ? '编辑代垫' : 'Edit Claim'}"
              aria-label="${isZh ? '编辑代垫' : 'Edit Claim'}"
            >✎</button>
            <button type="button" class="btn-del" onclick="event.stopPropagation(); deleteClaim('${claim.id}')" title="Delete">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>

        <div class="claim-friend-list">
          ${friendsHtml}
        </div>

        <div class="project-card-actions">
          <button
            type="button"
            class="btn-card-action"
            onclick="event.stopPropagation(); copyClaimReminder('${claim.id}')"
          >
            ${SVG_ICONS.copy}
            <span>${t('btn_copy_claim_text')}</span>
          </button>
          ${settleAllBtn}
        </div>
      </div>
    `;
}

function renderClaims() {
  const container = elements.claimsList;
  if (!container) return;

  const sym = state.currency || 'RM';
  const allClaims = state.claims || [];
  const activeMonth = state.currentMonth || 'all';
  const filteredClaims =
    activeMonth === 'all'
      ? allClaims
      : allClaims.filter((c) => (c.date || '').startsWith(activeMonth));

  // Compute total pending across unpaid friend shares for the active period
  let totalPending = 0;
  filteredClaims.forEach((claim) => {
    (claim.friends || []).forEach((f) => {
      if (!f.paid) totalPending += parseFloat(f.amount) || 0;
    });
  });

  if (elements.claimsPendingTotalVal) {
    elements.claimsPendingTotalVal.textContent = `${sym} ${formatNumber(totalPending)}`;
  }

  if (filteredClaims.length === 0) {
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

  const activeClaims = [];
  const settledClaims = [];
  filteredClaims.forEach((claim) => {
    const friends = Array.isArray(claim.friends) ? claim.friends : [];
    const isSettled =
      friends.length > 0 && friends.every((f) => Boolean(f.paid));
    if (isSettled) {
      settledClaims.push(claim);
    } else {
      activeClaims.push(claim);
    }
  });

  const activeHtml =
    activeClaims.length > 0
      ? activeClaims.map(renderClaimCardHtml).join('')
      : `<div class="claims-active-empty-banner">${escapeHtml(t('claims_active_empty'))}</div>`;

  let settledGroupHtml = '';
  if (settledClaims.length > 0) {
    const isExpanded = Boolean(state.claimsSettledExpanded);
    const chevronSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
    settledGroupHtml = `
      <div class="claims-settled-group">
        <button
          type="button"
          class="claims-settled-toggle ${isExpanded ? 'is-expanded' : ''}"
          aria-expanded="${isExpanded}"
          onclick="toggleClaimsSettledSection()"
        >
          <span class="claims-settled-toggle-left">
            <span class="claims-settled-chevron">${chevronSvg}</span>
            <span>${escapeHtml(t('claims_settled_group'))} (${settledClaims.length})</span>
          </span>
          <span class="claims-settled-toggle-hint">${escapeHtml(
            isExpanded ? t('tap_to_collapse') : t('tap_to_expand'),
          )}</span>
        </button>
        <div class="claims-settled-body ${isExpanded ? '' : 'hidden'}">
          ${settledClaims.map(renderClaimCardHtml).join('')}
        </div>
      </div>
    `;
  }

  container.innerHTML = activeHtml + settledGroupHtml;
}

function toggleClaimsSettledSection() {
  triggerHaptic(8);
  state.claimsSettledExpanded = !state.claimsSettledExpanded;
  renderClaims();
}

async function copyClaimReminder(claimId) {
  const claim = (state.claims || []).find(
    (c) => String(c.id) === String(claimId),
  );
  if (!claim) return;

  const sym = state.currency || 'RM';
  const isZh = state.lang === 'zh';
  const totalAmount = parseFloat(claim.total_amount) || 0;
  const myShare = parseFloat(claim.my_share) || 0;
  const friends = Array.isArray(claim.friends) ? claim.friends : [];
  const pendingAmt = friends.reduce(
    (sum, f) => sum + (f.paid ? 0 : parseFloat(f.amount) || 0),
    0,
  );

  const lines = [
    `${claim.title}${claim.date ? ` (${claim.date})` : ''}`,
    isZh
      ? `总付 ${sym} ${formatNumber(totalAmount)}，自付 ${sym} ${formatNumber(myShare)}`
      : `Total ${sym} ${formatNumber(totalAmount)}, My share ${sym} ${formatNumber(myShare)}`,
    ...friends.map((f) => {
      const statusTxt = isZh
        ? f.paid
          ? '已付'
          : '待付'
        : f.paid
          ? 'Paid'
          : 'Pending';
      return `${f.name}: ${sym} ${formatNumber(f.amount)} (${statusTxt})`;
    }),
    isZh
      ? pendingAmt > 0
        ? `待收回：${sym} ${formatNumber(pendingAmt)}`
        : '已全员结清'
      : pendingAmt > 0
        ? `Pending: ${sym} ${formatNumber(pendingAmt)}`
        : 'All settled',
  ];
  const text = lines.join('\n');

  let copied = false;
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch (e) {}
  }
  if (!copied) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      copied = document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (e) {}
  }

  if (copied) {
    triggerHaptic(12);
    showToast(t('toast_claim_copied'));
  } else {
    showToast(isZh ? '复制失败，请手动复制' : 'Copy failed', true);
  }
}

// Open Transaction Modal specifically in Split mode
function openCreateModalWithSplit() {
  if (state.currentType !== 'expense') {
    setEntryType('expense');
  }
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
  if (elements.newProjectIncludeBudgetCheck) {
    elements.newProjectIncludeBudgetCheck.checked = false;
  }
  applyProjectTimeframeUI('new', 'indefinite', getLocalDateString(), null);
  elements.newProjectModal.classList.remove('hidden');
  pushModalHistoryState();
}

function closeNewProjectModal(fromPopState = false) {
  triggerHaptic(10);
  elements.newProjectModal?.classList.add('hidden');
  popModalHistoryIfCleared(fromPopState === true);
}

async function saveNewProject() {
  const title = (elements.projectInputTitle?.value || '').trim();
  const amount = parseFloat(elements.projectInputAmount?.value) || 0;
  const includeInBudget = Boolean(
    elements.newProjectIncludeBudgetCheck?.checked,
  );
  const timeframeType = state.newProjectTimeframe || 'indefinite';
  const startStr = elements.newProjectStartInput?.value || getLocalDateString();
  const rawDeadlineStr = elements.newProjectDeadlineInput?.value || null;
  const computedDates = computeTimeframeDates(
    timeframeType,
    startStr,
    rawDeadlineStr,
  );
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
      isZh ? '请输入有效的专款预算金额' : 'Please enter a valid budget amount',
      true,
    );
  }
  if (
    timeframeType !== 'indefinite' &&
    computedDates.deadline &&
    computedDates.deadline < computedDates.start_date
  ) {
    return showToast(
      isZh
        ? '截止日期不能早于开始日期'
        : 'Deadline cannot be earlier than start date',
      true,
    );
  }

  const newProject = {
    id: 'proj_' + Date.now(),
    title: title,
    icon: SVG_ICONS.target,
    target_amount: amount,
    spent_amount: 0,
    mode: includeInBudget ? 'budget_deduct' : 'extra',
    include_in_budget: includeInBudget,
    timeframe_type: timeframeType,
    start_date: computedDates.start_date,
    deadline: computedDates.deadline,
    month: getCurrentMonthKey(),
    status: 'active',
    entries: [],
    created_at: new Date().toISOString(),
  };

  const list = state.projects || [];
  list.unshift(newProject);
  saveProjects(list);
  renderSinkingFunds();
  renderBudgetTracker();

  triggerHaptic(15);
  closeNewProjectModal();
  showToast(isZh ? `专款【${title}】建立成功` : `Project "${title}" created!`);

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
        include_in_budget: Boolean(newProject.include_in_budget),
        timeframe_type: newProject.timeframe_type || 'indefinite',
        start_date: newProject.start_date || null,
        deadline: newProject.deadline || null,
        entries: normalizeProjectEntries(newProject.entries),
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
        includeInBudget: Boolean(newProject.include_in_budget),
        timeframeType: newProject.timeframe_type || 'indefinite',
        startDate: newProject.start_date || undefined,
        deadline: newProject.deadline ?? null,
      }),
    });
  } catch (e) {}
}

function getActiveDetailProject() {
  if (!state.activeProjectId) return null;
  return (state.projects || []).find(
    (p) => String(p.id) === String(state.activeProjectId),
  );
}

async function syncProjectChangeToCloud(fund, extraFields = {}) {
  if (!fund) return;
  const cleanEntries = normalizeProjectEntries(fund.entries).map((e) => ({
    id: e.id,
    title: e.title || '',
    category: e.category || 'Other Expense',
    account_name: e.account_name || 'Cash',
    amount: Number((parseFloat(e.amount) || 0).toFixed(2)),
    date: e.date || getLocalDateString(),
    image_url: e.image_url ?? null,
    image_size_kb: Number(e.image_size_kb) || 0,
    created_at: e.created_at || new Date().toISOString(),
  }));
  const nextStatus = extraFields.status || fund.status || 'active';

  if (supabaseClient && state.user?.id) {
    try {
      await supabaseClient.from('projects').upsert({
        id: fund.id,
        user_id: state.user.id,
        title: fund.title,
        icon: 'target',
        target_amount: Number((parseFloat(fund.target_amount) || 0).toFixed(2)),
        spent_amount: getProjectSpentAmount(fund),
        mode: fund.mode || (fund.include_in_budget ? 'budget_deduct' : 'extra'),
        month: fund.month || getCurrentMonthKey(),
        status: nextStatus,
        include_in_budget: Boolean(fund.include_in_budget),
        timeframe_type: fund.timeframe_type || 'indefinite',
        start_date: fund.start_date || null,
        deadline: fund.deadline || null,
        entries: cleanEntries,
        updated_at: new Date().toISOString(),
        ...extraFields,
      });
    } catch (e) {}
  }

  try {
    await fetch(`/api/projects/${fund.id}`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        title: fund.title,
        targetAmount: Number((parseFloat(fund.target_amount) || 0).toFixed(2)),
        spentAmount: getProjectSpentAmount(fund),
        status: nextStatus,
        includeInBudget: Boolean(fund.include_in_budget),
        timeframeType: fund.timeframe_type || 'indefinite',
        startDate: fund.start_date || undefined,
        deadline: fund.deadline ?? null,
        entries: cleanEntries,
      }),
    });
  } catch (e) {}
}

function openProjectDetailModal(fundId) {
  const fund = (state.projects || []).find(
    (p) => String(p.id) === String(fundId),
  );
  if (!fund || !elements.projectDetailModal) return;

  triggerHaptic(10);
  state.activeProjectId = String(fund.id);
  state.editingProjectEntryId = null;

  elements.projectMetaEditPanel?.classList.add('hidden');
  resetProjectEntryForm();
  renderProjectDetailModal();

  elements.projectDetailModal.classList.remove('hidden');
  pushModalHistoryState();
}

function closeProjectDetailModal(fromPopState = false) {
  triggerHaptic(8);
  elements.projectDetailModal?.classList.add('hidden');
  elements.projectMetaEditPanel?.classList.add('hidden');
  state.activeProjectId = null;
  state.editingProjectEntryId = null;
  resetProjectEntryForm();
  popModalHistoryIfCleared(fromPopState === true);
}

function clearPendingProjectReceipt() {
  state.pendingProjectReceiptDataUrl = null;
  state.pendingProjectReceiptSizeKb = 0;
  if (elements.projectReceiptFileInput) {
    elements.projectReceiptFileInput.value = '';
  }
  if (elements.projectReceiptPreviewImg) {
    elements.projectReceiptPreviewImg.src = '';
  }
  elements.projectReceiptPreviewDrawer?.classList.add('hidden');
  elements.triggerProjectReceiptBtn?.classList.remove('active');
}

async function handleProjectReceiptFileSelected(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast(
      state.lang === 'zh' ? '请选择有效的图片' : 'Please select a valid image',
      true,
    );
    return;
  }
  try {
    const { dataUrl, sizeKb, width, height } = await compressReceiptImage(file);
    state.pendingProjectReceiptDataUrl = dataUrl;
    state.pendingProjectReceiptSizeKb = sizeKb;
    if (elements.projectReceiptPreviewImg) {
      elements.projectReceiptPreviewImg.src = dataUrl;
    }
    if (elements.projectReceiptPreviewMeta) {
      const formatLabel = dataUrl.startsWith('data:image/webp')
        ? 'WebP'
        : 'JPEG';
      elements.projectReceiptPreviewMeta.textContent = `${formatLabel} · ${width}×${height} · ~${sizeKb} KB`;
    }
    elements.projectReceiptPreviewDrawer?.classList.remove('hidden');
    elements.triggerProjectReceiptBtn?.classList.add('active');
    triggerHaptic(10);
  } catch (err) {
    showToast(err.message || 'Image compression failed', true);
  }
}

function openProjectEntryReceiptLightbox(entryId) {
  const fund = getActiveDetailProject();
  if (!fund) return;
  const entries = normalizeProjectEntries(fund.entries);
  const entry = entries.find((item) => String(item.id) === String(entryId));
  if (!entry || !entry.image_url || typeof openReceiptLightbox !== 'function') {
    return;
  }
  const catLabel = getCategoryDisplayLabel(entry.category || 'Other Expense');
  const titleText = entry.title ? `${entry.title} (${catLabel})` : catLabel;
  const subText = `${entry.date || ''} · ${state.currency || 'RM'} ${formatNumber(entry.amount)}`;
  openReceiptLightbox(entry.image_url, titleText, subText);
}
window.openProjectEntryReceiptLightbox = openProjectEntryReceiptLightbox;

function resetProjectEntryForm() {
  state.editingProjectEntryId = null;
  state.selectedProjectEntryCategory =
    (CATEGORIES.expense && CATEGORIES.expense[0]) || 'Food & Dining';
  state.selectedProjectEntryAccount =
    (DEFAULT_ACCOUNTS[0] && DEFAULT_ACCOUNTS[0].name) || 'Cash';
  if (elements.projectEntryTitleInput) {
    elements.projectEntryTitleInput.value = '';
  }
  if (elements.projectEntryAmountInput) {
    elements.projectEntryAmountInput.value = '';
  }
  if (elements.projectEntryDateInput) {
    elements.projectEntryDateInput.value = getLocalDateString();
  }
  if (elements.saveProjectEntryBtn) {
    elements.saveProjectEntryBtn.textContent = t('btn_add_project_entry');
  }
  elements.cancelProjectEntryEditBtn?.classList.add('hidden');
  clearPendingProjectReceipt();
  renderProjectEntryCategoryGrid();
  renderProjectEntryAccountPicker();
}

function renderProjectEntryCategoryGrid() {
  const container = elements.projectEntryCategoryGrid;
  if (!container) return;

  const list = CATEGORIES.expense || [];
  const selectedCat = list.includes(state.selectedProjectEntryCategory)
    ? state.selectedProjectEntryCategory
    : list[0] || 'Food & Dining';
  state.selectedProjectEntryCategory = selectedCat;

  container.innerHTML = list
    .map((cat) => {
      const isSelected = cat === selectedCat;
      const icon = getCategoryIcon(cat);
      const label = getCategoryDisplayLabel(cat);
      return `
        <button type="button" class="cat-grid-btn ${isSelected ? 'active' : ''}" data-project-cat="${escapeHtml(cat)}">
          <span class="cat-grid-icon">${icon}</span>
          <span class="cat-grid-label">${escapeHtml(label)}</span>
        </button>
      `;
    })
    .join('');

  container.querySelectorAll('.cat-grid-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const chosen = btn.getAttribute('data-project-cat');
      if (chosen) state.selectedProjectEntryCategory = chosen;
      container
        .querySelectorAll('.cat-grid-btn')
        .forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function renderProjectEntryAccountPicker() {
  const container = elements.projectEntryAccountGrid;
  if (!container) return;

  const currentAcc = state.selectedProjectEntryAccount || 'Cash';
  container.innerHTML = DEFAULT_ACCOUNTS.map((acc) => {
    const isSelected = acc.name === currentAcc;
    const label = getAccountDisplayLabel(acc.name);
    return `
      <button type="button" class="account-chip-btn ${isSelected ? 'active' : ''}" data-project-acc="${escapeHtml(acc.name)}">
        <span class="account-chip-icon">${acc.icon}</span>
        <span class="account-chip-name">${escapeHtml(label)}</span>
      </button>
    `;
  }).join('');

  container.querySelectorAll('.account-chip-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const chosen = btn.getAttribute('data-project-acc');
      if (chosen) state.selectedProjectEntryAccount = chosen;
      container
        .querySelectorAll('.account-chip-btn')
        .forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function renderProjectDetailModal() {
  const fund = getActiveDetailProject();
  if (!fund) return;

  const sym = state.currency || 'RM';
  const isZh = state.lang === 'zh';
  const target = parseFloat(fund.target_amount) || 0;
  const entries = normalizeProjectEntries(fund.entries);
  const spent = getProjectSpentAmount(fund);
  const isSettled = fund.status === 'settled';
  const outcome = formatProjectOutcomeSummary(target, spent, isSettled);
  const pctBar =
    target > 0 ? Math.min(100, Math.round((spent / target) * 100)) : 0;

  if (elements.projectDetailTitle) {
    elements.projectDetailTitle.textContent = fund.title;
  }

  if (elements.projectDetailStatusBadge) {
    elements.projectDetailStatusBadge.textContent = isSettled
      ? t('fund_settled')
      : t('fund_status_active');
    elements.projectDetailStatusBadge.classList.toggle(
      'status-completed',
      isSettled,
    );
    elements.projectDetailStatusBadge.classList.toggle(
      'status-active',
      !isSettled,
    );
  }

  if (elements.toggleEditProjectMetaBtn) {
    elements.toggleEditProjectMetaBtn.classList.toggle('hidden', isSettled);
  }
  if (isSettled) {
    elements.projectMetaEditPanel?.classList.add('hidden');
  }

  if (elements.projectDetailTargetVal) {
    elements.projectDetailTargetVal.textContent = `${sym} ${formatNumber(target)}`;
  }
  if (elements.projectDetailSpentVal) {
    elements.projectDetailSpentVal.textContent = `${sym} ${formatNumber(spent)}`;
  }
  if (elements.projectDetailOutcomeLabel) {
    elements.projectDetailOutcomeLabel.textContent = outcome.label;
  }
  if (elements.projectDetailOutcomeVal) {
    elements.projectDetailOutcomeVal.textContent = `${sym} ${outcome.absAmount}`;
    elements.projectDetailOutcomeVal.classList.toggle(
      'is-over-budget',
      outcome.isOverBudget,
    );
    elements.projectDetailOutcomeVal.classList.toggle(
      'is-remaining',
      !outcome.isOverBudget,
    );
  }
  if (elements.projectDetailProgressFill) {
    elements.projectDetailProgressFill.style.width = `${pctBar}%`;
    elements.projectDetailProgressFill.classList.toggle(
      'is-over-budget',
      outcome.isOverBudget,
    );
  }

  // Toggle Active Add/Edit Form vs Completed Read-Only Banner & Footer Buttons
  elements.projectEntryForm?.classList.toggle('hidden', isSettled);
  elements.projectSettledNotice?.classList.toggle('hidden', !isSettled);
  elements.detailCompleteProjectBtn?.classList.toggle('hidden', isSettled);
  elements.detailResumeProjectBtn?.classList.toggle('hidden', !isSettled);
  if (!isSettled) {
    renderProjectEntryCategoryGrid();
    renderProjectEntryAccountPicker();
  }

  if (elements.projectEntriesCountLabel) {
    elements.projectEntriesCountLabel.textContent = isZh
      ? `${entries.length} ${t('project_entry_count_suffix')}`
      : `${entries.length} ${entries.length === 1 ? 'entry' : t('project_entry_count_suffix')}`;
  }

  if (!elements.projectEntriesList) return;
  if (entries.length === 0) {
    elements.projectEntriesList.innerHTML = `<div class="project-entries-empty">${t('project_entries_empty')}</div>`;
    return;
  }

  elements.projectEntriesList.innerHTML = entries
    .map((entry) => {
      const isEditing =
        state.editingProjectEntryId &&
        String(state.editingProjectEntryId) === String(entry.id);
      const catKey = entry.category || 'Other Expense';
      const catLabel = getCategoryDisplayLabel(catKey);
      const catIcon = getCategoryIcon(catKey);
      const catColor =
        (CATEGORY_META[catKey] && CATEGORY_META[catKey].color) || '';
      const accLabel = getAccountDisplayLabel(entry.account_name || 'Cash');
      const displayTitle = entry.title ? entry.title : catLabel;
      const metaParts = [catLabel, accLabel, entry.date].filter(Boolean);
      const actionsHtml = !isSettled
        ? `
          <div class="project-entry-actions">
            <button
              type="button"
              class="btn-project-entry-icon"
              onclick="editProjectEntry('${entry.id}')"
              title="${isZh ? '编辑' : 'Edit'}"
              aria-label="${isZh ? '编辑' : 'Edit'}"
            >✎</button>
            <button
              type="button"
              class="btn-project-entry-icon is-delete"
              onclick="deleteProjectEntry('${entry.id}')"
              title="${isZh ? '删除' : 'Delete'}"
              aria-label="${isZh ? '删除' : 'Delete'}"
            >✕</button>
          </div>
        `
        : '';

      const receiptBadgeHtml = entry.image_url
        ? `<span class="badge-receipt-photo" onclick="event.stopPropagation(); openProjectEntryReceiptLightbox('${entry.id}')" title="${escapeHtml(t('view_receipt'))}">${SVG_ICONS.receipt}</span>`
        : '';

      return `
        <div class="project-entry-item ${isEditing ? 'is-editing' : ''}">
          <div class="project-entry-left">
            <span class="project-entry-cat-icon" ${catColor ? `style="color: ${catColor}; background: ${catColor}1f;"` : ''}>
              ${catIcon}
            </span>
            <div class="project-entry-info">
              <span class="project-entry-name">${escapeHtml(displayTitle)}${receiptBadgeHtml}</span>
              <span class="project-entry-meta">${escapeHtml(metaParts.join(' · '))}</span>
            </div>
          </div>
          <div class="project-entry-right">
            <span class="project-entry-amount mono-amount">-${sym} ${formatNumber(entry.amount)}</span>
            ${actionsHtml}
          </div>
        </div>
      `;
    })
    .join('');
}

function toggleEditProjectMeta() {
  const fund = getActiveDetailProject();
  if (!fund || fund.status === 'settled' || !elements.projectMetaEditPanel)
    return;

  const willShow = elements.projectMetaEditPanel.classList.contains('hidden');
  if (willShow) {
    if (elements.projectDetailEditTitle) {
      elements.projectDetailEditTitle.value = fund.title || '';
    }
    if (elements.projectDetailEditTarget) {
      elements.projectDetailEditTarget.value = String(fund.target_amount || '');
    }
    if (elements.editProjectIncludeBudgetCheck) {
      elements.editProjectIncludeBudgetCheck.checked = Boolean(
        fund.include_in_budget,
      );
    }
    applyProjectTimeframeUI(
      'edit',
      fund.timeframe_type || 'indefinite',
      fund.start_date || getLocalDateString(),
      fund.deadline || null,
    );
    elements.projectMetaEditPanel.classList.remove('hidden');
    elements.projectDetailEditTitle?.focus();
  } else {
    elements.projectMetaEditPanel.classList.add('hidden');
  }
}

async function saveProjectMeta() {
  const fund = getActiveDetailProject();
  if (!fund || fund.status === 'settled') return;

  const isZh = state.lang === 'zh';
  const nextTitle = (elements.projectDetailEditTitle?.value || '').trim();
  const nextTarget = parseFloat(elements.projectDetailEditTarget?.value) || 0;
  const includeInBudget = Boolean(
    elements.editProjectIncludeBudgetCheck?.checked,
  );
  const timeframeType = state.editProjectTimeframe || 'indefinite';
  const startStr =
    elements.editProjectStartInput?.value ||
    fund.start_date ||
    getLocalDateString();
  const rawDeadlineStr = elements.editProjectDeadlineInput?.value || null;
  const computedDates = computeTimeframeDates(
    timeframeType,
    startStr,
    rawDeadlineStr,
  );

  if (!nextTitle) {
    return showToast(
      isZh ? '专款名称不能为空' : 'Project name is required',
      true,
    );
  }
  if (nextTarget <= 0) {
    return showToast(
      isZh ? '请输入有效的预算金额' : 'Please enter a valid budget amount',
      true,
    );
  }
  if (
    timeframeType !== 'indefinite' &&
    computedDates.deadline &&
    computedDates.deadline < computedDates.start_date
  ) {
    return showToast(
      isZh
        ? '截止日期不能早于开始日期'
        : 'Deadline cannot be earlier than start date',
      true,
    );
  }

  fund.title = nextTitle;
  fund.target_amount = Number(nextTarget.toFixed(2));
  fund.include_in_budget = includeInBudget;
  fund.mode = includeInBudget ? 'budget_deduct' : 'extra';
  fund.timeframe_type = timeframeType;
  fund.start_date = computedDates.start_date;
  fund.deadline = computedDates.deadline;
  elements.projectMetaEditPanel?.classList.add('hidden');

  saveProjects(state.projects);
  renderSinkingFunds();
  renderBudgetTracker();
  renderProjectDetailModal();
  triggerHaptic(12);
  showToast(isZh ? '已更新专款设置' : 'Project updated');
  await syncProjectChangeToCloud(fund);
}

async function saveProjectEntry(e) {
  if (e) e.preventDefault();
  const fund = getActiveDetailProject();
  if (!fund || fund.status === 'settled') return;

  const isZh = state.lang === 'zh';
  const title = (elements.projectEntryTitleInput?.value || '').trim();
  const amount = parseFloat(elements.projectEntryAmountInput?.value) || 0;
  const date = elements.projectEntryDateInput?.value || getLocalDateString();
  const category = state.selectedProjectEntryCategory || 'Other Expense';
  const accountName = state.selectedProjectEntryAccount || 'Cash';

  if (amount <= 0) {
    return showToast(
      isZh ? '请输入有效支出金额' : 'Please enter a valid amount',
      true,
    );
  }

  let entries = normalizeProjectEntries(fund.entries);

  // Preserve pre-existing aggregate spent_amount if converting a legacy card on first item
  if (entries.length === 0 && (parseFloat(fund.spent_amount) || 0) > 0) {
    entries.push({
      id: 'pentry_legacy_' + Date.now(),
      title: isZh ? '历史已用金额' : 'Previous Spent Balance',
      category: 'Other Expense',
      account_name: 'Cash',
      amount: Number((parseFloat(fund.spent_amount) || 0).toFixed(2)),
      date: getLocalDateString(),
      created_at: fund.created_at || new Date().toISOString(),
    });
  }

  let nextImageUrl = state.pendingProjectReceiptDataUrl || null;
  const nextImageSizeKb = state.pendingProjectReceiptSizeKb || 0;
  if (
    nextImageUrl &&
    String(nextImageUrl).startsWith('data:image/') &&
    typeof uploadReceiptToCloud === 'function'
  ) {
    nextImageUrl = await uploadReceiptToCloud(nextImageUrl);
  }

  if (state.editingProjectEntryId) {
    const idx = entries.findIndex(
      (item) => String(item.id) === String(state.editingProjectEntryId),
    );
    if (idx !== -1) {
      const previousImageUrl = entries[idx].image_url || null;
      if (
        previousImageUrl &&
        previousImageUrl !== nextImageUrl &&
        typeof deleteReceiptFromCloud === 'function'
      ) {
        deleteReceiptFromCloud(previousImageUrl);
      }
      entries[idx] = {
        ...entries[idx],
        title,
        category,
        account_name: accountName,
        amount: Number(amount.toFixed(2)),
        date,
        image_url: nextImageUrl,
        image_size_kb: nextImageSizeKb,
      };
    }
  } else {
    entries.unshift({
      id: 'pentry_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      title,
      category,
      account_name: accountName,
      amount: Number(amount.toFixed(2)),
      date,
      image_url: nextImageUrl,
      image_size_kb: nextImageSizeKb,
      created_at: new Date().toISOString(),
    });
  }

  fund.entries = entries;
  fund.spent_amount = getProjectSpentAmount(fund);

  const wasEditing = Boolean(state.editingProjectEntryId);
  resetProjectEntryForm();

  saveProjects(state.projects);
  renderSinkingFunds();
  renderBudgetTracker();
  renderProjectDetailModal();

  triggerHaptic(12);
  showToast(
    wasEditing
      ? isZh
        ? '明细已更新'
        : 'Entry updated'
      : isZh
        ? '已记入专款'
        : 'Entry added to project',
  );
  await syncProjectChangeToCloud(fund);
}

function editProjectEntry(entryId) {
  const fund = getActiveDetailProject();
  if (!fund || fund.status === 'settled') return;

  const entries = normalizeProjectEntries(fund.entries);
  const targetEntry = entries.find(
    (item) => String(item.id) === String(entryId),
  );
  if (!targetEntry) return;

  triggerHaptic(8);
  state.editingProjectEntryId = String(targetEntry.id);
  state.selectedProjectEntryCategory = targetEntry.category || 'Other Expense';
  state.selectedProjectEntryAccount = targetEntry.account_name || 'Cash';

  if (elements.projectEntryTitleInput) {
    elements.projectEntryTitleInput.value = targetEntry.title || '';
  }
  if (elements.projectEntryAmountInput) {
    elements.projectEntryAmountInput.value = String(targetEntry.amount || '');
  }
  if (elements.projectEntryDateInput) {
    elements.projectEntryDateInput.value =
      targetEntry.date || getLocalDateString();
  }
  clearPendingProjectReceipt();
  if (targetEntry.image_url) {
    state.pendingProjectReceiptDataUrl = targetEntry.image_url;
    state.pendingProjectReceiptSizeKb = targetEntry.image_size_kb || 0;
    if (elements.projectReceiptPreviewImg) {
      elements.projectReceiptPreviewImg.src = targetEntry.image_url;
    }
    if (elements.projectReceiptPreviewMeta) {
      elements.projectReceiptPreviewMeta.textContent = targetEntry.image_size_kb
        ? `${targetEntry.image_size_kb} KB · WebP`
        : t('receipt_attached');
    }
    elements.projectReceiptPreviewDrawer?.classList.remove('hidden');
    elements.triggerProjectReceiptBtn?.classList.add('active');
  }
  if (elements.saveProjectEntryBtn) {
    elements.saveProjectEntryBtn.textContent = t('btn_save_project_entry');
  }
  elements.cancelProjectEntryEditBtn?.classList.remove('hidden');
  renderProjectDetailModal();
  elements.projectEntryAmountInput?.focus();
}

function cancelProjectEntryEdit() {
  triggerHaptic(8);
  resetProjectEntryForm();
  renderProjectDetailModal();
}

async function deleteProjectEntry(entryId) {
  const fund = getActiveDetailProject();
  if (!fund || fund.status === 'settled') return;

  const isZh = state.lang === 'zh';
  const currentEntries = normalizeProjectEntries(fund.entries);
  const removedEntry = currentEntries.find(
    (item) => String(item.id) === String(entryId),
  );
  if (removedEntry?.image_url && typeof deleteReceiptFromCloud === 'function') {
    deleteReceiptFromCloud(removedEntry.image_url);
  }
  const entries = currentEntries.filter(
    (item) => String(item.id) !== String(entryId),
  );
  fund.entries = entries;
  fund.spent_amount = entries.reduce((sum, item) => sum + item.amount, 0);

  if (
    state.editingProjectEntryId &&
    String(state.editingProjectEntryId) === String(entryId)
  ) {
    resetProjectEntryForm();
  }

  saveProjects(state.projects);
  renderSinkingFunds();
  renderBudgetTracker();
  renderProjectDetailModal();

  triggerHaptic(12);
  showToast(isZh ? '已删除该笔专款明细' : 'Project entry removed');
  await syncProjectChangeToCloud(fund);
}

function completeProject(fundId) {
  const targetId = fundId || state.activeProjectId;
  const fund = (state.projects || []).find(
    (p) => String(p.id) === String(targetId),
  );
  if (!fund) return;

  triggerHaptic(10);
  const isZh = state.lang === 'zh';
  const target = parseFloat(fund.target_amount) || 0;
  const spent = getProjectSpentAmount(fund);
  const outcome = formatProjectOutcomeSummary(target, spent, true);

  showConfirmModal({
    title: isZh ? '确认完成该专款？' : 'Complete Project Card?',
    subtitle: `${fund.title} · ${outcome.fullText}`,
    desc: t('confirm_complete_project'),
    confirmText: isZh ? '确认完成' : 'Complete',
    danger: false,
    onConfirm: async () => {
      fund.status = 'settled';
      resetProjectEntryForm();
      elements.projectMetaEditPanel?.classList.add('hidden');

      saveProjects(state.projects);
      renderSinkingFunds();
      renderBudgetTracker();
      if (
        state.activeProjectId &&
        String(state.activeProjectId) === String(fund.id)
      ) {
        renderProjectDetailModal();
      }

      triggerHaptic(15);
      showToast(
        isZh
          ? `专款【${fund.title}】已完成 (${outcome.fullText})`
          : `"${fund.title}" completed (${outcome.fullText})`,
      );

      await syncProjectChangeToCloud(fund, { status: 'settled' });
      try {
        await fetch('/api/projects/' + fund.id + '/settle', {
          method: 'PATCH',
          headers: getAuthHeaders(),
        });
      } catch (e) {}
    },
  });
}

function resumeProject(fundId) {
  const targetId = fundId || state.activeProjectId;
  const fund = (state.projects || []).find(
    (p) => String(p.id) === String(targetId),
  );
  if (!fund) return;

  triggerHaptic(10);
  const isZh = state.lang === 'zh';

  showConfirmModal({
    title: isZh ? '确认恢复该专款？' : 'Resume Project Card?',
    subtitle: fund.title,
    desc: t('confirm_resume_project'),
    confirmText: isZh ? '确认恢复' : 'Resume',
    danger: false,
    onConfirm: async () => {
      fund.status = 'active';
      resetProjectEntryForm();

      saveProjects(state.projects);
      renderSinkingFunds();
      renderBudgetTracker();
      if (
        state.activeProjectId &&
        String(state.activeProjectId) === String(fund.id)
      ) {
        renderProjectDetailModal();
      }

      triggerHaptic(12);
      showToast(
        isZh
          ? `专款【${fund.title}】已恢复为进行中`
          : `"${fund.title}" resumed`,
      );

      await syncProjectChangeToCloud(fund, { status: 'active' });
      try {
        await fetch('/api/projects/' + fund.id + '/resume', {
          method: 'PATCH',
          headers: getAuthHeaders(),
        });
      } catch (e) {}
    },
  });
}

function deleteProject(fundId) {
  triggerHaptic(10);
  const targetId = fundId || state.activeProjectId;
  const fund = (state.projects || []).find(
    (p) => String(p.id) === String(targetId),
  );
  if (!fund) return;

  const isZh = state.lang === 'zh';

  showConfirmModal({
    title: isZh ? '确认删除该专款？' : 'Delete Project Card?',
    subtitle: fund.title,
    desc: t('confirm_cancel_project'),
    confirmText: isZh ? '确认删除' : 'Delete',
    danger: true,
    onConfirm: async () => {
      addDeletedId(getDeletedProjectsStorageKey(), fund.id);
      state.projects = (state.projects || []).filter(
        (p) => String(p.id) !== String(fund.id),
      );
      if (
        state.activeProjectId &&
        String(state.activeProjectId) === String(fund.id)
      ) {
        closeProjectDetailModal(false);
      }
      saveProjects(state.projects);
      renderSinkingFunds();
      renderBudgetTracker();

      if (supabaseClient && state.user?.id) {
        try {
          await supabaseClient
            .from('projects')
            .delete()
            .eq('id', fund.id)
            .eq('user_id', state.user.id);
        } catch (e) {}
      }

      try {
        await fetch('/api/projects/' + fund.id, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
      } catch (e) {}
      triggerHaptic(15);
      showToast(isZh ? '专款卡片已删除' : 'Project card deleted');
    },
  });
}

// Claims Actions
function renderClaimReceiveMethodGrid(selectedMethod) {
  const grid = elements.claimReceiveMethodGrid;
  if (!grid) return;

  grid.innerHTML = DEFAULT_ACCOUNTS.map((acc) => {
    const label = getAccountDisplayLabel(acc.name);
    const isActive = acc.name === selectedMethod;
    return `
      <button
        type="button"
        class="claim-receive-method-chip ${isActive ? 'active' : ''}"
        data-receive-method="${escapeHtml(acc.name)}"
      >
        ${acc.icon}
        <span>${escapeHtml(label)}</span>
      </button>
    `;
  }).join('');

  grid.querySelectorAll('.claim-receive-method-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      triggerHaptic(8);
      const chosen = btn.dataset.receiveMethod || 'eWallet';
      state.lastClaimReceiveMethod = chosen;
      grid.querySelectorAll('.claim-receive-method-chip').forEach((b) => {
        b.classList.toggle('active', b === btn);
      });
    });
  });
}

function openClaimReceiveModal(actionMeta) {
  if (!elements.claimReceiveModal) return;
  const sym = state.currency || 'RM';
  const isZh = state.lang === 'zh';
  state.pendingClaimReceiveAction = actionMeta;

  if (elements.claimReceiveModalSub) {
    elements.claimReceiveModalSub.textContent = actionMeta.subtitle || '';
  }

  const defaultMethod = state.lastClaimReceiveMethod || 'eWallet';
  renderClaimReceiveMethodGrid(defaultMethod);

  elements.claimReceiveModal.classList.remove('hidden');
  pushModalHistoryState();
}

function closeClaimReceiveModal(fromPopState = false) {
  triggerHaptic(8);
  elements.claimReceiveModal?.classList.add('hidden');
  state.pendingClaimReceiveAction = null;
  popModalHistoryIfCleared(fromPopState === true);
}

async function confirmClaimReceivePayment() {
  const action = state.pendingClaimReceiveAction;
  if (!action) {
    closeClaimReceiveModal(false);
    return;
  }
  const claim = (state.claims || []).find((c) => c.id === action.claimId);
  const method = state.lastClaimReceiveMethod || 'eWallet';
  closeClaimReceiveModal(false);
  if (!claim) return;

  const isZh = state.lang === 'zh';
  const methodLabel = getAccountDisplayLabel(method);

  if (action.mode === 'single') {
    const friend = claim.friends?.[action.friendIdx];
    if (!friend) return;
    friend.paid = true;
    friend.paid_via = method;
    claim.status = claim.friends.every((f) => f.paid) ? 'settled' : 'active';
    saveClaims(state.claims);
    renderClaims();

    if (supabaseClient && state.user?.id) {
      try {
        await supabaseClient
          .from('claims')
          .update({
            friends: claim.friends,
            status: claim.status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', claim.id)
          .eq('user_id', state.user.id);
      } catch (e) {}
    }

    try {
      await fetch(`/api/claims/${claim.id}/friend/${action.friendIdx}`, {
        method: 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ paid_via: method }),
      });
    } catch (e) {}

    triggerHaptic(12);
    showToast(
      isZh
        ? `已收到 ${friend.name} 的 ${state.currency} ${formatNumber(friend.amount)}（${methodLabel}）`
        : `Received ${state.currency} ${formatNumber(friend.amount)} from ${friend.name} (${methodLabel})`,
    );
    return;
  }

  if (action.mode === 'all') {
    (claim.friends || []).forEach((f) => {
      if (!f.paid) {
        f.paid = true;
        f.paid_via = method;
      } else if (!f.paid_via) {
        f.paid_via = method;
      }
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
          .eq('id', claim.id)
          .eq('user_id', state.user.id);
      } catch (e) {}
    }

    try {
      await fetch(`/api/claims/${claim.id}/settle-all`, {
        method: 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ paid_via: method }),
      });
    } catch (e) {}

    triggerHaptic(15);
    showToast(
      isZh
        ? `该笔代垫款项已全额结清（${methodLabel}）`
        : `All shares settled (${methodLabel})`,
    );
  }
}

async function toggleClaimFriendPaid(claimId, friendIdx) {
  triggerHaptic(12);
  const claim = (state.claims || []).find((c) => c.id === claimId);
  if (!claim || !claim.friends?.[friendIdx]) return;

  const friend = claim.friends[friendIdx];
  const isZh = state.lang === 'zh';
  const sym = state.currency || 'RM';

  if (!friend.paid) {
    openClaimReceiveModal({
      mode: 'single',
      claimId,
      friendIdx,
      subtitle: `${friend.name} · ${sym} ${formatNumber(friend.amount)}`,
    });
    return;
  }

  friend.paid = false;
  delete friend.paid_via;
  claim.status = 'active';
  saveClaims(state.claims);
  renderClaims();

  if (supabaseClient && state.user?.id) {
    try {
      await supabaseClient
        .from('claims')
        .update({
          friends: claim.friends,
          status: claim.status,
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

  showToast(isZh ? '已标记为待收' : 'Marked as pending');
}

function settleAllClaim(claimId) {
  triggerHaptic(12);
  const claim = (state.claims || []).find((c) => c.id === claimId);
  if (!claim) return;

  const sym = state.currency || 'RM';
  const isZh = state.lang === 'zh';
  const unpaidFriends = (claim.friends || []).filter((f) => !f.paid);
  const pendingAmt = unpaidFriends.reduce(
    (sum, f) => sum + (parseFloat(f.amount) || 0),
    0,
  );
  const subtitle = isZh
    ? `${claim.title} · 待收 ${unpaidFriends.length} 人 (${sym} ${formatNumber(pendingAmt)})`
    : `${claim.title} · ${unpaidFriends.length} pending (${sym} ${formatNumber(pendingAmt)})`;

  openClaimReceiveModal({
    mode: 'all',
    claimId,
    subtitle,
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
      if (
        state.editingClaimId &&
        String(state.editingClaimId) === String(claimId)
      ) {
        closeEditClaimModal(false);
      }
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

function openProjectSettingsEdit(fundId) {
  openProjectDetailModal(fundId);
  if (elements.projectMetaEditPanel?.classList.contains('hidden')) {
    toggleEditProjectMeta();
  }
}

function addEditClaimFriendRow(
  defaultName = '',
  defaultAmount = '',
  defaultPaid = false,
  defaultPaidVia = '',
) {
  const list = elements.editClaimFriendsList;
  if (!list) return;

  const isZh = state.lang === 'zh';
  const methodOptionsHtml = [
    `<option value="">${escapeHtml(t('claim_via_unrecorded'))}</option>`,
    ...DEFAULT_ACCOUNTS.map((acc) => {
      const selected = defaultPaidVia === acc.name ? 'selected' : '';
      return `<option value="${escapeHtml(acc.name)}" ${selected}>${escapeHtml(getAccountDisplayLabel(acc.name))}</option>`;
    }),
  ].join('');

  const row = document.createElement('div');
  row.className = 'edit-claim-friend-row';
  row.innerHTML = `
    <input
      type="text"
      class="clean-form-input edit-claim-friend-name"
      placeholder="${t('friend_name_placeholder')}"
      value="${escapeHtml(defaultName)}"
      maxlength="40"
      required
    />
    <input
      type="number"
      class="clean-form-input mono-amount edit-claim-friend-amount"
      placeholder="0.00"
      step="0.01"
      min="0"
      inputmode="decimal"
      value="${defaultAmount}"
      required
    />
    <label class="edit-claim-paid-toggle">
      <input type="checkbox" class="edit-claim-friend-paid" ${defaultPaid ? 'checked' : ''} />
      <span>${isZh ? '已还' : 'Paid'}</span>
    </label>
    <button type="button" class="btn-friend-delete" title="Remove">&times;</button>
    <div class="edit-claim-friend-via-row ${defaultPaid ? '' : 'hidden'}">
      <span class="edit-claim-friend-via-label">${isZh ? '收款方式' : 'Paid via'}</span>
      <select class="edit-claim-friend-via">
        ${methodOptionsHtml}
      </select>
    </div>
  `;

  const paidCheck = row.querySelector('.edit-claim-friend-paid');
  const viaRow = row.querySelector('.edit-claim-friend-via-row');
  const viaSelect = row.querySelector('.edit-claim-friend-via');
  paidCheck?.addEventListener('change', () => {
    const isChecked = Boolean(paidCheck.checked);
    viaRow?.classList.toggle('hidden', !isChecked);
    if (!isChecked && viaSelect) {
      viaSelect.value = '';
    }
  });

  row
    .querySelector('.edit-claim-friend-amount')
    ?.addEventListener('input', recalcEditClaimMyShare);
  row.querySelector('.btn-friend-delete')?.addEventListener('click', () => {
    row.remove();
    recalcEditClaimMyShare();
  });

  list.appendChild(row);
}

function recalcEditClaimMyShare() {
  const total = parseFloat(elements.editClaimTotalInput?.value) || 0;
  let friendsSum = 0;
  elements.editClaimFriendsList
    ?.querySelectorAll('.edit-claim-friend-amount')
    .forEach((inp) => {
      friendsSum += parseFloat(inp.value) || 0;
    });

  const isOver = friendsSum > total + 0.001;
  elements.editClaimOverSumWarn?.classList.toggle('hidden', !isOver);
  if (elements.editClaimMyShareInput) {
    const computed = Math.max(0, Number((total - friendsSum).toFixed(2)));
    elements.editClaimMyShareInput.value = String(computed);
  }
}

function openEditClaimModal(claimId) {
  const claim = (state.claims || []).find(
    (c) => String(c.id) === String(claimId),
  );
  if (!claim || !elements.editClaimModal) return;

  triggerHaptic(10);
  state.editingClaimId = String(claim.id);

  if (elements.editClaimTitleInput) {
    elements.editClaimTitleInput.value = claim.title || '';
  }
  if (elements.editClaimTotalInput) {
    elements.editClaimTotalInput.value = String(claim.total_amount ?? '');
  }
  if (elements.editClaimDateInput) {
    elements.editClaimDateInput.value = claim.date || getLocalDateString();
  }
  if (elements.editClaimFriendsList) {
    elements.editClaimFriendsList.innerHTML = '';
    const friends = Array.isArray(claim.friends) ? claim.friends : [];
    if (friends.length === 0) {
      addEditClaimFriendRow('', '', false);
    } else {
      friends.forEach((f) => {
        addEditClaimFriendRow(
          f.name || '',
          f.amount ?? '',
          Boolean(f.paid),
          f.paid_via || '',
        );
      });
    }
  }
  if (elements.editClaimMyShareInput) {
    elements.editClaimMyShareInput.value = String(claim.my_share ?? 0);
  }
  elements.editClaimOverSumWarn?.classList.add('hidden');
  recalcEditClaimMyShare();

  elements.editClaimModal.classList.remove('hidden');
  pushModalHistoryState();
}

function closeEditClaimModal(fromPopState = false) {
  triggerHaptic(8);
  elements.editClaimModal?.classList.add('hidden');
  state.editingClaimId = null;
  popModalHistoryIfCleared(fromPopState === true);
}

async function saveEditClaim() {
  if (!state.editingClaimId) return;
  const claim = (state.claims || []).find(
    (c) => String(c.id) === String(state.editingClaimId),
  );
  if (!claim) return;

  const isZh = state.lang === 'zh';
  const title = (elements.editClaimTitleInput?.value || '').trim();
  const totalAmount = parseFloat(elements.editClaimTotalInput?.value) || 0;
  const date = elements.editClaimDateInput?.value || getLocalDateString();

  if (!title) {
    return showToast(
      isZh ? '请输入代垫项目名称' : 'Claim title is required',
      true,
    );
  }
  if (totalAmount <= 0) {
    return showToast(
      isZh ? '请输入有效的总付金额' : 'Please enter a valid total amount',
      true,
    );
  }

  const friends = [];
  elements.editClaimFriendsList
    ?.querySelectorAll('.edit-claim-friend-row')
    .forEach((row) => {
      const name = (
        row.querySelector('.edit-claim-friend-name')?.value || ''
      ).trim();
      const amount =
        parseFloat(row.querySelector('.edit-claim-friend-amount')?.value) || 0;
      const paid = Boolean(
        row.querySelector('.edit-claim-friend-paid')?.checked,
      );
      const paidVia = paid
        ? (row.querySelector('.edit-claim-friend-via')?.value || '').trim()
        : '';
      if (name && amount > 0) {
        const item = { name, amount: Number(amount.toFixed(2)), paid };
        if (paidVia) item.paid_via = paidVia;
        friends.push(item);
      }
    });

  if (friends.length === 0) {
    return showToast(
      isZh
        ? '请至少保留一位有效分摊对象及金额'
        : 'Please add at least one valid split party',
      true,
    );
  }

  const friendsSum = friends.reduce((sum, f) => sum + f.amount, 0);
  if (friendsSum > totalAmount + 0.001) {
    return showToast(
      isZh
        ? '分摊总额不能超过总付金额'
        : 'Split sum cannot exceed total amount',
      true,
    );
  }

  const myShareRaw = parseFloat(elements.editClaimMyShareInput?.value);
  const myShare = Number.isNaN(myShareRaw)
    ? Math.max(0, Number((totalAmount - friendsSum).toFixed(2)))
    : Math.max(0, Number(myShareRaw.toFixed(2)));

  claim.title = title;
  claim.total_amount = Number(totalAmount.toFixed(2));
  claim.my_share = myShare;
  claim.friends = friends;
  claim.date = date;
  claim.status = friends.every((f) => f.paid) ? 'settled' : 'active';

  saveClaims(state.claims);
  renderClaims();
  closeEditClaimModal(false);
  triggerHaptic(12);
  showToast(isZh ? '已更新代垫账单' : 'Claim updated');

  if (supabaseClient && state.user?.id) {
    try {
      await supabaseClient
        .from('claims')
        .update({
          title: claim.title,
          total_amount: claim.total_amount,
          my_share: claim.my_share,
          friends: claim.friends,
          status: claim.status,
          date: claim.date,
          updated_at: new Date().toISOString(),
        })
        .eq('id', claim.id)
        .eq('user_id', state.user.id);
    } catch (e) {}
  }

  try {
    await fetch(`/api/claims/${claim.id}`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        title: claim.title,
        totalAmount: claim.total_amount,
        myShare: claim.my_share,
        friends: claim.friends,
        status: claim.status,
        date: claim.date,
      }),
    });
  } catch (e) {}
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

function distributeSplitEvenly(
  totalAmount,
  friendAmountInputs,
  onAfterDistribute,
) {
  const isZh = state.lang === 'zh';
  const total = parseFloat(totalAmount) || 0;
  if (total <= 0) {
    showToast(
      isZh ? '请先输入有效总付金额' : 'Please enter total paid amount first',
      true,
    );
    return;
  }
  const inputs = Array.from(friendAmountInputs || []);
  if (inputs.length === 0) return;

  const participantCount = 1 + inputs.length;
  const perFriend = Number((total / participantCount).toFixed(2));
  inputs.forEach((inp) => {
    inp.value = String(perFriend);
  });
  if (typeof onAfterDistribute === 'function') {
    onAfterDistribute();
  }
  triggerHaptic(10);
}

function recalcSplitBillMyShare() {
  const total = parseFloat(elements.inputAmount?.value) || 0;
  let friendsSum = 0;
  elements.splitFriendsList
    ?.querySelectorAll('.friend-amount-input')
    .forEach((inp) => {
      friendsSum += parseFloat(inp.value) || 0;
    });

  const isOver = total > 0 ? friendsSum > total + 0.001 : friendsSum > 0.001;
  elements.splitOverSumWarn?.classList.toggle('hidden', !isOver);

  const computed = Math.max(0, Number((total - friendsSum).toFixed(2)));
  if (elements.splitMyShareInput) {
    elements.splitMyShareInput.value =
      total > 0 || friendsSum > 0 ? String(computed) : '';
  }

  if (elements.splitCalcFormula) {
    if (total > 0) {
      const sym = state.currency || 'RM';
      const isZh = state.lang === 'zh';
      elements.splitCalcFormula.textContent = isZh
        ? `总付 ${sym} ${formatNumber(total)} − 代垫 ${sym} ${formatNumber(friendsSum)} = 自付 ${sym} ${formatNumber(computed)}`
        : `Total ${sym} ${formatNumber(total)} − Split ${sym} ${formatNumber(friendsSum)} = Mine ${sym} ${formatNumber(computed)}`;
      elements.splitCalcFormula.classList.remove('hidden');
    } else {
      elements.splitCalcFormula.classList.add('hidden');
    }
  }
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
      <span class="currency-sym">${escapeHtml(state.currency || 'RM')}</span>
      <input type="number" step="0.01" min="0" placeholder="0.00" value="${defaultAmount}" class="clean-form-input friend-amount-input" required />
    </div>
    <button type="button" class="btn-friend-delete" title="Remove">&times;</button>
  `;

  row
    .querySelector('.friend-amount-input')
    ?.addEventListener('input', recalcSplitBillMyShare);
  row.querySelector('.btn-friend-delete')?.addEventListener('click', () => {
    row.remove();
    recalcSplitBillMyShare();
  });

  list.appendChild(row);
  recalcSplitBillMyShare();
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

  // 2. New Project & Project Detail Modal Triggers
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

  // Create Entry Modal Destination Switch (Daily Expense vs Dedicated Project Fund)
  elements.btnDestDaily?.addEventListener('click', () => {
    triggerHaptic(8);
    setEntryDestination('daily');
  });
  elements.btnDestFund?.addEventListener('click', () => {
    triggerHaptic(8);
    setEntryDestination('fund');
  });

  // New Project & Edit Project Timeframe Preset Pills & Start Date Recalculation
  elements.newProjectTimeframePills
    ?.querySelectorAll('.timeframe-pill-btn')
    .forEach((btn) => {
      btn.addEventListener('click', () => {
        triggerHaptic(8);
        const tf = btn.getAttribute('data-timeframe') || 'indefinite';
        applyProjectTimeframeUI(
          'new',
          tf,
          elements.newProjectStartInput?.value || getLocalDateString(),
          elements.newProjectDeadlineInput?.value || null,
        );
      });
    });
  elements.newProjectStartInput?.addEventListener('change', () => {
    applyProjectTimeframeUI(
      'new',
      state.newProjectTimeframe || 'indefinite',
      elements.newProjectStartInput.value,
      elements.newProjectDeadlineInput?.value || null,
    );
  });

  elements.editProjectTimeframePills
    ?.querySelectorAll('.timeframe-pill-btn')
    .forEach((btn) => {
      btn.addEventListener('click', () => {
        triggerHaptic(8);
        const tf = btn.getAttribute('data-timeframe') || 'indefinite';
        applyProjectTimeframeUI(
          'edit',
          tf,
          elements.editProjectStartInput?.value || getLocalDateString(),
          elements.editProjectDeadlineInput?.value || null,
        );
      });
    });
  elements.editProjectStartInput?.addEventListener('change', () => {
    applyProjectTimeframeUI(
      'edit',
      state.editProjectTimeframe || 'indefinite',
      elements.editProjectStartInput.value,
      elements.editProjectDeadlineInput?.value || null,
    );
  });

  elements.closeProjectDetailModalBtn?.addEventListener('click', () =>
    closeProjectDetailModal(false),
  );
  elements.projectDetailModal?.addEventListener('click', (e) => {
    if (e.target === elements.projectDetailModal) {
      closeProjectDetailModal(false);
    }
  });
  elements.toggleEditProjectMetaBtn?.addEventListener(
    'click',
    toggleEditProjectMeta,
  );
  elements.cancelProjectMetaBtn?.addEventListener('click', () => {
    elements.projectMetaEditPanel?.classList.add('hidden');
  });
  elements.saveProjectMetaBtn?.addEventListener('click', saveProjectMeta);
  elements.projectEntryForm?.addEventListener('submit', saveProjectEntry);
  elements.cancelProjectEntryEditBtn?.addEventListener(
    'click',
    cancelProjectEntryEdit,
  );
  elements.detailDeleteProjectBtn?.addEventListener('click', () =>
    deleteProject(),
  );
  elements.detailCompleteProjectBtn?.addEventListener('click', () =>
    completeProject(),
  );
  elements.detailResumeProjectBtn?.addEventListener('click', () =>
    resumeProject(),
  );

  // Project Entry Receipt Photo Upload & Preview
  elements.triggerProjectReceiptBtn?.addEventListener('click', () => {
    triggerHaptic(8);
    elements.projectReceiptFileInput?.click();
  });
  elements.projectReceiptFileInput?.addEventListener('change', (e) => {
    handleProjectReceiptFileSelected(e);
  });
  elements.removeProjectReceiptBtn?.addEventListener('click', () => {
    clearPendingProjectReceipt();
  });
  elements.previewProjectReceiptThumbWrap?.addEventListener('click', () => {
    if (
      state.pendingProjectReceiptDataUrl &&
      typeof openReceiptLightbox === 'function'
    ) {
      openReceiptLightbox(
        state.pendingProjectReceiptDataUrl,
        t('receipt_attached'),
        elements.projectReceiptPreviewMeta?.textContent || '',
      );
    }
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
    const cb = currentConfirmCallback;
    currentConfirmCallback = null;
    closeConfirmModal();
    if (typeof cb === 'function') {
      await cb();
    }
  });

  // 5. Create Transaction Advanced Toggles
  elements.toggleSplitBillBtn?.addEventListener('click', () => {
    triggerHaptic(10);
    const isOpen = !elements.splitBillDrawer?.classList.contains('hidden');
    elements.splitBillDrawer?.classList.toggle('hidden', isOpen);
    elements.toggleSplitBillBtn?.classList.toggle('active', !isOpen);

    if (!isOpen) {
      if (
        elements.splitFriendsList &&
        elements.splitFriendsList.children.length === 0
      ) {
        addSplitFriendRow();
      } else {
        recalcSplitBillMyShare();
      }
    }
  });

  elements.inputAmount?.addEventListener('input', () => {
    if (elements.toggleSplitBillBtn?.classList.contains('active')) {
      recalcSplitBillMyShare();
    }
  });

  elements.splitEvenlyBtn?.addEventListener('click', () => {
    if (
      elements.splitFriendsList &&
      elements.splitFriendsList.children.length === 0
    ) {
      addSplitFriendRow();
    }
    distributeSplitEvenly(
      elements.inputAmount?.value,
      elements.splitFriendsList?.querySelectorAll('.friend-amount-input'),
      recalcSplitBillMyShare,
    );
  });

  elements.addFriendRowBtn?.addEventListener('click', () => {
    triggerHaptic(8);
    addSplitFriendRow();
  });

  elements.openNewClaimBtn?.addEventListener('click', openCreateModalWithSplit);

  // Edit Claim Modal Listeners
  elements.closeEditClaimModalBtn?.addEventListener('click', () =>
    closeEditClaimModal(false),
  );
  elements.cancelEditClaimBtn?.addEventListener('click', () =>
    closeEditClaimModal(false),
  );
  elements.editClaimModal?.addEventListener('click', (e) => {
    if (e.target === elements.editClaimModal) closeEditClaimModal(false);
  });
  elements.editClaimSplitEvenlyBtn?.addEventListener('click', () => {
    if (
      elements.editClaimFriendsList &&
      elements.editClaimFriendsList.children.length === 0
    ) {
      addEditClaimFriendRow('', '', false);
    }
    distributeSplitEvenly(
      elements.editClaimTotalInput?.value,
      elements.editClaimFriendsList?.querySelectorAll(
        '.edit-claim-friend-amount',
      ),
      recalcEditClaimMyShare,
    );
  });
  elements.addEditClaimFriendBtn?.addEventListener('click', () => {
    triggerHaptic(8);
    addEditClaimFriendRow('', '', false);
  });
  elements.editClaimTotalInput?.addEventListener(
    'input',
    recalcEditClaimMyShare,
  );
  elements.saveEditClaimBtn?.addEventListener('click', saveEditClaim);
  elements.deleteClaimInModalBtn?.addEventListener('click', () => {
    if (state.editingClaimId) {
      deleteClaim(state.editingClaimId);
    }
  });

  // Claim Receive Method Modal Listeners
  elements.closeClaimReceiveModalBtn?.addEventListener('click', () =>
    closeClaimReceiveModal(false),
  );
  elements.claimReceiveModal?.addEventListener('click', (e) => {
    if (e.target === elements.claimReceiveModal) closeClaimReceiveModal(false);
  });
  elements.confirmClaimReceiveBtn?.addEventListener(
    'click',
    confirmClaimReceivePayment,
  );

  // Refresh current local date, relative day tags, month rollover, and streak when returning from background
  const handleAppWakeupRollover = () => {
    const nowMonth = getCurrentMonthKey();
    const savedLastMonth = localStorage.getItem('ledger_last_active_month');
    if (
      (state.lastActiveMonth && state.lastActiveMonth !== nowMonth) ||
      (savedLastMonth && savedLastMonth !== nowMonth)
    ) {
      state.lastActiveMonth = nowMonth;
      try {
        localStorage.setItem('ledger_last_active_month', nowMonth);
      } catch (e) {}
      state.currentMonth = nowMonth;
      state.selectedAccountsMonth = 'current';
      updateMonthFilterDropdown(state.records);
      loadSummary();
    }
    if (
      elements.inputDate &&
      (!elements.createEntryModal ||
        elements.createEntryModal.classList.contains('hidden'))
    ) {
      elements.inputDate.value = getLocalDateString();
    }
    renderTable();
    renderClaims();
    renderStreakAndBadges();
    updateAccountModalData();
    renderAccountsCenter();
    if (
      navigator.onLine &&
      Date.now() - lastAutoUpdateCheckAt >= AUTO_UPDATE_CHECK_COOLDOWN_MS
    ) {
      checkForAppUpdates(false);
    }
  };

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      handleAppWakeupRollover();
    }
  });
  window.addEventListener('focus', handleAppWakeupRollover);
}

// Start Application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
