import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsBoolean,
  IsOptional,
  IsArray,
  IsIn,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Single expense entry payload within a dedicated project budget card.
 */
export class ProjectEntryDto {
  @ApiProperty({ example: 'pentry_1730000000000_abcd' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({ example: '小零件' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Transportation' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'eWallet' })
  @IsString()
  @IsNotEmpty()
  account_name: string;

  @ApiProperty({ example: 120 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: '2026-11-18' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional({ nullable: true })
  @IsString()
  @IsOptional()
  image_url?: string | null;

  @ApiPropertyOptional({ example: 42 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  image_size_kb?: number;

  @ApiPropertyOptional({ example: '2026-11-18T10:15:00.000Z' })
  @IsString()
  @IsOptional()
  created_at?: string;
}

/**
 * Data Transfer Object for updating a Project card's settings, entries, and status.
 */
export class UpdateProjectDto {
  @ApiPropertyOptional({ example: '修车保养' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 600 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  targetAmount?: number;

  @ApiPropertyOptional({ example: 210 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  spentAmount?: number;

  @ApiPropertyOptional({ enum: ['active', 'settled'] })
  @IsString()
  @IsIn(['active', 'settled'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  includeInBudget?: boolean;

  @ApiPropertyOptional({
    enum: ['indefinite', '2w', 'this_month', '1m', '3m', 'custom'],
  })
  @IsString()
  @IsIn(['indefinite', '2w', 'this_month', '1m', '3m', 'custom'])
  @IsOptional()
  timeframeType?: string;

  @ApiPropertyOptional({ example: '2026-11-18' })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-12-02', nullable: true })
  @IsString()
  @IsOptional()
  deadline?: string | null;

  @ApiPropertyOptional({ type: [ProjectEntryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectEntryDto)
  @IsOptional()
  entries?: ProjectEntryDto[];
}
