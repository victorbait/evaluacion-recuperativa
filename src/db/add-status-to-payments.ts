import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

async function addStatusColumn() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  try {
    // Check if the column already exists
    const tableInfo = await db.all(`PRAGMA table_info(payments)`);
    const columnExists = tableInfo.some(column => column.name === 'status');

    if (!columnExists) {
      await db.exec(`
        ALTER TABLE payments
        ADD COLUMN status TEXT;
      `);
      console.log('✅ Columna "status" agregada a la tabla de pagos.');
    } else {
      console.log('ℹ️ La columna "status" ya existe en la tabla de pagos.');
    }
  } catch (error) {
    console.error('❌ Error al agregar la columna "status":', error);
  } finally {
    await db.close();
  }
}

addStatusColumn(); 