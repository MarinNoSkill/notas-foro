const express = require('express');
const router = express.Router();
const passport = require('passport');
const { showLoginForm, showRegisterForm, registerUser, loginUser } = require('../controllers/authController');

// Ruta GET para mostrar el formulario de inicio de sesión
router.get('/login', showLoginForm);

// Ruta GET para mostrar el formulario de registro
router.get('/register', showRegisterForm);  // Ruta para mostrar el formulario de registro

// Ruta POST para registrar un usuario
router.post('/register', registerUser);  // Ruta para procesar el registro de usuario
// Ruta POST para iniciar sesión
router.post('/login', loginUser);  // Nueva ruta para el inicio de sesión

// Ruta de autenticación con Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Ruta de callback de Google después de la autenticación
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login' }),
  (req, res) => {
    // Redirige al dashboard o página principal después de un inicio de sesión exitoso
    res.redirect('/dashboard');
  }
);

module.exports = router;
