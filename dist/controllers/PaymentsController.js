"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPayment = void 0;
const addPayment = (req, res, next) => {
    const { email, cardName, cardNumber, expMonth, expYear, cvv, amount, currency } = req.body;
    if (!email || !cardName || !cardNumber || !expMonth || !expYear || !cvv || !amount || !currency) {
        res.status(400).send('Todos los campos son obligatorios.');
        return;
    }
    res.send('Pago realizado exitosamente.');
};
exports.addPayment = addPayment;
