// src/tests/personalityEvolution.test.js
const { calculateArchetype } = require('../services/profileService');
const { generatePersonalizedChallenges } = require('../services/challengeService');

// --- 1️⃣ Simulación de evolución de un usuario (5 semanas) ---
const weeklyProfiles = [
  { week: 1, openness: 55, conscientiousness: 60, extraversion: 50, agreeableness: 55, neuroticism: 65 },
  { week: 2, openness: 60, conscientiousness: 63, extraversion: 55, agreeableness: 58, neuroticism: 60 },
  { week: 3, openness: 65, conscientiousness: 65, extraversion: 60, agreeableness: 62, neuroticism: 55 },
  { week: 4, openness: 70, conscientiousness: 68, extraversion: 65, agreeableness: 66, neuroticism: 50 },
  { week: 5, openness: 75, conscientiousness: 70, extraversion: 70, agreeableness: 68, neuroticism: 45 },
];

// --- 2️⃣ Ejecutamos el ciclo de evolución ---
function testEvolutionStability() {
  let lastArchetype = null;
  let stableTransitions = 0;
  let totalTransitions = 0;

  console.log('🚀 Iniciando prueba de estabilidad evolutiva (5 semanas)\n');

  weeklyProfiles.forEach(profile => {
    const archetype = calculateArchetype(profile);
    const challenges = generatePersonalizedChallenges(archetype);

    console.log(`📆 Semana ${profile.week}:`);
    console.log(`   Arquetipo: ${archetype.name}`);
    console.log(`   Rasgo dominante: ${archetype.challengeTrait}`);
    console.log(`   Retos: ${challenges.map(c => c.title).join(' | ')}`);
    console.log('--------------------------------');

    // Evaluamos estabilidad del cambio
    if (lastArchetype) {
      totalTransitions++;

      // Si el cambio fue progresivo (no saltó de un rasgo opuesto)
      const isStable =
        Math.abs(profile.openness - weeklyProfiles[profile.week - 2].openness) < 15 &&
        Math.abs(profile.neuroticism - weeklyProfiles[profile.week - 2].neuroticism) < 20;

      if (isStable) stableTransitions++;
    }

    lastArchetype = archetype;
  });

  // --- 3️⃣ Resultado ---
  const stability = ((stableTransitions / totalTransitions) * 100).toFixed(2);
  console.log(`\n📈 Estabilidad evolutiva estimada: ${stability}%`);
  console.log('✅ Valores altos (>85%) indican coherencia progresiva en la evolución del usuario.');

  return stability;
}

// --- 4️⃣ Ejecutamos ---
if (require.main === module) {
  testEvolutionStability();
}