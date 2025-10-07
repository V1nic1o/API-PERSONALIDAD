// src/routes/profileRoutes.js
const express = require('express');
const { getCurrentUserProfile, getProfileHistory, updateUserProfile } = require('../controllers/profileController');
const authenticateToken = require('../middlewares/authMiddleware');
const upload = require('../config/cloudinaryConfig');

const router = express.Router();

// GET /api/profile/me
router.get('/me', authenticateToken, getCurrentUserProfile);

// GET /api/profile/history
router.get('/history', authenticateToken, getProfileHistory);

router.put('/me', authenticateToken, upload.single('profileImage'), updateUserProfile);

module.exports = router;