// src/routes/challengeRoutes.js
const express = require('express');
const { getPersonalChallenges } = require('../controllers/challengeController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Protegemos la ruta, solo usuarios logueados pueden acceder
router.get('/personal', authenticateToken, getPersonalChallenges);

module.exports = router;