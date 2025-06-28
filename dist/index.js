"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const contact_1 = __importDefault(require("./routes/contact"));
const admin_1 = __importDefault(require("./routes/admin"));
const payment_1 = __importDefault(require("./routes/payment"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("./config/passport");
const i18n_1 = __importDefault(require("i18n"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dayjs_1 = __importDefault(require("dayjs"));
require("dayjs/locale/es");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Configuración de i18n
i18n_1.default.configure({
    locales: ['es', 'en'],
    defaultLocale: 'es',
    directory: path_1.default.join(__dirname, '../locales'),
    cookie: 'lang',
    objectNotation: true,
    updateFiles: false,
    syncFiles: false
});
// Middleware para i18n
app.use((0, cookie_parser_1.default)());
app.use(i18n_1.default.init);
// Middleware para formatear fechas según el idioma
app.use((req, res, next) => {
    const locale = req.getLocale();
    dayjs_1.default.locale(locale);
    // Función helper para formatear fechas
    res.locals.formatDate = (date, format = 'long') => {
        const formatMap = {
            'short': locale === 'es' ? 'DD/MM/YYYY' : 'MM/DD/YYYY',
            'long': locale === 'es' ? 'DD/MM/YYYY HH:mm' : 'MM/DD/YYYY h:mm A',
            'time': locale === 'es' ? 'HH:mm' : 'h:mm A'
        };
        return (0, dayjs_1.default)(date).format(formatMap[format] || formatMap.long);
    };
    next();
});
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'unsecretofuerteyseguro123!',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
    },
    name: 'sessionId',
    rolling: true
}));
(0, passport_2.configurePassport)();
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express_1.default.static('public'));
app.use((req, res, next) => {
    res.locals.meta = {
        title: 'Peluquería a Domicilio',
        description: 'Servicios de estílistica profesional en la comodidad de tu hogar.',
        image: `${req.protocol}://${req.get('host')}/img/peluqueria-domicilio.jpg`,
        url: `${req.protocol}://${req.get('host')}${req.originalUrl}`
    };
    next();
});
app.use(express_1.default.json());
// Ruta para cambiar idioma
app.get('/change-language/:locale', (req, res) => {
    const locale = req.params.locale;
    if (['es', 'en'].includes(locale)) {
        res.cookie('lang', locale, { maxAge: 365 * 24 * 60 * 60 * 1000 }); // 1 año
        req.setLocale(locale);
    }
    res.redirect('back');
});
app.get('/', (req, res) => {
    res.locals.meta.title = req.__('home.title') + ' | ' + req.__('home.title');
    res.locals.meta.description = req.__('home.welcome_message');
    res.render('index', { meta: res.locals.meta });
});
app.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/admin/login?error=Error en autenticación con Google' }), (req, res) => {
    var _a, _b;
    req.session.isAdmin = true;
    req.session.adminUsername = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.display_name) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.username);
    res.redirect('/admin/dashboard');
});
app.use('/', contact_1.default);
app.use('/admin', admin_1.default);
app.use('/payment', payment_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
