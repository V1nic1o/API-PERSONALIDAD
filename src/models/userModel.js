// src/models/userModel.js
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

// Función para crear un nuevo usuario y su perfil en una transacción
async function createUser(email, password) {
  const client = await pool.connect(); // Obtenemos un cliente del pool para la transacción

  try {
    await client.query('BEGIN'); // Iniciamos la transacción

    // 1. Encriptamos la contraseña y creamos el usuario
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userQuery = {
      text: 'INSERT INTO users(email, password_hash) VALUES($1, $2) RETURNING id, email',
      values: [email, passwordHash],
    };
    const userResult = await client.query(userQuery);
    const newUser = userResult.rows[0];

    // 2. Creamos el perfil asociado a ese nuevo usuario
    const profileQuery = {
      text: 'INSERT INTO profiles(user_id) VALUES($1)',
      values: [newUser.id],
    };
    await client.query(profileQuery);

    await client.query('COMMIT'); // Si todo fue bien, confirmamos los cambios
    return newUser;

  } catch (error) {
    await client.query('ROLLBACK'); // Si algo falló, revertimos todo
    throw error; // Propagamos el error para que el controlador lo maneje
  } finally {
    client.release(); // Liberamos el cliente de vuelta al pool
  }
}

// Función para encontrar un usuario por su email (sin cambios)
async function findUserByEmail(email) {
  const query = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email],
  };
  const result = await pool.query(query);
  return result.rows[0];
}

module.exports = {
  createUser,
  findUserByEmail,
};