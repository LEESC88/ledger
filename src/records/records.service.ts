import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './entities/record.entity.js';
import { CreateRecordDto } from './dto/create-record.dto.js';
import { UpdateRecordDto } from './dto/update-record.dto.js';
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
    if (userId) {
      const userCount = await this.recordRepository.count({ where: { userId } });
      if (userCount >= 50000) {
        throw new BadRequestException(
          'Single account record storage limit (50,000) reached. Please backup and purge older records.',
        );
      }
    }

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
   * Updates an existing transaction record by its unique ID, verifying owner if userId provided.
   */
  async update(
    id: number,
    updateRecordDto: UpdateRecordDto,
    userId?: string,
  ): Promise<Record> {
    const whereCondition: any = { id };
    if (userId) {
      whereCondition.userId = userId;
    }
    const record = await this.recordRepository.findOne({
      where: whereCondition,
    });
    if (!record) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }
    Object.assign(record, updateRecordDto);
    return await this.recordRepository.save(record);
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

  /**
   * Evaluates storage capacity metrics and quota health for multi-user safety.
   */
  async getStorageStatus(userId?: string) {
    const totalRecords = await this.recordRepository.count(
      userId ? { where: { userId } } : {},
    );
    const estimatedBytes = totalRecords * 200; // ~200 bytes per record
    return {
      totalRecords,
      estimatedBytes,
      estimatedKb: Number((estimatedBytes / 1024).toFixed(2)),
      estimatedMb: Number((estimatedBytes / (1024 * 1024)).toFixed(2)),
      quotaLimit: 50000,
      isHealthy: totalRecords < 45000,
      thresholdPct: Number(((totalRecords / 50000) * 100).toFixed(1)),
    };
  }
}
