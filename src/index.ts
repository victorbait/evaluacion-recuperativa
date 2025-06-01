import express from 'express';
import path from 'path'; 
import contactRoutes from './routes/contact';
import adminRoutes from './routes/admin';
import paymentRoutes from './routes/payment';
import dotenv from 'dotenv';

dotenv.config();
const app = express(); 
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); 
app.set('views', './views'); 
app.use(express.static('public'));

app.get('/', (req, res) => { 
  res.render('index'); 
});

app.use('/', contactRoutes);
app.use('/admin', adminRoutes);
app.use('/payment', paymentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
