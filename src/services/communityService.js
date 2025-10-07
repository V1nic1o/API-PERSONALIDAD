// src/services/communityService.js
const { pool } = require('../config/database');
const { calculateArchetype } = require('./profileService');

// Esta función obtiene todos los perfiles y calcula a qué arquetipo pertenece cada uno
async function getArchetypeDistribution() {
  const result = await pool.query('SELECT * FROM profiles');
  const allProfiles = result.rows;

  const distribution = {};

  allProfiles.forEach(profile => {
    const archetype = calculateArchetype(profile);
    if (distribution[archetype.name]) {
      distribution[archetype.name]++;
    } else {
      distribution[archetype.name] = 1;
    }
  });

  // Convertimos el conteo a porcentajes
  const totalUsers = allProfiles.length;
  if (totalUsers === 0) return {};
  
  const percentageDistribution = {};
  for (const name in distribution) {
    percentageDistribution[name] = parseFloat(((distribution[name] / totalUsers) * 100).toFixed(2));
  }
  
  return percentageDistribution;
}

module.exports = {
  getArchetypeDistribution,
};