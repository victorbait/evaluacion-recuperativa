import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Creamos la conexión a la base de datos
async function createDatabase() {
  const db = await open({
    filename: path.join(__dirname, '../database.sqlite'),
    driver: sqlite3.Database
  });

  // Creamos la tabla si no existe
  await db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      comment TEXT NOT NULL,
      ip TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  console.log('✅ Base de datos y tabla "contacts" creadas correctamente.');
  await db.close();
}

// Ejecutar el script
createDatabase().catch((err) => {
  console.error('❌ Error creando la base de datos:', err);
});
