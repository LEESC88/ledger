/* MonetaX Engine - Core Constants, State, DOM Refs, Formatting, Language & Modals */

/**
 * ============================================================================
 * MonetaX — Client Application Engine (Minimalist Pro Max Edition)
 * Pure Vanilla JavaScript • Multi-Page Mobile Architecture • Bilingual (EN/中文)
 * ============================================================================
 */
// Current Client Release Version
const APP_VERSION = '1.6.1';

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

  // Export Format Modal (Excel / CSV)
  exportFormatModal: document.getElementById('exportFormatModal'),
  closeExportFormatModalBtn: document.getElementById(
    'closeExportFormatModalBtn',
  ),
  exportScopeSummary: document.getElementById('exportScopeSummary'),
  exportAsExcelBtn: document.getElementById('exportAsExcelBtn'),
  exportAsCsvBtn: document.getElementById('exportAsCsvBtn'),

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
    elements.exportFormatModal,
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
    elements.exportFormatModal &&
    !elements.exportFormatModal.classList.contains('hidden')
  ) {
    if (typeof closeExportFormatModal === 'function') {
      closeExportFormatModal(fromPopState);
    } else {
      elements.exportFormatModal.classList.add('hidden');
    }
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
