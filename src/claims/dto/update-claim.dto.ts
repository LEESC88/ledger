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
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Single split-party item payload when updating a Claim entry.
 */
export class UpdateClaimFriendDto {
  @ApiProperty({ example: '小明' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 50.0 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  paid?: boolean;

  @ApiPropertyOptional({
    example: 'eWallet',
    description: 'Optional repayment channel recorded when marked paid',
  })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  paid_via?: string;
}

/**
 * Optional request body when marking a friend paid or settling a whole claim.
 */
export class SettleClaimReceiveDto {
  @ApiPropertyOptional({
    example: 'eWallet',
    description: 'Optional repayment channel (Cash, eWallet, Bank Card, Credit Card)',
  })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  paid_via?: string;
}

/**
 * Data Transfer Object for partially updating a Claim / Split Bill record.
 */
export class UpdateClaimDto {
  @ApiPropertyOptional({ example: '周五聚餐火锅' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 200.0 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  totalAmount?: number;

  @ApiPropertyOptional({ example: 50.0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  myShare?: number;

  @ApiPropertyOptional({ type: [UpdateClaimFriendDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateClaimFriendDto)
  @IsOptional()
  friends?: UpdateClaimFriendDto[];

  @ApiPropertyOptional({ enum: ['active', 'settled'] })
  @IsString()
  @IsIn(['active', 'settled'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: '2026-11-19' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  date?: string;
}
