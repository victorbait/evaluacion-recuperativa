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
    try {
        const { email, name, comment } = req.body;
        const ip = req.ip || '0.0.0.0';
        const date = new Date().toISOString();
        if (!email || !name || !comment) {
            res.status(400).send('Todos los campos son obligatorios.');
            return;
        }
        yield ContactsModel_1.default.add({ email, name, comment, ip, date });
        res.send('Contacto guardado exitosamente.');
    }
    catch (error) {
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
        res.status(500).json({ error: 'Error al obtener contactos' });
    }
});
exports.getContacts = getContacts;
