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
exports.requireAdminAuth = exports.handleAdminLogout = exports.renderAdminPayments = exports.renderAdminDashboard = exports.handleAdminLogin = exports.renderAdminLogin = void 0;
const sqlite_1 = require("sqlite");
const sqlite3_1 = __importDefault(require("sqlite3"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// Credenciales del admin (en producción deberían estar en variables de entorno)
const ADMIN_EMAIL = 'admin@peluqueria.com';
const ADMIN_PASSWORD = 'admin123';
const renderAdminLogin = (req, res) => {
    const error = req.query.error;
    res.render('admin/login', { error });
};
exports.renderAdminLogin = renderAdminLogin;
const handleAdminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const db = yield (0, sqlite_1.open)({ filename: './database.sqlite', driver: sqlite3_1.default.Database });
    const user = yield db.get('SELECT * FROM users WHERE username = ?', username);
    yield db.close();
    if (user && (yield bcrypt_1.default.compare(password, user.password_hash))) {
        req.session.isAdmin = true;
        req.session.adminUsername = user.username;
        res.redirect('/admin/dashboard');
    }
    else {
        res.redirect('/admin/login?error=Credenciales inválidas');
    }
});
exports.handleAdminLogin = handleAdminLogin;
const renderAdminDashboard = (req, res) => {
    var _a;
    // Verificar si está autenticado
    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
        return res.redirect('/admin/login');
    }
    res.render('admin/dashboard', {
        adminUsername: req.session.adminUsername
    });
};
exports.renderAdminDashboard = renderAdminDashboard;
const renderAdminPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, sqlite_1.open)({ filename: './database.sqlite', driver: sqlite3_1.default.Database });
        const payments = yield db.all('SELECT * FROM payments ORDER BY created_at DESC');
        yield db.close();
        res.render('admin/payments', { payments });
    }
    catch (error) {
        console.error('💥 ERROR al obtener los pagos:', error);
        res.status(500).send("Error al cargar la página de pagos.");
    }
});
exports.renderAdminPayments = renderAdminPayments;
const handleAdminLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            // manejar error, por ejemplo, loguearlo
            return res.redirect('/admin/dashboard');
        }
        res.redirect('/admin/login');
    });
};
exports.handleAdminLogout = handleAdminLogout;
// Middleware para proteger rutas de admin
const requireAdminAuth = (req, res, next) => {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.isAdmin) {
        next();
    }
    else {
        res.redirect('/admin/login');
    }
};
exports.requireAdminAuth = requireAdminAuth;
