// src/routes/notificationRoutes.js
const express = require('express');
const { subscribe } = require('../controllers/notificationController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para que el frontend guarde su suscripción
router.post('/subscribe', authenticateToken, subscribe);

module.exports = router;