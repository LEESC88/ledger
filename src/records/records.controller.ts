import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RecordsService } from './records.service.js';
import { CreateRecordDto } from './dto/create-record.dto.js';

/**
 * RecordsController
 * Exposes RESTful HTTP endpoints for managing financial records.
 * Routes under '/api/records'.
 */
@ApiTags('Records')
@Controller('api/records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  /**
   * HTTP POST /api/records
   * Creates a new transaction record.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new transaction record' })
  async create(@Body() createRecordDto: CreateRecordDto) {
    return await this.recordsService.create(createRecordDto);
  }

  /**
   * HTTP GET /api/records
   * Retrieves all transaction records sorted by date descending.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all transaction records' })
  async findAll() {
    return await this.recordsService.findAll();
  }

  /**
   * HTTP GET /api/records/summary
   * Returns financial summary (Total Income, Total Expense, Net Balance, Category Breakdown).
   */
  @Get('summary')
  @ApiOperation({ summary: 'Get financial summary and balance' })
  @ApiQuery({
    name: 'month',
    required: false,
    example: '2026-10',
    description: 'Filter by YYYY-MM (e.g. 2026-10)',
  })
  async getSummary(@Query('month') month?: string) {
    return await this.recordsService.getSummary(month);
  }

  /**
   * HTTP DELETE /api/records/:id
   * Deletes a transaction record by its unique ID.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction record by ID' })
  @ApiParam({ name: 'id', example: 1, description: 'Record ID to delete' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.recordsService.remove(id);
  }
}
