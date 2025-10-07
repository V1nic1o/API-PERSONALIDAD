// src/services/notificationService.js
const webpush = require('web-push');

// Configurar web-push con las claves VAPID
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Función para enviar una notificación
const sendNotification = async (subscription, payload) => {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (error) {
    console.error("Error al enviar notificación, puede que la suscripción haya expirado:", error.statusCode);
    // Aquí se podría añadir lógica para eliminar suscripciones expiradas (error 410)
  }
};

module.exports = {
  sendNotification,
};