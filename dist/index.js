"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Importamos la dependencia de express
const path_1 = __importDefault(require("path")); // Para manejar rutas
const app = (0, express_1.default)(); // Inicializamos express
// Configuramos el motor de plantillas
app.set('view engine', 'ejs'); // Usamos ejs como motor
app.set('views', './views'); // Definimos la carpeta de las vistas
// Configuramos la carpeta 'public' para servir archivos estáticos (imagenes, css, js)
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
// Ruta principal que renderiza index.ejs
app.get('/', (req, res) => {
    res.render('index'); // Renderizamos la vista 'index'
});
// Configuramos el puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
