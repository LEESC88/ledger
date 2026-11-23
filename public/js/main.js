/* MonetaX Engine - App Bootstrap, Global Listeners & Wakeup Lifecycle */

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

  // 11. Export Data (Excel / CSV) & Retention Modal
  elements.exportCsvBtn?.addEventListener('click', openExportFormatModal);
  elements.closeExportFormatModalBtn?.addEventListener('click', () =>
    closeExportFormatModal(false),
  );
  elements.exportFormatModal?.addEventListener('click', (e) => {
    if (e.target === elements.exportFormatModal) closeExportFormatModal(false);
  });
  elements.exportAsExcelBtn?.addEventListener('click', async () => {
    closeExportFormatModal(false);
    await exportToExcel();
  });
  elements.exportAsCsvBtn?.addEventListener('click', async () => {
    closeExportFormatModal(false);
    await exportToCSV();
  });
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
    if (getTotalPendingSyncCount() > 0) {
      syncOfflineDrafts();
    } else {
      showToast(t('sync_synced'));
    }
  });

  updateSyncStatusUI();
  if (navigator.onLine && getTotalPendingSyncCount() > 0) {
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
