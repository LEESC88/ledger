import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Record } from './records/entities/record.entity.js';
import { RecordsModule } from './records/records.module.js';

/**
 * Root Application Module
 * Integrates global configuration, database connectivity, static hosting, and business modules.
 */
@Module({
  imports: [
    // 1. Global environment variable support (.env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. High-performance SQLite database connection via TypeORM
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DB_DATABASE || 'data/ledger.db',
      entities: [Record],
      synchronize: false, // Strict production rule: schema managed by database/schema.sql
    }),

    // 3. Static asset hosting for frontend web interface (serves public/ at http://localhost:3000)
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
    }),

    // 4. Ledger business feature module
    RecordsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
