// src/services/challengeService.js

// 1. Definimos nuestro banco de retos, clasificados por rasgo.
const challengeBank = {
  openness: [
    { title: "Explora un Género Nuevo", description: "Escucha un playlist de un género musical que normalmente no escuchas." },
    { title: "Ruta Alternativa", description: "Toma un camino diferente para ir al trabajo, a la tienda o a casa." },
    { title: "Platillo Misterioso", description: "La próxima vez que comas fuera, pide algo del menú que no reconozcas o que nunca hayas probado." }
  ],
  conscientiousness: [
    { title: "Planifica Mañana", description: "Antes de terminar tu día, escribe las 3 tareas más importantes que quieres lograr mañana." },
    { title: "Cama Perfecta", description: "Haz tu cama cada mañana durante una semana. Es una pequeña victoria que empieza el día con orden." },
    { title: "Espacio Limpio", description: "Dedica 10 minutos a ordenar un solo espacio de tu casa u oficina, como tu escritorio." }
  ],
  extraversion: [
    { title: "Interacción Breve", description: "Haz un comentario o una pregunta casual a un barista, cajero o alguien con quien interactúes brevemente." },
    { title: "Inicia la Conversación", description: "Envía un mensaje a un amigo o familiar con el que no has hablado en un tiempo, solo para saludar." },
    { title: "Comparte una Idea", description: "En tu próxima reunión o conversación grupal, haz un esfuerzo consciente por compartir una de tus ideas." }
  ],
  agreeableness: [
    { title: "Cumplido Genuino", description: "Busca una oportunidad para dar un cumplido sincero a un amigo, familiar o colega." },
    { title: "Escucha Activa", description: "En tu próxima conversación, enfócate en escuchar sin interrumpir y haz una pregunta para profundizar en lo que dice la otra persona." },
    { title: "Perspectiva Diferente", description: "Piensa en alguien con quien no estás de acuerdo y dedica 5 minutos a intentar entender sinceramente su punto de vista." }
  ],
  neuroticism: [
    { title: "Pausa de 3 Minutos", description: "Si te sientes abrumado, detente y enfócate en tu respiración durante 3 minutos. Inhala lento, exhala lento." },
    { title: "Anota la Preocupación", description: "Cuando una preocupación aparezca, escríbela en un papel. A veces, sacarla de tu mente le quita poder." },
    { title: "Logro del Día", description: "Al final del día, escribe una cosa, por pequeña que sea, que hayas logrado y de la que te sientas orgulloso." }
  ]
};

// 2. Lógica para generar los retos
function generatePersonalizedChallenges(archetype) {
  const trait = archetype.challengeTrait;
  const challengesForTrait = challengeBank[trait] || [];

  if (challengesForTrait.length < 2) {
    return challengesForTrait;
  }

  // Mezclamos el array y tomamos los primeros 2 para que sean aleatorios
  const shuffled = challengesForTrait.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2);
}

module.exports = {
  generatePersonalizedChallenges,
};