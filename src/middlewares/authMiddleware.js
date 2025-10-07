// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.sendStatus(401); // No hay token, no autorizado
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key', (err, user) => {
    if (err) {
      return res.sendStatus(403); // Token inválido o expirado
    }
    req.user = user; // Guardamos la info del usuario (ej. userId) en el objeto de la petición
    next(); // El usuario está verificado, puede continuar
  });
}

module.exports = authenticateToken;