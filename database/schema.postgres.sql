-- ============================================================================
-- Simple Ledger System - Supabase PostgreSQL Database Schema
-- Target: PostgreSQL 15+ (Supabase Cloud Database)
-- Language: English-first
-- ============================================================================

CREATE TABLE IF NOT EXISTS records (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(100),
  type VARCHAR(20) CHECK (type IN ('income', 'expense')) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  account_name VARCHAR(50) DEFAULT 'Cash',
  date VARCHAR(10) NOT NULL, -- Stored as ISO YYYY-MM-DD
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_records_date ON records(date);
CREATE INDEX IF NOT EXISTS idx_records_category ON records(category);
CREATE INDEX IF NOT EXISTS idx_records_type ON records(type);
CREATE INDEX IF NOT EXISTS idx_records_amount ON records(amount);
CREATE INDEX IF NOT EXISTS idx_records_user_id ON records(user_id);
CREATE INDEX IF NOT EXISTS idx_records_account_name ON records(account_name);

-- ============================================================================
-- Payment Accounts & Asset Wallets Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS accounts (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(100),
  name VARCHAR(50) NOT NULL,
  type VARCHAR(30) DEFAULT 'general',
  icon VARCHAR(20) DEFAULT '💵',
  initial_balance DECIMAL(12, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_accounts_user_name UNIQUE (user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);

-- ============================================================================
-- Monthly Budgets Table (P2 Budget Tracker)
-- ============================================================================
CREATE TABLE IF NOT EXISTS budgets (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(100),
  month VARCHAR(10) NOT NULL, -- Format: YYYY-MM or 'default'
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_budgets_user_month UNIQUE (user_id, month)
);

CREATE INDEX IF NOT EXISTS idx_budgets_user_month ON budgets(user_id, month);

-- ============================================================================
-- Row Level Security (RLS) Policies for Direct Supabase BaaS Client Access
-- ============================================================================
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_records" ON records;
CREATE POLICY "allow_all_records" ON records FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_budgets" ON budgets;
CREATE POLICY "allow_all_budgets" ON budgets FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_accounts" ON accounts;
CREATE POLICY "allow_all_accounts" ON accounts FOR ALL USING (true) WITH CHECK (true);

