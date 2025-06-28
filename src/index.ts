import express from 'express';
import path from 'path'; 
import contactRoutes from './routes/contact';
import adminRoutes from './routes/admin';
import paymentRoutes from './routes/payment';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { configurePassport } from './config/passport';
import i18n from 'i18n';
import cookieParser from 'cookie-parser';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dotenv.config();
const app = express(); 

// Configuración de i18n
i18n.configure({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  directory: path.join(__dirname, '../locales'),
  cookie: 'lang',
  objectNotation: true,
  updateFiles: false,
  syncFiles: false
});

// Middleware para i18n
app.use(cookieParser());
app.use(i18n.init);

// Middleware para formatear fechas según el idioma
app.use((req, res, next) => {
  const locale = req.getLocale();
  dayjs.locale(locale);
  
  // Función helper para formatear fechas
  res.locals.formatDate = (date: Date, format: string = 'long') => {
    const formatMap = {
      'short': locale === 'es' ? 'DD/MM/YYYY' : 'MM/DD/YYYY',
      'long': locale === 'es' ? 'DD/MM/YYYY HH:mm' : 'MM/DD/YYYY h:mm A',
      'time': locale === 'es' ? 'HH:mm' : 'h:mm A'
    };
    return dayjs(date).format(formatMap[format as keyof typeof formatMap] || formatMap.long);
  };
  
  next();
});

app.use(express.urlencoded({ extended: true }));

app.use(session({
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

configurePassport();
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs'); 
app.set('views', './views'); 
app.use(express.static('public'));

app.use((req, res, next) => {
    res.locals.meta = {
        title: 'Peluquería a Domicilio',
        description: 'Servicios de estílistica profesional en la comodidad de tu hogar.',
        image: `${req.protocol}://${req.get('host')}/img/peluqueria-domicilio.jpg`,
        url: `${req.protocol}://${req.get('host')}${req.originalUrl}`
    };
    next();
});

app.use(express.json());

// Ruta para cambiar idioma
app.get('/change-language/:locale', (req, res) => {
  const locale = req.params.locale;
  if (['es', 'en'].includes(locale)) {
    res.cookie('lang', locale, { maxAge: 365 * 24 * 60 * 60 * 1000 }); // 1 año
    req.setLocale(locale);
  }
  
  // Redirigir a la página anterior o a la principal
  const referer = req.get('Referer');
  if (referer && !referer.includes('/change-language/')) {
    res.redirect(referer);
  } else {
    res.redirect('/');
  }
});

app.get('/', (req, res) => {
    res.locals.meta.title = req.__('home.title') + ' | ' + req.__('home.title');
    res.locals.meta.description = req.__('home.welcome_message');
    res.render('index', { meta: res.locals.meta });
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/admin/login?error=Error en autenticación con Google' }),
  (req, res) => {
    (req.session as any).isAdmin = true;
    (req.session as any).adminUsername = (req.user as any)?.display_name || (req.user as any)?.username;
    res.redirect('/admin/dashboard');
  }
);

app.use('/', contactRoutes);
app.use('/admin', adminRoutes);
app.use('/payment', paymentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 