/* MonetaX Engine - Explicit ES Module AppState Store (Zero DOM / Zero I/O) */

/**
 * ============================================================================
 * AppState — 显式领域状态门面（原生 ES Module）
 * 将原先散落在 core.js 全局 state 的 45 个可变字段按职责收拢为 4 个清晰切片：
 *   - session: 用户登录态、语言、币种、网络状态
 *   - filters: 当前月份、收支筛选、搜索词
 *   - data:    账单流水、专款、代垫、月度汇总
 *   - ui:      当前页面、同步中标记、隐私模式
 * ============================================================================
 */

export function createAppState(initialOverrides = {}) {
  const slices = {
    session: {
      user: null,
      lang: 'zh',
      currency: 'RM',
      isOnline: true,
      ...(initialOverrides.session || {}),
    },
    filters: {
      currentMonth: 'all',
      currentFilter: 'all',
      searchQuery: '',
      ...(initialOverrides.filters || {}),
    },
    data: {
      records: [],
      projects: [],
      claims: [],
      summary: null,
      monthlyBudget: 3000,
      ...(initialOverrides.data || {}),
    },
    ui: {
      activePage: 'ledger',
      isSyncing: false,
      privacyMode: false,
      ...(initialOverrides.ui || {}),
    },
  };

  /** @type {Map<string, Set<Function>>} */
  const listeners = new Map();

  function assertSlice(sliceName) {
    if (!Object.prototype.hasOwnProperty.call(slices, sliceName)) {
      throw new Error(`Unknown AppState slice: ${sliceName}`);
    }
  }

  function getSlice(sliceName) {
    assertSlice(sliceName);
    return { ...slices[sliceName] };
  }

  function patchSlice(sliceName, patch) {
    assertSlice(sliceName);
    slices[sliceName] = { ...slices[sliceName], ...(patch || {}) };
    const next = { ...slices[sliceName] };
    const subs = listeners.get(sliceName);
    if (subs) {
      for (const fn of subs) fn(next);
    }
    return next;
  }

  function subscribe(sliceName, listener) {
    assertSlice(sliceName);
    if (typeof listener !== 'function') return () => {};
    if (!listeners.has(sliceName)) listeners.set(sliceName, new Set());
    listeners.get(sliceName).add(listener);
    return () => {
      listeners.get(sliceName)?.delete(listener);
    };
  }

  function getSnapshot() {
    return {
      session: { ...slices.session },
      filters: { ...slices.filters },
      data: { ...slices.data },
      ui: { ...slices.ui },
    };
  }

  return {
    getSlice,
    patchSlice,
    subscribe,
    getSnapshot,
  };
}

export const AppState = createAppState();

if (typeof window !== 'undefined') {
  window.AppState = AppState;
}
