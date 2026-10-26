import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  Index,
} from 'typeorm';

/**
 * Budget Entity
 * Represents user-defined monthly spending limits for financial goal tracking.
 */
@Entity('budgets')
@Unique(['userId', 'month'])
@Index(['userId', 'month'])
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * User identifier (UUID string from Supabase Auth) for tenant isolation
   */
  @Column({ type: 'text', name: 'user_id', nullable: true })
  userId?: string;

  /**
   * Target budget month formatted as 'YYYY-MM' or 'default'
   */
  @Column({ type: 'varchar', length: 10 })
  month: string;

  /**
   * Target spending limit amount
   */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
