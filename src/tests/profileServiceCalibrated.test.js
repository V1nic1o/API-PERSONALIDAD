// src/tests/profileServiceCalibrated.test.js
require("dotenv").config();
const { calculateArchetype } = require("../services/profileService");

console.log("🚀 Iniciando prueba de calibración del nuevo profileService.js...\n");

// --- Definimos tres perfiles de prueba ---
const profiles = [
  {
    id: 1,
    desc: "Usuario equilibrado (debería devolver default)",
    data: { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 },
  },
  {
    id: 2,
    desc: "Usuario con diferencias leves (veremos si cambia según tolerancia)",
    data: { openness: 55, conscientiousness: 51, extraversion: 50, agreeableness: 49, neuroticism: 45 },
  },
  {
    id: 3,
    desc: "Usuario con rasgo dominante claro (debería devolver arquetipo específico)",
    data: { openness: 80, conscientiousness: 40, extraversion: 30, agreeableness: 35, neuroticism: 25 },
  },
];

// --- Definimos distintos niveles de sensibilidad ---
const tolerancias = [
  { empate: 0.05, diff: 0.1, label: "Original (más estricta)" },
  { empate: 0.02, diff: 0.05, label: "Alta sensibilidad" },
  { empate: 0.1, diff: 0.2, label: "Muy estricta (tolerante a empates)" },
];

(async () => {
  try {
    for (const perfil of profiles) {
      console.log(`🧠 Perfil ${perfil.id}: ${perfil.desc}`);

      for (const tol of tolerancias) {
        const result = calculateArchetype(perfil.data, tol.empate, tol.diff);
        console.log(
          `   🔧 ${tol.label.padEnd(30)} → ${result.name} (${result.challengeTrait})`
        );
      }

      console.log("-------------------------------------------\n");
    }

    console.log("✅ Prueba de calibración completada.\n");
    console.log("💡 Interpreta los resultados así:");
    console.log(" - Si el perfil 1 da 'default' en todas → OK");
    console.log(" - Si el perfil 2 cambia según la tolerancia → la calibración funciona");
    console.log(" - Si el perfil 3 da siempre un arquetipo concreto → la lógica es estable.\n");

  } catch (error) {
    console.error("❌ Error durante la prueba:", error);
  }
})();