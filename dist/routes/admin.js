"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ContactsController_1 = require("../controllers/ContactsController");
const router = express_1.default.Router();
router.get('/contacts', ContactsController_1.indexContacts); // Nueva ruta para mostrar contactos
exports.default = router;
