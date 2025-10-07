// src/services/aiService.js
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getAIPoweredFeedback(dilemma, userOption, userProfile) {
  // Construimos el prompt. Esta es la parte más importante.
  // Le damos a la IA un rol, el contexto y lo que esperamos que haga.
  const prompt = `
    Actúa como un coach de desarrollo personal, amigable y perspicaz. 
    Un usuario acaba de enfrentarse a una situación y ha tomado una decisión.

    **Situación:** "${dilemma.question_text}"
    **Decisión del usuario:** "${userOption.option_text}"

    **Perfil de personalidad actual del usuario (Big Five):**
    - Apertura: ${userProfile.openness}
    - Responsabilidad: ${userProfile.conscientiousness}
    - Extraversión: ${userProfile.extraversion}
    - Amabilidad: ${userProfile.agreeableness}
    - Neuroticismo: ${userProfile.neuroticism}

    Basado en su decisión y en el contexto de su perfil, genera una reflexión corta (1-2 frases, máximo 40 palabras), positiva y útil. La reflexión debe ayudar al usuario a entender cómo esta pequeña decisión refleja una parte de su carácter. Habla en segunda persona (ej. "Tu elección demuestra...").
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Modelo rápido y eficiente
      messages: [{ role: "user", content: prompt }],
      max_tokens: 70, // Limita la longitud de la respuesta
      temperature: 0.7, // Un valor balanceado para respuestas creativas pero no demasiado aleatorias
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error al obtener feedback de OpenAI:", error);
    // En caso de error con la IA, devolvemos un mensaje genérico para no interrumpir la experiencia.
    return "Cada decisión que tomas es un paso más en tu camino de autoconocimiento.";
  }
}

module.exports = {
  getAIPoweredFeedback,
};