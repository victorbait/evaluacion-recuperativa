import express from 'express';
import { indexContacts } from '../controllers/ContactsController';

const router = express.Router();

router.get('/contacts', indexContacts); // Nueva ruta para mostrar contactos

export default router;