import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for creating a new Sinking Fund / Project.
 */
export class CreateProjectDto {
  @ApiPropertyOptional({ example: 'proj_1730000000000', description: 'Client-generated unique ID' })
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

  @ApiProperty({ example: 500, description: 'Target reserved monetary amount' })
  @IsNumber()
  @IsPositive()
  targetAmount: number;

  @ApiPropertyOptional({
    example: 'budget_deduct',
    enum: ['budget_deduct', 'extra'],
    description: 'Funding mode',
  })
  @IsString()
  @IsOptional()
  @IsIn(['budget_deduct', 'extra'])
  mode?: string;

  @ApiPropertyOptional({ example: '2026-10', description: 'Target month' })
  @IsString()
  @IsOptional()
  month?: string;
}
