/* MonetaX Engine - Deep LedgerStore Module (Ports & Adapters Persistence Layer) */

/**
 * ============================================================================
 * LedgerStore — 统一客户端持久化、离线队列与双轨传输门面 (Stage 1)
 *
 * 架构分层：
 *   UI Modules (projects.js / claims.js / records.js)
 *       └──▶ LedgerStore (本文件对外唯一门面)
 *                ├── LocalVault       (localStorage 分区读写 & 墓碑管理)
 *                ├── SupabaseAdapter  (Supabase PostgreSQL RLS 传输适配器)
 *                └── LocalApiAdapter  (NestJS /api/* REST 传输适配器)
 * ============================================================================
 */

const LocalVault = {
  getUserKey(prefix, userId = state.user?.id) {
    return `${prefix}_${userId || 'guest'}`;
  },

  readJson(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },

  writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('LocalVault writeJson failed:', key, e);
      return false;
    }
  },
};

/**
 * Adapter 1: Supabase Cloud (PostgreSQL + RLS)
 */
const SupabaseAdapter = {
  name: 'supabase',

  isAvailable() {
    return Boolean(
      typeof supabaseClient !== 'undefined' && supabaseClient && state.user?.id,
    );
  },

  async upsertProject(snapshot, extraFields = {}) {
    if (!this.isAvailable()) return false;
    try {
      const { error } = await supabaseClient.from('projects').upsert({
        id: snapshot.id,
        user_id: state.user.id,
        title: snapshot.title,
        icon: 'target',
        target_amount: Number(
          (parseFloat(snapshot.target_amount) || 0).toFixed(2),
        ),
        spent_amount:
          typeof getProjectSpentAmount === 'function'
            ? getProjectSpentAmount(snapshot)
            : Number((parseFloat(snapshot.spent_amount) || 0).toFixed(2)),
        mode:
          snapshot.mode ||
          (snapshot.include_in_budget ? 'budget_deduct' : 'extra'),
        month: snapshot.month || getCurrentMonthKey(),
        status: snapshot.status || 'active',
        include_in_budget: Boolean(snapshot.include_in_budget),
        timeframe_type: snapshot.timeframe_type || 'indefinite',
        start_date: snapshot.start_date || null,
        deadline: snapshot.deadline || null,
        entries: snapshot.entries || [],
        updated_at: new Date().toISOString(),
        ...extraFields,
      });
      return !error;
    } catch (e) {
      return false;
    }
  },

  async deleteProject(fundId) {
    if (!this.isAvailable()) return false;
    try {
      const { error } = await supabaseClient
        .from('projects')
        .delete()
        .eq('id', fundId)
        .eq('user_id', state.user.id);
      return !error;
    } catch (e) {
      return false;
    }
  },

  async upsertClaim(claim) {
    if (!this.isAvailable()) return false;
    try {
      const { error } = await supabaseClient.from('claims').upsert({
        id: claim.id,
        user_id: state.user.id,
        title: claim.title,
        total_amount: claim.total_amount,
        my_share: claim.my_share,
        friends: claim.friends || [],
        status: claim.status || 'active',
        date: claim.date || getLocalDateString(),
        updated_at: new Date().toISOString(),
      });
      return !error;
    } catch (e) {
      return false;
    }
  },

  async deleteClaim(claimId) {
    if (!this.isAvailable()) return false;
    try {
      const { error } = await supabaseClient
        .from('claims')
        .delete()
        .eq('id', claimId)
        .eq('user_id', state.user.id);
      return !error;
    } catch (e) {
      return false;
    }
  },

  async createRecord(payload) {
    if (!this.isAvailable()) return false;
    const baseInsert = {
      user_id: state.user.id,
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

    if (error && error.message?.includes('image_')) {
      const retry = await supabaseClient
        .from('records')
        .insert(baseInsert)
        .select()
        .single();
      error = retry.error;
    }
    if (error) throw new Error(error.message);
    return true;
  },

  async updateRecord(id, updatedPayload, nextImageArchived = false) {
    if (!this.isAvailable()) return false;
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
      .eq('id', id)
      .eq('user_id', state.user.id);

    if (error && error.message?.includes('image_')) {
      const retry = await supabaseClient
        .from('records')
        .update(baseUpdate)
        .eq('id', id)
        .eq('user_id', state.user.id);
      error = retry.error;
    }
    if (error) throw new Error(error.message);
    return true;
  },

  async deleteRecord(id) {
    if (!this.isAvailable()) return false;
    const { error } = await supabaseClient
      .from('records')
      .delete()
      .eq('id', id)
      .eq('user_id', state.user.id);
    if (error) throw new Error(error.message);
    return true;
  },

  async setBudget(month, amount) {
    if (!this.isAvailable()) return false;
    const rowsToUpsert = [
      { user_id: state.user.id, month, amount },
    ];
    if (month !== 'default') {
      rowsToUpsert.push({ user_id: state.user.id, month: 'default', amount });
    }
    const { error } = await supabaseClient
      .from('budgets')
      .upsert(rowsToUpsert, { onConflict: 'user_id,month' });
    return !error;
  },
};

/**
 * Adapter 2: Local NestJS REST API (/api/*)
 */
const LocalApiAdapter = {
  name: 'local-api',

  isAvailable() {
    return true;
  },

  async upsertProject(snapshot, _extraFields = {}, options = {}) {
    try {
      const isPost = options.apiMethod === 'POST';
      const url = isPost ? '/api/projects' : `/api/projects/${snapshot.id}`;
      const targetAmount = Number(
        (parseFloat(snapshot.target_amount) || 0).toFixed(2),
      );
      const spentAmount =
        typeof getProjectSpentAmount === 'function'
          ? getProjectSpentAmount(snapshot)
          : Number((parseFloat(snapshot.spent_amount) || 0).toFixed(2));
      const body = {
        ...(isPost
          ? { id: snapshot.id, mode: snapshot.mode, month: snapshot.month }
          : {}),
        title: snapshot.title,
        targetAmount,
        spentAmount,
        status: snapshot.status || 'active',
        includeInBudget: Boolean(snapshot.include_in_budget),
        timeframeType: snapshot.timeframe_type || 'indefinite',
        startDate: snapshot.start_date || undefined,
        deadline: snapshot.deadline ?? null,
        entries: snapshot.entries || [],
      };
      const res = await fetch(url, {
        method: isPost ? 'POST' : 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(body),
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  async deleteProject(fundId) {
    try {
      const res = await fetch(`/api/projects/${fundId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.ok || res.status === 404;
    } catch (e) {
      return false;
    }
  },

  async upsertClaim(claim, options = {}) {
    try {
      const isPost = options.apiMethod === 'POST';
      const url =
        options.apiPath || (isPost ? '/api/claims' : `/api/claims/${claim.id}`);
      const body =
        options.apiBody !== undefined && options.apiBody !== null
          ? options.apiBody
          : {
              ...(isPost ? { id: claim.id } : {}),
              title: claim.title,
              totalAmount: claim.total_amount,
              myShare: claim.my_share,
              friends: claim.friends || [],
              status: claim.status || 'active',
              date: claim.date || getLocalDateString(),
            };
      const res = await fetch(url, {
        method: options.apiMethod || 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(body),
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  async deleteClaim(claimId) {
    try {
      const res = await fetch(`/api/claims/${claimId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.ok || res.status === 404;
    } catch (e) {
      return false;
    }
  },

  async createRecord(payload) {
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
    return true;
  },

  async updateRecord(id, updatedPayload) {
    const res = await fetch(`/api/records/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(updatedPayload),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Local record update failed');
    }
    return true;
  },

  async deleteRecord(id) {
    const res = await fetch(`/api/records/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete transaction');
    return true;
  },

  async setBudget(month, amount) {
    const res = await fetch('/api/budgets', {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ month, amount }),
    });
    return res.ok;
  },
};

// Pluggable Transport Adapter Seam (可替换，方便 Vitest 注入 MemoryAdapter 测试)
let activeAdapters = [SupabaseAdapter, LocalApiAdapter];

function setLedgerAdapters(customAdapters) {
  if (Array.isArray(customAdapters) && customAdapters.length > 0) {
    activeAdapters = customAdapters;
  }
}

function getLedgerAdapters() {
  return activeAdapters;
}

async function syncEntityThroughAdapters(
  entityType,
  action,
  payload,
  options = {},
) {
  const { fromQueue = false } = options;
  const entityId = payload?.id;
  if (!entityId) return false;

  if (!navigator.onLine) {
    if (!fromQueue) enqueueMetaSync(entityType, action, payload);
    return false;
  }

  const methodName =
    action === 'delete'
      ? entityType === 'project'
        ? 'deleteProject'
        : 'deleteClaim'
      : entityType === 'project'
        ? 'upsertProject'
        : 'upsertClaim';

  let primaryOk = false;
  let anyOk = false;
  let hasSupabase = false;
  for (const adapter of getLedgerAdapters()) {
    if (typeof adapter[methodName] !== 'function') continue;
    if (adapter.name === 'supabase' && adapter.isAvailable?.()) {
      hasSupabase = true;
    }
    const ok =
      action === 'delete'
        ? await adapter[methodName](entityId, options)
        : entityType === 'project'
          ? await adapter[methodName](
              payload,
              options.extraFields || {},
              options,
            )
          : await adapter[methodName](payload, options);
    if (ok) {
      anyOk = true;
      if (adapter.name === 'supabase') primaryOk = true;
    }
  }

  const synced = hasSupabase ? primaryOk : anyOk;
  if (synced) {
    removeMetaSync(entityType, entityId);
    return true;
  }
  if (!fromQueue) enqueueMetaSync(entityType, action, payload);
  return false;
}

function getPrimaryRecordAdapter() {
  const adapters = getLedgerAdapters();
  return (
    adapters.find(
      (a) => a.isAvailable?.() && typeof a.createRecord === 'function',
    ) || adapters[0]
  );
}

const LedgerStore = {
  vault: LocalVault,
  setAdapters: setLedgerAdapters,
  getAdapters: getLedgerAdapters,

  records: {
    async create(payload) {
      const adapter = getPrimaryRecordAdapter();
      return adapter.createRecord(payload);
    },

    async update(id, updatedPayload, nextImageArchived = false) {
      if (String(id).startsWith('draft-')) return true;
      const adapter = getPrimaryRecordAdapter();
      return adapter.updateRecord(id, updatedPayload, nextImageArchived);
    },

    async remove(id) {
      const adapter = getPrimaryRecordAdapter();
      return adapter.deleteRecord(id);
    },
  },

  projects: {
    async upsert(fund, extraFields = {}, options = {}) {
      if (!fund || !fund.id) return false;
      const cleanEntries =
        typeof normalizeProjectEntries === 'function'
          ? normalizeProjectEntries(fund.entries)
          : Array.isArray(fund.entries)
            ? fund.entries
            : [];
      const snapshot = {
        ...fund,
        ...extraFields,
        status: extraFields.status || fund.status || 'active',
        entries: cleanEntries,
      };
      return syncEntityThroughAdapters('project', 'upsert', snapshot, {
        ...options,
        extraFields,
      });
    },

    async remove(fundId, options = {}) {
      if (!fundId) return false;
      return syncEntityThroughAdapters(
        'project',
        'delete',
        { id: fundId },
        options,
      );
    },
  },

  claims: {
    async upsert(claim, options = {}) {
      if (!claim || !claim.id) return false;
      return syncEntityThroughAdapters('claim', 'upsert', claim, options);
    },

    async remove(claimId, options = {}) {
      if (!claimId) return false;
      return syncEntityThroughAdapters(
        'claim',
        'delete',
        { id: claimId },
        options,
      );
    },
  },

  budgets: {
    async set(month, amount) {
      const adapter = getPrimaryRecordAdapter();
      if (typeof adapter?.setBudget !== 'function') return false;
      return adapter.setBudget(month, amount);
    },
  },
};

window.LedgerStore = LedgerStore;
