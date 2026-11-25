import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';

function createStoreHarness(initialOnline = true) {
  const storage = new Map<string, string>();
  const calls: Array<unknown[]> = [];

  const sandbox: Record<string, any> = {
    console,
    Date,
    Math,
    Number,
    String,
    Boolean,
    Array,
    Object,
    JSON,
    Set,
    Map,
    Promise,
    parseFloat,
    isNaN,
    navigator: { onLine: initialOnline },
    localStorage: {
      getItem: (k: string) => (storage.has(k) ? storage.get(k)! : null),
      setItem: (k: string, v: string) => storage.set(k, String(v)),
      removeItem: (k: string) => storage.delete(k),
    },
    state: {
      user: { id: 'user-1' },
      lang: 'zh',
      isSyncing: false,
      projects: [],
      claims: [],
      records: [],
    },
    elements: {},
    t: (k: string) => k,
    showToast: (msg: string) => calls.push(['toast', msg]),
    getAuthHeaders: (h: Record<string, string> = {}) => h,
    getLocalDateString: () => '2026-11-25',
    getCurrentMonthKey: () => '2026-11',
    renderSinkingFunds: () => {},
    renderClaims: () => {},
    renderBudgetTracker: () => {},
    fetchRecords: async () => {},
    fetchProjectsFromBackend: async () => {},
    fetchClaimsFromBackend: async () => {},
    syncProjectChangeToCloud: async (p: any, extra: any, opts: any) =>
      sandbox.LedgerStore.projects.upsert(p, extra, opts),
    deleteProjectInCloud: async (id: string, opts: any) =>
      sandbox.LedgerStore.projects.remove(id, opts),
  };
  sandbox.window = sandbox;

  vm.createContext(sandbox);
  const root = process.cwd();
  vm.runInContext(
    readFileSync(join(root, 'public/js/store.js'), 'utf8'),
    sandbox,
  );
  vm.runInContext(
    readFileSync(join(root, 'public/js/sync.js'), 'utf8'),
    sandbox,
  );

  const memoryAdapter = {
    name: 'memory',
    isAvailable: () => true,
    createRecord: async (payload: any) => {
      calls.push(['createRecord', payload.amount, payload.category]);
      return true;
    },
    updateRecord: async (id: any, payload: any) => {
      calls.push(['updateRecord', id, payload.amount]);
      return true;
    },
    deleteRecord: async (id: any) => {
      calls.push(['deleteRecord', id]);
      return true;
    },
    upsertProject: async (p: any) => {
      calls.push(['upsertProject', p.id, p.title]);
      return true;
    },
    deleteProject: async (id: string) => {
      calls.push(['deleteProject', id]);
      return true;
    },
    upsertClaim: async (c: any) => {
      calls.push(['upsertClaim', c.id, c.title]);
      return true;
    },
    deleteClaim: async (id: string) => {
      calls.push(['deleteClaim', id]);
      return true;
    },
    setBudget: async (month: string, amount: number) => {
      calls.push(['setBudget', month, amount]);
      return true;
    },
  };

  sandbox.LedgerStore.setAdapters([memoryAdapter]);
  return { sandbox, calls };
}

describe('LedgerStore (Ports & Adapters)', () => {
  it('routes record CRUD through the active adapter and skips draft updates', async () => {
    const { sandbox, calls } = createStoreHarness(true);

    await sandbox.LedgerStore.records.create({
      amount: 42,
      category: 'Food & Dining',
    });
    const draftResult = await sandbox.LedgerStore.records.update('draft-123', {
      amount: 99,
    });
    await sandbox.LedgerStore.records.update('rec-9', { amount: 88 });
    await sandbox.LedgerStore.records.remove('rec-9');

    expect(draftResult).toBe(true);
    expect(calls).toEqual([
      ['createRecord', 42, 'Food & Dining'],
      ['updateRecord', 'rec-9', 88],
      ['deleteRecord', 'rec-9'],
    ]);
  });

  it('queues offline project & claim mutations, deduplicates, and replays on reconnect', async () => {
    const { sandbox, calls } = createStoreHarness(false);

    const p1 = await sandbox.LedgerStore.projects.upsert({
      id: 'proj-1',
      title: 'Trip v1',
    });
    const p2 = await sandbox.LedgerStore.projects.upsert({
      id: 'proj-1',
      title: 'Trip v2',
    });
    const c1 = await sandbox.LedgerStore.claims.upsert({
      id: 'claim-1',
      title: 'Dinner',
    });
    const c2 = await sandbox.LedgerStore.claims.remove('claim-2');

    expect([p1, p2, c1, c2]).toEqual([false, false, false, false]);
    expect(sandbox.getTotalPendingSyncCount()).toBe(3);

    sandbox.navigator.onLine = true;
    await sandbox.syncOfflineDrafts();

    expect(sandbox.getTotalPendingSyncCount()).toBe(0);
    expect(calls).toContainEqual(['upsertProject', 'proj-1', 'Trip v2']);
    expect(calls).toContainEqual(['upsertClaim', 'claim-1', 'Dinner']);
    expect(calls).toContainEqual(['deleteClaim', 'claim-2']);

    const budgetOk = await sandbox.LedgerStore.budgets.set('2026-11', 3500);
    expect(budgetOk).toBe(true);
    expect(calls).toContainEqual(['setBudget', '2026-11', 3500]);
  });
});
