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
exports.checkSessionActivity = exports.requireAdminAuth = exports.handleAdminLogout = exports.renderAdminPayments = exports.renderAdminDashboard = exports.handleAdminLogin = exports.renderAdminLogin = void 0;
const sqlite_1 = require("sqlite");
const sqlite3_1 = __importDefault(require("sqlite3"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dayjs_1 = __importDefault(require("dayjs"));
const ADMIN_EMAIL = 'admin@peluqueria.com';
const ADMIN_PASSWORD = 'admin123';
const renderAdminLogin = (req, res) => {
    const error = req.query.error;
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    res.render('admin/login', {
        error: error ? req.__(error) : null,
        googleClientId
    });
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
        res.redirect('/admin/login?error=admin_login.invalid_credentials');
    }
});
exports.handleAdminLogin = handleAdminLogin;
const renderAdminDashboard = (req, res) => {
    var _a;
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
        // Formatear fechas según el idioma
        const formattedPayments = payments.map(payment => (Object.assign(Object.assign({}, payment), { created_at: (0, dayjs_1.default)(payment.created_at).format(req.getLocale() === 'es' ? 'DD/MM/YYYY HH:mm' : 'MM/DD/YYYY h:mm A') })));
        res.render('admin/payments', { payments: formattedPayments });
    }
    catch (error) {
        console.error('💥 ERROR al obtener los pagos:', error);
        res.status(500).send(req.__('admin_payments.error_loading'));
    }
});
exports.renderAdminPayments = renderAdminPayments;
const handleAdminLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/admin/dashboard');
        }
        res.redirect('/admin/login');
    });
};
exports.handleAdminLogout = handleAdminLogout;
const requireAdminAuth = (req, res, next) => {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.isAdmin) {
        if (req.session.cookie && req.session.cookie.expires) {
            const now = new Date();
            const expires = new Date(req.session.cookie.expires);
            if (now > expires) {
                req.session.destroy(() => {
                    res.redirect('/admin/login?error=admin_login.session_expired');
                });
                return;
            }
        }
        next();
    }
    else {
        res.redirect('/admin/login');
    }
};
exports.requireAdminAuth = requireAdminAuth;
const checkSessionActivity = (req, res, next) => {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.isAdmin) {
        req.session.lastActivity = Date.now();
    }
    next();
};
exports.checkSessionActivity = checkSessionActivity;
