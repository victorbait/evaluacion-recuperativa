"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contact_1 = __importDefault(require("./routes/contact"));
const admin_1 = __importDefault(require("./routes/admin"));
const payment_1 = __importDefault(require("./routes/payment"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
// Configuración de Sesión
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'unsecretofuerteyseguro123!',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto' }
}));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express_1.default.static('public'));
// Middleware para metadatos Open Graph
app.use((req, res, next) => {
    res.locals.meta = {
        title: 'Peluquería a Domicilio',
        description: 'Servicios de estílistica profesional en la comodidad de tu hogar.',
        image: `${req.protocol}://${req.get('host')}/img/peluqueria-domicilio.jpg`,
        url: `${req.protocol}://${req.get('host')}${req.originalUrl}`
    };
    next();
});
// Middleware para parsear el cuerpo de las solicitudes
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.locals.meta.title = 'Inicio | Peluquería a Domicilio';
    res.locals.meta.description = 'Bienvenido a nuestros servicios de peluquería y estilismo profesional a domicilio. Calidad y comodidad sin salir de casa.';
    res.render('index', { meta: res.locals.meta });
});
app.use('/', contact_1.default);
app.use('/admin', admin_1.default);
app.use('/payment', payment_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
