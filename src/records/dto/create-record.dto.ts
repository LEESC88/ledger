import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '../../common/enums/transaction-type.enum.js';

/**
 * Data Transfer Object for creating a new ledger record.
 * Contains input validation rules and OpenAPI/Swagger schema metadata.
 */
export class CreateRecordDto {
  /**
   * Transaction type: either 'income' or 'expense'
   */
  @ApiProperty({ enum: TransactionType, example: TransactionType.EXPENSE })
  @IsEnum(TransactionType)
  type: TransactionType;

  /**
   * Positive numeric amount for the transaction
   */
  @ApiProperty({ example: 45.5, description: 'Transaction monetary amount' })
  @IsNumber()
  @IsPositive()
  amount: number;

  /**
   * Transaction category name (e.g. 'Food & Dining', 'Salary')
   */
  @ApiProperty({ example: 'Food & Dining', description: 'Category identifier' })
  @IsString()
  @IsNotEmpty()
  category: string;

  /**
   * Transaction date in ISO format (YYYY-MM-DD)
   */
  @ApiProperty({
    example: '2026-10-20',
    description: 'Transaction date (YYYY-MM-DD)',
  })
  @IsDateString()
  date: string;

  /**
   * Optional contextual remark or memo (max 255 characters)
   */
  @ApiPropertyOptional({
    example: 'Dinner with colleagues',
    description: 'Optional remarks',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string;
}
