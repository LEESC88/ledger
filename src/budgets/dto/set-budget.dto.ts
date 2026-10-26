import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for setting a monthly budget
 */
export class SetBudgetDto {
  /**
   * Month in YYYY-MM format or 'default'
   */
  @ApiProperty({
    example: '2026-10',
    description: 'Target month in YYYY-MM format or default',
  })
  @IsString()
  @IsNotEmpty()
  month: string;

  /**
   * Budget spending ceiling amount
   */
  @ApiProperty({ example: 3000, description: 'Budget spending limit amount' })
  @IsNumber()
  @IsPositive()
  amount: number;
}
