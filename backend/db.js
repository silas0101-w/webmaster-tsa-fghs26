const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let db;

async function initDb() {
  db = await open({
    filename: process.env.DATABASE_PATH || path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });
  await db.exec('PRAGMA foreign_keys = ON');

  // Create Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  // Create Progress table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS progress (
      userId TEXT PRIMARY KEY,
      xp INTEGER DEFAULT 0,
      lessons TEXT,
      badges TEXT,
      FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  return db;
}

function getDb() {
  if (!db) throw new Error('Database has not been initialized');
  return db;
}

module.exports = { initDb, getDb };
