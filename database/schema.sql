-- ============================================================================
-- Simple Ledger System - SQLite Database Schema
-- Database: SQLite 3
-- File Location: data/ledger.db (Inside Project Root)
-- Language: English-first
-- ============================================================================

CREATE TABLE IF NOT EXISTS records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL, -- Stored as ISO YYYY-MM-DD
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast query performance
CREATE INDEX IF NOT EXISTS idx_records_date ON records(date);
CREATE INDEX IF NOT EXISTS idx_records_category ON records(category);
CREATE INDEX IF NOT EXISTS idx_records_type ON records(type);
CREATE INDEX IF NOT EXISTS idx_records_amount ON records(amount);
CREATE INDEX IF NOT EXISTS idx_records_user_id ON records(user_id);

-- ============================================================================
-- Budgets Table (P2 Budget Tracker)
-- ============================================================================
CREATE TABLE IF NOT EXISTS budgets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  month TEXT NOT NULL, -- Format: YYYY-MM or 'default'
  amount REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, month)
);

CREATE INDEX IF NOT EXISTS idx_budgets_user_month ON budgets(user_id, month);

-- ============================================================================
-- Projects & Dedicated Budget Cards Table
-- Supports monthly budget toggle (`include_in_budget`), custom timeframe,
-- and standalone item entries stored as JSON text in `entries`.
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  title TEXT NOT NULL,
  icon TEXT DEFAULT '🎯',
  target_amount REAL NOT NULL,
  spent_amount REAL DEFAULT 0.00,
  mode TEXT DEFAULT 'extra',
  month TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  include_in_budget INTEGER NOT NULL DEFAULT 0,
  timeframe_type TEXT NOT NULL DEFAULT 'indefinite',
  start_date TEXT,
  deadline TEXT,
  entries TEXT NOT NULL DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- ============================================================================
-- Claims & Split Bills Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS claims (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  title TEXT NOT NULL,
  total_amount REAL NOT NULL,
  my_share REAL NOT NULL,
  friends TEXT NOT NULL DEFAULT '[]',
  status TEXT DEFAULT 'active',
  date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_claims_user_id ON claims(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);

-- Legacy SQLite migration reference (uncomment and run once only if `data/ledger.db` predates these columns):
-- ALTER TABLE projects ADD COLUMN include_in_budget INTEGER NOT NULL DEFAULT 0;
-- ALTER TABLE projects ADD COLUMN timeframe_type TEXT NOT NULL DEFAULT 'indefinite';
-- ALTER TABLE projects ADD COLUMN start_date TEXT;
-- ALTER TABLE projects ADD COLUMN deadline TEXT;
-- ALTER TABLE projects ADD COLUMN entries TEXT NOT NULL DEFAULT '[]';
