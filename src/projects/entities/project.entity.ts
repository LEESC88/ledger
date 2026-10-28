import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Project Entity
 * Represents a dedicated sinking fund or project envelope mapped to the 'projects' table.
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
   * Target reserved monetary amount
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'target_amount' })
  targetAmount: number;

  /**
   * Accumulated spent monetary amount
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
   * Funding mode: 'budget_deduct' (deducted from monthly budget) or 'extra' (independent tracking)
   */
  @Column({ type: 'varchar', length: 30, default: 'budget_deduct' })
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

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
