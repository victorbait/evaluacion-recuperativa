import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

async function addEmailColumn() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  try {
    const tableInfo = await db.all(`PRAGMA table_info(payments)`);
    const columnExists = tableInfo.some(column => column.name === 'email');

    if (!columnExists) {
      await db.exec(`
        ALTER TABLE payments
        ADD COLUMN email TEXT;
      `);
      console.log('✅ Columna "email" agregada a la tabla de pagos.');
    } else {
      console.log('ℹ️ La columna "email" ya existe en la tabla de pagos.');
    }
  } catch (error) {
    console.error('❌ Error al agregar la columna "email":', error);
  } finally {
    await db.close();
  }
}

addEmailColumn(); 