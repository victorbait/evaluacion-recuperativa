import { Request, Response } from 'express';
import ContactsModel from '../models/ContactsModel';

export const addContact = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, name, comment } = req.body;
        const ip = req.ip || '0.0.0.0';
        const date = new Date().toISOString();

        if (!email || !name || !comment) {
            res.status(400).send('Todos los campos son obligatorios.');
            return;
        }

        await ContactsModel.add({ email, name, comment, ip, date });

        res.send('Contacto guardado exitosamente.');
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar contacto' });
    }
};

// Aquí agregamos la función `getContacts` y nos aseguramos de exportarla
export const getContacts = async (req: Request, res: Response): Promise<void> => {
    try {
        const contacts = await ContactsModel.getAll();
        res.json({ contacts });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener contactos' });
    }
};