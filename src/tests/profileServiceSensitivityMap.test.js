// src/tests/profileServiceSensitivityMap.test.js
require("dotenv").config();
const chalk = require("chalk");
const { calculateArchetype } = require("../services/profileService");

// --- Versiones seguras para cualquier versión de chalk ---
const cyan = chalk.cyan || ((t) => t);
const green = chalk.green || ((t) => t);
const yellow = chalk.yellow || ((t) => t);
const red = chalk.red || ((t) => t);
const bold = chalk.bold || ((t) => t);
const gray = chalk.gray || ((t) => t);
const white = chalk.white || ((t) => t);

console.log(cyan("\n🚀 Iniciando mapa de sensibilidad del motor de personalidad...\n"));

// === Perfiles de prueba simulados (de distintos tipos de usuarios) ===
const profiles = [
  { id: 1, name: "Equilibrado", traits: { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 } },
  { id: 2, name: "Leve Diferencia", traits: { openness: 56, conscientiousness: 54, extraversion: 52, agreeableness: 51, neuroticism: 49 } },
  { id: 3, name: "Dominante en Apertura", traits: { openness: 80, conscientiousness: 45, extraversion: 40, agreeableness: 42, neuroticism: 35 } },
  { id: 4, name: "Dominante en Responsabilidad", traits: { openness: 40, conscientiousness: 82, extraversion: 50, agreeableness: 48, neuroticism: 45 } },
  { id: 5, name: "Dominante en Neuroticismo", traits: { openness: 40, conscientiousness: 45, extraversion: 35, agreeableness: 38, neuroticism: 80 } },
];

// === Rango de tolerancias a probar ===
const empateVals = [0.01, 0.03, 0.05, 0.07, 0.1];
const diffVals = [0.05, 0.1, 0.15, 0.2];

// === Función principal ===
(async () => {
  const resultados = [];

  for (const emp of empateVals) {
    for (const diff of diffVals) {
      let cambios = 0;
      let consistentes = 0;

      for (const perfil of profiles) {
        const base = calculateArchetype(perfil.traits, 0.05, 0.1);
        const actual = calculateArchetype(perfil.traits, emp, diff);
        if (actual.name !== base.name) cambios++;
        else consistentes++;
      }

      const estabilidad = ((consistentes / profiles.length) * 100).toFixed(2);
      resultados.push({ emp, diff, estabilidad, cambios });
    }
  }

  // === Mostramos resultados ===
  console.log(bold("📊 Resultados del mapa de sensibilidad:\n"));
  resultados.forEach(r => {
    const color = r.estabilidad >= 90 ? green : r.estabilidad >= 70 ? yellow : red;
    console.log(color(`Empate=${r.emp.toFixed(2)} | Diff=${r.diff.toFixed(2)} → Estabilidad=${r.estabilidad}% (${r.cambios} cambios)`));
  });

  // === Identificamos la combinación más coherente ===
  const mejor = resultados.reduce((a, b) => (b.estabilidad > a.estabilidad ? b : a));
  console.log(bold(cyan(`\n🏆 Mejor combinación encontrada:`)));
  console.log(white(`Empate=${mejor.emp} | Diff=${mejor.diff} → Estabilidad=${mejor.estabilidad}%`));

  console.log(gray("\n💡 Recomendación: usa esos valores en calculateArchetype() como umbrales por defecto.\n"));
})();