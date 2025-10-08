// src/services/challengeService.js
const { pool } = require('../config/database');

// 1) Banco de retos
const challengeBank = {
  openness: [
    { title: "Explora un Género Nuevo", description: "Escucha un playlist de un género musical que normalmente no escuchas." },
    { title: "Ruta Alternativa", description: "Toma un camino diferente para ir al trabajo, a la tienda o a casa." },
    { title: "Platillo Misterioso", description: "La próxima vez que comas fuera, pide algo del menú que no reconozcas o que nunca hayas probado." },
    { title: "Cine Desconocido", description: "Mira una película de un país o cultura que nunca hayas explorado antes." },
{ title: "Cambia tu Rutina", description: "Haz algo cotidiano en un orden distinto: desayuna en otro lugar o cambia tu ruta de ejercicio." },
{ title: "Aprende Algo Nuevo", description: "Dedica 20 minutos a investigar un tema completamente desconocido para ti." },
{ title: "Cocina Internacional", description: "Prepara una receta de otro país o región que nunca hayas probado." },
{ title: "Día Sin Tecnología", description: "Pasa un día sin redes sociales ni pantallas, y observa cómo cambia tu forma de pensar." },
{ title: "Mente Abierta", description: "Lee un artículo o video que contradiga algo en lo que crees y analiza sus argumentos sin juzgar." },
{ title: "Museo o Galería", description: "Visita un museo, galería o exposición aunque no sea un tema de tu interés habitual." },
{ title: "Nuevo Autor", description: "Lee un libro o cuento de un autor que no conozcas." },
{ title: "Creatividad al Azar", description: "Dibuja, escribe o crea algo sin planearlo. Deja que la intuición te guíe." },
{ title: "Idea Loca", description: "Anota 3 ideas que parezcan imposibles o locas. No importa si no son realistas, sólo diviértete soñando." },
    
  ],
  conscientiousness: [
    { title: "Planifica Mañana", description: "Antes de terminar tu día, escribe las 3 tareas más importantes que quieres lograr mañana." },
    { title: "Cama Perfecta", description: "Haz tu cama cada mañana durante una semana. Es una pequeña victoria que empieza el día con orden." },
    { title: "Espacio Limpio", description: "Dedica 10 minutos a ordenar un solo espacio de tu casa u oficina, como tu escritorio." },
    { title: "Objetivo Semanal", description: "Define un objetivo concreto para esta semana y escríbelo en un lugar visible." },
{ title: "Rutina de Mañana", description: "Despiértate 15 minutos antes y dedica ese tiempo a planificar tu día con calma." },
{ title: "Pequeña Victoria", description: "Haz una tarea que has estado postergando por días o semanas." },
{ title: "Evaluación Personal", description: "Al final del día, califica tu productividad del 1 al 10 y anota una mejora para mañana." },
{ title: "Organiza tu Semana", description: "Dedica 15 minutos a planificar tu semana en una libreta o calendario digital." },
{ title: "Sin Multitarea", description: "Durante 2 horas, enfócate en una sola tarea a la vez y evita distracciones." },
{ title: "Ahorro Diario", description: "Guarda una pequeña cantidad de dinero hoy, aunque sea simbólica." },
{ title: "Revisión de Metas", description: "Revisa tus metas personales o laborales y ajusta una de ellas para hacerla más realista." },
{ title: "Checklist Diaria", description: "Haz una lista de tareas pequeñas y táchalas una por una." },
{ title: "Pausa Reflexiva", description: "Antes de dormir, escribe una frase sobre algo que hiciste bien hoy." },
  ],
  extraversion: [
    { title: "Interacción Breve", description: "Haz un comentario o una pregunta casual a un barista, cajero o alguien con quien interactúes brevemente." },
    { title: "Inicia la Conversación", description: "Envía un mensaje a un amigo o familiar con el que no has hablado en un tiempo, solo para saludar." },
    { title: "Comparte una Idea", description: "En tu próxima reunión o conversación grupal, haz un esfuerzo consciente por compartir una de tus ideas." },
    { title: "Rompe el Hielo", description: "Saluda a alguien nuevo hoy, aunque sea brevemente." },
{ title: "Conversación Profunda", description: "Habla con un amigo sobre un tema que normalmente no tocan, como sueños o miedos." },
{ title: "Grupo Nuevo", description: "Únete a un grupo o comunidad online con intereses diferentes a los tuyos." },
{ title: "Pequeño Evento", description: "Participa en un evento o actividad social, aunque sea corto." },
{ title: "Compartir en Público", description: "Publica algo positivo o inspirador en tus redes sociales." },
{ title: "Ayuda Espontánea", description: "Ofrece ayuda a alguien sin que te la pida." },
{ title: "Charla de Café", description: "Invita a un amigo o compañero a tomar algo sin motivo especial." },
{ title: "Escucha Grupal", description: "En una conversación de grupo, escucha más de lo habitual antes de hablar." },
{ title: "Aplauso Ajeno", description: "Reconoce públicamente el logro de otra persona." },
{ title: "Energía Compartida", description: "Realiza una actividad física en grupo, como caminar o jugar algo juntos." },
  ],
  agreeableness: [
    { title: "Cumplido Genuino", description: "Busca una oportunidad para dar un cumplido sincero a un amigo, familiar o colega." },
    { title: "Escucha Activa", description: "En tu próxima conversación, enfócate en escuchar sin interrumpir y haz una pregunta para profundizar en lo que dice la otra persona." },
    { title: "Perspectiva Diferente", description: "Piensa en alguien con quien no estás de acuerdo y dedica 5 minutos a intentar entender sinceramente su punto de vista." },
    { title: "Pequeño Favor", description: "Haz algo amable por alguien sin esperar nada a cambio." },
{ title: "Empatía Silenciosa", description: "Pasa 5 minutos imaginando lo que siente alguien con quien no te llevas bien." },
{ title: "Mensaje Positivo", description: "Envía un mensaje de agradecimiento a alguien que haya influido en tu vida." },
{ title: "Ayuda Anónima", description: "Haz una buena acción sin decirle a nadie." },
{ title: "Perdón Pendiente", description: "Piensa en alguien a quien podrías perdonar y da el primer paso mentalmente." },
{ title: "Tiempo de Escucha", description: "Dedica una conversación completa a escuchar sin interrumpir." },
{ title: "Detalle Amable", description: "Escribe una nota de aprecio y déjala en un lugar inesperado para alguien." },
{ title: "Agradecimiento Diario", description: "Hoy, anota tres cosas o personas por las que te sientes agradecido." },
{ title: "Acto Solidario", description: "Ofrece tu tiempo o recursos a alguien que lo necesite." },
{ title: "Evita el Juicio", description: "Cuando alguien te irrite, respira profundo y evita reaccionar de inmediato." },
  ],
  neuroticism: [
    { title: "Pausa de 3 Minutos", description: "Si te sientes abrumado, detente y enfócate en tu respiración durante 3 minutos. Inhala lento, exhala lento." },
    { title: "Anota la Preocupación", description: "Cuando una preocupación aparezca, escríbela en un papel. A veces, sacarla de tu mente le quita poder." },
    { title: "Logro del Día", description: "Al final del día, escribe una cosa, por pequeña que sea, que hayas logrado y de la que te sientas orgulloso." },
    { title: "Diario de Calma", description: "Escribe tres cosas que te causaron estrés hoy y una forma de enfrentarlas mejor mañana." },
{ title: "Cuerpo y Mente", description: "Dedica 10 minutos a estirarte o meditar antes de dormir." },
{ title: "Música Tranquila", description: "Escucha música relajante o instrumental durante 10 minutos." },
{ title: "Desconexión Nocturna", description: "Evita revisar el celular 30 minutos antes de dormir." },
{ title: "Mantra Positivo", description: "Elige una frase que te inspire y repítela durante el día." },
{ title: "Paseo Sin Rumbo", description: "Sal a caminar sin destino y observa tu entorno sin prisa." },
{ title: "Anclaje de Gratitud", description: "Cada vez que sientas ansiedad, recuerda tres cosas buenas de tu día." },
{ title: "Ducha Consciente", description: "Toma una ducha prestando atención a cada sensación, respirando con calma." },
{ title: "Escribe para Soltar", description: "Escribe todo lo que te preocupa sin censura y luego rompe o borra el papel." },
{ title: "Respiro 4-7-8", description: "Practica la respiración 4-7-8: inhala 4 segundos, retén 7, exhala 8." },
  ]
};

// 2) Utilidad para elegir 2 retos al azar (mezcla Fisher–Yates)
function pickTwoRandom(arr) {
  if (arr.length <= 2) return arr;
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, 2);
}

// 3) Generador puro (como tenías)
function generatePersonalizedChallenges(archetype) {
  const trait = archetype.challengeTrait;
  const candidates = challengeBank[trait] || [];
  return pickTwoRandom(candidates);
}

// 4) Persistencia semanal (GT): lunes 00:00 como inicio de semana
// Nota: date_trunc('week', ...) en Postgres usa ISO (lunes) como inicio.
// Usamos la zona 'America/Guatemala' para alinear con tu app.
const WEEK_START_SQL = "date_trunc('week', (NOW() AT TIME ZONE 'America/Guatemala'))::date";

async function getOrCreateWeeklyChallenges(userId, archetype) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 4.1) Intentamos leer lo ya existente para esta semana
    const selectQuery = `
      SELECT challenges
      FROM user_challenges
      WHERE user_id = $1
        AND week_start = ${WEEK_START_SQL}
      LIMIT 1;
    `;
    const existing = await client.query(selectQuery, [userId]);

    if (existing.rowCount > 0) {
      await client.query('COMMIT');
      return existing.rows[0].challenges;
    }

    // 4.2) Si no hay, generamos y tratamos de insertar (idempotente)
    const newChallenges = generatePersonalizedChallenges(archetype);

    const insertQuery = `
      INSERT INTO user_challenges (user_id, week_start, challenges)
      VALUES ($1, ${WEEK_START_SQL}, $2)
      ON CONFLICT (user_id, week_start) DO NOTHING;
    `;
    await client.query(insertQuery, [userId, JSON.stringify(newChallenges)]);

    // 4.3) Releemos para devolver lo que quedó persistido (maneja concurrencia)
    const after = await client.query(selectQuery, [userId]);

    await client.query('COMMIT');
    return after.rows[0]?.challenges || newChallenges;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  challengeBank,
  generatePersonalizedChallenges,
  getOrCreateWeeklyChallenges,
};