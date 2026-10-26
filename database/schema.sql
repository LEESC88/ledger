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
