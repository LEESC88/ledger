import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Single expense item recorded inside a Project / Dedicated Fund card.
 */
export interface ProjectEntryItem {
  id: string;
  title?: string;
  category: string;
  account_name: string;
  amount: number;
  date: string;
  image_url?: string | null;
  image_size_kb?: number;
  created_at: string;
}

/**
 * Project Entity
 * Represents a dedicated sinking fund / project budget card mapped to the 'projects' table.
 */
@Entity('projects')
export class Project {
  /**
   * Unique project identifier (e.g., 'proj_1730000000000')
   */
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  /**
   * User identifier (UUID from Supabase Auth) for tenant isolation
   */
  @Column({ type: 'varchar', length: 100, name: 'user_id', nullable: true })
  userId?: string;

  /**
   * Project Title (e.g. '🚗 汽车大保养', '✈️ 沙巴度假')
   */
  @Column({ type: 'varchar', length: 100 })
  title: string;

  /**
   * Visual icon / emoji
   */
  @Column({ type: 'varchar', length: 20, default: '🎯' })
  icon: string;

  /**
   * Target budget monetary amount
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'target_amount' })
  targetAmount: number;

  /**
   * Accumulated spent monetary amount derived from project entries
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'spent_amount',
    default: 0,
  })
  spentAmount: number;

  /**
   * Funding mode: 'budget_deduct' (included in monthly budget monitor) or 'extra' (independent card)
   */
  @Column({ type: 'varchar', length: 30, default: 'extra' })
  mode: string;

  /**
   * Month identifier in 'YYYY-MM' format
   */
  @Column({ type: 'varchar', length: 10 })
  month: string;

  /**
   * Current status: 'active' | 'settled'
   */
  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  /**
   * Whether this project displays in the Monthly Budget monitor's Dedicated Funds section
   */
  @Column({ type: 'boolean', name: 'include_in_budget', default: false })
  includeInBudget: boolean;

  /**
   * Timeframe preset: 'indefinite' | '2w' | 'this_month' | '1m' | '3m' | 'custom'
   */
  @Column({
    type: 'varchar',
    length: 30,
    name: 'timeframe_type',
    default: 'indefinite',
  })
  timeframeType: string;

  /**
   * Start date in ISO YYYY-MM-DD format
   */
  @Column({ type: 'varchar', length: 10, name: 'start_date', nullable: true })
  startDate?: string | null;

  /**
   * Optional deadline in ISO YYYY-MM-DD format (null for indefinite/ongoing funds)
   */
  @Column({ type: 'varchar', length: 10, nullable: true })
  deadline?: string | null;

  /**
   * Standalone project expense items (stored as JSONB in Postgres, JSON text in SQLite)
   */
  @Column({
    type: process.env.DATABASE_URL ? 'jsonb' : 'simple-json',
    nullable: true,
  })
  entries?: ProjectEntryItem[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
