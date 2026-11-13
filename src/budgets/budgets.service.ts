import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity.js';
import { SetBudgetDto } from './dto/set-budget.dto.js';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
  ) {}

  /**
   * Retrieves budget for a given month and user, falling back to 'default' budget.
   */
  async getBudget(month: string, userId?: string): Promise<Budget | null> {
    if (!userId) {
      return null;
    }
    const whereCondition: any = {
      month,
      userId,
    };

    let budget = await this.budgetRepository.findOne({ where: whereCondition });

    // Fallback to 'default' budget if specific month is not configured
    if (!budget && month !== 'default') {
      const defaultWhere: any = {
        month: 'default',
        userId,
      };
      budget = await this.budgetRepository.findOne({ where: defaultWhere });
    }

    return budget;
  }

  /**
   * Persists or updates budget target for a user and month.
   */
  async setBudget(dto: SetBudgetDto, userId?: string): Promise<Budget> {
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }
    const month = dto.month || 'default';
    const whereCondition: any = {
      month,
      userId,
    };

    let existing = await this.budgetRepository.findOne({
      where: whereCondition,
    });
    if (existing) {
      existing.amount = dto.amount;
      return await this.budgetRepository.save(existing);
    }

    const newBudget = this.budgetRepository.create({
      userId,
      month,
      amount: dto.amount,
    });
    return await this.budgetRepository.save(newBudget);
  }
}
