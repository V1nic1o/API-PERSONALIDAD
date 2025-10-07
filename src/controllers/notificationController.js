// src/controllers/notificationController.js
const asyncHandler = require('express-async-handler');
const notificationModel = require('../models/notificationModel');

// Guarda la suscripción del usuario en la BD
const subscribe = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const subscription = req.body;

  if (!subscription || !subscription.endpoint) {
    res.status(400);
    throw new Error("El objeto de suscripción es inválido.");
  }

  await notificationModel.saveSubscription(userId, subscription);

  res.status(201).json({ message: "Suscripción guardada con éxito." });
});

module.exports = {
  subscribe,
};