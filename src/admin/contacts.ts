import express from 'express';
import { getContacts } from '../controllers/ContactsController';

const router = express.Router();

router.get('/admin/contacts', getContacts);

export default router;
