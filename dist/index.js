"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Importamos la dependencia de express
const contact_1 = __importDefault(require("./routes/contact")); // Importamos las rutas de contacto
const app = (0, express_1.default)(); // Inicializamos express
// Middleware para procesar datos del formulario
app.use(express_1.default.urlencoded({ extended: true }));
// Configuramos el motor de plantillas
app.set('view engine', 'ejs'); // Usamos ejs como motor
app.set('views', './views'); // Definimos la carpeta de las vistas
// Configuramos la carpeta 'public' para servir archivos estáticos (imagenes, css, js)
app.use(express_1.default.static('public'));
// Ruta principal que renderiza index.ejs
app.get('/', (req, res) => {
    res.render('index'); // Renderizamos la vista 'index'
});
app.get('/payment', (req, res) => {
    res.render('payment');
});
// Usamos las rutas del formulario de contacto
app.use('/', contact_1.default);
// Configuramos el puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
