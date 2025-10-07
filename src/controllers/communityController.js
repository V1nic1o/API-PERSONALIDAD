// src/controllers/communityController.js
const asyncHandler = require('express-async-handler');
const communityModel = require('../models/communityModel');
const profileModel = require('../models/profileModel');
const communityService = require('../services/communityService');

const getCommunityStats = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  // 1. Obtenemos el perfil del usuario actual para comparar
  const userProfile = await profileModel.getProfileByUserId(userId);
  if (!userProfile) {
    res.status(404);
    throw new Error('Perfil de usuario no encontrado.');
  }

  // 2. Obtenemos las estadísticas generales de la comunidad
  const overallStats = await communityModel.getOverallStats();
  const totalUsers = parseInt(overallStats.total_users, 10);

  // 3. Calculamos los percentiles para el usuario actual
  const userPercentiles = {};
  const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];

  for (const trait of traits) {
    const countLower = await communityModel.countUsersWithLowerScore(trait, userProfile[trait]);
    if (totalUsers > 0) {
      userPercentiles[trait] = parseFloat(((countLower / totalUsers) * 100).toFixed(2));
    } else {
      userPercentiles[trait] = 100; // Si es el único usuario, está en el percentil 100
    }
  }

  // 4. Obtenemos la distribución de arquetipos
  const archetypeDistribution = await communityService.getArchetypeDistribution();

  res.status(200).json({
    userPercentiles,
    archetypeDistribution,
    communityAverages: {
      openness: parseFloat(overallStats.avg_openness).toFixed(2),
      conscientiousness: parseFloat(overallStats.avg_conscientiousness).toFixed(2),
      extraversion: parseFloat(overallStats.avg_extraversion).toFixed(2),
      agreeableness: parseFloat(overallStats.avg_agreeableness).toFixed(2),
      neuroticism: parseFloat(overallStats.avg_neuroticism).toFixed(2),
    },
    totalUsers: totalUsers,
  });
});

module.exports = {
  getCommunityStats,
};