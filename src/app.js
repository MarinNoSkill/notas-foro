require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes'); // Nueva ruta para el chat
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// Configuración de Passport
passport.use(new GoogleStrategy({
  clientID: '61241558476-8usbeeop8eln7lqje7v4vd0s9f1tg0vb.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3000/auth/google/callback', 
}, (token, tokenSecret, profile, done) => {
  return done(null, profile);  
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Configuración de sesión
app.use(session({ secret: 'mi_clave_secreta', resave: false, saveUninitialized: true }));

// Iniciar Passport
app.use(passport.initialize());
app.use(passport.session());

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Sirve archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Para manejar JSON en el cuerpo de POST

// Rutas de autenticación
app.use('/auth', authRoutes);

// Nueva ruta para el chat con IA
app.use('/api', chatRoutes);

// Ruta para la página del chat
app.get('/chat', (req, res) => {
  res.render('chat');
});

module.exports = app;
