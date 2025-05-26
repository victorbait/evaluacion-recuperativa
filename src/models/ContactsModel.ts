import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

interface Contact {
  email: string;
  name: string;
  comment: string;
  ip: string;
  created_at: string;
  country: string;
}

class ContactsModel {
  static async add(contact: Contact) {
    const db = await open({
      filename: path.resolve(__dirname, '../../database.sqlite'),
      driver: sqlite3.Database
    });

    await db.run(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        name TEXT NOT NULL,
        comment TEXT NOT NULL,
        ip TEXT NOT NULL,
        country TEXT, 
        created_at TEXT NOT NULL
      )
    `);

    await db.run(`
      INSERT INTO contacts (email, name, comment, ip, country, created_at) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, 
      contact.email,
      contact.name,
      contact.comment,
      contact.ip,
      contact.country,
      contact.created_at
    );

    await db.close();
  }

  static async getAll() {
    const db = await open({
      filename: path.resolve(__dirname, '../../database.sqlite'),
      driver: sqlite3.Database
    });

    const contacts = await db.all("SELECT id, name, email, comment, ip, country, created_at FROM contacts");

    await db.close();

    return contacts;
  }
}

export default ContactsModel;