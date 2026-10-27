import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionType } from '../../common/enums/transaction-type.enum.js';

/**
 * Record Entity
 * Represents a single transaction entry (income or expense) mapped to the 'records' table in SQLite.
 */
@Entity('records')
export class Record {
  /**
   * Unique transaction identifier (Auto-incremented primary key)
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * User identifier (UUID string from Supabase Auth) for tenant isolation
   */
  @Column({ type: 'text', name: 'user_id', nullable: true })
  userId?: string;

  /**
   * Type of transaction: 'income' or 'expense'
   */
  @Column({ type: 'text' })
  type: TransactionType;

  /**
   * Monetary amount of the transaction
   */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  /**
   * Category tag (e.g., 'Food & Dining', 'Salary', 'Shopping')
   */
  @Column({ type: 'text' })
  category: string;

  /**
   * Account / Payment method name (e.g. 'Cash', 'TNG eWallet', 'Bank Card', 'Credit Card')
   */
  @Column({ type: 'text', name: 'account_name', nullable: true, default: 'Cash' })
  account_name?: string;

  /**
   * Date the transaction occurred (ISO format: YYYY-MM-DD)
   */
  @Column({ type: 'text' })
  date: string;

  /**
   * Optional note or description for additional context
   */
  @Column({ type: 'text', nullable: true })
  note?: string;

  /**
   * Timestamp when the record was initially inserted
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * Timestamp when the record was last modified
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
