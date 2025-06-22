"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPayment = exports.renderPaymentForm = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const sqlite_1 = require("sqlite");
const sqlite3_1 = __importDefault(require("sqlite3"));
const renderPaymentForm = (req, res) => {
    res.render('payment', { message: null, success: null });
};
exports.renderPaymentForm = renderPaymentForm;
const addPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, cardName, cardNumber, expMonth, expYear, cvv, amount, currency } = req.body;
    console.log('🔍 Datos recibidos:', { email, cardName, cardNumber: (cardNumber === null || cardNumber === void 0 ? void 0 : cardNumber.substring(0, 4)) + '****', expMonth, expYear, cvv: '***', amount, currency });
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
        console.log('📤 Enviando datos a fakepayments:', Object.assign(Object.assign({}, paymentData), { "card-number": ((_a = paymentData["card-number"]) === null || _a === void 0 ? void 0 : _a.substring(0, 4)) + '****', cvv: '***' }));
        const response = yield (0, node_fetch_1.default)('https://fakepayment.onrender.com/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZmFrZSBwYXltZW50IiwiZGF0ZSI6IjIwMjUtMDUtMzFUMDg6NDY6MDkuMzc5WiIsImlhdCI6MTc0ODY4MTE2OX0.5GIcrI0VAFPg_ngUxT5Hne4Fg2a53eej2dClbpGLazM'
            },
            body: JSON.stringify(paymentData)
        });
        console.log('📥 Status Code de la respuesta:', response.status);
        console.log('📥 Headers de la respuesta:', Object.fromEntries(response.headers.entries()));
        const result = yield response.json();
        console.log('📥 Respuesta completa de fakepayments:', result);
        if (response.ok && (result.status === 'APPROVED' || result.success === true)) {
            console.log('✅ Pago aprobado exitosamente');
            // Guardar en la base de datos
            try {
                const db = yield (0, sqlite_1.open)({ filename: './database.sqlite', driver: sqlite3_1.default.Database });
                yield db.run('INSERT INTO payments (transaction_id, amount, currency, status, description, reference, payment_date, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', result.data.transaction_id, result.data.amount, result.data.currency, 'APPROVED', result.data.description, result.data.reference, result.data.date, email);
                yield db.close();
                console.log('💾 Pago guardado en la base de datos.');
            }
            catch (dbError) {
                console.error('💥 ERROR al guardar en la base de datos:', dbError);
                // Continuar aunque falle el guardado en DB para no afectar al usuario
            }
            return res.render('payment', {
                message: '¡PAGO EXITOSO, GRACIAS!',
                success: true
            });
        }
        else {
            console.log('❌ Pago rechazado o error:', {
                statusCode: response.status,
                responseStatus: result.status,
                responseData: result
            });
            // Manejar errores específicos de la API
            let errorMessage = 'PAGO RECHAZADO, VUELVA A INTENTAR POR FAVOR';
            if (result.errors && Array.isArray(result.errors)) {
                const errorDetails = result.errors.map((err) => `${err.path}: ${err.msg}`).join(', ');
                errorMessage = `Error de validación: ${errorDetails}`;
            }
            else if (result.status) {
                errorMessage = `PAGO RECHAZADO: ${result.status}`;
            }
            else if (response.status === 400) {
                errorMessage = 'Error en los datos enviados. Verifique la información.';
            }
            else if (response.status === 401) {
                errorMessage = 'Error de autenticación con el servicio de pagos.';
            }
            else if (response.status === 500) {
                errorMessage = 'Error interno del servicio de pagos.';
            }
            return res.render('payment', {
                message: errorMessage,
                success: false
            });
        }
    }
    catch (error) {
        console.error('💥 ERROR en la petición:', error);
        return res.render('payment', {
            message: 'ERROR INTERNO, INTENTE MÁS TARDE.',
            success: false
        });
    }
});
exports.addPayment = addPayment;
