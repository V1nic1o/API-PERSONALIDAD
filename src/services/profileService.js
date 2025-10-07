// src/services/profileService.js

// 1. Definimos nuestros arquetipos. (EXPANDIDO a las 20 combinaciones ALTO-BAJO)
const archetypes = {
  // ==========================================================
  // 1. Apertura (Openness) Alta
  // ==========================================================
  "openness-conscientiousness": {
    name: "El Visionario Creativo",
    description: "Eres una fuente de ideas innovadoras, pero a veces te cuesta llevarlas a la práctica de forma ordenada. Tu mente vuela alto, viendo posibilidades que otros no ven.",
    superpower: "Imaginación sin límites.",
    challenge: "Canalizar tu creatividad en proyectos concretos y terminados.",
    challengeTrait: "conscientiousness"
  },
  "openness-extraversion": {
    name: "El Explorador Contemplativo",
    description: "Valorizas profundamente el conocimiento y la estética, prefiriendo explorar ideas y mundos internos antes que la acción social. Tiendes a ser reservado pero mentalmente ágil.",
    superpower: "Profundidad de pensamiento e ideas originales.",
    challenge: "Compartir tus ideas y conectar con otros de forma más activa.",
    challengeTrait: "extraversion"
  },
  "openness-agreeableness": {
    name: "El Buscador Escéptico",
    description: "Tu curiosidad te lleva a cuestionar constantemente el status quo y las convenciones, lo que a veces te hace percibir como cínico o difícil de convencer. Buscas la verdad más allá de la armonía.",
    superpower: "Análisis crítico y mentalidad independiente.",
    challenge: "Aceptar las perspectivas de los demás con mayor flexibilidad.",
    challengeTrait: "agreeableness"
  },
  "openness-neuroticism": {
    name: "El Intelectual Sensible",
    description: "Tu intensa sensibilidad emocional potencia tu aprecio por el arte y las ideas complejas. Experimentas el mundo con gran profundidad, lo cual puede llevarte a sobreanalizar o preocuparte en exceso.",
    superpower: "Percepción intuitiva y emocional.",
    challenge: "Establecer límites mentales para reducir el estrés y la rumia.",
    challengeTrait: "neuroticism"
  },

  // ==========================================================
  // 2. Responsabilidad (Conscientiousness) Alta
  // ==========================================================
  "conscientiousness-openness": {
    name: "El Arquitecto Confiable",
    description: "Eres la persona en la que todos confían para que las cosas se hagan bien. Tu disciplina y orden son notables, aunque a veces te cuesta salir de la rutina y probar algo nuevo.",
    superpower: "Fiabilidad y ejecución impecable.",
    challenge: "Abrazar la espontaneidad y explorar nuevas experiencias.",
    challengeTrait: "openness"
  },
  "conscientiousness-extraversion": {
    name: "El Gestor Solitario",
    description: "Eres altamente organizado y enfocado en la tarea, pero prefieres la eficiencia del trabajo individual. Tu disciplina es interna, y la interacción social es una distracción.",
    superpower: "Concentración y eficiencia en tareas complejas.",
    challenge: "Construir redes de apoyo y delegar responsabilidades.",
    challengeTrait: "extraversion"
  },
  "conscientiousness-agreeableness": {
    name: "El Juez Riguroso",
    description: "Te adhieres a reglas y estándares altos de ética y trabajo. Valoras el orden por encima del sentimiento, y a veces tu franqueza sobre los errores puede parecer crítica o insensible.",
    superpower: "Integridad inquebrantable y alta productividad.",
    challenge: "Suavizar tu enfoque y priorizar las relaciones humanas.",
    challengeTrait: "agreeableness"
  },
  "conscientiousness-neuroticism": {
    name: "La Roca Serena",
    description: "Eres disciplinado y emocionalmente estable, una fuerza tranquila en medio del caos. Tu capacidad para mantener la calma es admirable, aunque a veces puedes pasar por alto los matices emocionales de una situación.",
    superpower: "Estabilidad y resiliencia.",
    challenge: "Conectar con tus propias emociones y las de los demás con más curiosidad.",
    challengeTrait: "neuroticism"
  },

  // ==========================================================
  // 3. Extraversión (Extraversion) Alta
  // ==========================================================
  "extraversion-openness": {
    name: "El Animador Popular",
    description: "Tu energía viene de la interacción con los demás y te enfocas en la acción social y las experiencias compartidas. A veces, la necesidad de estímulos externos te impide profundizar en ideas complejas.",
    superpower: "Liderazgo enérgico e influencia social.",
    challenge: "Dedicar tiempo a la reflexión y el autoanálisis profundo.",
    challengeTrait: "openness"
  },
  "extraversion-conscientiousness": {
    name: "El Vendedor Impulsivo",
    description: "Eres un motor de entusiasmo social, siempre buscando la próxima actividad emocionante. Sin embargo, tu alta energía a veces se traduce en falta de planificación o seguimiento de proyectos.",
    superpower: "Optimismo contagioso y capacidad de iniciar.",
    challenge: "Desarrollar la paciencia y un enfoque más metódico.",
    challengeTrait: "conscientiousness"
  },
  "extraversion-agreeableness": {
    name: "El Líder Carismático",
    description: "Tienes una energía contagiante y no tienes miedo de tomar la iniciativa. La gente te sigue naturalmente, aunque a veces tu franqueza puede ser un poco directa para otros.",
    superpower: "Inspirar y movilizar a los demás.",
    challenge: "Practicar la escucha activa y la empatía en tus interacciones.",
    challengeTrait: "agreeableness"
  },
  "extraversion-neuroticism": {
    name: "El Histrión Emocional",
    description: "Experimentas las emociones con intensidad y las expresas abiertamente. Tu mundo social es vibrante, pero tu alta reactividad emocional puede llevar a dramas o picos de ansiedad en público.",
    superpower: "Expresividad apasionada y alta visibilidad.",
    challenge: "Encontrar técnicas de regulación emocional en entornos sociales.",
    challengeTrait: "neuroticism"
  },

  // ==========================================================
  // 4. Amabilidad (Agreeableness) Alta
  // ==========================================================
  "agreeableness-openness": {
    name: "El Pacificador Práctico",
    description: "Priorizas la cooperación y la bondad por encima de la experimentación radical. Tiendes a seguir métodos probados y valores sociales establecidos, prefiriendo la estabilidad a la novedad constante.",
    superpower: "Construcción de consenso y estabilidad social.",
    challenge: "Aceptar el cambio y la exploración de ideas no convencionales.",
    challengeTrait: "openness"
  },
  "agreeableness-conscientiousness": {
    name: "El Mediador Relajado",
    description: "Tu principal meta es la armonía y la comodidad en las relaciones. Tiendes a ser flexible y dejas pasar el rigor y la organización si interfieren con la buena voluntad.",
    superpower: "Tacto diplomático y fomento de la confianza.",
    challenge: "Establecer límites personales y adherirte a planes rigurosos.",
    challengeTrait: "conscientiousness"
  },
  "agreeableness-extraversion": {
    name: "El Protector Empático",
    description: "Tienes una habilidad innata para conectar con los demás y hacer que se sientan cómodos y escuchados. Valoras la armonía, aunque a veces te cuesta un poco ser el centro de atención.",
    superpower: "Crear conexiones profundas y genuinas.",
    challenge: "Compartir tus propias ideas y opiniones con más confianza.",
    challengeTrait: "extraversion"
  },
  "agreeableness-neuroticism": {
    name: "El Altruista Angustiado",
    description: "Sientes profundamente las necesidades de los demás, pero esta sensibilidad a menudo conduce a la preocupación y la autocrítica. Te sacrificas por otros, pero te sientes agotado o ansioso.",
    superpower: "Gran compasión y dedicación a los demás.",
    challenge: "Priorizar tu bienestar emocional y practicar el autocuidado.",
    challengeTrait: "neuroticism"
  },
  
  // ==========================================================
  // 5. Neuroticismo (Neuroticism) Alto
  // ==========================================================
  "neuroticism-openness": {
    name: "El Sensitivo Racional",
    description: "Buscas el orden y la lógica para controlar tus intensas emociones. Tu ansiedad te impulsa a planificar meticulosamente para evitar desastres o imprevistos.",
    superpower: "Intuición para el riesgo y atención al detalle.",
    challenge: "Permitirte la espontaneidad y aceptar la incertidumbre de la vida.",
    challengeTrait: "openness"
  },
  "neuroticism-conscientiousness": {
    name: "El Artista Sensible",
    description: "Sientes las emociones con gran intensidad, lo que te da una profunda capacidad para la empatía y la creatividad. Sin embargo, esta sensibilidad a veces puede llevar a la preocupación y la duda.",
    superpower: "Profundidad emocional y creatividad.",
    challenge: "Construir rutinas que te den estabilidad y confianza.",
    challengeTrait: "conscientiousness"
  },
  "neuroticism-extraversion": {
    name: "El Retraído Cauteloso",
    description: "Tu ansiedad y cautela te hacen preferir entornos tranquilos y familiares. La interacción social es una fuente potencial de estrés, lo que limita tus oportunidades de crecimiento externo.",
    superpower: "Autoconocimiento y prudencia.",
    challenge: "Aceptar pequeños riesgos sociales y buscar el apoyo de tu círculo íntimo.",
    challengeTrait: "extraversion"
  },
  "neuroticism-agreeableness": {
    name: "El Desconfiado Exigente",
    description: "Eres muy crítico y cínico, usando el escepticismo como escudo contra el dolor emocional. Tiendes a dudar de las intenciones de los demás, lo que dificulta la formación de vínculos profundos.",
    superpower: "Evaluación realista de situaciones difíciles.",
    challenge: "Practicar la empatía y construir activamente la confianza en tus relaciones.",
    challengeTrait: "agreeableness"
  },

  // ==========================================================
  // Default (Bajo contraste o empate)
  // ==========================================================
  "default": {
    name: "El Individuo Equilibrado",
    description: "Tus rasgos de personalidad están en armonía, dándote una gran flexibilidad para adaptarte a diferentes situaciones. No tienes picos extremos, lo que te convierte en una persona versátil.",
    superpower: "Adaptabilidad y balance.",
    challenge: "Descubrir en qué área te gustaría destacar y profundizar.",
    challengeTrait: "openness"
  }
};

// 2. Creamos la función que calcula el arquetipo (SIN CAMBIOS)
function calculateArchetype(profile) {
  // Verificación para asegurarnos de que el perfil no es nulo
  if (!profile) {
    return archetypes['default'];
  }

  const traits = {
    openness: profile.openness,
    conscientiousness: profile.conscientiousness,
    extraversion: profile.extraversion,
    agreeableness: profile.agreeableness,
    neuroticism: profile.neuroticism,
  };

  let highestTrait = 'openness';
  let lowestTrait = 'openness';

  for (const trait in traits) {
    if (traits[trait] > traits[highestTrait]) {
      highestTrait = trait;
    }
    if (traits[trait] < traits[lowestTrait]) {
      lowestTrait = trait;
    }
  }

  // Si el rasgo más alto y el más bajo son el mismo (o muy cercanos),
  // asignamos directamente el arquetipo de equilibrio.
  if (highestTrait === lowestTrait) {
    return archetypes['default'];
  }

  const key = `${highestTrait}-${lowestTrait}`;
  
  // La clave de la lógica: Busca la nueva clave o regresa al default si no existe
  return archetypes[key] || archetypes['default'];
}

module.exports = {
  calculateArchetype,
};