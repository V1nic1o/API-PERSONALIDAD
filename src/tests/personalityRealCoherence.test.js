// src/tests/personalityRealCoherence.test.js
require('dotenv').config();
const { Pool } = require('pg');
const { calculateArchetype } = require('../services/profileService');
const { archetypes } = require('../services/profileService');

console.log('🚀 Iniciando prueba de coherencia empírica (datos reales de Neon)...\n');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    // 1️⃣ Obtenemos todos los usuarios y sus promedios
    const result = await pool.query(`
      SELECT user_id,
             AVG(openness) AS openness,
             AVG(conscientiousness) AS conscientiousness,
             AVG(extraversion) AS extraversion,
             AVG(agreeableness) AS agreeableness,
             AVG(neuroticism) AS neuroticism
      FROM profile_snapshots
      GROUP BY user_id;
    `);

    if (result.rows.length === 0) {
      console.log('⚠️ No hay snapshots para analizar.\n');
      process.exit(0);
    }

    let consistentCount = 0;

    for (const row of result.rows) {
      const profile = {
        openness: parseFloat(row.openness),
        conscientiousness: parseFloat(row.conscientiousness),
        extraversion: parseFloat(row.extraversion),
        agreeableness: parseFloat(row.agreeableness),
        neuroticism: parseFloat(row.neuroticism),
      };

      // Calculamos el arquetipo
      const archetype = calculateArchetype(profile);

      // Determinamos el rasgo promedio dominante
      const traits = Object.entries(profile);
      const topTrait = traits.sort((a, b) => b[1] - a[1])[0][0];

      // Buscamos la clave del arquetipo en el objeto
      const key = Object.keys(archetypes).find(k => archetypes[k].name === archetype.name);

      // Extraemos el rasgo base (primera parte de la clave)
      const archetypeBaseTrait = key ? key.split('-')[0] : 'default';

      const isConsistent = topTrait === archetypeBaseTrait;
      if (isConsistent) consistentCount++;

      console.log(`🧠 Usuario ${row.user_id}`);
      console.log(`   Rasgo promedio dominante: ${topTrait}`);
      console.log(`   Arquetipo calculado: ${archetype.name}`);
      console.log(`   Rasgo arquetipo: ${archetypeBaseTrait}`);
      console.log(isConsistent ? '   ✅ Coherente' : '   ⚠️ Inconsistente');
      console.log('--------------------------------');
    }

    const total = result.rows.length;
    const coherence = ((consistentCount / total) * 100).toFixed(2);

    console.log(`\n📊 Total usuarios analizados: ${total}`);
    console.log(`🎯 Coherencia empírica real: ${coherence}%`);
    console.log('✅ Valores mayores a 85% indican una calibración sólida del sistema de personalidad.\n');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await pool.end();
    console.log('🔌 Conexión cerrada.');
  }
})();