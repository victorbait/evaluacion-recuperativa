import { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

interface PaymentResponse {
  status: 'APPROVED' | 'REJECTED' | 'ERROR' | 'INSUFFICIENT' | string;
  [key: string]: any;
}

export const renderPaymentForm = (req: Request, res: Response) => {
  res.render('payment', { message: null, success: null });
};

export const addPayment: (req: Request, res: Response, next: NextFunction) => void = async (req, res, next) => {
  const { email, cardName, cardNumber, expMonth, expYear, cvv, amount, currency } = req.body;

  console.log('🔍 Datos recibidos:', { email, cardName, cardNumber: cardNumber?.substring(0, 4) + '****', expMonth, expYear, cvv: '***', amount, currency });

  if (!email || !cardName || !cardNumber || !expMonth || !expYear || !cvv || !amount || !currency) {
    console.log('❌ Validación fallida: campos faltantes');
    return res.render('payment', {
      message: 'Todos los campos son obligatorios.',
      success: false
    });
  }

  try {
    const paymentData = {
      amount,
      "card-number": cardNumber,
      cvv,
      "expiration-month": expMonth,
      "expiration-year": expYear,
      "full-name": cardName,
      currency,
      description: `Pago de ${email}`,
      reference: `payment_${Date.now()}`
    };

    console.log('📤 Enviando datos a fakepayments:', {
      ...paymentData,
      "card-number": paymentData["card-number"]?.substring(0, 4) + '****',
      cvv: '***'
    });

    const response = await fetch('https://fakepayment.onrender.com/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZmFrZSBwYXltZW50IiwiZGF0ZSI6IjIwMjUtMDUtMzFUMDg6NDY6MDkuMzc5WiIsImlhdCI6MTc0ODY4MTE2OX0.5GIcrI0VAFPg_ngUxT5Hne4Fg2a53eej2dClbpGLazM'
      },
      body: JSON.stringify(paymentData)
    });

    console.log('📥 Status Code de la respuesta:', response.status);
    console.log('📥 Headers de la respuesta:', Object.fromEntries(response.headers.entries()));

    const result = await response.json() as PaymentResponse;
    console.log('📥 Respuesta completa de fakepayments:', result);

    if (response.ok && (result.status === 'APPROVED' || result.success === true)) {
      console.log('✅ Pago aprobado exitosamente');

      // Guardar en la base de datos
      try {
        const db = await open({ filename: './database.sqlite', driver: sqlite3.Database });
        await db.run(
          'INSERT INTO payments (transaction_id, amount, currency, status, description, reference, payment_date, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          result.data.transaction_id,
          result.data.amount,
          result.data.currency,
          'APPROVED',
          result.data.description,
          result.data.reference,
          result.data.date,
          email
        );
        await db.close();
        console.log('💾 Pago guardado en la base de datos.');
      } catch (dbError) {
        console.error('💥 ERROR al guardar en la base de datos:', dbError);
        // Continuar aunque falle el guardado en DB para no afectar al usuario
      }

      return res.render('payment', {
        message: '¡PAGO EXITOSO, GRACIAS!',
        success: true
      });
    } else {
      console.log('❌ Pago rechazado o error:', {
        statusCode: response.status,
        responseStatus: result.status,
        responseData: result
      });
      
      // Manejar errores específicos de la API
      let errorMessage = 'PAGO RECHAZADO, VUELVA A INTENTAR POR FAVOR';
      
      if (result.errors && Array.isArray(result.errors)) {
        const errorDetails = result.errors.map((err: any) => `${err.path}: ${err.msg}`).join(', ');
        errorMessage = `Error de validación: ${errorDetails}`;
      } else if (result.status) {
        errorMessage = `PAGO RECHAZADO: ${result.status}`;
      } else if (response.status === 400) {
        errorMessage = 'Error en los datos enviados. Verifique la información.';
      } else if (response.status === 401) {
        errorMessage = 'Error de autenticación con el servicio de pagos.';
      } else if (response.status === 500) {
        errorMessage = 'Error interno del servicio de pagos.';
      }
      
      return res.render('payment', {
        message: errorMessage,
        success: false
      });
    }
  } catch (error) {
    console.error('💥 ERROR en la petición:', error);
    return res.render('payment', {
      message: 'ERROR INTERNO, INTENTE MÁS TARDE.',
      success: false
    });
  }
};
