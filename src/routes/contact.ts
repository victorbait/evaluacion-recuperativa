import express from 'express';
import { addContact } from '../controllers/ContactsController';
import { addPayment } from '../controllers/PaymentsController';

const router = express.Router();

router.get('/contact', (req, res) => {
  res.render('contact');
});

router.post('/contact/add', addContact);

router.post('/payment/add', addPayment);

export default router;
