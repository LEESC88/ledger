/* MonetaX Engine - Split Bills, Repayment Tracking, Reminders & Edit Modal */

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

    await syncClaimToCloud(claim, {
      apiMethod: 'PATCH',
      apiPath: `/api/claims/${claim.id}/friend/${action.friendIdx}`,
      apiBody: { paid_via: method },
    });
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

    await syncClaimToCloud(claim, {
      apiMethod: 'PATCH',
      apiPath: `/api/claims/${claim.id}/settle-all`,
      apiBody: { paid_via: method },
    });

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

  await syncClaimToCloud(claim, {
    apiMethod: 'PATCH',
    apiPath: `/api/claims/${claimId}/friend/${friendIdx}`,
    apiBody: {},
  });

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

      await deleteClaimInCloud(claimId);
      showToast(isZh ? '已删除待收账单' : 'Claim deleted');
    },
  });
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

  await syncClaimToCloud(claim);
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
