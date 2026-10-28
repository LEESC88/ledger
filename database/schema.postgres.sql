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
-- Strict per-user isolation: users can only read, insert, update, or delete
-- their own records, budgets, and accounts.
-- ============================================================================
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_records" ON records;
DROP POLICY IF EXISTS "Users can manage their own records" ON records;
CREATE POLICY "Users can manage their own records"
ON records
FOR ALL
TO authenticated
USING ((select auth.uid())::text = user_id)
WITH CHECK ((select auth.uid())::text = user_id);

DROP POLICY IF EXISTS "allow_all_budgets" ON budgets;
DROP POLICY IF EXISTS "Users can manage their own budgets" ON budgets;
CREATE POLICY "Users can manage their own budgets"
ON budgets
FOR ALL
TO authenticated
USING ((select auth.uid())::text = user_id)
WITH CHECK ((select auth.uid())::text = user_id);

DROP POLICY IF EXISTS "allow_all_accounts" ON accounts;
DROP POLICY IF EXISTS "Users can manage their own accounts" ON accounts;
CREATE POLICY "Users can manage their own accounts"
ON accounts
FOR ALL
TO authenticated
USING ((select auth.uid())::text = user_id)
WITH CHECK ((select auth.uid())::text = user_id);


-- ============================================================================
-- Projects & Sinking Funds Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(100),
  title VARCHAR(100) NOT NULL,
  icon VARCHAR(20) DEFAULT '🎯',
  target_amount DECIMAL(10, 2) NOT NULL,
  spent_amount DECIMAL(10, 2) DEFAULT 0.00,
  mode VARCHAR(30) DEFAULT 'budget_deduct', -- 'budget_deduct' | 'extra'
  month VARCHAR(10) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',      -- 'active' | 'settled'
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own projects" ON projects;
CREATE POLICY "Users can manage their own projects"
ON projects
FOR ALL
TO authenticated
USING ((select auth.uid())::text = user_id)
WITH CHECK ((select auth.uid())::text = user_id);

-- ============================================================================
-- Claims & Split Bills Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS claims (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(100),
  title VARCHAR(100) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  my_share DECIMAL(10, 2) NOT NULL,
  friends JSONB NOT NULL DEFAULT '[]'::jsonb,
  status VARCHAR(20) DEFAULT 'active',      -- 'active' | 'settled'
  date VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_claims_user_id ON claims(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);

ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own claims" ON claims;
CREATE POLICY "Users can manage their own claims"
ON claims
FOR ALL
TO authenticated
USING ((select auth.uid())::text = user_id)
WITH CHECK ((select auth.uid())::text = user_id);
