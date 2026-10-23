-- ============================================================================
-- Simple Ledger System - Supabase PostgreSQL Database Schema
-- Target: PostgreSQL 15+ (Supabase Cloud Database)
-- Language: English-first
-- ============================================================================

CREATE TABLE IF NOT EXISTS records (
  id BIGSERIAL PRIMARY KEY,
  type VARCHAR(20) CHECK (type IN ('income', 'expense')) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  date VARCHAR(10) NOT NULL, -- Stored as ISO YYYY-MM-DD
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_records_date ON records(date);
CREATE INDEX IF NOT EXISTS idx_records_category ON records(category);
CREATE INDEX IF NOT EXISTS idx_records_type ON records(type);
