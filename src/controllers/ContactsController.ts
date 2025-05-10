import { Request, Response } from 'express';
import ContactsModel from '../models/ContactsModel';

export const addContact = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, name, comment } = req.body;
        const ip = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || '0.0.0.0';
        const created_at = new Date().toISOString();

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

export const getContacts = async (req: Request, res: Response): Promise<void> => {
    try {
        const contacts = await ContactsModel.getAll();
        res.json({ contacts });
    } catch (error) {
        console.error('Error en getContacts:', error);
        res.status(500).json({ error: 'Error al obtener contactos' });
    }
};

export const indexContacts = async (req: Request, res: Response): Promise<void> => {
    try {
        const contacts = await ContactsModel.getAll();
        res.render('admin/contacts', { contacts });
    } catch (error) {
        console.error('Error en indexContacts:', error);
        res.status(500).json({ error: 'Error al obtener contactos' });
    }
};