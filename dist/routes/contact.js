"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ContactsController_1 = require("../controllers/ContactsController");
const PaymentsController_1 = require("../controllers/PaymentsController");
const router = express_1.default.Router();
router.post('/contact/add', ContactsController_1.addContact);
router.post('/payment/add', PaymentsController_1.addPayment);
exports.default = router;
