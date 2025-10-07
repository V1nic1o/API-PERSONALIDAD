// src/models/notificationModel.js
const { pool } = require('../config/database');

// Guarda una nueva suscripción para un usuario
async function saveSubscription(userId, subscriptionObject) {
  const query = {
    text: 'INSERT INTO push_subscriptions(user_id, subscription_object) VALUES($1, $2) RETURNING id',
    values: [userId, subscriptionObject],
  };
  const result = await pool.query(query);
  return result.rows[0];
}

module.exports = {
  saveSubscription,
};