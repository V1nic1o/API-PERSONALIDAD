// scripts/seed.js
require('dotenv').config({ path: './.env' }); // Asegúrate de que cargue las variables de entorno
const { pool } = require('../src/config/database');

const dilemmasData = [
  {
    question_text: "Es viernes por la noche después de una semana agotadora. ¿Qué haces?",
    trait_measured: "extraversion",
    options: [
      { option_text: "Organizo una salida con varios amigos a un lugar concurrido.", effect_json: { "extraversion": 7, "openness": 2 } },
      { option_text: "Prefiero quedarme en casa, pedir algo de comer y ver una película.", effect_json: { "extraversion": -7 } },
      { option_text: "Busco un plan tranquilo con mi amigo más cercano o mi pareja.", effect_json: { "extraversion": -2, "agreeableness": 4 } }
    ]
  },
  {
    question_text: "Tu equipo de trabajo tiene una fecha de entrega importante. ¿Cómo abordas la tarea?",
    trait_measured: "conscientiousness",
    options: [
      { option_text: "Creo un plan detallado con fechas límite para cada subtarea y lo sigo rigurosamente.", effect_json: { "conscientiousness": 8, "neuroticism": -2 } },
      { option_text: "Confío en mi capacidad para resolverlo sobre la marcha, trabajando intensamente cuando se acerca la fecha.", effect_json: { "conscientiousness": -7, "neuroticism": 3 } },
      { option_text: "Divido el trabajo entre todos y confío en que cada uno hará su parte a tiempo.", effect_json: { "conscientiousness": 3, "agreeableness": 5 } }
    ]
  },
  {
    question_text: "Estás de vacaciones y ves un restaurante local con comida exótica que nunca has probado. ¿Qué haces?",
    trait_measured: "openness",
    options: [
      { option_text: "Entro sin dudarlo. ¡Viajar es para experimentar cosas nuevas!", effect_json: { "openness": 9 } },
      { option_text: "Busco reseñas en línea antes de decidir. Me gusta la novedad, pero con un poco de seguridad.", effect_json: { "openness": 4, "conscientiousness": 3 } },
      { option_text: "Prefiero buscar un lugar de comida que ya conozco y sé que me gusta.", effect_json: { "openness": -8 } }
    ]
  },
  {
    question_text: "Un amigo cercano te cancela un plan a último minuto. ¿Cómo reaccionas?",
    trait_measured: "agreeableness",
    options: [
      { option_text: "Le digo que no se preocupe, que entiendo que a veces surgen imprevistos.", effect_json: { "agreeableness": 7, "neuroticism": -3 } },
      { option_text: "Me siento un poco molesto y se lo hago saber, aunque intento no ser muy duro.", effect_json: { "agreeableness": -5, "neuroticism": 4 } },
      { option_text: "Busco otro plan inmediatamente para no desperdiciar el tiempo.", effect_json: { "agreeableness": 1, "extraversion": 3 } }
    ]
  }
];

async function seedDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Limpiamos las tablas para evitar duplicados si se corre el script de nuevo
    await client.query('TRUNCATE TABLE options, dilemmas RESTART IDENTITY CASCADE');
    console.log('Tablas limpiadas.');

    for (const dilemma of dilemmasData) {
      // Insertar el dilema
      const dilemmaInsertQuery = 'INSERT INTO dilemmas(question_text, trait_measured) VALUES($1, $2) RETURNING id';
      const dilemmaResult = await client.query(dilemmaInsertQuery, [dilemma.question_text, dilemma.trait_measured]);
      const newDilemmaId = dilemmaResult.rows[0].id;
      
      // Insertar las opciones asociadas
      for (const option of dilemma.options) {
        const optionInsertQuery = 'INSERT INTO options(dilemma_id, option_text, effect_json) VALUES($1, $2, $3)';
        await client.query(optionInsertQuery, [newDilemmaId, option.option_text, option.effect_json]);
      }
    }

    await client.query('COMMIT');
    console.log('✅ Base de datos poblada con éxito.');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al poblar la base de datos:', error);
  } finally {
    client.release();
    pool.end(); // Cerramos la conexión
  }
}

seedDatabase();