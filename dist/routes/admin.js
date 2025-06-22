"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ContactsController_1 = require("../controllers/ContactsController");
const AdminController_1 = require("../controllers/AdminController");
const router = express_1.default.Router();
// Redirección para la raíz de /admin
router.get('/', (req, res) => {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.isAdmin) {
        res.redirect('/admin/dashboard');
    }
    else {
        res.redirect('/admin/login');
    }
});
// Rutas de autenticación
router.get('/login', AdminController_1.renderAdminLogin);
router.post('/login', AdminController_1.handleAdminLogin);
router.get('/logout', AdminController_1.handleAdminLogout);
// Rutas protegidas
router.get('/dashboard', AdminController_1.requireAdminAuth, AdminController_1.renderAdminDashboard);
router.get('/contacts', AdminController_1.requireAdminAuth, ContactsController_1.indexContacts); // Ruta de contactos ahora protegida
router.get('/payments', AdminController_1.requireAdminAuth, AdminController_1.renderAdminPayments);
exports.default = router;
