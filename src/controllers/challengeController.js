// src/controllers/challengeController.js
const asyncHandler = require('express-async-handler');
const profileModel = require('../models/profileModel');
const { calculateArchetype } = require('../services/profileService');
const { getOrCreateWeeklyChallenges } = require('../services/challengeService');

const getPersonalChallenges = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  // 1) Perfil del usuario
  const profile = await profileModel.getProfileByUserId(userId);
  if (!profile) {
    res.status(404);
    throw new Error('Perfil no encontrado.');
  }

  // 2) Arquetipo
  const archetype = calculateArchetype(profile);

  // 3) Retos de la semana (persistidos)
  const challenges = await getOrCreateWeeklyChallenges(userId, archetype);

  res.status(200).json({
    message: `Retos semanales para el arquetipo: '${archetype.name}'`,
    challenges,
  });
});

module.exports = {
  getPersonalChallenges,
};