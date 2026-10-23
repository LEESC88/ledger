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

    // ==========================================================================
    // 🎯 YOUR TURN: Connect to Supabase Cloud PostgreSQL
    // ==========================================================================
    // Update TypeOrmModule.forRoot to dynamically connect to Supabase PostgreSQL
    // when process.env.DATABASE_URL is set, or fall back to local SQLite:
    //
    // Hint:
    // TypeOrmModule.forRoot(
    //   process.env.DATABASE_URL
    //     ? {
    //         type: 'postgres',
    //         url: process.env.DATABASE_URL,
    //         ssl: { rejectUnauthorized: false }, // Crucial for Supabase Cloud SSL
    //         entities: [Record],
    //         synchronize: false,
    //       }
    //     : {
    //         type: 'better-sqlite3',
    //         database: process.env.DB_DATABASE || 'data/ledger.db',
    //         entities: [Record],
    //         synchronize: false,
    //       },
    // ),
    TypeOrmModule.forRoot(
      process.env.DATABASE_URL
        ? {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }, // Crucial for Supabase Cloud SSL
            entities: [Record],
            synchronize: false,
          }
        : {
            type: 'better-sqlite3',
            database: process.env.DB_DATABASE || 'data/ledger.db',
            entities: [Record],
            synchronize: false,
          },
    ),

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
