import express from 'express';
import { addPayment } from '../controllers/PaymentsController';

const router = express.Router();

router.get('/', (req, res) => {
  res.locals.meta.title = 'Realizar Pago | Peluquería a Domicilio';
  res.locals.meta.description = 'Realiza el pago de tu servicio de forma rápida y segura a través de nuestra plataforma.';
  res.render('payment', { message: null, success: null, meta: res.locals.meta });
});

router.post('/', addPayment);

export default router;
