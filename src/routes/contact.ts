import express from 'express';
import { addContact } from '../controllers/ContactsController';
import { addPayment } from '../controllers/PaymentsController';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/contact', (req, res) => {
  res.locals.meta.title = 'Contacto | Peluquería a Domicilio';
  res.locals.meta.description = 'Ponte en contacto con nosotros para agendar una cita o resolver tus dudas. Estamos para ayudarte.';
  res.render('contact', { 
    meta: res.locals.meta, 
    success: null, 
    message: null,
    recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
  });
});

router.post('/contact', addContact);

router.post('/payment/add', addPayment);

export default router;
