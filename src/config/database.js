// src/config/database.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido por Neon para conexiones SSL
  }
});

// Función para probar la conexión
async function testConnection() {
  try {
    await pool.query('SELECT NOW()'); // Consulta simple para verificar la conexión
    console.log('Conexión a la base de datos establecida con éxito. ✅');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
}

// Exportamos el pool para poder hacer consultas desde otros archivos
module.exports = {
  pool,
  testConnection
};