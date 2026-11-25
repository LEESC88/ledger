import { describe, expect, it } from 'vitest';
import { createAppState } from '../public/js/app-state.mjs';

describe('AppState (Native ES Module Explicit State)', () => {
  it('returns defensive copies from getSlice and rejects unknown slices', () => {
    const store = createAppState({
      session: { currency: 'USD' },
    });

    const session = store.getSlice('session');
    expect(session.currency).toBe('USD');

    // Mutating returned copy must not corrupt internal state
    session.currency = 'HACKED';
    expect(store.getSlice('session').currency).toBe('USD');

    expect(() => store.getSlice('nonexistent')).toThrow(
      'Unknown AppState slice: nonexistent',
    );
  });

  it('patches slices, notifies subscribers, and supports unsubscribe', () => {
    const store = createAppState();
    const seen: string[] = [];

    const unsubscribe = store.subscribe('filters', (next: any) => {
      seen.push(`${next.currentMonth}:${next.currentFilter}`);
    });

    const updated = store.patchSlice('filters', {
      currentMonth: '2026-11',
      currentFilter: 'expense',
    });
    expect(updated.currentMonth).toBe('2026-11');
    expect(seen).toEqual(['2026-11:expense']);

    unsubscribe();
    store.patchSlice('filters', { currentMonth: '2026-12' });
    expect(seen).toEqual(['2026-11:expense']);
  });
});
