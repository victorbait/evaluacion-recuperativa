import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

async function createContactsTable() {
  const db = await open({
    filename: path.join(__dirname, '../../database.sqlite'),
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      comment TEXT NOT NULL,
      ip TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  console.log('✅ Tabla "contacts" creada correctamente.');
  await db.close();
}

createContactsTable();