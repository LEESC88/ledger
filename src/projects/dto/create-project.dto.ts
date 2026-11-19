import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  IsIn,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for creating a new Sinking Fund / Project Budget Card.
 */
export class CreateProjectDto {
  @ApiPropertyOptional({
    example: 'proj_1730000000000',
    description: 'Client-generated unique ID',
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({ example: '🚗 汽车大保养', description: 'Project title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: '🚗', description: 'Icon or emoji' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ example: 500, description: 'Target budget monetary amount' })
  @IsNumber()
  @IsPositive()
  targetAmount: number;

  @ApiPropertyOptional({
    example: 'extra',
    enum: ['budget_deduct', 'extra'],
    description: 'Funding mode',
  })
  @IsString()
  @IsOptional()
  @IsIn(['budget_deduct', 'extra'])
  mode?: string;

  @ApiPropertyOptional({ example: '2026-11', description: 'Target month' })
  @IsString()
  @IsOptional()
  month?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Include in monthly budget monitor',
  })
  @IsBoolean()
  @IsOptional()
  includeInBudget?: boolean;

  @ApiPropertyOptional({
    example: 'indefinite',
    enum: ['indefinite', '2w', 'this_month', '1m', '3m', 'custom'],
    description: 'Custom timeframe preset',
  })
  @IsString()
  @IsOptional()
  @IsIn(['indefinite', '2w', 'this_month', '1m', '3m', 'custom'])
  timeframeType?: string;

  @ApiPropertyOptional({ example: '2026-11-18', description: 'Start date (YYYY-MM-DD)' })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-12-02',
    nullable: true,
    description: 'Optional deadline (YYYY-MM-DD)',
  })
  @IsString()
  @IsOptional()
  deadline?: string | null;
}
