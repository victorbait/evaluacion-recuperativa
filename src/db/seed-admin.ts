import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';

async function seedAdmin() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  const adminUsername = 'admin';
  const adminPassword = 'admin123';

  const existingAdmin = await db.get('SELECT * FROM users WHERE username = ?', adminUsername);

  if (!existingAdmin) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

    await db.run(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      adminUsername,
      passwordHash
    );
    console.log('✅ Usuario administrador "admin" creado exitosamente.');
  } else {
    console.log('ℹ️ El usuario administrador "admin" ya existe.');
  }

  await db.close();
}

seedAdmin(); 