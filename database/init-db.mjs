// ============================================================================
// Database Initialization Script (Node.js + sqlite3)
// Creates data/ledger.db in project root and executes database/schema.sql
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const rootDir = path.resolve(__dirname, '..');
  const dataDir = path.resolve(rootDir, 'data');
  const dbPath = path.resolve(dataDir, 'ledger.db');
  const schemaPath = path.resolve(__dirname, 'schema.sql');

  // 1. Ensure data/ directory exists
  if (!fs.existsSync(dataDir)) {
    console.log('[*] Creating data directory: data/');
    fs.mkdirSync(dataDir, { recursive: true });
  }

  console.log(`[*] Connecting to SQLite database at: ${dbPath}`);

  // 2. Open / Create SQLite database file
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('[✖] Failed to open SQLite database:', err.message);
      process.exit(1);
    }
  });

  // 3. Read schema.sql
  const sql = fs.readFileSync(schemaPath, 'utf-8');

  // 4. Execute schema SQL
  console.log('[*] Executing database/schema.sql...');
  db.exec(sql, (err) => {
    if (err) {
      console.error('[✖] Failed to execute schema.sql:', err.message);
      db.close();
      process.exit(1);
    }

    console.log('[✔] Database file `data/ledger.db` and table `records` initialized successfully!');
    db.close();
  });
}

run();
