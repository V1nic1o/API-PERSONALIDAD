// src/models/communityModel.js
const { pool } = require('../config/database');

// Obtiene estadísticas generales de todos los perfiles
async function getOverallStats() {
  // Esta consulta calcula el promedio y la desviación estándar para cada rasgo
  const statsQuery = `
    SELECT
      AVG(openness) as avg_openness,
      STDDEV(openness) as stddev_openness,
      AVG(conscientiousness) as avg_conscientiousness,
      STDDEV(conscientiousness) as stddev_conscientiousness,
      AVG(extraversion) as avg_extraversion,
      STDDEV(extraversion) as stddev_extraversion,
      AVG(agreeableness) as avg_agreeableness,
      STDDEV(agreeableness) as stddev_agreeableness,
      AVG(neuroticism) as avg_neuroticism,
      STDDEV(neuroticism) as stddev_neuroticism,
      COUNT(*) as total_users
    FROM profiles;
  `;
  const result = await pool.query(statsQuery);
  return result.rows[0];
}

// Cuenta cuántos usuarios tienen un puntaje MENOR al del usuario actual para un rasgo específico
async function countUsersWithLowerScore(trait, score) {
  // Usamos $1 y $2 para pasar los argumentos de forma segura y evitar inyección SQL
  const query = {
    text: `SELECT COUNT(*) FROM profiles WHERE ${trait} < $1`,
    values: [score],
  };
  const result = await pool.query(query);
  return parseInt(result.rows[0].count, 10);
}

module.exports = {
  getOverallStats,
  countUsersWithLowerScore,
};