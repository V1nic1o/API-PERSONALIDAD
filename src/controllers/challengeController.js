// src/controllers/challengeController.js
const asyncHandler = require('express-async-handler');
const profileModel = require('../models/profileModel');
const { calculateArchetype } = require('../services/profileService');
const { generatePersonalizedChallenges } = require('../services/challengeService');

const getPersonalChallenges = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  // 1. Obtenemos el perfil del usuario para saber su arquetipo
  const profile = await profileModel.getProfileByUserId(userId);
  if (!profile) {
    res.status(404);
    throw new Error('Perfil no encontrado.');
  }

  // 2. Calculamos su arquetipo
  const archetype = calculateArchetype(profile);

  // 3. Generamos retos basados en el arquetipo
  const challenges = generatePersonalizedChallenges(archetype);

  res.status(200).json({
    message: `Retos personalizados para el arquetipo: '${archetype.name}'`,
    challenges,
  });
});

module.exports = {
  getPersonalChallenges,
};