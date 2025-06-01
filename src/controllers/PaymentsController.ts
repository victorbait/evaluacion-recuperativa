import { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';

interface PaymentResponse {
  status: 'APPROVED' | 'REJECTED' | 'ERROR' | 'INSUFFICIENT' | string;
  [key: string]: any;
}

export const renderPaymentForm = (req: Request, res: Response) => {
  res.render('payment', { message: null, success: null });
};

export const addPayment: (req: Request, res: Response, next: NextFunction) => void = async (req, res, next) => {
  const { email, cardName, cardNumber, expMonth, expYear, cvv, amount, currency } = req.body;

  if (!email || !cardName || !cardNumber || !expMonth || !expYear || !cvv || !amount || !currency) {
    return res.render('payment', {
      message: 'Todos los campos son obligatorios.',
      success: false
    });
  }

  try {
    const response = await fetch('https://fakepayment.onrender.com/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZmFrZSBwYXltZW50IiwiZGF0ZSI6IjIwMjUtMDUtMzFUMDg6NDY6MDkuMzc5WiIsImlhdCI6MTc0ODY4MTE2OX0.5GIcrI0VAFPg_ngUxT5Hne4Fg2a53eej2dClbpGLazM'
      },
      body: JSON.stringify({
        amount,
        "card-number": cardNumber,
        cvv,
        "expiration-month": expMonth,
        "expiration-year": expYear,
        "full-name": cardName,
        currency,
        description: `Pago de ${email}`,
        reference: `payment_${Date.now()}`
      })
    });

    const result = await response.json() as PaymentResponse;

    if (response.ok && result.status === 'APPROVED') {
      return res.render('payment', {
        message: '¡PAGO EXITOSO, GRACIAS!',
        success: true
      });
    } else {
      return res.render('payment', {
        message: 'PAGO RECHAZADO, VUELVA A INTENTAR POR FAVOR',
        success: false
      });
    }
  } catch (error) {
    console.error('ERROR', error);
    return res.render('payment', {
      message: 'ERROR INTERNO, INTENTE MÁS TARDE.',
      success: false
    });
  }
};
