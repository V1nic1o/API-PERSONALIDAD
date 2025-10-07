// src/routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
// Importamos nuestras nuevas reglas y el middleware de validación
const { registerRules, loginRules, validate } = require('../validators/authValidator');

const router = express.Router();

// Aplicamos las reglas de registro antes de que llegue al controlador.
// La ruta ahora tiene 3 partes: la ruta, las reglas y el controlador.
router.post('/register', registerRules(), validate, registerUser);

// Aplicamos las reglas de inicio de sesión.
router.post('/login', loginRules(), validate, loginUser);

module.exports = router;