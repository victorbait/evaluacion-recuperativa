import { Request, Response } from 'express';
import ContactsModel from '../models/ContactsModel';

export const addContact = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, name, comment } = req.body;
        const ip = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || '0.0.0.0';
        const created_at = new Date().toISOString();  // Corrección aquí: renombrado de "date" a "created_at"

        if (!email || !name || !comment) {
            res.status(400).send('Todos los campos son obligatorios.');
            return;
        }

        await ContactsModel.add({ email, name, comment, ip, created_at });

        res.send('Contacto guardado exitosamente.');
    } catch (error) {
        console.error('Error en addContact:', error);
        res.status(500).json({ error: 'Error al agregar contacto' });
    }
};

// Aquí agregamos la función `getContacts` y nos aseguramos de exportarla
export const getContacts = async (req: Request, res: Response): Promise<void> => {
    try {
        const contacts = await ContactsModel.getAll();
        res.json({ contacts });
    } catch (error) {
        console.error('Error en getContacts:', error);
        res.status(500).json({ error: 'Error al obtener contactos' });
    }
};