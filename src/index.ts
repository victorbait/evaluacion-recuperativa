import express from 'express'; // Importamos la dependencia de express
import path from 'path'; // Para manejar rutas
import contactRoutes from './routes/contact'; // Importamos las rutas de contacto

const app = express(); // Inicializamos express

// Middleware para procesar datos del formulario
app.use(express.urlencoded({ extended: true }));

// Configuramos el motor de plantillas
app.set('view engine', 'ejs'); // Usamos ejs como motor
app.set('views', './views'); // Definimos la carpeta de las vistas

// Configuramos la carpeta 'public' para servir archivos estáticos (imagenes, css, js)
app.use(express.static('public'));

// Ruta principal que renderiza index.ejs
app.get('/', (req, res) => { 
  res.render('index'); // Renderizamos la vista 'index'
});

app.get('/payment', (req, res) => {
  res.render('payment');
});

// Usamos las rutas del formulario de contacto
app.use('/', contactRoutes);

// Configuramos el puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
