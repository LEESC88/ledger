/* MonetaX Engine - Dedicated Project Budget Cards & Entries */

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

  await syncProjectChangeToCloud(newProject, {}, { apiMethod: 'POST' });
}

function getActiveDetailProject() {
  if (!state.activeProjectId) return null;
  return (state.projects || []).find(
    (p) => String(p.id) === String(state.activeProjectId),
  );
}

async function syncProjectChangeToCloud(fund, extraFields = {}, options = {}) {
  if (!fund) return false;
  const { fromQueue = false, apiMethod = 'PATCH' } = options;
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
  const snapshot = {
    ...fund,
    ...extraFields,
    status: nextStatus,
    entries: cleanEntries,
  };

  if (!navigator.onLine) {
    if (!fromQueue) enqueueMetaSync('project', 'upsert', snapshot);
    return false;
  }

  let receiptsUpdated = false;
  if (typeof uploadReceiptToCloud === 'function') {
    for (const entry of cleanEntries) {
      if (
        entry.image_url &&
        String(entry.image_url).startsWith('data:image/')
      ) {
        try {
          const uploadedUrl = await uploadReceiptToCloud(entry.image_url);
          if (uploadedUrl) {
            entry.image_url = uploadedUrl;
            receiptsUpdated = true;
          }
        } catch (e) {}
      }
    }
  }
  if (receiptsUpdated) {
    fund.entries = cleanEntries;
    const liveFund = (state.projects || []).find(
      (p) => String(p.id) === String(fund.id),
    );
    if (liveFund) {
      liveFund.entries = cleanEntries;
    }
    saveProjects(state.projects, false);
  }

  /**
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS (projects.js Spot 1 - 委托给 LedgerStore.projects.upsert):
   * 1. 删除下面从 `const spentAmount = ...` 一直到函数末尾 `return false;` 的全部代码
   * 2. 保留函数结尾的 `}` 不动
   * 3. 原地写成一行：
   *      return LedgerStore.projects.upsert(snapshot, extraFields, options);
   * ============================================================================
   */
  // ✍️ YOUR TURN: Delete the inline Supabase + fetch block below and delegate to LedgerStore:
  return LedgerStore.projects.upsert(snapshot, extraFields, options);
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

      await deleteProjectInCloud(fund.id);
      triggerHaptic(15);
      showToast(isZh ? '专款卡片已删除' : 'Project card deleted');
    },
  });
}

async function deleteProjectInCloud(fundId, options = {}) {
  /**
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS (projects.js Spot 2 - 委托给 LedgerStore.projects.remove):
   * 1. 删除下面从 `if (!fundId) return false;` 一直到 `return false;` 的全部代码
   * 2. 保留函数结尾的 `}` 不动
   * 3. 原地写成一行：
   *      return LedgerStore.projects.remove(fundId, options);
   * ============================================================================
   */
  // ✍️ YOUR TURN: Delete the inline delete block below and delegate to LedgerStore:
  return LedgerStore.projects.remove(fundId, options);
}
function openProjectSettingsEdit(fundId) {
  openProjectDetailModal(fundId);
  if (elements.projectMetaEditPanel?.classList.contains('hidden')) {
    toggleEditProjectMeta();
  }
}
