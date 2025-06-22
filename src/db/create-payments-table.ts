import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

async function createPaymentsTable() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_id TEXT UNIQUE NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL,
      description TEXT,
      reference TEXT,
      payment_date TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ Tabla de pagos creada o ya existente.');
  await db.close();
}

createPaymentsTable(); 