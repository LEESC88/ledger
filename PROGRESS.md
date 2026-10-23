# 📈 Development Progress & Change Log (项目进展与全历史记录)

* **Repository**: [https://github.com/LEESC88/ledger](https://github.com/LEESC88/ledger)
* **Code Dictionary**: [`VOCABULARY.md`](VOCABULARY.md) (All code tokens & keywords disassembled)
* **Current Sprint**: Sprint 2 (P0 Backend Core)
* **Status**: In Progress
* **Last Updated**: 2026-10-21

---

## 🚦 Sprint Overview (敏捷冲刺看板)

| Sprint | Goal (目标) | Priority | Status (状态) |
| :--- | :--- | :--- | :--- |
| **Sprint 1** | SQLite Database (`data/ledger.db`), Schema & TypeORM Connection | High | 🟢 Completed (已完成) |
| **Sprint 2** | P0 Backend Core CRUD, DTO Validation & Swagger Testing | High | 🟢 Completed (已完成) |
| **Sprint 3** | P0 Frontend HTML/CSS/JS Integration (Served by NestJS) | High | 🟢 Completed (已完成) |
| **Sprint 4** | P1 Chart.js Expense Analytics & Month Selector | Medium | 🟡 In Progress (进行中) |
| **Sprint 5** | P2 Budget Warning Alert & CSV Data Export | Low | ⚪ Pending (待开始) |

---

## 📝 Cumulative Step-by-Step History Log (所有历史步骤全记录 - 永不删除)

### Step 0: Project Inception & Engineering Setup
* [✔] **Framework Initialization**:
  * Created NestJS 12 project with TypeScript and ESM modules (`"type": "module"`).
  * Solved npm 10.x peer dependency conflicts using `--legacy-peer-deps`.
* [✔] **Telemetry Cleanup**:
  * Removed default commercial `@nestjs/observe` integration from `src/app.module.ts` and `src/main.ts` to silence 429 rate limit warnings and ensure clean local execution.
* [✔] **Git & Remote Binding**:
  * Verified local git repository linked with GitHub remote: `https://github.com/LEESC88/ledger.git`.
  * User credentials set to `LEESC88 (lee90186@gmail.com)`.
* [✔] **Architecture Blueprints Formulated**:
  * English Master Specification: [`project.md`](project.md).
  * Chinese Reference Specification: [`project.zh.md`](project.zh.md).
  * Established English-First code and comment policy.
  * Established Agile iterative sprints (Core P0 first, Analytics P1, Smart extensions P2).

---

### Step 1: Database Architecture Decision & Local SQLite Initialization (Sprint 1)
* [✔] **Architecture Pivot to SQLite 3**:
  * Avoided heavy, external MySQL background service software; chose self-contained, zero-install, local-first **SQLite 3**.
  * Database file is physically hosted directly within the project root at `data/ledger.db`.
* [✔] **Production Database DDL**:
  * Created [`database/schema.sql`](database/schema.sql) with strict `synchronize: false` rule.
  * Defined `records` table with columns: `id`, `type`, `amount`, `category`, `date`, `note`, `created_at`, `updated_at`.
  * Added indexes on `date`, `category`, and `type`.
* [✔] **Cross-Platform Initializer**:
  * Created [`database/init-db.mjs`](database/init-db.mjs) to execute SQL schema and generate `data/ledger.db`.
  * Created Windows one-click batch script [`init.bat`](init.bat).
  * Configured [`.env.example`](.env.example) and [`.env`](.env) with `DB_DATABASE=data/ledger.db`.
* [✔] **Execution & Verification**:
  * Executed initializer; confirmed `data/ledger.db` (24KB) generated and table ready.

---

### Step 2: Domain Entity & Module Wiring (Sprint 2 - In Progress)
* [✔] **Enum Definition**:
  * Created [`src/common/enums/transaction-type.enum.ts`](src/common/enums/transaction-type.enum.ts) defining `INCOME = 'income'` and `EXPENSE = 'expense'`.
* [✔] **Record Entity Implementation (User Code)**:
  * User wrote all 8 entity properties and TypeORM decorators in [`src/records/entities/record.entity.ts`](src/records/entities/record.entity.ts).
  * Reviewed and verified: 100% accurate mapping to SQLite schema.
  * Cleaned up task hints and added professional English JSDoc comments.
* [✔] **Module Creation & Configuration**:
  * Created [`src/records/records.module.ts`](src/records/records.module.ts) to register `TypeOrmModule.forFeature([Record])`.
  * User implemented `AppModule` imports with `ConfigModule`, `TypeOrmModule.forRoot`, and `RecordsModule`.
  * Resolved TypeORM 1.x driver requirement: identified upgrade to `better-sqlite3`.
  * Cleaned up task hints in [`src/app.module.ts`](src/app.module.ts) and added production-ready English docstrings.
* [✔] **DTO & Request Validation (User Code)**:
  * User implemented [`src/records/dto/create-record.dto.ts`](src/records/dto/create-record.dto.ts) with all 5 fields (`type`, `amount`, `category`, `date`, `note`).
  * Combined `class-validator` rules (`@IsEnum`, `@IsPositive`, `@IsNotEmpty`, `@IsDateString`, `@IsOptional`) and `@nestjs/swagger` metadata (`@ApiProperty`, `@ApiPropertyOptional`).
  * Reviewed and verified: 100% compliant with schema and validation rules.
  * Cleaned up task hints and added professional English JSDoc comments.

---

### Step 3: Business Logic Service & REST Controller (Sprint 2 - In Progress)
* [✔] **RecordsService Implementation (User Code)**:
  * Location: [`src/records/records.service.ts`](src/records/records.service.ts)
  * **Functions & Key Code Highlights**:
    * `constructor`: Injects TypeORM `Repository<Record>` into the service.
      ```typescript
      constructor(@InjectRepository(Record) private readonly recordRepository: Repository<Record>) {}
      ```
    * `create(createRecordDto: CreateRecordDto)`: Formats and inserts a new transaction into SQLite.
      ```typescript
      const newRecord = this.recordRepository.create(createRecordDto);
      return await this.recordRepository.save(newRecord);
      ```
    * `findAll()`: Queries all records sorted chronologically from newest to oldest.
      ```typescript
      return await this.recordRepository.find({ order: { date: 'DESC', createdAt: 'DESC' } });
      ```
  * Registered `RecordsService` in `RecordsModule` providers.

* [✔] **RecordsController Implementation (User Code)**:
  * Location: [`src/records/records.controller.ts`](src/records/records.controller.ts)
  * Base Route: `@Controller('api/records')`, Tag: `@ApiTags('Records')`.
  * **Endpoints & Key Code Highlights**:
    * `POST /api/records`: Listens for incoming transaction creation requests.
      ```typescript
      @Post()
      @ApiOperation({ summary: 'Create a new transaction record' })
      async create(@Body() createRecordDto: CreateRecordDto) {
        return await this.recordsService.create(createRecordDto);
      }
      ```
    * `GET /api/records`: Returns list of all stored transactions as JSON.
      ```typescript
      @Get()
      @ApiOperation({ summary: 'Retrieve all transaction records' })
      async findAll() {
        return await this.recordsService.findAll();
      }
      ```
  * Registered `RecordsController` in [`src/records/records.module.ts`](src/records/records.module.ts).

* [✔] **Swagger & ValidationPipe Bootstrap (User Code)**:
  * Location: [`src/main.ts`](src/main.ts)
  * **Functions & Key Code Highlights**:
    * Global `ValidationPipe`: Enforces input security by rejecting unexpected properties and auto-transforming payloads.
      ```typescript
      app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
      ```
    * OpenAPI/Swagger Engine: Auto-generates interactive API playground at `http://localhost:3000/api-docs`.
      ```typescript
      const config = new DocumentBuilder().setTitle('Simple Ledger API').setVersion('1.0').build();
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api-docs', app, document);
      ```

---

### Step 4: Missing Core Features - Delete & Financial Summary (Sprint 2 - Current)
* [✔] **Delete Record Feature (User Code)**:
  * **RecordsService `remove(id: number)`**:
    * Location: [`src/records/records.service.ts`](src/records/records.service.ts)
    * Functionality: Executes SQLite `DELETE FROM records WHERE id = ?`. Validates that rows were affected, otherwise throws `NotFoundException` (HTTP 404).
    * Key Code:
      ```typescript
      async remove(id: number): Promise<void> {
        const result = await this.recordRepository.delete(id);
        if (result.affected === 0) {
          throw new NotFoundException(`Record with ID ${id} not found`);
        }
      }
      ```
  * **RecordsController `DELETE /api/records/:id`**:
    * Location: [`src/records/records.controller.ts`](src/records/records.controller.ts)
    * Functionality: Routes HTTP DELETE requests. Uses `ParseIntPipe` to parse string parameter into integer and enforce numeric validation.
    * Key Code:
      ```typescript
      @Delete(':id')
      @ApiOperation({ summary: 'Delete a transaction record by ID' })
      @ApiParam({ name: 'id', example: 1, description: 'Record ID to delete' })
      async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.recordsService.remove(id);
      }
      ```

* [✔] **Financial Summary & Balance Calculation (User Code)**:
  * **RecordsService `getSummary(month?: string)`**:
    * Location: [`src/records/records.service.ts`](src/records/records.service.ts)
    * Functionality: Filters records by optional month, sums up `totalIncome` and `totalExpense`, calculates `netBalance = totalIncome - totalExpense`, and aggregates `categoryBreakdown`.
    * Key Code:
      ```typescript
      async getSummary(month?: string) {
        const allRecords = await this.findAll();
        const records = month ? allRecords.filter((r) => r.date.startsWith(month)) : allRecords;
        let totalIncome = 0;
        let totalExpense = 0;
        const categoryBreakdown: { [category: string]: number } = {};
        for (const record of records) {
          const amount = Number(record.amount);
          if (record.type === TransactionType.INCOME) {
            totalIncome += amount;
          } else {
            totalExpense += amount;
            categoryBreakdown[record.category] = (categoryBreakdown[record.category] || 0) + amount;
          }
        }
        return {
          month: month || 'all',
          totalIncome: Number(totalIncome.toFixed(2)),
          totalExpense: Number(totalExpense.toFixed(2)),
          netBalance: Number((totalIncome - totalExpense).toFixed(2)),
          categoryBreakdown,
        };
      }
      ```
  * **RecordsController `GET /api/records/summary`**:
    * Location: [`src/records/records.controller.ts`](src/records/records.controller.ts)
    * Functionality: Exposes financial summary endpoint, accepts optional `@Query('month') month?: string`.
    * Key Code:
      ```typescript
      @Get('summary')
      @ApiOperation({ summary: 'Get financial summary and balance' })
      @ApiQuery({ name: 'month', required: false, example: '2026-10', description: 'Filter by YYYY-MM' })
      async getSummary(@Query('month') month?: string) {
        return await this.recordsService.getSummary(month);
      }
      ```

---

### Step 5: Frontend Web Interface (Sprint 3 - Completed)
* [✔] **Serve Static Assets Configuration**:
  * Configured `ServeStaticModule.forRoot()` in [`src/app.module.ts`](src/app.module.ts) to host the `public/` directory at root `http://localhost:3000`.
  * Safely excluded `/api/(.*)` and `/api-docs(.*)` routes to prevent collisions with REST endpoints and Swagger.
* [✔] **Bespoke Financial UI Architecture (`public/index.html`)**:
  * 3-Column Ergonomic Workstation Layout (Left: Overview Metrics -> Center: Post Transaction -> Right: Audit Ledger).
  * Removed developer-facing indicators ("SQLite Active", "PRO" badge) for a distraction-free client interface.
  * Added dynamic Multi-Currency selector (RM, ¥, $, €, £) with local persistence.
* [✔] **Precision CSS Design System (`public/style.css`)**:
  * Overhauled to a sophisticated Cyan-White (青白为主) bright editorial aesthetic:
    * Canvas: Porcelain cyan-tinted background (`#F4F8F8`).
    * Surfaces: Pure crisp white cards (`#FFFFFF`) with delicate hairline borders (`#E2ECEC`).
    * Accents: Elegant Cyan-Teal (`#0D9488`), emerald income (`#059669`), and crisp rose expense (`#E11D48`).
  * Tabular typography (`'JetBrains Mono'`, `font-variant-numeric: tabular-nums`).
  * Seamless 3-column desktop alignment eliminating awkward card height discrepancies.
* [✔] **Client Engine (`public/app.js`)**:
  * Real-time multi-currency switcher with `localStorage` memory.
  * Native ES6 asynchronous architecture communicating with backend APIs (`POST /api/records`, `GET /api/records`, `GET /api/records/summary`, `DELETE /api/records/:id`).
  * Dynamic category mapping, XSS-safe HTML escaping, inline delete confirmations, and floating feedback toasts.

---

### Step 6: Security Hardening & v1.0-beta Release
* [✔] **Database Security & `.gitignore` Isolation**:
  * Configured [`.gitignore`](.gitignore) to strictly exclude all database files (`data/*.db`, `data/*.sqlite`, `*.db`).
  * Created [`data/.gitkeep`](data/.gitkeep) to preserve directory structure in remote Git while keeping user data private.
  * Ensured local environment secrets (`.env`) remain excluded from version control.
* [✔] **v1.0-beta Release to GitHub**:
  * Tagged and published full working end-to-end MVP (Sprint 1, 2, 3) to [https://github.com/LEESC88/ledger](https://github.com/LEESC88/ledger).

---

### Step 7: Visual Analytics & Financial Data Export (Sprint 4 - In Progress)
* [✔] **Chart.js Donut Chart Engine (`public/index.html` & `public/app.js`)**:
  * Integrated Chart.js v4 CDN into application layout.
  * Engineered `renderCategoryChart()` with responsive doughnut configuration (`cutout: '70%'`) and Cyan-White color harmony palette.
  * Real-time sync with `/api/records/summary`'s `categoryBreakdown` with automated empty-state fallbacks.
* [✔] **Client-side RFC 4180 CSV Financial Statement Exporter**:
  * Engineered zero-latency browser export via native `Blob` and dynamic URI triggering.
  * Prefixed UTF-8 Byte Order Mark (`\uFEFF`) to prevent character encoding corruption in Microsoft Excel.
  * Honors active month and type filters for targeted ledger export.

---

### Step 8: Data Retention & Archiving Policy (Sprint 4 Step 2 - Completed)
* [✔] **Modal UI Architecture (`public/index.html` & `public/style.css`)**:
  * Designed bespoke Cyan-White modal dialog (`#retentionModal`) with backdrop blur and header maintenance icon.
  * Configured retention threshold selector (1, 2, 3, 5 years) with live eligible record count feedback.
  * Dual-action controls: "1. Download Archive CSV" and "2. Purge Old Records" with confirmation safeguards.
* [✔] **Backend Retention Service & Endpoints (`src/records/`)**:
  * User-implemented `purgeOlderThan(years)` and `findOlderThan(years)` in [`src/records/records.service.ts`](src/records/records.service.ts).
  * User-implemented REST routing `DELETE /api/records/purge` and `GET /api/records/archive` with Swagger documentation in [`src/records/records.controller.ts`](src/records/records.controller.ts).
* [✔] **Client-Side Maintenance Controller (`public/app.js`)**:
  * User-implemented interactive modal controller, live eligible count evaluation, and backend purge execution.

---

### Step 9: Cloud Database Migration - Supabase PostgreSQL Dual-Driver (Completed)
* [✔] **PostgreSQL Driver Setup**:
  * Installed `pg` and `@types/pg` packages into project dependencies.
* [✔] **PostgreSQL Cloud DDL Schema**:
  * Authored [`database/schema.postgres.sql`](database/schema.postgres.sql) with PostgreSQL datatypes (`BIGSERIAL`, `TIMESTAMPTZ`, check constraints, and performance indexes).
* [✔] **Dynamic Dual-Driver Configuration**:
  * Implemented environment-driven fallback in [`src/app.module.ts`](src/app.module.ts): connects to Supabase PostgreSQL when `DATABASE_URL` is configured, seamlessly falls back to local SQLite when unset.

---

### Step 10: Google OAuth & Zero-Leak Client Security (Completed)
* [✔] **Zero-Leak Backend Configuration Endpoint (`src/records/records.controller.ts`)**:
  * Implemented `GET /api/records/config` to safely inject public Supabase settings from server `.env` to browser client memory, preventing key leakage into Git history.
* [✔] **Bespoke Auth UI Header Capsule (`public/index.html` & `public/style.css`)**:
  * Designed Google sign-in button and user profile capsule (high-res avatar, display name/email, and logout trigger).
* [✔] **Client-Side Auth Lifecycle (`public/app.js`)**:
  * Integrated `@supabase/supabase-js` v2 with dynamic runtime initialization (`initSupabaseClient()`).
  * Implemented Google OAuth flow (`signInWithOAuth`), session signout, and reactive auth state listening (`onAuthStateChange`).

---

## 🎯 Next Immediate Steps (下一步操作)
1. **[Live Auth Test]**: Run `npm run start:dev`, open `http://localhost:3000`, click **Sign in with Google**, and verify real-time avatar/name display in the navigation bar.
2. **[Multi-User Mobile App Packaging]**: Package the application via Capacitor for testing across independent devices.
