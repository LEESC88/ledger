import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Record } from './records/entities/record.entity.js';
import { RecordsModule } from './records/records.module.js';
import { Budget } from './budgets/entities/budget.entity.js';
import { BudgetsModule } from './budgets/budgets.module.js';
import { Project } from './projects/entities/project.entity.js';
import { ProjectsModule } from './projects/projects.module.js';
import { Claim } from './claims/entities/claim.entity.js';
import { ClaimsModule } from './claims/claims.module.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const publicPath = existsSync(join(projectRoot, 'public'))
  ? join(projectRoot, 'public')
  : join(process.cwd(), 'public');
const dbPath =
  process.env.DB_DATABASE ||
  (existsSync(join(projectRoot, 'data', 'ledger.db'))
    ? join(projectRoot, 'data', 'ledger.db')
    : join(process.cwd(), 'data', 'ledger.db'));

/**
 * Root Application Module
 * Integrates global configuration, database connectivity, static hosting, and business modules.
 */
@Module({
  imports: [
    // 1. Global environment variable support (.env)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(projectRoot, '.env'), join(process.cwd(), '.env')],
    }),

    TypeOrmModule.forRoot(
      process.env.DATABASE_URL
        ? {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }, // Crucial for Supabase Cloud SSL
            entities: [Record, Budget, Project, Claim],
            synchronize: false,
          }
        : {
            type: 'better-sqlite3',
            database: dbPath,
            entities: [Record, Budget, Project, Claim],
            synchronize: false,
          },
    ),

    // 3. Static asset hosting for frontend web interface (serves public/ at http://localhost:3000)
    ServeStaticModule.forRoot({
      rootPath: publicPath,
    }),

    // 4. Feature modules
    RecordsModule,
    BudgetsModule,
    ProjectsModule,
    ClaimsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
