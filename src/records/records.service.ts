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
  async create(createRecordDto: CreateRecordDto): Promise<Record> {
    const newRecord = this.recordRepository.create(createRecordDto);
    return await this.recordRepository.save(newRecord);
  }

  /**
   * Retrieves all transaction records from the database sorted by date descending.
   */
  async findAll(): Promise<Record[]> {
    return await this.recordRepository.find({
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  /**
   * Deletes a transaction record by its unique ID.
   */
  async remove(id: number): Promise<void> {
    const result = await this.recordRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }
  }

  /**
   * Calculates financial totals (Total Income, Total Expense, Net Balance)
   * and aggregates category breakdowns, optionally filtered by month.
   *
   * @param month - Optional filter in YYYY-MM format
   */
  async getSummary(month?: string) {
    const allRecords = await this.findAll();
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
}
