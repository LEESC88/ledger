import { UnauthorizedException } from '@nestjs/common';
import { describe, it, expect, vi } from 'vitest';
import { RecordsService } from './records/records.service.js';
import { ProjectsService } from './projects/projects.service.js';
import { ClaimsService } from './claims/claims.service.js';
import { BudgetsService } from './budgets/budgets.service.js';
import { TransactionType } from './common/enums/transaction-type.enum.js';

function createMockRepo() {
  return {
    count: vi.fn().mockResolvedValue(0),
    find: vi.fn().mockResolvedValue([]),
    findOne: vi.fn().mockResolvedValue(null),
    create: vi.fn((data) => data),
    save: vi.fn(async (entity) => entity),
    delete: vi.fn().mockResolvedValue({ affected: 1 }),
    remove: vi.fn(async (entity) => entity),
  };
}

describe('Multi-Tenant Isolation & Core Service Logic', () => {
  it('RecordsService: rejects writes without userId and computes summary', async () => {
    const repo = createMockRepo();
    const service = new RecordsService(repo as never);

    await expect(service.findAll()).resolves.toEqual([]);
    await expect(
      service.create({
        type: TransactionType.EXPENSE,
        amount: 25,
        category: 'Food',
        date: '2026-11-16',
      }),
    ).rejects.toThrow(UnauthorizedException);
    await expect(service.update(1, { amount: 30 })).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(service.remove(1)).rejects.toThrow(UnauthorizedException);

    repo.find.mockResolvedValueOnce([
      {
        type: TransactionType.INCOME,
        amount: 100,
        category: 'Salary',
        date: '2026-11-01',
      },
      {
        type: TransactionType.EXPENSE,
        amount: 35.5,
        category: 'Food',
        date: '2026-11-02',
      },
    ]);
    const summary = await service.getSummary('2026-11', 'user-1');
    expect(summary).toEqual({
      month: '2026-11',
      totalIncome: 100,
      totalExpense: 35.5,
      netBalance: 64.5,
      categoryBreakdown: { Food: 35.5 },
    });
  });

  it('ProjectsService: enforces userId on all read & write methods', async () => {
    const repo = createMockRepo();
    const service = new ProjectsService(repo as never);

    await expect(service.findAll()).resolves.toEqual([]);
    await expect(
      service.create({ title: 'Japan Trip', targetAmount: 5000 }),
    ).rejects.toThrow(UnauthorizedException);
    await expect(service.settle('proj_1')).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(service.release('proj_1')).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(service.remove('proj_1')).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(service.updateSpentAmount('proj_1', 200)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(
      service.update('proj_1', { title: 'Updated' }),
    ).rejects.toThrow(UnauthorizedException);
    await expect(service.resume('proj_1')).rejects.toThrow(
      UnauthorizedException,
    );

    repo.findOne.mockResolvedValueOnce({
      id: 'proj_1',
      userId: 'user-1',
      title: 'Car Repair',
      targetAmount: 500,
      spentAmount: 0,
      status: 'active',
      entries: [],
    });
    const updatedProj = await service.update(
      'proj_1',
      {
        includeInBudget: true,
        timeframeType: '2w',
        entries: [
          {
            id: 'e1',
            title: 'Parts',
            category: 'Transportation',
            account_name: 'Cash',
            amount: 120,
            date: '2026-11-18',
          },
          {
            id: 'e2',
            title: 'Oil',
            category: 'Transportation',
            account_name: 'eWallet',
            amount: 150,
            date: '2026-11-18',
          },
        ],
      },
      'user-1',
    );
    expect(updatedProj.spentAmount).toBe(270);
    expect(updatedProj.includeInBudget).toBe(true);
    expect(updatedProj.entries).toHaveLength(2);

    repo.findOne.mockResolvedValueOnce({
      id: 'proj_1',
      userId: 'user-1',
      status: 'settled',
    });
    const resumedProj = await service.resume('proj_1', 'user-1');
    expect(resumedProj.status).toBe('active');
  });

  it('ClaimsService: enforces userId and auto-settles when all friends pay', async () => {
    const repo = createMockRepo();
    const service = new ClaimsService(repo as never);

    await expect(service.findAll()).resolves.toEqual([]);
    await expect(
      service.create({
        title: 'Dinner',
        totalAmount: 90,
        myShare: 30,
        date: '2026-11-16',
        friends: [],
      }),
    ).rejects.toThrow(UnauthorizedException);
    await expect(service.toggleFriendPaid('claim_1', 0)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(service.settleAll('claim_1')).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(service.remove('claim_1')).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(
      service.update('claim_1', { title: 'Updated' }),
    ).rejects.toThrow(UnauthorizedException);

    repo.findOne.mockResolvedValueOnce({
      id: 'claim_1',
      userId: 'user-1',
      status: 'active',
      friends: [{ name: 'Alice', amount: 30, paid: false }],
    });
    const updated = await service.toggleFriendPaid(
      'claim_1',
      0,
      'user-1',
      'eWallet',
    );
    expect(updated.friends[0].paid).toBe(true);
    expect(updated.friends[0].paid_via).toBe('eWallet');
    expect(updated.status).toBe('settled');

    repo.findOne.mockResolvedValueOnce({
      id: 'claim_1',
      userId: 'user-1',
      title: 'Dinner',
      totalAmount: 90,
      myShare: 30,
      status: 'settled',
      date: '2026-11-16',
      friends: [{ name: 'Alice', amount: 60, paid: true, paid_via: 'Cash' }],
    });
    const edited = await service.update(
      'claim_1',
      {
        title: 'Hotpot Dinner',
        totalAmount: 120,
        friends: [
          { name: 'Alice', amount: 40, paid: true, paid_via: 'Cash' },
          { name: 'Bob', amount: 40, paid: false, paid_via: 'eWallet' },
        ],
      },
      'user-1',
    );
    expect(edited.title).toBe('Hotpot Dinner');
    expect(edited.myShare).toBe(40);
    expect(edited.status).toBe('active');
    expect(edited.friends).toHaveLength(2);
    expect(edited.friends[0].paid_via).toBe('Cash');
    expect(edited.friends[1].paid_via).toBeUndefined();

    repo.findOne.mockResolvedValueOnce(edited);
    const allSettled = await service.settleAll(
      'claim_1',
      'user-1',
      'Bank Card',
    );
    expect(allSettled.status).toBe('settled');
    expect(allSettled.friends[0].paid_via).toBe('Cash');
    expect(allSettled.friends[1].paid_via).toBe('Bank Card');
  });

  it('BudgetsService: enforces userId and falls back to default budget', async () => {
    const repo = createMockRepo();
    const service = new BudgetsService(repo as never);

    await expect(service.getBudget('2026-11')).resolves.toBeNull();
    await expect(
      service.setBudget({
        amount: 3000,
        month: '',
      }),
    ).rejects.toThrow(UnauthorizedException);

    repo.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({
      month: 'default',
      userId: 'user-1',
      amount: 2500,
    });
    const budget = await service.getBudget('2026-11', 'user-1');
    expect(budget?.amount).toBe(2500);
    expect(repo.findOne).toHaveBeenNthCalledWith(2, {
      where: { month: 'default', userId: 'user-1' },
    });
  });
});
