import { describe, expect, it } from 'vitest';
import * as domain from '../public/js/domain.mjs';

describe('LedgerDomain (Pure Financial Calculations)', () => {
  it('computes monthly summary and descending category breakdown', () => {
    const res = domain.computeMonthlySummary(
      [
        {
          date: '2026-11-01',
          type: 'income',
          amount: 5000,
          category: 'Salary',
        },
        {
          date: '2026-11-02',
          type: 'expense',
          amount: 120.5,
          category: 'Food & Dining',
        },
        {
          date: '2026-11-03',
          type: 'expense',
          amount: 300,
          category: 'Shopping',
        },
        {
          date: '2026-11-04',
          type: 'expense',
          amount: 80,
          category: 'Food & Dining',
        },
        {
          date: '2026-10-28',
          type: 'expense',
          amount: 999,
          category: 'Shopping',
        },
      ],
      '2026-11',
    );

    expect(res.totalIncome).toBe(5000);
    expect(res.totalExpense).toBe(500.5);
    expect(res.netBalance).toBe(4499.5);
    expect(res.count).toBe(4);
    expect(res.categoryBreakdown).toEqual([
      { category: 'Shopping', amount: 300 },
      { category: 'Food & Dining', amount: 200.5 },
    ]);
  });

  it('computes budget pool thresholds and zero-budget safety', () => {
    const warn = domain.computeBudgetPool({
      baseBudget: 1000,
      topUps: 200,
      lockedFunds: 200,
      totalExpense: 850,
    });
    expect(warn).toEqual({
      effectiveBudget: 1000,
      spent: 850,
      remaining: 150,
      usagePercent: 85,
      status: 'warning',
    });

    const over = domain.computeBudgetPool({
      baseBudget: 0,
      totalExpense: 50,
    });
    expect(over.usagePercent).toBe(100);
    expect(over.status).toBe('warning');
  });

  it('computes consecutive streak with today/yesterday anchors and breaks', () => {
    expect(
      domain.computeStreak(
        [
          { date: '2026-11-25' },
          { date: '2026-11-24' },
          { date: '2026-11-23' },
          { date: '2026-11-21' },
        ],
        '2026-11-25',
      ),
    ).toBe(3);

    expect(
      domain.computeStreak(
        [{ date: '2026-11-24' }, { date: '2026-11-23' }],
        '2026-11-25',
      ),
    ).toBe(2);

    expect(domain.computeStreak([{ date: '2026-11-22' }], '2026-11-25')).toBe(
      0,
    );
  });

  it('computes split bill shares, pure advance, over-sum, and settled status', () => {
    const active = domain.computeSplitBill(200, [
      { name: 'A', amount: 60, paid: true },
      { name: 'B', amount: 70, paid: false },
    ]);
    expect(active).toEqual({
      total: 200,
      friendsSum: 130,
      myShare: 70,
      isOverSum: false,
      isPureAdvance: false,
      received: 60,
      pending: 70,
      status: 'active',
    });

    const pureSettled = domain.computeSplitBill(100, [
      { name: 'A', amount: 100, paid: true },
    ]);
    expect(pureSettled.isPureAdvance).toBe(true);
    expect(pureSettled.status).toBe('settled');
  });

  it('computes project progress from entries or fallback spent_amount', () => {
    const p = domain.computeProjectProgress({
      target_amount: 1000,
      entries: [{ amount: 400 }, { amount: 750 }],
    });
    expect(p).toEqual({
      target: 1000,
      spent: 1150,
      remaining: -150,
      progressPercent: 115,
      isOverBudget: true,
    });
  });
});
