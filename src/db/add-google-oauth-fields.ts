import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

async function addGoogleOAuthFields() {
  try {
    const db = await open({ filename: './database.sqlite', driver: sqlite3.Database });
    
    // Verificar si las columnas ya existen
    const tableInfo = await db.all("PRAGMA table_info(users)");
    const columnNames = tableInfo.map(col => col.name);
    
    // Agregar google_id si no existe
    if (!columnNames.includes('google_id')) {
      await db.run('ALTER TABLE users ADD COLUMN google_id TEXT');
      console.log('✅ Columna google_id agregada');
    }
    
    // Agregar display_name si no existe
    if (!columnNames.includes('display_name')) {
      await db.run('ALTER TABLE users ADD COLUMN display_name TEXT');
      console.log('✅ Columna display_name agregada');
    }
    
    await db.close();
    console.log('✅ Campos de Google OAuth agregados exitosamente');
  } catch (error) {
    console.error('❌ Error al agregar campos de Google OAuth:', error);
  }
}

addGoogleOAuthFields(); 