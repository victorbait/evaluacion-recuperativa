Proyecto: Formulario de Contacto y Pago para Peluquería a Domicilio

Este es un proyecto que desarrollé como práctica de integración de servicios en un sitio web real.  
La idea es ofrecer a los usuarios:

un formulario de contacto seguro  
un formulario de pagos funcional (con una API de pagos falsa)  
notificaciones por correo electrónico  
geolocalización automática por IP  
protección contra bots con Google reCAPTCHA  
análisis de comportamiento de los usuarios con Google Analytics  
seguridad usando variables de entorno para las credenciales sensibles  

---

## Tecnologías usadas

node.js + express
ejs
sqlite para base de datos
nodemails para los correos
google recaptcha v3
ipapi de geolocalizacion
google analitycs
fake api (https://fakepayment.onrender.com)


Variables de entorno (.env)
Para mayor seguridad, las claves y contraseñas se manejan mediante variables de entorno.
Estas se colocan en el archivo .env (que está en .gitignore para no subirlo a GitHub).

Ejemplo de .env (las que usé en este proyecto):

RECAPTCHA_SECRET_KEY=6LcKl0orAAAAAEqF1l4wh4BkU9jPJ_Xluob6ga9D
EMAIL_USER=chevetteconfiable@gmail.com
EMAIL_PASS=ubxr lubq derh jidh

integración de servicios

Geolocalización por IP
Para detectar el país de los usuarios que envían el formulario de contacto, utilicé la API gratuita ipapi.co Cuando se recibe un nuevo contacto, hago una petición a https://ipapi.co/<ip>/json/ y de ahí obtengo el país.
el país se guarda en la base de datos junto con el resto de los datos del contacto.

ejemplo en ContactsController.ts:

const response = await fetch(`https://ipapi.co/${ip}/json/`);
const data = await response.json();
const detectedCountry = data.country_name || "Desconocido";

Google Analytics

para poder analizar las visitas al sitio y el comportamiento de los usuarios, integré google analitycs en la página principal (views/index.ejs) y también en la de pago. use  el ID: G-MY5WQH8WHN. mediante el script pues

<script async src="https://www.googletagmanager.com/gtag/js?id=G-MY5WQH8WHN"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-MY5WQH8WHN');
</script>

google recaptcha

para proteger el formulario de contacto contra bots y spam, usamos el captcha v3. el  frontend genera un token que se envía con el formulario. el el backend (ContactsController.ts) verifico ese token con la api de google

const captchaVerifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captcha}`;
const captchaResponse = await fetch(captchaVerifyURL, { method: 'POST' });
const captchaData = await captchaResponse.json();

si el captcha no es valido o el score es bajo, el formulario no se procesa

Notificación por correo electrónico
cada vez que un usuario completa el formulario de contacto, se envia un correo automático a los siguientes correos

programacion2ais@yopmail.com
manurondon67xdk@gmail.com (este es para testear xd)

el correo incluye:

Nombre
Correo
Comentario
Dirección IP
País
Fecha/Hora de la solicitud

se configura nodemailer con las variables de entorno:

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:
        pass:


y luego envío el correo con esta estructura:

const mailOptions = {
    from: `"Formulario de Contacto" <${EMAIL_USER}>`,
    to: 'programacion2ais@yopmail.com, manurondon67xdk@gmail.com',
    subject: 'Nuevo formulario de contacto recibido',
    text: `información del contacto...`,
await transporter.sendMail(mailOptions);


 integracion con la fake api

el formulario de pagos /payment está conectado con la api falsa depues el usuario llena los datos de la tarjeta y monto, y el backend envía la información a la api

por ultimo y seguridad utilice variables de entorno definidas en el archivo .env. para proteger informacion sensible del clave privada del recaptcha y usuario y contraseña del correo electrónico

importante: el archivo .env está incluido en .gitignore para que no se suba al repositorio publico
