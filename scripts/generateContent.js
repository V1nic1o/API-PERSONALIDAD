// scripts/generateContent.js
require('dotenv').config({ path: './.env' });
const OpenAI = require('openai');
const { pool } = require('../src/config/database');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateAndInsertDilemmas(trait, count) {
  console.log(`\n🤖 Solicitando a la IA que genere ${count} dilemas para el rasgo: '${trait}'...`);
  const prompt = `
    Eres un psicólogo experto en el modelo Big Five. Tu tarea es generar contenido para una aplicación de análisis de personalidad.
    Genera un array de JSON con ${count} objetos. Cada objeto debe ser un dilema único que mida principalmente el rasgo de personalidad "${trait}".

    *** IMPORTANTE: Todo el texto generado, incluyendo 'question_text' y 'option_text', debe estar en idioma español. ***

    La estructura de cada objeto JSON debe ser EXACTAMENTE la siguiente:
    {
      "question_text": "El texto de la situación o dilema en español.",
      "trait_measured": "${trait}",
      "options": [
        { "option_text": "El texto de la primera opción en español.", "effect_json": { /* ... */ } },
        { "option_text": "El texto de la segunda opción en español.", "effect_json": { /* ... */ } },
        { "option_text": "El texto de la tercera opción en español.", "effect_json": { /* ... */ } }
      ]
    }

    Asegúrate de que los valores en 'effect_json' sean numéricos y representen un impacto lógico en la personalidad. Responde únicamente con el array de JSON, sin texto adicional.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [{ role: "user", content: prompt }],
    });
    const responseText = response.choices[0].message.content;
    const cleanJsonText = responseText.replace(/```json/g, '').replace(/```/g, '');
    const dilemmasData = JSON.parse(cleanJsonText);
    if (!dilemmasData || !Array.isArray(dilemmasData) || dilemmasData.length === 0) {
      console.log(`❌ La IA no devolvió un array de dilemas válidos para '${trait}'.`);
      return;
    }
    console.log(`🧠 IA generó ${dilemmasData.length} dilemas para '${trait}'. Insertando en la base de datos...`);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const dilemma of dilemmasData) {
        const dilemmaInsertQuery = 'INSERT INTO dilemmas(question_text, trait_measured) VALUES($1, $2) RETURNING id';
        const dilemmaResult = await client.query(dilemmaInsertQuery, [dilemma.question_text, dilemma.trait_measured]);
        const newDilemmaId = dilemmaResult.rows[0].id;
        for (const option of dilemma.options) {
          const optionInsertQuery = 'INSERT INTO options(dilemma_id, option_text, effect_json) VALUES($1, $2, $3)';
          await client.query(optionInsertQuery, [newDilemmaId, option.option_text, option.effect_json]);
        }
      }
      await client.query('COMMIT');
      console.log(`✅ ¡Éxito! Se añadieron ${dilemmasData.length} nuevos dilemas para '${trait}'.`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`❌ Error al insertar los dilemas para '${trait}':`, error);
    } finally {
      client.release();
    }
  } catch (aiError) {
    console.error(`❌ Error fatal llamando a la API de OpenAI para '${trait}':`, aiError);
  }
}
async function run() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Uso: node scripts/generateContent.js [rasgo] [cantidad]');
    console.log('O para modo masivo: node scripts/generateContent.js massive [cantidad por rasgo]');
    process.exit(1);
  }
  const command = args[0];
  const count = parseInt(args[1], 10);
  if (command === 'massive') {
    const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    console.log(`🔥 Iniciando generación masiva. ${count} dilemas por cada uno de los ${traits.length} rasgos...`);
    for (const trait of traits) {
      await generateAndInsertDilemmas(trait, count);
    }
    console.log('\n🎉 Proceso de generación masiva completado.');
  } else {
    await generateAndInsertDilemmas(command, count);
  }
  await pool.end();
}
run();