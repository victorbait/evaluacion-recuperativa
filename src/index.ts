import express from 'express';
import path from 'path'; 
import contactRoutes from './routes/contact'; 


const app = express(); 
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); 
app.set('views', './views'); 
app.use(express.static('public'));

app.get('/', (req, res) => { 
  res.render('index'); 
});

app.get('/payment', (req, res) => {
  res.render('payment');
});


app.use('/', contactRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
