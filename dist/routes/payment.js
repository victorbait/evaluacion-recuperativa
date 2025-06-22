"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PaymentsController_1 = require("../controllers/PaymentsController");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.locals.meta.title = 'Realizar Pago | Peluquería a Domicilio';
    res.locals.meta.description = 'Realiza el pago de tu servicio de forma rápida y segura a través de nuestra plataforma.';
    res.render('payment', { message: null, success: null, meta: res.locals.meta });
});
router.post('/', PaymentsController_1.addPayment);
exports.default = router;
