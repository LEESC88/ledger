import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Headers,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiHeader } from '@nestjs/swagger';
import { ClaimsService } from './claims.service.js';
import { CreateClaimDto } from './dto/create-claim.dto.js';
import {
  UpdateClaimDto,
  SettleClaimReceiveDto,
} from './dto/update-claim.dto.js';

/**
 * ClaimsController
 * Exposes RESTful endpoints for managing Claims, Split Bills & Advance Payments under '/api/claims'.
 */
@ApiTags('Claims')
@Controller('api/claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  /**
   * GET /api/claims - 获取当前用户所有代垫账单
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all claims / split bills' })
  @ApiHeader({ name: 'x-user-id', required: false })
  async findAll(@Headers('x-user-id') userId?: string) {
    return await this.claimsService.findAll(userId);
  }

  /**
   * POST /api/claims - 创建代垫分摊账单
   */
  @Post()
  @ApiOperation({ summary: 'Create a new claim / split bill' })
  @ApiHeader({ name: 'x-user-id', required: false })
  async create(
    @Body() createClaimDto: CreateClaimDto,
    @Headers('x-user-id') userId?: string,
  ) {
    return await this.claimsService.create(createClaimDto, userId);
  }

  /**
   * PATCH /api/claims/:id - 更新代垫账单内容与分摊明细
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a claim / split bill' })
  @ApiParam({ name: 'id', description: 'Claim ID' })
  @ApiHeader({ name: 'x-user-id', required: false })
  async update(
    @Param('id') id: string,
    @Body() updateClaimDto: UpdateClaimDto,
    @Headers('x-user-id') userId?: string,
  ) {
    return await this.claimsService.update(id, updateClaimDto, userId);
  }

  /**
   * PATCH /api/claims/:id/friend/:index - 切换某位朋友还款状态
   */
  @Patch(':id/friend/:index')
  @ApiOperation({ summary: 'Toggle friend paid status' })
  @ApiParam({ name: 'id', description: 'Claim ID' })
  @ApiParam({ name: 'index', description: 'Friend index in array' })
  async toggleFriendPaid(
    @Param('id') id: string,
    @Param('index', ParseIntPipe) index: number,
    @Headers('x-user-id') userId?: string,
    @Body() body?: SettleClaimReceiveDto,
  ) {
    return await this.claimsService.toggleFriendPaid(
      id,
      index,
      userId,
      body?.paid_via,
    );
  }

  /**
   * PATCH /api/claims/:id/settle-all - 全员结清并归档
   */
  @Patch(':id/settle-all')
  @ApiOperation({ summary: 'Settle and mark all friends as paid' })
  @ApiParam({ name: 'id', description: 'Claim ID' })
  async settleAll(
    @Param('id') id: string,
    @Headers('x-user-id') userId?: string,
    @Body() body?: SettleClaimReceiveDto,
  ) {
    return await this.claimsService.settleAll(id, userId, body?.paid_via);
  }

  /**
   * DELETE /api/claims/:id - 删除账单记录
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a claim' })
  @ApiParam({ name: 'id', description: 'Claim ID' })
  async remove(@Param('id') id: string, @Headers('x-user-id') userId?: string) {
    return await this.claimsService.remove(id, userId);
  }
}
