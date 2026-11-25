/* MonetaX Engine - Pure Financial & Analytics Domain Module (Zero DOM / Zero I/O) */

/**
 * ============================================================================
 * LedgerDomain — 纯财务与统计计算领域模块
 * 原则：无 DOM、无 localStorage、无 fetch、无全局 state 副作用，可直接在 Vitest 零 mock 单测。
 * ============================================================================
 */

function roundCurrency(value) {
  return Number((Number(value) || 0).toFixed(2));
}

/**
 * 1. 计算月度收支汇总与分类占比
 */
function computeMonthlySummary(records, month = 'all') {
  const list = (Array.isArray(records) ? records : []).filter((r) =>
    month === 'all'
      ? true
      : Boolean(r?.date && String(r.date).startsWith(month)),
  );

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryMap = new Map();
  for (const r of list) {
    const amt = Math.abs(parseFloat(r.amount) || 0);
    if (r.type === 'income') {
      totalIncome += amt;
    } else {
      totalExpense += amt;
      const cat = r.category || 'Other Expense';
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + amt);
    }
  }

  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({ category, amount: roundCurrency(amount) }))
    .sort((a, b) => b.amount - a.amount);
  return {
    totalIncome: roundCurrency(totalIncome),
    totalExpense: roundCurrency(totalExpense),
    netBalance: roundCurrency(totalIncome - totalExpense),
    count: list.length,
    categoryBreakdown,
  };
}

/**
 * 2. 计算月度预算池、剩余额度与三段式告警状态
 */
function computeBudgetPool({
  baseBudget = 3000,
  topUps = 0,
  lockedFunds = 0,
  totalExpense = 0,
} = {}) {
  const effectiveBudget = Math.max(
    0,
    roundCurrency(
      (parseFloat(baseBudget) || 0) +
        (parseFloat(topUps) || 0) -
        (parseFloat(lockedFunds) || 0),
    ),
  );
  const spent = roundCurrency(Math.abs(parseFloat(totalExpense) || 0));
  const remaining = roundCurrency(effectiveBudget - spent);
  const usagePercent =
    effectiveBudget > 0
      ? roundCurrency((spent / effectiveBudget) * 100)
      : spent > 0
        ? 100
        : 0;
  const status =
    usagePercent > 100 ? 'danger' : usagePercent >= 80 ? 'warning' : 'normal';
  return { effectiveBudget, spent, remaining, usagePercent, status };
}

/**
 * 3. 计算连续记账打卡天数（兼容今天 / 昨天锚点）
 */
function computeStreak(records, todayStr) {
  const dates = new Set(
    (Array.isArray(records) ? records : [])
      .map((r) => (r?.date ? String(r.date).slice(0, 10) : ''))
      .filter(Boolean),
  );
  if (dates.size === 0 || !todayStr) return 0;

  const prevDay = (iso) => {
    const d = new Date(`${iso}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().slice(0, 10);
  };

  let cursor = dates.has(todayStr)
    ? todayStr
    : dates.has(prevDay(todayStr))
      ? prevDay(todayStr)
      : null;
  if (!cursor) return 0;

  let streak = 0;
  while (dates.has(cursor)) {
    streak++;
    cursor = prevDay(cursor);
  }
  return streak;
}

/**
 * 4. 计算 AA 分账与代垫收款状态
 */
function computeSplitBill(totalAmount, friends = []) {
  const total = roundCurrency(Math.max(0, parseFloat(totalAmount) || 0));
  const list = Array.isArray(friends) ? friends : [];
  let friendsSum = 0;
  let received = 0;
  let pending = 0;
  for (const f of list) {
    const amt = roundCurrency(Math.max(0, parseFloat(f?.amount) || 0));
    friendsSum += amt;
    if (f?.paid) received += amt;
    else pending += amt;
  }

  friendsSum = roundCurrency(friendsSum);
  received = roundCurrency(received);
  pending = roundCurrency(pending);
  const isOverSum = total > 0 ? friendsSum > total + 0.001 : friendsSum > 0.001;
  const myShare = Math.max(0, roundCurrency(total - friendsSum));
  const isPureAdvance = total > 0 && myShare === 0 && friendsSum > 0;
  const status =
    list.length > 0 && list.every((f) => Boolean(f?.paid))
      ? 'settled'
      : 'active';
  return {
    total,
    friendsSum,
    myShare,
    isOverSum,
    isPureAdvance,
    received,
    pending,
    status,
  };
}

/**
 * 5. 计算专款项目已用金额、剩余额度与进度百分比
 */
function computeProjectProgress(project) {
  const target = roundCurrency(
    Math.max(0, parseFloat(project?.target_amount) || 0),
  );
  const entries = Array.isArray(project?.entries) ? project.entries : [];
  const spent =
    entries.length > 0
      ? roundCurrency(
          entries.reduce(
            (sum, e) => sum + Math.max(0, parseFloat(e?.amount) || 0),
            0,
          ),
        )
      : roundCurrency(Math.max(0, parseFloat(project?.spent_amount) || 0));

  const remaining = roundCurrency(target - spent);
  const progressPercent =
    target > 0 ? roundCurrency((spent / target) * 100) : spent > 0 ? 100 : 0;
  const isOverBudget = target > 0 && spent > target;
  return { target, spent, remaining, progressPercent, isOverBudget };
}

const LedgerDomain = {
  roundCurrency,
  computeMonthlySummary,
  computeBudgetPool,
  computeStreak,
  computeSplitBill,
  computeProjectProgress,
};

export {
  roundCurrency,
  computeMonthlySummary,
  computeBudgetPool,
  computeStreak,
  computeSplitBill,
  computeProjectProgress,
  LedgerDomain,
};

if (typeof window !== 'undefined') {
  window.LedgerDomain = LedgerDomain;
}
