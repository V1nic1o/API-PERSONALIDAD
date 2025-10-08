// src/controllers/dilemmaController.js
const asyncHandler = require('express-async-handler');
const dilemmaModel = require('../models/dilemmaModel');
const aiService = require('../services/aiService.js');
const { snapshotUserNow } = require('../jobs/snapshotJob'); // ✅ Importamos la función instantánea

async function fetchDailyDilemmas(req, res) {
  const { userId } = req.user; // Obtenemos el userId del token
  try {
    // Pasamos el userId a la función del modelo
    const dilemmasWithOptions = await dilemmaModel.getDailyDilemmas(userId); 
    res.status(200).json(dilemmasWithOptions);
  } catch (error) {
    console.error('❌ Error al obtener dilemas:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

const submitAnswer = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { optionId, dilemmaId } = req.body;

  // Procesamos la respuesta (actualiza perfil + guarda elección)
  const result = await dilemmaModel.processAnswer(userId, optionId, dilemmaId);
  if (!result) {
    res.status(404);
    throw new Error("No se pudo procesar la respuesta o encontrar la información necesaria.");
  }

  const { updatedProfile, dilemma, userOption } = result;

  // ✅ Nuevo paso: crear/actualizar snapshot instantáneo
  try {
    await snapshotUserNow(userId);
    console.log(`📸 Snapshot actualizado instantáneamente para el usuario ${userId}`);
  } catch (err) {
    console.error('⚠️ No se pudo crear snapshot instantáneo:', err.message);
  }

  const feedback = await aiService.getAIPoweredFeedback(dilemma, userOption, updatedProfile);

  // Respuesta final al frontend
  res.status(200).json({
    message: 'Perfil actualizado exitosamente.',
    updatedProfile,
    feedback,
  });
});

module.exports = {
  fetchDailyDilemmas,
  submitAnswer,
};