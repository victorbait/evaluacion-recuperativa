import express from 'express';
import path from 'path'; 
import contactRoutes from './routes/contact';
import adminRoutes from './routes/admin';
import paymentRoutes from './routes/payment';
import dotenv from 'dotenv';
import session from 'express-session';

dotenv.config();
const app = express(); 
app.use(express.urlencoded({ extended: true }));

// Configuración de Sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'unsecretofuerteyseguro123!',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: 'auto' }
}));

app.set('view engine', 'ejs'); 
app.set('views', './views'); 
app.use(express.static('public'));

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
app.use(express.json());

app.get('/', (req, res) => {
    res.locals.meta.title = 'Inicio | Peluquería a Domicilio';
    res.locals.meta.description = 'Bienvenido a nuestros servicios de peluquería y estilismo profesional a domicilio. Calidad y comodidad sin salir de casa.';
    res.render('index', { meta: res.locals.meta });
});

app.use('/', contactRoutes);
app.use('/admin', adminRoutes);
app.use('/payment', paymentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
