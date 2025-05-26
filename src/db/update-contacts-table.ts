import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

async function addCountryColumn() {
  const db = await open({
    filename: path.resolve(__dirname, '../../database.sqlite'),
    driver: sqlite3.Database
  });

  try {
    await db.exec(`ALTER TABLE contacts ADD COLUMN country TEXT`);
    console.log(' Columna "country" agregada correctamente.');
  } catch (error: any) {
    if (error.message.includes('duplicate column name')) {
      console.log('ℹ La columna "country" ya existe.');
    } else {
      console.error(' Error al agregar la columna:', error);
    }
  }

  await db.close();
}

addCountryColumn();

