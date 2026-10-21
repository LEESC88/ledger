# 📘 Simple Ledger System - Architecture & Project Specification

> **Language Policy (CRITICAL)**:
> All code implementations, comments, database schemas, API responses, error messages, and scripts must strictly be in **ENGLISH** first. Localization (e.g., Chinese UI/documentation) will only be introduced after core development is mature.

---

## 1. Project Overview & SDLC Methodology

### 1.1 Methodology: Agile (Iterative Sprints)
* **Fast Feedback Loop**: Build thin vertical slices (Database -> API -> Simple UI).
* **Zero Heavy Software**: Using **SQLite 3** (`data/ledger.db`), the database resides directly inside the project root folder. No daemon, no installer, 100% portable.
* **Core-First Focus**: Deliver **P0 (Minimum Viable Product)** completely before introducing nice-to-have features (charts, budgets, CSV exports).

---

## 2. Open-Source References on GitHub

| Project | Stack | Repository / URL | Key Takeaways to Borrow |
| :--- | :--- | :--- | :--- |
| **Actual Budget** | TypeScript / SQLite | `actualbudget/actual` | • SQLite file storage directly in project.<br>• Clean transaction & category domain modeling. |
| **Firefly III** | Modern Web | `firefly-iii/firefly-iii` | • Gold standard for personal finance schemas & classification. |
| **NestJS Clean Architecture** | NestJS / TypeORM | `luchsamapp/nestjs-clean-architecture` | • Controller -> Service -> Repository decoupling with TypeORM. |

---

## 3. Feature Breakdown & Prioritization

### 3.1 [P0] Core MVP (Immediate Priority)
1. **Transaction Management (CRUD)**:
   * **Create**: `type` ('income' | 'expense'), `amount`, `category`, `date`, `note`.
   * **Read**: Retrieve transactions filtered by month sorted in descending order.
   * **Update**: Edit incorrect amounts, categories, or notes.
   * **Delete**: Remove mistaken entries.
2. **Monthly Financial Summary**:
   * Calculate **Total Income**, **Total Expense**, and **Net Balance** (`Balance = Income - Expense`).
3. **Database & Infrastructure**:
   * SQLite database file at `data/ledger.db` with `schema.sql` (Strictly **`synchronize: false`**).
   * Safe credentials via `.env` (`DB_DATABASE=data/ledger.db`).
   * One-click Windows setup script (`init.bat`).
4. **Interactive API Documentation**:
   * Embedded Swagger UI (`/api-docs`).

### 3.2 [P1] Analytics & Visualization (Secondary Priority)
1. **Category Breakdown Chart (Chart.js)**: Donut/pie chart of monthly expenses by category.
2. **Month Switcher**: Quick month selector (e.g., `2026-10`, `2026-09`).

### 3.3 [P2] Smart Extensions (Tertiary Priority)
1. **Monthly Budget Warning**: Progress bar with alert if expenses exceed budget.
2. **Keyword Search**: Quick search by notes.
3. **CSV Export**: One-click download of transactions in CSV.

---

## 4. Technical Architecture & Database

### 4.1 Tech Stack
* **Frontend**: Vanilla HTML5 + Modern CSS3 + Native Fetch API (Served by NestJS from `public/`).
* **Backend**: NestJS 12 (TypeScript, ESM).
* **Database**: **SQLite 3** (Database file: `data/ledger.db`).
* **ORM**: TypeORM (`@nestjs/typeorm`, `sqlite3`) with **`synchronize: false`**.
* **Docs & Tools**: `@nestjs/swagger`, `class-validator`, `class-transformer`.

---

## 5. Database Schema (`database/schema.sql`)

```sql
CREATE TABLE IF NOT EXISTS records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_records_date ON records(date);
CREATE INDEX IF NOT EXISTS idx_records_category ON records(category);
CREATE INDEX IF NOT EXISTS idx_records_type ON records(type);
```

---

## 6. Implementation Roadmap (Agile Sprints)

* [ ] **Sprint 1 (Environment & SQLite DB Setup)**:
  * Install `sqlite3`, `@nestjs/typeorm`, `typeorm`, `@nestjs/config`, `@nestjs/swagger`, `class-validator`, `class-transformer`.
  * Run `node database/init-db.mjs` to create `data/ledger.db`.
  * Configure `TypeOrmModule` in `app.module.ts`.
* [ ] **Sprint 2 (P0 Backend Core CRUD & Swagger)**
* [ ] **Sprint 3 (P0 Frontend Integration)**
* [ ] **Sprint 4 (P1 Analytics - Chart.js)**
* [ ] **Sprint 5 (P2 Extensions & Polish)**
