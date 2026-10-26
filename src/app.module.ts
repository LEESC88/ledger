import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Record } from './records/entities/record.entity.js';
import { RecordsModule } from './records/records.module.js';
import { Budget } from './budgets/entities/budget.entity.js';
import { BudgetsModule } from './budgets/budgets.module.js';

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

    TypeOrmModule.forRoot(
      process.env.DATABASE_URL
        ? {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }, // Crucial for Supabase Cloud SSL
            entities: [Record, Budget],
            synchronize: false,
          }
        : {
            type: 'better-sqlite3',
            database: process.env.DB_DATABASE || 'data/ledger.db',
            entities: [Record, Budget],
            synchronize: false,
          },
    ),

    // 3. Static asset hosting for frontend web interface (serves public/ at http://localhost:3000)
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
    }),

    // 4. Feature modules
    RecordsModule,
    BudgetsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
