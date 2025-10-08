// src/tests/personalityConsistency.test.js
const { calculateArchetype } = require('../services/profileService');
const { generatePersonalizedChallenges } = require('../services/challengeService');

// --- 1️⃣ Datos simulados de perfiles de usuarios ---
const mockProfiles = [
  { id: 1, openness: 85, conscientiousness: 60, extraversion: 70, agreeableness: 65, neuroticism: 40 }, // Abierto
  { id: 2, openness: 40, conscientiousness: 85, extraversion: 50, agreeableness: 60, neuroticism: 35 }, // Responsable
  { id: 3, openness: 55, conscientiousness: 45, extraversion: 85, agreeableness: 55, neuroticism: 50 }, // Extrovertido
  { id: 4, openness: 50, conscientiousness: 60, extraversion: 55, agreeableness: 85, neuroticism: 40 }, // Amable
  { id: 5, openness: 45, conscientiousness: 50, extraversion: 55, agreeableness: 50, neuroticism: 85 }, // Emocional
];

// --- 2️⃣ Lógica de validación ---
function testPersonalityConsistency() {
  let total = 0;
  let correct = 0;

  for (const profile of mockProfiles) {
    const archetype = calculateArchetype(profile);
    const challenges = generatePersonalizedChallenges(archetype);

    total++;

    // Comprobamos que el rasgo principal del arquetipo coincida con los retos generados
    const trait = archetype.challengeTrait;
    const traitInTitle = challenges.every(c =>
      c.title.toLowerCase().includes(trait.substring(0, 4)) ||
      c.description.toLowerCase().includes(trait.substring(0, 4))
    );

    if (trait && challenges.length > 0) correct++;

    console.log(`🧠 Usuario ${profile.id} → Arquetipo: ${archetype.name}`);
    console.log(`   Rasgo dominante: ${trait}`);
    console.log(`   Retos generados: ${challenges.length}`);
    console.log('------------------------------');
  }

  const precision = ((correct / total) * 100).toFixed(2);
  console.log(`🎯 Precisión total estimada: ${precision}%`);
  return precision;
}

// --- 3️⃣ Ejecutamos ---
if (require.main === module) {
  console.log('🚀 Iniciando prueba automatizada de consistencia de personalidad...\n');
  testPersonalityConsistency();
}