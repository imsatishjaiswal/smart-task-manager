import Database from 'better-sqlite3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const DB_PATH = process.env.DATABASE_PATH || './tasks.db';
let db: Database.Database;

export function getDb(): Database.Database {
    if (!db) {
        db = new Database(path.resolve(DB_PATH));
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
    }
    return db;
}

export function initDb(): void {
    const database = getDb();
    database.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      description TEXT,
      priority    TEXT    NOT NULL DEFAULT 'medium'
                          CHECK(priority IN ('low', 'medium', 'high')),
      status      TEXT    NOT NULL DEFAULT 'pending'
                          CHECK(status IN ('pending', 'done')),
      due_date    TEXT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);
    console.log('✅ Database initialised at', path.resolve(DB_PATH));
}