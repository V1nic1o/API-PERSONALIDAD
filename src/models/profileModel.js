// src/models/profileModel.js
const { pool } = require('../config/database');

async function getProfileByUserId(userId) {
  const query = {
    text: `
      SELECT 
        p.*, 
        u.first_name, 
        u.last_name, 
        u.email,
        u.profile_image_url,
        u.date_of_birth -- ¡AÑADIMOS LA LÍNEA QUE FALTABA!
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = $1;
    `,
    values: [userId],
  };
  
  const result = await pool.query(query);
  return result.rows[0];
}

async function getProfileHistoryByUserId(userId) {
  const query = {
    text: 'SELECT * FROM profile_snapshots WHERE user_id = $1 ORDER BY snapshot_date ASC',
    values: [userId],
  };
  const result = await pool.query(query);
  return result.rows;
}

async function updateUserProfile(userId, { firstName, lastName, dateOfBirth, profileImageUrl }) {
  const fields = [];
  const values = [];
  let queryIndex = 1;

  if (firstName !== undefined) {
    fields.push(`first_name = $${queryIndex++}`);
    values.push(firstName);
  }
  if (lastName !== undefined) {
    fields.push(`last_name = $${queryIndex++}`);
    values.push(lastName);
  }
  if (dateOfBirth !== undefined) {
    fields.push(`date_of_birth = $${queryIndex++}`);
    values.push(dateOfBirth);
  }
  if (profileImageUrl !== undefined) {
    fields.push(`profile_image_url = $${queryIndex++}`);
    values.push(profileImageUrl);
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(userId);
  const query = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE id = $${queryIndex}
    RETURNING id, email, first_name, last_name, date_of_birth, profile_image_url;
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
}

module.exports = {
  getProfileByUserId,
  getProfileHistoryByUserId,
  updateUserProfile,
};