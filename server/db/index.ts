import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const dbDir = resolve("./data");
mkdirSync(dbDir, { recursive: true });

const sqlite = new Database(resolve(dbDir, "inpus.db"));

// Enable WAL mode for better performance
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });

// ─── Auto-migrate / create tables ────────────────────────────────────────────
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    nim_nip    TEXT,
    type       TEXT NOT NULL DEFAULT 'intern',
    division   TEXT,
    phone      TEXT,
    institution TEXT,
    start_date TEXT,
    end_date   TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS projects (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id   INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    description TEXT,
    roles       TEXT NOT NULL DEFAULT '[]',
    status      TEXT NOT NULL DEFAULT 'active',
    start_date  TEXT,
    end_date    TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id  INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    member_id   INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    description TEXT,
    week_start  TEXT NOT NULL,
    week_end    TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'pending',
    admin_note  TEXT,
    marked_at   TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
`);
