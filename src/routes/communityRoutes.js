// src/routes/communityRoutes.js
const express = require('express');
const { getCommunityStats } = require('../controllers/communityController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Protegemos la ruta, solo usuarios logueados pueden ver las estadísticas
router.get('/stats', authenticateToken, getCommunityStats);

module.exports = router;