// ============================================================================
// Database Initialization Script (Node.js + SQLite3 + PostgreSQL)
// Creates data/ledger.db in project root and executes database/schema.sql,
// and initializes remote Supabase PostgreSQL if DATABASE_URL is set in .env.
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sqlite3 from 'sqlite3';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const rootDir = path.resolve(__dirname, '..');
  const dataDir = path.resolve(rootDir, 'data');
  const dbPath = path.resolve(dataDir, 'ledger.db');
  const schemaSqlitePath = path.resolve(__dirname, 'schema.sql');
  const schemaPostgresPath = path.resolve(__dirname, 'schema.postgres.sql');
  const envPath = path.resolve(rootDir, '.env');

  // 1. Ensure data/ directory exists
  if (!fs.existsSync(dataDir)) {
    console.log('[*] Creating data directory: data/');
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 2. Initialize SQLite Database
  console.log(`[*] Connecting to SQLite database at: ${dbPath}`);
  const sqlSqlite = fs.readFileSync(schemaSqlitePath, 'utf-8');

  await new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) return reject(err);
    });

    db.exec(sqlSqlite, (err) => {
      if (err) {
        db.close();
        return reject(err);
      }
      console.log('[✔] SQLite database `data/ledger.db` initialized successfully!');
      db.close();
      resolve();
    });
  });

  // 3. Initialize Supabase PostgreSQL if DATABASE_URL is present in .env
  let dbUrl = process.env.DATABASE_URL;
  if (!dbUrl && fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/^DATABASE_URL\s*=\s*["']?([^"'\r\n]+)["']?/m);
    if (match) dbUrl = match[1];
  }

  if (dbUrl) {
    console.log('[*] DATABASE_URL detected. Initializing Supabase PostgreSQL...');
    try {
      const sqlPostgres = fs.readFileSync(schemaPostgresPath, 'utf-8');
      const client = new pg.Client({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false },
      });
      await client.connect();
      await client.query(sqlPostgres);
      console.log('[✔] Supabase PostgreSQL tables and indexes initialized successfully!');
      await client.end();
    } catch (pgErr) {
      console.warn('[!] Supabase PostgreSQL initialization skipped or encountered warning:', pgErr.message);
    }
  }

  console.log('[✔] All databases are ready.');
}

run().catch((err) => {
  console.error('[✖] Database initialization failed:', err);
  process.exit(1);
});
