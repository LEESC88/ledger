/* MonetaX Engine - Transactions CRUD, Pickers, Receipt Compression & Lightbox */

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

  await LedgerStore.records.update(
    editingId,
    updatedPayload,
    nextImageArchived,
  );

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
        await syncClaimToCloud(claim, { apiMethod: 'POST' });

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

    await LedgerStore.records.create(payload);

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
        await LedgerStore.records.remove(id);

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
