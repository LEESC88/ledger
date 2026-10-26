import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BudgetsService } from './budgets.service.js';
import { SetBudgetDto } from './dto/set-budget.dto.js';

@ApiTags('Budgets')
@Controller('api/budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  @ApiOperation({ summary: 'Get monthly budget limit' })
  @ApiQuery({ name: 'month', required: false, example: '2026-10' })
  async getBudget(
    @Query('month') month?: string,
    @Headers('x-user-id') userId?: string,
  ) {
    const targetMonth = month || 'default';
    const budget = await this.budgetsService.getBudget(targetMonth, userId);
    return {
      month: targetMonth,
      amount: budget ? Number(budget.amount) : null,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Set or update monthly budget limit' })
  async setBudget(
    @Body() dto: SetBudgetDto,
    @Headers('x-user-id') userId?: string,
  ) {
    const budget = await this.budgetsService.setBudget(dto, userId);
    return {
      id: budget.id,
      month: budget.month,
      amount: Number(budget.amount),
    };
  }
}
