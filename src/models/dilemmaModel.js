// src/models/dilemmaModel.js
const { pool } = require('../config/database');

async function getDailyDilemmas(userId) {
  // --- INICIO DE LA CORRECCIÓN ---

  // Definimos el tamaño de la sesión diaria
  const DAILY_SESSION_SIZE = 3;

  // 1. Obtenemos los dilemas que el usuario YA respondió hoy.
  const answeredDilemmasQuery = {
    text: `
      SELECT o.dilemma_id FROM answers a
      JOIN options o ON a.option_id = o.id
      WHERE a.user_id = $1 AND a.answered_at >= date_trunc('day', NOW() AT TIME ZONE 'America/Guatemala');
    `,
    values: [userId],
  };
  const answeredResult = await pool.query(answeredDilemmasQuery);
  // Creamos un array de IDs ya respondidos, ej: [10, 25]
  const answeredDilemmaIds = answeredResult.rows.map(row => row.dilemma_id);

  // 2. Calculamos cuántos dilemas nuevos necesitamos para completar la sesión
  const remainingCount = DAILY_SESSION_SIZE - answeredDilemmaIds.length;

  let pendingDilemmas = [];
  if (remainingCount > 0) {
    // 3. Buscamos N dilemas nuevos (que no estén en la lista de respondidos)
    const pendingDilemmasQuery = {
      text: `
        SELECT d.id, d.question_text, json_agg(json_build_object('id', o.id, 'text', o.option_text)) as options
        FROM dilemmas d
        JOIN options o ON d.id = o.dilemma_id
        WHERE d.id <> ALL($1::int[]) -- Excluye los IDs ya respondidos
        GROUP BY d.id
        ORDER BY RANDOM()
        LIMIT $2;
      `,
      values: [answeredDilemmaIds, remainingCount],
    };
    const pendingResult = await pool.query(pendingDilemmasQuery);
    pendingDilemmas = pendingResult.rows;
  }
  
  // 4. Devolvemos el resultado correcto
  return {
    pendingDilemmas: pendingDilemmas,
    totalCount: DAILY_SESSION_SIZE, // El total siempre es el tamaño de la sesión
  };
  // --- FIN DE LA CORRECCIÓN ---
}


async function processAnswer(userId, optionId, dilemmaId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const optionQuery = 'SELECT option_text, effect_json FROM options WHERE id = $1';
    const optionResult = await client.query(optionQuery, [optionId]);
    if (optionResult.rows.length === 0) throw new Error('Opción no encontrada');
    
    const userOption = { option_text: optionResult.rows[0].option_text };
let effect = optionResult.rows[0].effect_json;

// 🧠 --- Normalización y precisión mejorada ---
// 1. Validar que el efecto tenga estructura válida
if (!effect || typeof effect !== 'object' || Object.keys(effect).length === 0) {
  throw new Error('Efecto inválido o vacío en la opción seleccionada.');
}

// 2. Normalizamos valores extremos para mantener estabilidad psicológica
//    Evita que un solo dilema distorsione el perfil completo
const normalizedEffect = {};
for (const key in effect) {
  if (typeof effect[key] !== 'number') continue;

  // Limitar cada cambio entre -0.3 y 0.3 (escala óptima de impacto)
  const value = Math.max(-0.3, Math.min(0.3, effect[key]));

  // Opcional: suavizar pequeños efectos para que no sean insignificantes
  normalizedEffect[key] =
    Math.abs(value) < 0.05 ? 0 : parseFloat(value.toFixed(3)); // Redondeo a 3 decimales
}

// 3. Verificación de seguridad (puedes dejarlo como log o alerta)
if (Object.keys(normalizedEffect).length === 0) {
  console.warn('Advertencia: la opción no tiene efectos válidos para aplicar.');
}

// --- Fin de normalización ---
// 🔁 Sustituimos el objeto original por el normalizado
effect = normalizedEffect;

    const dilemmaQuery = 'SELECT question_text FROM dilemmas WHERE id = $1';
    const dilemmaResult = await client.query(dilemmaQuery, [dilemmaId]);
    if (dilemmaResult.rows.length === 0) throw new Error('Dilema no encontrado');

    const dilemma = dilemmaResult.rows[0];

    const updates = Object.keys(effect);
    const setClauses = updates.map((key, index) => `${key} = ${key} + $${index + 2}`).join(', ');
    const values = updates.map(key => effect[key]);

    const updateProfileQuery = `
      UPDATE profiles
      SET ${setClauses}, last_updated = NOW()
      WHERE user_id = $1
      RETURNING *;
    `;
    const profileResult = await client.query(updateProfileQuery, [userId, ...values]);
    const updatedProfile = profileResult.rows[0];

    const logAnswerQuery = 'INSERT INTO answers(user_id, option_id) VALUES($1, $2)';
    await client.query(logAnswerQuery, [userId, optionId]);

    await client.query('COMMIT');
    
    return { updatedProfile, dilemma, userOption };

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  getDailyDilemmas,
  processAnswer,
};