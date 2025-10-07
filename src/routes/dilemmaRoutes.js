// src/routes/dilemmaRoutes.js
const express = require('express');
const { fetchDailyDilemmas, submitAnswer } = require('../controllers/dilemmaController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Todas las rutas aquí requieren un token de autenticación válido
router.use(authenticateToken);

// GET /api/dilemmas/daily - Obtiene los dilemas del día
router.get('/daily', fetchDailyDilemmas);

// POST /api/dilemmas/answer - Envía una respuesta
router.post('/answer', submitAnswer);

module.exports = router;