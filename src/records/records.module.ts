import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './entities/record.entity.js';
import { RecordsService } from './records.service.js';
import { RecordsController } from './records.controller.js';

/**
 * RecordsModule
 * Encapsulates all ledger record functionality (Controller, Service, Repository).
 */
@Module({
  imports: [
    // Register the Record entity with TypeOrm to enable Repository injection:
    TypeOrmModule.forFeature([Record]),
  ],
  controllers: [RecordsController],
  providers: [RecordsService],
  exports: [TypeOrmModule, RecordsService],
})
export class RecordsModule {}
