import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface ClaimFriendItem {
  name: string;
  amount: number;
  paid: boolean;
}

/**
 * Claim Entity
 * Represents a split bill / reimbursement / IOU tracker entry.
 */
@Entity('claims')
export class Claim {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 100, name: 'user_id', nullable: true })
  userId?: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'my_share' })
  myShare: number;

  @Column({ type: 'simple-json' })
  friends: ClaimFriendItem[];

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  @Column({ type: 'varchar', length: 10 })
  date: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
