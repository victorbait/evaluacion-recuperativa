"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ContactsController_1 = require("../controllers/ContactsController");
const PaymentsController_1 = require("../controllers/PaymentsController");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
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
router.post('/contact', ContactsController_1.addContact);
router.post('/payment/add', PaymentsController_1.addPayment);
exports.default = router;
