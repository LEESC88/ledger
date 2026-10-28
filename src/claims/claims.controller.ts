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

/**
 * ClaimsController
 * Exposes RESTful endpoints for managing Claims, Split Bills & Advance Payments under '/api/claims'.
 */
@ApiTags('Claims')
@Controller('api/claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  /**
   * ============================================================================
   * 1. GET /api/claims - 获取当前用户所有代垫账单
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS:
   * 1. 接收 @Headers('x-user-id') userId?: string
   * 2. 调用 claimsService.findAll(userId) 并返回结果:
   *      return await this.claimsService.findAll(userId);
   * ============================================================================
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all claims / split bills' })
  @ApiHeader({ name: 'x-user-id', required: false })
  async findAll(@Headers('x-user-id') userId?: string) {
    // ✍️ YOUR TURN: Write your code below this line:
    return await this.claimsService.findAll(userId);
  }

  /**
   * ============================================================================
   * 2. POST /api/claims - 创建代垫分摊账单
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS:
   * 1. 接收 @Body() createClaimDto: CreateClaimDto
   * 2. 接收 @Headers('x-user-id') userId?: string
   * 3. 调用 service 创建:
   *      return await this.claimsService.create(createClaimDto, userId);
   * ============================================================================
   */
  @Post()
  @ApiOperation({ summary: 'Create a new claim / split bill' })
  @ApiHeader({ name: 'x-user-id', required: false })
  async create(
    @Body() createClaimDto: CreateClaimDto,
    @Headers('x-user-id') userId?: string,
  ) {
    // ✍️ YOUR TURN: Write your code below this line:
    return await this.claimsService.create(createClaimDto, userId);
  }

  /**
   * ============================================================================
   * 3. PATCH /api/claims/:id/friend/:index - 切换某位朋友还款状态
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS:
   * 1. 接收 @Param('id') id: string
   * 2. 接收 @Param('index', ParseIntPipe) index: number
   * 3. 接收 @Headers('x-user-id') userId?: string
   * 4. 调用 service 切换状态:
   *      return await this.claimsService.toggleFriendPaid(id, index, userId);
   * ============================================================================
   */
  @Patch(':id/friend/:index')
  @ApiOperation({ summary: 'Toggle friend paid status' })
  @ApiParam({ name: 'id', description: 'Claim ID' })
  @ApiParam({ name: 'index', description: 'Friend index in array' })
  async toggleFriendPaid(
    @Param('id') id: string,
    @Param('index', ParseIntPipe) index: number,
    @Headers('x-user-id') userId?: string,
  ) {
    // ✍️ YOUR TURN: Write your code below this line:
    return await this.claimsService.toggleFriendPaid(id, index, userId);
  }

  /**
   * ============================================================================
   * 4. PATCH /api/claims/:id/settle-all - 全员结清并归档
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS:
   * 1. 接收 @Param('id') id: string
   * 2. 接收 @Headers('x-user-id') userId?: string
   * 3. 调用 service 全员结清:
   *      return await this.claimsService.settleAll(id, userId);
   * ============================================================================
   */
  @Patch(':id/settle-all')
  @ApiOperation({ summary: 'Settle and mark all friends as paid' })
  @ApiParam({ name: 'id', description: 'Claim ID' })
  async settleAll(
    @Param('id') id: string,
    @Headers('x-user-id') userId?: string,
  ) {
    // ✍️ YOUR TURN: Write your code below this line:
    return await this.claimsService.settleAll(id, userId);
  }

  /**
   * ============================================================================
   * 5. DELETE /api/claims/:id - 删除账单记录
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS:
   * 1. 接收 @Param('id') id: string
   * 2. 接收 @Headers('x-user-id') userId?: string
   * 3. 调用 service 删除:
   *      return await this.claimsService.remove(id, userId);
   * ============================================================================
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a claim' })
  @ApiParam({ name: 'id', description: 'Claim ID' })
  async remove(@Param('id') id: string, @Headers('x-user-id') userId?: string) {
    // ✍️ YOUR TURN: Write your code below this line:
    return await this.claimsService.remove(id, userId);
  }
}
