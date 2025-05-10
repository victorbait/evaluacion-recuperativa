import express from 'express';
import { addContact } from '../controllers/ContactsController';
import { addPayment } from '../controllers/PaymentsController';

const router = express.Router();

router.post('/contact/add', addContact);
router.post('/payment/add', addPayment);

export default router;
