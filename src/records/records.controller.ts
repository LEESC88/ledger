import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  ParseIntPipe,
  DefaultValuePipe,
  Header,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiHeader,
} from '@nestjs/swagger';
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
  async create(
    @Body() createRecordDto: CreateRecordDto,
    @Headers('x-user-id') userId?: string,
  ) {
    return await this.recordsService.create(createRecordDto, userId);
  }

  /**
   * HTTP GET /api/records
   * Retrieves all transaction records sorted by date descending.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all transaction records' })
  async findAll(@Headers('x-user-id') userId?: string) {
    return await this.recordsService.findAll(userId);
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
  async getSummary(
    @Query('month') month?: string,
    @Headers('x-user-id') userId?: string,
  ) {
    return await this.recordsService.getSummary(month, userId);
  }

  /**
   * HTTP GET /api/records/config
   * Safely provides public client configuration (e.g., Supabase Anon Key) from environment variables.
   */
  @Get('config')
  @ApiOperation({ summary: 'Get public client configuration' })
  getClientConfig() {
    return {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
    };
  }

  /**
   * HTTP GET /api/records/storage-status
   * Reports multi-user storage capacity and quota health metrics.
   */
  @Get('storage-status')
  @ApiOperation({ summary: 'Get multi-user storage metrics and quota health' })
  async getStorageStatus(@Headers('x-user-id') userId?: string) {
    return await this.recordsService.getStorageStatus(userId);
  }

  /**
   * HTTP GET /api/records/archive
   * Retrieves historical records older than the specified retention threshold.
   */
  @Get('archive')
  @ApiOperation({ summary: 'Find records older than retention threshold' })
  @ApiQuery({
    name: 'years',
    required: false,
    example: 3,
    description: 'Retention threshold in years (default 3)',
  })
  async getArchive(
    @Query('years', new DefaultValuePipe(3), ParseIntPipe) years: number,
    @Headers('x-user-id') userId?: string,
  ) {
    return await this.recordsService.findOlderThan(years, userId);
  }

  /**
   * HTTP DELETE /api/records/purge
   * Permanently purges historical records older than the specified retention threshold.
   * NOTE: Defined before @Delete(':id') to prevent routing collision.
   */
  @Delete('purge')
  @ApiOperation({ summary: 'Permanently purge historical records' })
  @ApiQuery({
    name: 'years',
    required: false,
    example: 3,
    description: 'Retention threshold in years (default 3)',
  })
  async purge(
    @Query('years', new DefaultValuePipe(3), ParseIntPipe) years: number,
    @Headers('x-user-id') userId?: string,
  ) {
    return await this.recordsService.purgeOlderThan(years, userId);
  }

  /**
   * HTTP DELETE /api/records/:id
   * Deletes a transaction record by its unique ID.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction record by ID' })
  @ApiParam({ name: 'id', example: 1, description: 'Record ID to delete' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-id') userId?: string,
  ) {
    return await this.recordsService.remove(id, userId);
  }
}
