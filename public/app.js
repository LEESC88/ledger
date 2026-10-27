/**
 * ============================================================================
 * LEDGER — Client Application Engine (Minimalist Pro Max Edition v1.3.0)
 * Pure Vanilla JavaScript • Multi-Page Mobile Architecture • Bilingual (EN/中文)
 * ============================================================================
 */

// Current Client Release Version
const APP_VERSION = '1.3.4';

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

// Visual Category Metadata (Icons + Bilingual Labels)
const CATEGORY_META = {
  'Food & Dining': { icon: '🍽️', en: 'Dining', zh: '餐饮美食' },
  Transportation: { icon: '🚗', en: 'Transport', zh: '交通出行' },
  Shopping: { icon: '🛍️', en: 'Shopping', zh: '购物消费' },
  'Housing & Utilities': { icon: '🏠', en: 'Housing', zh: '居家水电' },
  Entertainment: { icon: '🎬', en: 'Leisure', zh: '休闲娱乐' },
  Healthcare: { icon: '💊', en: 'Medical', zh: '医疗健康' },
  Subscriptions: { icon: '🔄', en: 'Subscript.', zh: '会员订阅' },
  'Other Expense': { icon: '📦', en: 'Other', zh: '其他支出' },
  Salary: { icon: '💰', en: 'Salary', zh: '薪资收入' },
  Freelance: { icon: '💻', en: 'Freelance', zh: '兼职副业' },
  'Investment & Dividends': { icon: '📈', en: 'Invest', zh: '投资理财' },
  Bonus: { icon: '🎁', en: 'Bonus', zh: '奖金补贴' },
  Refund: { icon: '↩️', en: 'Refund', zh: '退款报销' },
  'Other Income': { icon: '✨', en: 'Other', zh: '其他收入' },
};

// Full Bilingual Dictionary (English & Simplified Chinese)
const I18N = {
  en: {
    login_badge: 'Personal Finance Pro',
    login_headline: 'Minimalist Bookkeeping, Cloud Synchronized.',
    login_subhead:
      'Instant offline entry paired with real-time Supabase Cloud sync and visual budget analytics.',
    login_feat_1: '⚡ Offline-First',
    login_feat_2: '☁️ Cloud Sync',
    login_feat_3: '📊 Budget Alerts',
    login_google_btn: 'Continue with Google',
    login_security_note: 'End-to-End User Isolation • Google OAuth 2.0',
    login_subtitle: 'Minimalist Personal Finance & Cloud Ledger',
    feat_instant: 'Instant Record',
    feat_analytics: 'Smart Analytics',
    feat_sync: 'Cloud Sync',
    continue_google: 'Continue with Google',
    login_encrypted_note: 'End-to-end isolated cloud storage via Google OAuth 2.0',
    sync_synced: 'Synced',
    sync_offline: 'Offline',
    sync_syncing: 'Syncing',
    all_months: 'All Months',
    all_records: 'All Records',
    view_profile: 'Account Profile',
    change_avatar: 'Change Photo',
    reset_avatar: 'Reset Default',
    appearance: 'Appearance',
    appearance_label: 'Appearance',
    appearance_desc: 'High-contrast color theme',
    theme_light: 'Light',
    theme_dark: 'Dark',
    theme_auto: 'Auto',
    theme_system: 'System',
    preferences: 'Preferences',
    preferences_heading: 'Preferences & System',
    net_balance: 'Net Balance',
    kpi_balance: 'Net Balance',
    income: 'Income',
    kpi_income: 'Income',
    expense: 'Expense',
    kpi_expense: 'Expense',
    status_balanced: 'Balanced',
    status_surplus: 'Surplus',
    status_deficit: 'Deficit',
    ledger_title: 'Transactions',
    audit_ledger: 'Transactions',
    search_placeholder: 'Search category or note...',
    filter_all: 'All',
    filter_expense: 'Expense',
    filter_income: 'Income',
    btn_new: 'Create',
    col_date: 'Date',
    col_category: 'Category',
    col_note: 'Note',
    col_amount: 'Amount',
    col_action: 'Action',
    empty_records: 'No records found for this period',
    empty_ledger: 'No transactions recorded yet.',
    create_first_record: '+ Record First Transaction',
    tap_create_first: '+ Tap to record your first entry',
    monthly_budget: 'Monthly Budget',
    edit_limit: 'Edit Limit',
    btn_set_budget: 'Set Limit',
    spent_label: 'Spent',
    spent: 'Spent:',
    limit_label: 'Limit',
    limit: 'Limit:',
    budget_used_suffix: 'of budget used',
    remaining: 'Remaining',
    exceeded_by: 'Exceeded by',
    expense_distribution: 'Expense Distribution',
    expense_structure: 'Expense Breakdown',
    chart_subtitle: 'Breakdown by category for selected period',
    categories_unit: 'Categories',
    no_expense_records: 'No expense records for this period',
    no_expenses_period: 'No expenses in this period',
    member_since: 'Member Since',
    usage_duration: 'Active Days',
    active_days: 'Active Days',
    total_records: 'Records',
    language_label: 'Language / 语言',
    language_desc: 'Interface display language',
    currency_label: 'Currency Symbol',
    currency_desc: 'Primary display currency',
    data_management_label: 'Data Backup & Cleanup',
    data_management_desc: 'Export CSV or prune old records',
    data_export_label: 'Data Backup & Archive',
    data_export_desc: 'Export CSV or clean up old records',
    export_csv: 'Export CSV',
    btn_export_csv: 'Export CSV',
    manage_archive: 'Archive',
    btn_archive: 'Archive',
    app_version_label: 'Application Version',
    up_to_date_desc: 'You are running the latest version',
    up_to_date: 'Up to date',
    check_update_btn: 'Check & Update',
    btn_check_update: 'Check Update',
    update_now: 'Update Now',
    logout_btn: 'Sign Out of Account',
    btn_sign_out: 'Sign Out of Account',
    create_modal_title: 'New Transaction',
    create_modal_sub: 'Record an expense or income entry',
    new_entry_title: 'New Transaction',
    note_placeholder: 'Optional note...',
    select_category: 'Category',
    commit_btn: 'Save Transaction',
    btn_save_entry: 'Save Transaction',
    set_budget_title: 'Monthly Budget Limit',
    target_period: 'Target Period:',
    budget_Ceiling_label: 'Budget Limit Amount',
    quick_presets: 'Quick Presets:',
    quick_select: 'Quick Presets',
    save: 'Save',
    cancel: 'Cancel',
    btn_cancel: 'Cancel',
    btn_save_budget: 'Save Limit',
    archive_modal_title: 'Data Retention & Backup',
    archive_modal_sub: 'Archive and prune old records',
    retention_threshold: 'Retention Threshold',
    eligible_records: 'Eligible Historical Records',
    retention_title: 'Data Retention & Archive',
    retention_desc: 'Export and clean up historical records older than your selected threshold.',
    archive_older_than: 'Archive records older than:',
    year_1: '1 Year',
    years_2: '2 Years',
    years_3: '3 Years (Recommended)',
    years_5: '5 Years',
    records_found: 'Matching records:',
    before_date: 'before',
    download_archive_btn: '1. Backup CSV',
    btn_download_csv: '1. Download CSV',
    purge_btn: '2. Purge Old',
    btn_purge_records: '2. Delete Old Records',
    nav_ledger: 'Ledger',
    nav_create: 'Create',
    nav_analytics: 'Analytics',
    nav_settings: 'Settings',
    inapp_update_title: 'App Update Available',
    download_and_install: 'Download & Install',
    downloading_package: 'Downloading update package...',
    keep_app_open: 'Please keep app open',
    installing_update: 'Download complete! Launching installer...',
    download_error: 'Download failed',
    account_label: 'Payment Account',
    account_cash: 'Cash',
    account_tng: 'TNG eWallet',
    account_bank: 'Bank Card',
    account_credit: 'Credit Card',
    filter_all_accounts: 'All Accounts',
    accounts_center_title: 'Accounts & Wallets',
    accounts_center_sub: 'Real-time balances & payment channels',
    net_worth: 'Net Worth',
    initial_balance: 'Initial Balance',
    edit_initial_balance: 'Edit Initial Balance',
    set_initial_balance_title: 'Set Initial Balance',
    enter_initial_balance: 'Enter starting balance for this account',
    account_updated_toast: 'Account balance updated',
  },
  zh: {
    login_badge: '极简个人财务管理',
    login_headline: '极简随手记账，云端实时同步',
    login_subhead: '支持离线秒记、Supabase 云端自动同步与月度预算图表分析。',
    login_feat_1: '⚡ 离线秒记',
    login_feat_2: '☁️ 云端同步',
    login_feat_3: '📊 预算分析',
    login_google_btn: '使用 Google 账号登录',
    login_security_note: '基于 Google OAuth 2.0 的独立加密云端存储',
    login_subtitle: '极简个人财务与云端记账本',
    feat_instant: '极速记账',
    feat_analytics: '智能图表',
    feat_sync: '云端同步',
    continue_google: '使用 Google 账号继续',
    login_encrypted_note: '基于 Google OAuth 2.0 的独立加密云端存储',
    sync_synced: '已同步',
    sync_offline: '离线模式',
    sync_syncing: '同步中',
    all_months: '所有月份',
    all_records: '全部周期',
    view_profile: '个人资料',
    change_avatar: '更换头像',
    reset_avatar: '恢复默认',
    appearance: '外观模式',
    appearance_label: '外观主题',
    appearance_desc: '高对比度浅色与深色模式',
    theme_light: '浅色',
    theme_dark: '深色',
    theme_auto: '跟随系统',
    theme_system: '跟随系统',
    preferences: '偏好设置',
    preferences_heading: '偏好与系统设置',
    net_balance: '净结余',
    kpi_balance: '净结余',
    income: '收入',
    kpi_income: '总收入',
    expense: '支出',
    kpi_expense: '总支出',
    status_balanced: '收支平衡',
    status_surplus: '结余盈余',
    status_deficit: '支出超支',
    ledger_title: '账单明细',
    audit_ledger: '账单明细',
    search_placeholder: '搜索备注或分类...',
    filter_all: '全部',
    filter_expense: '支出',
    filter_income: '收入',
    btn_new: '记一笔',
    col_date: '日期',
    col_category: '分类',
    col_note: '备注',
    col_amount: '金额',
    col_action: '操作',
    empty_records: '当前周期暂无账单记录',
    empty_ledger: '暂无记账记录',
    create_first_record: '+ 记下第一笔账单',
    tap_create_first: '+ 点击记下第一笔账单',
    monthly_budget: '每月预算监控',
    edit_limit: '设置预算',
    btn_set_budget: '设置预算',
    spent_label: '已用',
    spent: '已用:',
    limit_label: '预算',
    limit: '预算:',
    budget_used_suffix: '预算已使用',
    remaining: '剩余可用',
    exceeded_by: '已超支',
    expense_distribution: '支出分类占比',
    expense_structure: '支出分类占比',
    chart_subtitle: '当前所选周期的各项支出占比分析',
    categories_unit: '个分类',
    no_expense_records: '当前周期暂无支出记录',
    no_expenses_period: '当前周期暂无支出数据',
    member_since: '加入时间',
    usage_duration: '记账天数',
    active_days: '记账天数',
    total_records: '累计笔数',
    language_label: '语言设置 / Language',
    language_desc: '切换应用界面显示语言',
    currency_label: '默认货币符号',
    currency_desc: '应用于所有账单金额显示',
    data_management_label: '数据备份与归档',
    data_management_desc: '导出 CSV 报表或清理旧账单',
    data_export_label: '数据备份与归档',
    data_export_desc: '导出 CSV 报表或清理旧账单',
    export_csv: '导出 CSV',
    btn_export_csv: '导出 CSV',
    manage_archive: '归档清理',
    btn_archive: '归档清理',
    app_version_label: '应用版本信息',
    up_to_date_desc: '当前已是最新版本',
    up_to_date: '已是最新版本',
    check_update_btn: '检查更新',
    btn_check_update: '检查更新',
    update_now: '立即更新',
    logout_btn: '退出当前账号',
    btn_sign_out: '退出当前账号',
    create_modal_title: '新增记账',
    create_modal_sub: '快速记录一笔支出或收入',
    new_entry_title: '记一笔账',
    note_placeholder: '添加备注说明（选填）...',
    select_category: '选择分类',
    commit_btn: '保存账单',
    btn_save_entry: '保存账单',
    set_budget_title: '设置每月预算上限',
    target_period: '目标月份:',
    budget_Ceiling_label: '月度预算金额',
    quick_presets: '快捷额度:',
    quick_select: '快捷额度',
    save: '保存',
    cancel: '取消',
    btn_cancel: '取消',
    btn_save_budget: '保存预算',
    archive_modal_title: '历史数据归档与清理',
    archive_modal_sub: '备份并清理早期历史账单',
    retention_threshold: '清理时间范围',
    eligible_records: '符合条件的历史账单',
    retention_title: '历史数据归档与清理',
    retention_desc: '将早于指定年限的历史账单导出备份为 CSV，并可选择从云端清理。',
    archive_older_than: '清理早于以下年限的记录:',
    year_1: '1 年前',
    years_2: '2 年前',
    years_3: '3 年前（推荐）',
    years_5: '5 年前',
    records_found: '符合条件笔数:',
    before_date: '早于',
    download_archive_btn: '1. 导出备份 CSV',
    btn_download_csv: '1. 下载备份 CSV',
    purge_btn: '2. 清理历史记录',
    btn_purge_records: '2. 清理历史记录',
    nav_ledger: '明细',
    nav_create: '记账',
    nav_analytics: '图表',
    nav_settings: '设置',
    inapp_update_title: '发现新版本',
    download_and_install: '立即下载并安装',
    downloading_package: '正在下载安装包...',
    keep_app_open: '请勿关闭应用',
    installing_update: '下载完成！正在调起安装程序...',
    download_error: '下载更新失败',
    account_label: '支付/收款账户',
    account_cash: '现金 (Cash)',
    account_tng: 'TNG 电子钱包',
    account_bank: '银行卡 (Bank)',
    account_credit: '信用卡 (Credit)',
    filter_all_accounts: '全部账户',
    accounts_center_title: '资产与账户中心',
    accounts_center_sub: '各账户预估余额与流水来源',
    net_worth: '总净资产',
    initial_balance: '初始余额',
    edit_initial_balance: '修改初始余额',
    set_initial_balance_title: '设置初始余额',
    enter_initial_balance: '请输入此账户的起始资金/初始余额',
    account_updated_toast: '账户余额已更新',
  },
};

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
  searchQuery: '',
  monthlyBudget: 3000,
  isOnline: navigator.onLine,
  isSyncing: false,
  records: [],
  summary: null,
};

// Default Supported Payment Accounts / Asset Wallets
const DEFAULT_ACCOUNTS = [
  { name: 'Cash', icon: '💵', type: 'cash', zh: '现金 (Cash)' },
  { name: 'TNG eWallet', icon: '📱', type: 'ewallet', zh: 'TNG 电子钱包' },
  { name: 'Bank Card', icon: '🏦', type: 'bank', zh: '银行卡 (Bank)' },
  { name: 'Credit Card', icon: '💳', type: 'credit', zh: '信用卡 (Credit)' },
];

function getAccountMeta(name) {
  const norm = (name || 'Cash').trim();
  const found = DEFAULT_ACCOUNTS.find((a) => a.name.toLowerCase() === norm.toLowerCase());
  if (found) return found;
  return { name: norm, icon: '💵', type: 'general', zh: norm };
}

function getAccountDisplayLabel(name) {
  const meta = getAccountMeta(name);
  if (state.lang === 'zh') return meta.zh || meta.name;
  return meta.name;
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
  bottomNavItems: document.querySelectorAll('.bottom-nav-item[data-nav-target]'),
  openCreateModalBtn: document.getElementById('openCreateModalBtn'),
  desktopCreateBtn: document.getElementById('desktopCreateBtn'),
  emptyCreateBtn: document.getElementById('emptyCreateBtn'),

  // Create Entry Modal
  createEntryModal: document.getElementById('createEntryModal'),
  closeCreateModalBtn: document.getElementById('closeCreateModalBtn'),
  categoryGridContainer: document.getElementById('categoryGridContainer'),

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
  openRetentionFromSettingsBtn: document.getElementById('openRetentionFromSettingsBtn'),

  // Dedicated In-App Update Modal
  inAppUpdateModal: document.getElementById('inAppUpdateModal'),
  closeInAppUpdateModalBtn: document.getElementById('closeInAppUpdateModalBtn'),
  inAppUpdateVersionBadge: document.getElementById('inAppUpdateVersionBadge'),
  inAppUpdateNotes: document.getElementById('inAppUpdateNotes'),
  updateDownloadProgressArea: document.getElementById('updateDownloadProgressArea'),
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
  themeSegmentBtns: document.querySelectorAll('.theme-segment-btn:not(.lang-segment-btn)'),
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
  settingsAccountsCenterCard: document.getElementById('settingsAccountsCenterCard'),
  accountsWalletsList: document.getElementById('accountsWalletsList'),
  totalNetWorthValue: document.getElementById('totalNetWorthValue'),
  initialBalanceModal: document.getElementById('initialBalanceModal'),
  initialBalanceModalIcon: document.getElementById('initialBalanceModalIcon'),
  initialBalanceModalTitle: document.getElementById('initialBalanceModalTitle'),
  initialBalanceModalSub: document.getElementById('initialBalanceModalSub'),
  initialBalanceInput: document.getElementById('initialBalanceInput'),
  closeInitialBalanceModalBtn: document.getElementById('closeInitialBalanceModalBtn'),
  cancelInitialBalanceBtn: document.getElementById('cancelInitialBalanceBtn'),
  saveInitialBalanceBtn: document.getElementById('saveInitialBalanceBtn'),
};

/**
 * Translate helper for current language
 */
function t(key) {
  const dict = I18N[state.lang] || I18N.en;
  return dict[key] || I18N.en[key] || '';
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
  return CATEGORY_META[cat]?.icon || '📌';
}

/**
 * Switch Application Language (EN / 中文)
 */
function setAppLanguage(lang) {
  const validLang = lang === 'zh' ? 'zh' : 'en';
  state.lang = validLang;
  localStorage.setItem('ledger_lang', validLang);
  document.documentElement.setAttribute('lang', validLang === 'zh' ? 'zh-CN' : 'en');

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
  updateSyncStatusUI();
  updateAccountModalData();
  renderAccountsCenter();
  if (state.summary) {
    updateSummaryStatusBadge(state.summary.netBalance);
    renderCategoryChart(state.summary.categoryBreakdown);
  }
}

/**
 * Switch Active Page View (ledger | analytics | settings)
 */
function switchAppPage(pageName) {
  const target = ['ledger', 'analytics', 'settings'].includes(pageName)
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
      setTimeout(() => renderCategoryChart(state.summary.categoryBreakdown), 30);
    }
  } else if (target === 'settings') {
    updateAccountModalData();
    loadAccounts();
  }
}

/**
 * Open & Close Create Transaction Modal
 */
function openCreateModal() {
  closeProfileDropdown();
  if (elements.inputDate && !elements.inputDate.value) {
    elements.inputDate.value = new Date().toISOString().split('T')[0];
  }
  renderCategoryGrid(state.currentType);
  renderAccountPicker();
  elements.createEntryModal?.classList.remove('hidden');
  setTimeout(() => {
    elements.inputAmount?.focus();
  }, 60);
}

function closeCreateModal() {
  elements.createEntryModal?.classList.add('hidden');
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

  elements.categoryGridContainer.querySelectorAll('.cat-grid-btn').forEach((btn) => {
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

  elements.accountSelectorGrid.querySelectorAll('.account-chip-btn').forEach((btn) => {
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
      queue.length > 0 ? `${t('sync_offline')} (${queue.length})` : t('sync_offline');
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
      state.lang === 'zh' ? '当前处于离线状态，无法同步' : 'Cannot sync while offline',
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
        ? `✅ 已同步 ${successCount} 笔离线账单`
        : `✅ Synced ${successCount} offline transaction(s)!`,
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

  if (elements.netBalanceValue)
    elements.netBalanceValue.textContent = formatNumber(state.summary.netBalance);
  if (elements.totalIncomeValue)
    elements.totalIncomeValue.textContent = formatNumber(state.summary.totalIncome);
  if (elements.totalExpenseValue)
    elements.totalExpenseValue.textContent = formatNumber(state.summary.totalExpense);

  updateSummaryStatusBadge(state.summary.netBalance);
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

  showToast(
    state.lang === 'zh'
      ? `⚡ 已离线保存（待同步 ${queue.length} 笔）`
      : `⚡ Offline: Saved locally (${queue.length} pending)`,
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

  const cached = localStorage.getItem(cacheKey) || localStorage.getItem(defaultKey);
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
  const budgetLimit = Number(state.monthlyBudget || 3000);
  const sym = state.currency || 'RM';

  const percentage = budgetLimit > 0 ? Math.round((totalExpense / budgetLimit) * 100) : 0;
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
  elements.budgetRemainingLabel?.classList.remove('text-warning', 'text-danger');

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
  if (elements.budgetModalMonthText) elements.budgetModalMonthText.textContent = targetLabel;
  if (elements.budgetInputAmount)
    elements.budgetInputAmount.value = state.monthlyBudget || 3000;
  elements.budgetModal.classList.remove('hidden');
  elements.budgetInputAmount?.focus();
}

function closeBudgetModal() {
  elements.budgetModal?.classList.add('hidden');
}

function handleSaveBudget() {
  const val = parseFloat(elements.budgetInputAmount?.value);
  if (isNaN(val) || val <= 0) {
    return showToast(
      state.lang === 'zh' ? '请输入大于 0 的有效预算金额' : 'Please enter a valid budget amount',
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
 * Render Audit Ledger Table
 */
function renderTable() {
  if (!elements.recordsTbody) return;
  let filtered = state.records;

  if (state.currentMonth !== 'all') {
    filtered = filtered.filter((r) => r.date && r.date.startsWith(state.currentMonth));
  }

  if (state.currentFilter !== 'all') {
    filtered = filtered.filter((r) => r.type === state.currentFilter);
  }

  if (state.selectedAccountFilter && state.selectedAccountFilter !== 'all') {
    filtered = filtered.filter((r) => (r.account_name || 'Cash') === state.selectedAccountFilter);
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

  elements.recordsTbody.innerHTML = filtered
    .map((record) => {
      const isIncome = record.type === 'income';
      const sign = isIncome ? `+ ${sym} ` : `− ${sym} `;
      const amountClass = isIncome ? 'amount-income' : 'amount-expense';
      const isDraft = record.isDraft || String(record.id).startsWith('draft-');
      const draftBadge = isDraft
        ? `<span class="tag-draft" title="Pending sync">⚡</span>`
        : '';
      const catIcon = getCategoryIcon(record.category);
      const catLabel = getCategoryDisplayLabel(record.category);
      const accMeta = getAccountMeta(record.account_name);
      const accLabel = getAccountDisplayLabel(record.account_name);

      return `
        <tr data-id="${record.id}" class="${isDraft ? 'row-draft' : ''}">
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
            ${escapeHtml(record.note || '—')}
          </td>
          <td class="col-amount text-right ${amountClass}">
            ${sign}${formatNumber(record.amount)}
          </td>
          <td class="col-actions text-center">
            <button class="btn-del" onclick="handleDelete('${record.id}')" title="Delete">
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
    showToast(
      state.lang === 'zh' ? '请输入大于 0 的金额' : 'Please enter an amount greater than 0',
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

  if (!navigator.onLine) {
    saveOfflineRecord(payload);
    return;
  }

  try {
    elements.submitBtn.disabled = true;
    elements.submitBtn.style.opacity = '0.7';

    const userId = state.user?.id;
    let created = false;

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
        ? `✅ 已记账 ${state.currency} ${formatNumber(amount)}`
        : `✅ Recorded ${state.currency} ${formatNumber(amount)}`,
    );
    elements.inputAmount.value = '';
    elements.inputNote.value = '';
    closeCreateModal();

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
  const confirmMsg =
    state.lang === 'zh'
      ? '确定要删除这条账单记录吗？'
      : 'Are you sure you want to delete this transaction?';
  if (!confirm(confirmMsg)) {
    return;
  }

  if (isDraft) {
    let queue = getOfflineQueue();
    queue = queue.filter((item) => String(item.id) !== String(id));
    saveOfflineQueue(queue);

    state.records = state.records.filter((r) => String(r.id) !== String(id));
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
    await Promise.all([loadRecords(), loadSummary()]);
  } catch (err) {
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
 * Chart.js Instance & Color Harmony Palette
 */
let categoryChartInstance = null;

const CHART_PALETTE = [
  '#0D9488',
  '#059669',
  '#F59E0B',
  '#E11D48',
  '#6366F1',
  '#0284C7',
  '#8B5CF6',
  '#64748B',
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
  categoryChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: localizedLabels,
      datasets: [
        {
          data: amounts,
          backgroundColor: CHART_PALETTE.slice(0, rawCategories.length),
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

/**
 * Export Filtered Records as RFC 4180 Compliant CSV
 */
function exportToCSV() {
  let recordsToExport = state.records;

  if (state.currentMonth !== 'all') {
    recordsToExport = recordsToExport.filter(
      (r) => r.date && r.date.startsWith(state.currentMonth),
    );
  }

  if (state.currentFilter !== 'all') {
    recordsToExport = recordsToExport.filter((r) => r.type === state.currentFilter);
  }

  if (recordsToExport.length === 0) {
    showToast(
      state.lang === 'zh' ? '暂无可导出的账单记录' : 'No records available to export',
      true,
    );
    return;
  }

  const headers = ['ID', 'Date', 'Type', 'Category', 'Account', 'Amount', 'Currency', 'Note'];
  const rows = recordsToExport.map((r) => [
    r.id,
    `"${r.date}"`,
    `"${r.type}"`,
    `"${(r.category || '').replace(/"/g, '""')}"`,
    `"${(r.account_name || 'Cash').replace(/"/g, '""')}"`,
    Number(r.amount).toFixed(2),
    `"${state.currency}"`,
    `"${(r.note || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');

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

  showToast(
    state.lang === 'zh'
      ? `已导出 ${recordsToExport.length} 笔账单至 CSV`
      : `Exported ${recordsToExport.length} transactions to CSV`,
  );
}

// ============================================================================
// Data Retention & Archiving Modal Controller
// ============================================================================

function getRetentionCutoffDate(years) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return date.toISOString().split('T')[0];
}

function evaluateRetentionEligible() {
  if (!elements.retentionYearsSelect) return;
  const years = parseInt(elements.retentionYearsSelect.value) || 3;
  const cutoffDate = getRetentionCutoffDate(years);
  if (elements.retentionCutoffDate) elements.retentionCutoffDate.textContent = cutoffDate;

  const matchingRecords = state.records.filter((r) => r.date < cutoffDate);
  if (elements.retentionMatchCount)
    elements.retentionMatchCount.textContent = matchingRecords.length;

  if (elements.downloadArchiveBtn)
    elements.downloadArchiveBtn.disabled = matchingRecords.length === 0;
  if (elements.purgeOldRecordsBtn)
    elements.purgeOldRecordsBtn.disabled = matchingRecords.length === 0;
}

function openRetentionModal() {
  evaluateRetentionEligible();
  elements.retentionModal?.classList.remove('hidden');
}

function closeRetentionModal() {
  elements.retentionModal?.classList.add('hidden');
}

function downLoadArchiveCSV() {
  const years = parseInt(elements.retentionYearsSelect.value) || 3;
  const cutoffDate = getRetentionCutoffDate(years);
  const matchingRecords = state.records.filter((r) => r.date < cutoffDate);

  if (matchingRecords.length === 0) {
    showToast('No records available for archiving', true);
    return;
  }

  const headers = ['ID', 'Date', 'Type', 'Category', 'Account', 'Amount', 'Currency', 'Note'];
  const rows = matchingRecords.map((r) => [
    r.id,
    `"${r.date}"`,
    `"${r.type}"`,
    `"${(r.category || '').replace(/"/g, '""')}"`,
    `"${(r.account_name || 'Cash').replace(/"/g, '""')}"`,
    Number(r.amount).toFixed(2),
    `"${state.currency}"`,
    `"${(r.note || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
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

  showToast(`Downloaded ${matchingRecords.length} archived transactions`);
}

async function purgeOldRecords() {
  const years = parseInt(elements.retentionYearsSelect.value) || 3;
  if (
    !confirm(
      state.lang === 'zh'
        ? `确定要永久清理早于 ${years} 年前的所有历史记录吗？此操作不可撤销。`
        : `Permanently delete all records older than ${years} years?`,
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
    showToast(err.message, true);
  }
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
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
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
  return meta.custom_name || meta.full_name || meta.name || user.email?.split('@')[0] || 'User';
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
  if (!firstLoginIso) return state.lang === 'zh' ? '1 天' : '1 Day';
  const diffMs = Math.max(0, Date.now() - new Date(firstLoginIso).getTime());
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
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
    state.lang === 'zh' ? `用户名已更新为 "${newName}" 并同步至云端` : `Username updated to "${newName}" & synced`,
  );
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

  if (state.user) {
    syncUserProfileToCloud({ theme: mode });
  }
}

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

  if (elements.accountModalName) elements.accountModalName.textContent = displayName;
  if (elements.accountModalEmail) elements.accountModalEmail.textContent = state.user.email;

  const firstLoginKey = 'ledger_first_login_' + state.user.id;
  const meta = state.user.user_metadata || {};
  let firstLogin = meta.first_login_at || localStorage.getItem(firstLoginKey);
  if (!firstLogin) {
    firstLogin = new Date().toISOString();
    localStorage.setItem(firstLoginKey, firstLogin);
    syncUserProfileToCloud({ first_login_at: firstLogin });
  }

  if (elements.accountMemberSince) {
    elements.accountMemberSince.textContent = new Date(firstLogin).toLocaleDateString(
      state.lang === 'zh' ? 'zh-CN' : 'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
    );
  }
  if (elements.accountUsageDuration) {
    elements.accountUsageDuration.textContent = formatUsageDuration(firstLogin);
  }
  if (elements.accountTransactionCount) {
    elements.accountTransactionCount.textContent = `${state.records.length}`;
  }
}

// ============================================================================
// Accounts & Wallets Center Controller (Payment Methods & Asset Balances)
// ============================================================================

/**
 * Load Accounts & Wallets and calculate dynamic balances
 */
async function loadAccounts() {
  const userKey = state.user?.id || 'guest';
  const cacheKey = `ledger_cached_accounts_${userKey}`;
  let initialBalances = {};

  // 1. Try reading from Supabase accounts table
  if (supabaseClient && state.user?.id) {
    try {
      const { data, error } = await supabaseClient
        .from('accounts')
        .select('*')
        .eq('user_id', state.user.id);

      if (!error && Array.isArray(data)) {
        data.forEach((row) => {
          if (row.name) {
            initialBalances[row.name] = parseFloat(row.initial_balance) || 0;
          }
        });
        localStorage.setItem(cacheKey, JSON.stringify(initialBalances));
      }
    } catch (e) {
      console.warn('Failed to load accounts from Supabase:', e);
    }
  }

  // Fallback to local storage
  if (Object.keys(initialBalances).length === 0) {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) initialBalances = JSON.parse(cached);
    } catch (e) {}
  }

  // 2. Build accounts array with live calculated balances
  let totalNetWorth = 0;
  state.accounts = DEFAULT_ACCOUNTS.map((acc) => {
    const initBal = Number(initialBalances[acc.name] || 0);
    // Find all records belonging to this account (default 'Cash' for legacy records)
    const matchingRecords = state.records.filter(
      (r) => (r.account_name || 'Cash') === acc.name,
    );
    const totalIncome = matchingRecords
      .filter((r) => r.type === 'income')
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);
    const totalExpense = matchingRecords
      .filter((r) => r.type === 'expense')
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

    const currentBalance = initBal + totalIncome - totalExpense;
    totalNetWorth += currentBalance;

    return {
      ...acc,
      initial_balance: initBal,
      totalIncome,
      totalExpense,
      currentBalance,
    };
  });

  // 3. Render net worth and list
  if (elements.totalNetWorthValue) {
    elements.totalNetWorthValue.textContent = formatNumber(totalNetWorth);
  }
  renderAccountsCenter();
}

/**
 * Render Accounts & Wallets in Settings page
 */
function renderAccountsCenter() {
  if (!elements.accountsWalletsList) return;
  const sym = state.currency;

  elements.accountsWalletsList.innerHTML = (state.accounts || [])
    .map((acc) => {
      const label = getAccountDisplayLabel(acc.name);
      const isPositive = acc.currentBalance >= 0;
      const balClass = isPositive ? 'positive' : 'negative';
      const balSign = acc.currentBalance >= 0 ? '' : '− ';
      const initText =
        state.lang === 'zh'
          ? `初始: ${sym} ${formatNumber(acc.initial_balance)}`
          : `Init: ${sym} ${formatNumber(acc.initial_balance)}`;
      const flowText = `+${sym}${formatNumber(acc.totalIncome)} / −${sym}${formatNumber(acc.totalExpense)}`;

      return `
        <div class="wallet-card">
          <div class="wallet-card-left">
            <div class="wallet-icon-box">${acc.icon}</div>
            <div class="wallet-meta">
              <div class="wallet-name-row">
                <span class="wallet-name">${escapeHtml(label)}</span>
                <button
                  type="button"
                  class="btn-edit-wallet-init"
                  onclick="openInitialBalanceModal('${escapeHtml(acc.name)}')"
                  title="${state.lang === 'zh' ? '设置初始余额' : 'Set Initial Balance'}"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </div>
              <span class="wallet-subtext">${initText} &bull; ${flowText}</span>
            </div>
          </div>
          <div class="wallet-card-right">
            <span class="wallet-current-bal ${balClass}">${balSign}${sym} ${formatNumber(acc.currentBalance)}</span>
          </div>
        </div>
      `;
    })
    .join('');
}

/**
 * Open Modal to edit initial balance
 */
function openInitialBalanceModal(accountName) {
  const acc = (state.accounts || []).find((a) => a.name === accountName) || getAccountMeta(accountName);
  state.editingAccountName = accountName;
  if (elements.initialBalanceModalIcon) elements.initialBalanceModalIcon.textContent = acc.icon;
  if (elements.initialBalanceModalTitle) {
    elements.initialBalanceModalTitle.textContent =
      state.lang === 'zh' ? `设置 ${getAccountDisplayLabel(accountName)} 初始余额` : `Set ${acc.name} Initial Balance`;
  }
  if (elements.initialBalanceInput) {
    elements.initialBalanceInput.value =
      acc.initial_balance !== undefined && acc.initial_balance !== 0
        ? acc.initial_balance
        : '';
  }
  elements.initialBalanceModal?.classList.remove('hidden');
  setTimeout(() => elements.initialBalanceInput?.focus(), 60);
}

function closeInitialBalanceModal() {
  elements.initialBalanceModal?.classList.add('hidden');
  state.editingAccountName = null;
}

/**
 * Save updated initial balance
 */
async function handleSaveInitialBalance() {
  if (!state.editingAccountName) return;
  const val = parseFloat(elements.initialBalanceInput?.value);
  const newBal = isNaN(val) ? 0 : val;
  const accountName = state.editingAccountName;
  const accMeta = getAccountMeta(accountName);
  const userKey = state.user?.id || 'guest';
  const cacheKey = `ledger_cached_accounts_${userKey}`;

  // 1. Update local storage cache
  let initialBalances = {};
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) initialBalances = JSON.parse(cached);
  } catch (e) {}
  initialBalances[accountName] = newBal;
  localStorage.setItem(cacheKey, JSON.stringify(initialBalances));

  // 2. Sync to Supabase accounts table
  if (supabaseClient && state.user?.id) {
    try {
      await supabaseClient.from('accounts').upsert(
        {
          user_id: state.user.id,
          name: accountName,
          type: accMeta.type,
          icon: accMeta.icon,
          initial_balance: newBal,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,name' },
      );
    } catch (e) {
      console.warn('Failed to upsert account in Supabase:', e);
    }
  }

  closeInitialBalanceModal();
  await loadAccounts();
  showToast(
    state.lang === 'zh'
      ? `${getAccountDisplayLabel(accountName)} 初始余额已更新为 ${state.currency} ${formatNumber(newBal)}`
      : `${accountName} initial balance set to ${state.currency} ${formatNumber(newBal)}`,
  );
}

window.openInitialBalanceModal = openInitialBalanceModal;
window.closeInitialBalanceModal = closeInitialBalanceModal;

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
    showToast(state.lang === 'zh' ? '正在优化并同步头像...' : 'Optimizing and syncing avatar...');
    const compressed = await compressAvatarImage(file, 128, 0.82);
    localStorage.setItem('ledger_custom_avatar_' + state.user.id, compressed);
    updateAuthUI(state.user);
    updateAccountModalData();
    syncUserProfileToCloud({ custom_avatar: compressed });
    showToast(state.lang === 'zh' ? '头像已同步至云端' : 'Avatar synced to cloud');
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
  showToast(state.lang === 'zh' ? '已恢复 Google 原始头像' : 'Reset to Google profile photo');
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
  if (!supabaseClient) return showToast('Supabase client not initialized', true);
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
async function signOutUser() {
  const confirmMsg =
    state.lang === 'zh'
      ? '确定要退出当前登录的 Google 账号吗？'
      : 'Are you sure you want to sign out of your account?';
  if (!confirm(confirmMsg)) return;

  if (supabaseClient) {
    await supabaseClient.auth.signOut().catch(() => {});
  }
  state.user = null;
  switchAppPage('ledger');
  updateAuthUI(null);
  showToast(state.lang === 'zh' ? '已安全退出登录' : 'Signed out successfully');
}

/**
 * Update UI presentation based on authentication state
 */
function updateAuthUI(user) {
  if (user) {
    elements.loginLandingView?.classList.add('hidden');
    elements.appLayout?.classList.remove('hidden');

    const meta = user.user_metadata || {};

    // 1. Restore Custom Name from Cloud metadata
    if (meta.custom_name && meta.custom_name.trim()) {
      localStorage.setItem('ledger_custom_name_' + user.id, meta.custom_name.trim());
    }

    // 2. Restore Custom Avatar from Cloud metadata
    if (meta.custom_avatar) {
      localStorage.setItem('ledger_custom_avatar_' + user.id, meta.custom_avatar);
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
      if (elements.currencySelector) elements.currencySelector.value = state.currency;
      updateCurrencySymbols();
    }
    if (meta.lang && meta.lang !== state.lang) {
      setAppLanguage(meta.lang);
    }
    if (meta.theme && meta.theme !== (localStorage.getItem('ledger_theme') || 'system')) {
      setAppTheme(meta.theme);
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
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
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
  'https://github.com/LEESC88/ledger/releases/latest/download/LEDGER.apk';

function openInAppUpdateModal() {
  elements.updateDownloadProgressArea?.classList.add('hidden');
  if (elements.startInAppUpdateBtn) {
    elements.startInAppUpdateBtn.disabled = false;
  }
  if (elements.cancelInAppUpdateBtn) {
    elements.cancelInAppUpdateBtn.disabled = false;
  }
  elements.inAppUpdateModal?.classList.remove('hidden');
}

function closeInAppUpdateModal() {
  elements.inAppUpdateModal?.classList.add('hidden');
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
        ? `🎉 发现新版本 (v${versionLabel})！点击立即更新。`
        : `🎉 New update available (v${versionLabel})! Tap Update Now.`;
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
window.__onNativeDownloadProgress = function (percent, currentBytes, totalBytes) {
  const pct = Math.min(Math.max(Number(percent) || 0, 0), 100);
  if (elements.updateProgressBarFill) {
    elements.updateProgressBarFill.style.width = pct + '%';
  }
  if (elements.updateProgressPercent) {
    elements.updateProgressPercent.textContent = pct + '%';
  }
  if (elements.updateProgressBytes) {
    const curMb = (Number(currentBytes || 0) / (1024 * 1024)).toFixed(1);
    const totMb = totalBytes > 0 ? (Number(totalBytes) / (1024 * 1024)).toFixed(1) : '?';
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
  if (elements.startInAppUpdateBtn) elements.startInAppUpdateBtn.disabled = false;
  if (elements.cancelInAppUpdateBtn) elements.cancelInAppUpdateBtn.disabled = false;
};

/**
 * Execute in-app auto-update
 */
async function applyAppUpdate() {
  // If running inside Android container with NativeUpdater interface
  if (window.NativeUpdater && typeof window.NativeUpdater.downloadAndInstall === 'function') {
    elements.updateDownloadProgressArea?.classList.remove('hidden');
    if (elements.startInAppUpdateBtn) {
      elements.startInAppUpdateBtn.disabled = true;
    }
    if (elements.cancelInAppUpdateBtn) {
      elements.cancelInAppUpdateBtn.disabled = true;
    }
    if (elements.updateProgressBarFill) elements.updateProgressBarFill.style.width = '0%';
    if (elements.updateProgressPercent) elements.updateProgressPercent.textContent = '0%';
    if (elements.updateProgressBytes) elements.updateProgressBytes.textContent = '0 MB / ...';
    if (elements.updateProgressStatusText) {
      elements.updateProgressStatusText.textContent = t('downloading_package');
    }
    window.NativeUpdater.downloadAndInstall(pendingApkDownloadUrl);
    return;
  }

  // Web Browser Fallback
  if (swRegistration && swRegistration.waiting) {
    showToast('🚀 Applying latest update...');
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
        elements.updateStatusText.textContent = `✅ ${t('up_to_date')} (v${APP_VERSION})`;
      }
      showToast(`✅ ${t('up_to_date')} (v${APP_VERSION})`);
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
      if (state.user) {
        syncUserProfileToCloud({ currency: state.currency });
      }
    });
  }
  updateCurrencySymbols();

  // 5. Default date to today
  const today = new Date().toISOString().split('T')[0];
  if (elements.inputDate) elements.inputDate.value = today;

  // 6. Category options & initial entry type
  setEntryType('expense');

  elements.btnTypeExpense?.addEventListener('click', () => setEntryType('expense'));
  elements.btnTypeIncome?.addEventListener('click', () => setEntryType('income'));

  // 7. Filter tabs
  elements.filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
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

  // 10. Refresh button
  elements.refreshBtn?.addEventListener('click', () => {
    loadSummary();
    loadRecords();
    loadAccounts();
    showToast(state.lang === 'zh' ? '数据已刷新' : 'Ledger data synced');
  });

  // Account Filter Select in Search Bar
  elements.accountFilterSelect?.addEventListener('change', (e) => {
    state.selectedAccountFilter = e.target.value;
    renderTable();
  });

  // Initial Balance Modal Event Listeners
  elements.closeInitialBalanceModalBtn?.addEventListener('click', closeInitialBalanceModal);
  elements.cancelInitialBalanceBtn?.addEventListener('click', closeInitialBalanceModal);
  elements.saveInitialBalanceBtn?.addEventListener('click', handleSaveInitialBalance);
  elements.initialBalanceModal?.addEventListener('click', (e) => {
    if (e.target === elements.initialBalanceModal) closeInitialBalanceModal();
  });
  elements.initialBalanceInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSaveInitialBalance();
    if (e.key === 'Escape') closeInitialBalanceModal();
  });

  // 11. Export CSV & Retention Modal
  elements.exportCsvBtn?.addEventListener('click', exportToCSV);
  elements.closeModalBtn?.addEventListener('click', closeRetentionModal);
  elements.retentionYearsSelect?.addEventListener('change', evaluateRetentionEligible);
  elements.downloadArchiveBtn?.addEventListener('click', downLoadArchiveCSV);
  elements.purgeOldRecordsBtn?.addEventListener('click', purgeOldRecords);
  elements.retentionModal?.addEventListener('click', (e) => {
    if (e.target === elements.retentionModal) closeRetentionModal();
  });

  // 12. Profile Dropdown & Inline Settings Profile Event Listeners
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
  elements.avatarFileInput?.addEventListener('change', handleAvatarFileSelected);
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
  elements.closeInAppUpdateModalBtn?.addEventListener('click', closeInAppUpdateModal);
  elements.cancelInAppUpdateBtn?.addEventListener('click', closeInAppUpdateModal);
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

  // Apply initial theme & language from localStorage
  const savedTheme = localStorage.getItem('ledger_theme') || 'system';
  setAppTheme(savedTheme);
  setAppLanguage(state.lang);

  // Initial data fetch
  loadSummary();
  loadRecords();
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
          await Promise.all([loadRecords(), loadSummary()]);
        }
      });

      const { data } = await supabaseClient.auth.getSession();
      if (data?.session?.user) {
        state.user = data.session.user;
        updateAuthUI(state.user);
        await Promise.all([loadRecords(), loadSummary()]);
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

// Start Application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
