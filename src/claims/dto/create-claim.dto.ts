import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ClaimFriendDto {
  @ApiProperty({ example: '小明' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 50.0 })
  @IsNumber()
  @IsPositive()
  amount: number;
}

export class CreateClaimDto {
  @ApiProperty({ example: '周五聚餐火锅' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 200.0 })
  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @ApiProperty({ example: 50.0 })
  @IsNumber()
  myShare: number;

  @ApiProperty({ type: [ClaimFriendDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClaimFriendDto)
  friends: ClaimFriendDto[];

  @ApiProperty({ example: '2026-10-28' })
  @IsString()
  @IsNotEmpty()
  date: string;
}
