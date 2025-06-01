import express from 'express';
import { addPayment } from '../controllers/PaymentsController';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('payment', { message: null, success: null });
});

router.post('/add', addPayment);

export default router;
