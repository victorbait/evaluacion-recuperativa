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
exports.indexContacts = exports.getContacts = exports.addContact = void 0;
const ContactsModel_1 = __importDefault(require("../models/ContactsModel"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '';
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';
if (!RECAPTCHA_SECRET_KEY || !EMAIL_USER || !EMAIL_PASS) {
    throw new Error('faltan variables d entorno: RECAPTCHA_SECRET_KEY, EMAIL_USER o EMAIL_PASS');
}
const addContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log("Datos recibidos en req.body:", req.body);
        const { email, name, message, country, 'g-recaptcha-response': captcha } = req.body;
        const ip = ((_a = req.headers['x-forwarded-for']) === null || _a === void 0 ? void 0 : _a.toString()) || req.socket.remoteAddress || '0.0.0.0';
        const created_at = new Date().toISOString();
        if (!email || !name || !message) {
            res.render('contact', {
                meta: { title: req.__('contact.title') + ' | ' + req.__('home.title'), description: req.__('contact.subtitle') },
                success: false,
                message: req.__('contact.form_error'),
                recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
            });
            return;
        }
        if (!captcha) {
            res.render('contact', {
                meta: { title: req.__('contact.title') + ' | ' + req.__('home.title'), description: req.__('contact.subtitle') },
                success: false,
                message: req.__('contact.form_error'),
                recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
            });
            return;
        }
        try {
            const captchaVerifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captcha}`;
            const captchaResponse = yield (0, node_fetch_1.default)(captchaVerifyURL, { method: 'POST' });
            const captchaData = yield captchaResponse.json();
            console.log("Respuesta de reCAPTCHA:", captchaData);
            if (!captchaData.success || (captchaData.score !== undefined && captchaData.score < 0.5)) {
                res.render('contact', {
                    meta: { title: req.__('contact.title') + ' | ' + req.__('home.title'), description: req.__('contact.subtitle') },
                    success: false,
                    message: req.__('contact.form_error'),
                    recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
                });
                return;
            }
        }
        catch (captchaError) {
            console.error("Error validando reCAPTCHA:", captchaError);
            res.render('contact', {
                meta: { title: req.__('contact.title') + ' | ' + req.__('home.title'), description: req.__('contact.subtitle') },
                success: false,
                message: req.__('contact.form_error'),
                recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
            });
            return;
        }
        let detectedCountry = country || "Desconocido";
        if (detectedCountry === "Desconocido") {
            try {
                const response = yield (0, node_fetch_1.default)(`https://ipapi.co/${ip}/json/`);
                const data = yield response.json();
                console.log("Datos de geolocalización:", data);
                detectedCountry = data.country_name || "Desconocido";
            }
            catch (geoError) {
                console.error("Error obteniendo geolocalización:", geoError);
            }
        }
        yield ContactsModel_1.default.add({ email, name, comment: message, ip, created_at, country: detectedCountry });
        yield sendEmail(name, email, message, ip, detectedCountry, created_at);
        res.render('contact', {
            meta: { title: req.__('contact.title') + ' | ' + req.__('home.title'), description: req.__('contact.subtitle') },
            success: true,
            message: req.__('contact.form_success'),
            recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
        });
    }
    catch (error) {
        console.error("Error en addContact:", error);
        res.render('contact', {
            meta: { title: req.__('contact.title') + ' | ' + req.__('home.title'), description: req.__('contact.subtitle') },
            success: false,
            message: req.__('contact.form_error'),
            recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
        });
    }
});
exports.addContact = addContact;
const getContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield ContactsModel_1.default.getAll();
        res.json({ contacts });
    }
    catch (error) {
        console.error("Error en getContacts:", error);
        res.status(500).json({ error: req.__('admin_contacts.error_loading') });
    }
});
exports.getContacts = getContacts;
const indexContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield ContactsModel_1.default.getAll();
        res.render('admin/contacts', { contacts });
    }
    catch (error) {
        console.error("Error en indexContacts:", error);
        res.status(500).json({ error: req.__('admin_contacts.error_loading') });
    }
});
exports.indexContacts = indexContacts;
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});
function sendEmail(name, email, message, ip, country, created_at) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mailOptions = {
                from: `"Formulario de Contacto" <${EMAIL_USER}>`,
                to: 'programacion2ais@yopmail.com, manurondon67xdk@gmail.com',
                subject: 'Nuevo formulario de contacto recibido',
                text: `Hola,

Se ha recibido un nuevo formulario de contacto con la siguiente información:

Nombre: ${name}
Correo: ${email}
Comentario: ${message}
Dirección IP: ${ip}
País: ${country}
Fecha/Hora: ${created_at}

Saludos.
`,
            };
            yield transporter.sendMail(mailOptions);
            console.log("Correo enviado correctamente.");
        }
        catch (error) {
            console.error("Error al enviar el correo:", error);
        }
    });
}
