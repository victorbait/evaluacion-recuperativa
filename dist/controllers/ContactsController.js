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
exports.getContacts = exports.addContact = void 0;
const ContactsModel_1 = __importDefault(require("../models/ContactsModel"));
const addContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, name, comment } = req.body;
        const ip = ((_a = req.headers['x-forwarded-for']) === null || _a === void 0 ? void 0 : _a.toString()) || req.socket.remoteAddress || '0.0.0.0';
        const created_at = new Date().toISOString(); // Corrección aquí: renombrado de "date" a "created_at"
        if (!email || !name || !comment) {
            res.status(400).send('Todos los campos son obligatorios.');
            return;
        }
        yield ContactsModel_1.default.add({ email, name, comment, ip, created_at });
        res.send('Contacto guardado exitosamente.');
    }
    catch (error) {
        console.error('Error en addContact:', error);
        res.status(500).json({ error: 'Error al agregar contacto' });
    }
});
exports.addContact = addContact;
// Aquí agregamos la función `getContacts` y nos aseguramos de exportarla
const getContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield ContactsModel_1.default.getAll();
        res.json({ contacts });
    }
    catch (error) {
        console.error('Error en getContacts:', error);
        res.status(500).json({ error: 'Error al obtener contactos' });
    }
});
exports.getContacts = getContacts;
