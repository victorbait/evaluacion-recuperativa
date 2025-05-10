import { Request, Response, NextFunction } from 'express';

export const addPayment: (req: Request, res: Response, next: NextFunction) => void = (req, res, next) => {
    const { email, cardName, cardNumber, expMonth, expYear, cvv, amount, currency } = req.body;

    if (!email || !cardName || !cardNumber || !expMonth || !expYear || !cvv || !amount || !currency) {
        res.status(400).send('Todos los campos son obligatorios.');
        return;
    }

    res.send('Pago realizado exitosamente.');
};
