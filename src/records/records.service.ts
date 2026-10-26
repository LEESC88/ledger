import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './entities/record.entity.js';
import { CreateRecordDto } from './dto/create-record.dto.js';
import { TransactionType } from '../common/enums/transaction-type.enum.js';

/**
 * RecordsService
 * Handles business logic and database persistence for ledger records using TypeORM Repository.
 */
@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  /**
   * Persists a new transaction record into the database.
   */
  async create(
    createRecordDto: CreateRecordDto,
    userId?: string,
  ): Promise<Record> {
    const newRecord = this.recordRepository.create({
      ...createRecordDto,
      userId,
    });
    return await this.recordRepository.save(newRecord);
  }

  /**
   * Retrieves all transaction records from the database sorted by date descending.
   */
  async findAll(userId?: string): Promise<Record[]> {
    return await this.recordRepository.find({
      where: userId ? { userId } : {},
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  /**
   * Deletes a transaction record by its unique ID, verifying owner if userId provided.
   */
  async remove(id: number, userId?: string): Promise<void> {
    const whereCondition: any = { id };
    if (userId) {
      whereCondition.userId = userId;
    }
    const result = await this.recordRepository.delete(whereCondition);
    if (result.affected === 0) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }
  }

  /**
   * Calculates financial totals (Total Income, Total Expense, Net Balance)
   * and aggregates category breakdowns, optionally filtered by month and userId.
   *
   * @param month - Optional filter in YYYY-MM format
   * @param userId - Optional user UUID for multi-tenant isolation
   */
  async getSummary(month?: string, userId?: string) {
    const allRecords = await this.findAll(userId);
    const records = month
      ? allRecords.filter((r) => r.date.startsWith(month))
      : allRecords;

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryBreakdown: { [category: string]: number } = {};

    for (const record of records) {
      const amount = Number(record.amount);
      if (record.type === TransactionType.INCOME) {
        totalIncome += amount;
      } else {
        totalExpense += amount;
        categoryBreakdown[record.category] =
          (categoryBreakdown[record.category] || 0) + amount;
      }
    }

    return {
      month: month || 'all',
      totalIncome: Number(totalIncome.toFixed(2)),
      totalExpense: Number(totalExpense.toFixed(2)),
      netBalance: Number((totalIncome - totalExpense).toFixed(2)),
      categoryBreakdown,
    };
  }

  /**
   * Retrieves historical transaction records older than the specified retention threshold.
   *
   * @param years - Retention period threshold in years
   */
  async findOlderThan(years: number, userId?: string): Promise<Record[]> {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - years);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

    const qb = this.recordRepository
      .createQueryBuilder('record')
      .where('record.date < :cutoffDate', { cutoffDate: cutoffDateStr });

    if (userId) {
      qb.andWhere('record.userId = :userId', { userId });
    }

    return await qb.orderBy('record.date', 'ASC').getMany();
  }

  /**
   * Permanently deletes transaction records older than the specified retention threshold.
   *
   * @param years - Retention period threshold in years
   * @param userId - Optional user UUID for multi-tenant isolation
   */
  async purgeOlderThan(
    years: number,
    userId?: string,
  ): Promise<{ purgedCount: number; cutoffDate: string }> {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - years);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

    const qb = this.recordRepository
      .createQueryBuilder()
      .delete()
      .from(Record)
      .where('date < :cutoffDate', { cutoffDate: cutoffDateStr });

    if (userId) {
      qb.andWhere('user_id = :userId', { userId });
    }

    const result = await qb.execute();
    return { purgedCount: result.affected ?? 0, cutoffDate: cutoffDateStr };
  }
}
