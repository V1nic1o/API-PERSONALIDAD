// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const { errorHandler } = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const dilemmasRoutes = require('./routes/dilemmaRoutes');
const profileRoutes = require('./routes/profileRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const communityRoutes = require('./routes/communityRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const { snapshotJob, reminderJob } = require('./jobs/snapshotJob');

const app = express();
testConnection();

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());


app.get('/api', (req, res) => {
  res.json({ message: '¡La API de Personalidad está viva y conectada! 🚀' });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/dilemmas', dilemmasRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  snapshotJob.start();
  reminderJob.start(); // Iniciamos también el nuevo job
  console.log('🕒 Tareas de snapshot (semanal) y recordatorios (diarios) programadas.');
});