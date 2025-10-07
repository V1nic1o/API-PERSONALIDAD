// src/validators/authValidator.js
const { body, validationResult } = require('express-validator');

// Reglas para el endpoint de registro
const registerRules = () => {
  return [
    // El email debe ser un email válido
    body('email')
      .isEmail()
      .withMessage('Por favor, introduce un correo electrónico válido.')
      .normalizeEmail(),
    // La contraseña debe tener al menos 8 caracteres
    body('password')
      .isLength({ min: 8 })
      .withMessage('La contraseña debe tener al menos 8 caracteres.'),
  ];
};

// Reglas para el endpoint de login
const loginRules = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Por favor, introduce un correo electrónico válido.')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('La contraseña no puede estar vacía.'),
  ];
};

// Middleware que ejecuta la validación
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); // No hay errores, continuamos
  }

  // Si hay errores, los extraemos y los enviamos como respuesta
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  registerRules,
  loginRules,
  validate,
};