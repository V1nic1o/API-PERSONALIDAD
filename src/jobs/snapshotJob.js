// src/jobs/snapshotJob.js
const cron = require('node-cron');
const { pool } = require('../config/database');
const { sendNotification } = require('../services/notificationService');

// --- TAREA DE SNAPSHOTS SEMANAL (Funcionalidad existente) ---

const takeProfileSnapshots = async () => {
  console.log('📸 Ejecutando tarea programada: Tomando snapshots de perfiles...');
  const client = await pool.connect();
  try {
    const profilesResult = await client.query('SELECT * FROM profiles');
    const profiles = profilesResult.rows;

    if (profiles.length === 0) {
      console.log('No hay perfiles para tomar snapshots. Tarea finalizada.');
      return;
    }

    let snapshotsCreated = 0;
    for (const profile of profiles) {
      const insertQuery = `
        INSERT INTO profile_snapshots (
          user_id, snapshot_date, openness, conscientiousness, extraversion, agreeableness, neuroticism
        ) VALUES (
          $1, CURRENT_DATE, $2, $3, $4, $5, $6
        ) ON CONFLICT (user_id, snapshot_date) DO NOTHING;
      `;
      const result = await client.query(insertQuery, [
        profile.user_id,
        profile.openness,
        profile.conscientiousness,
        profile.extraversion,
        profile.agreeableness,
        profile.neuroticism,
      ]);
      if (result.rowCount > 0) {
        snapshotsCreated++;
      }
    }
    console.log(`✅ Tarea de snapshots completada. ${snapshotsCreated} nuevos snapshots creados.`);

  } catch (error) {
    console.error('❌ Error durante la tarea de snapshots:', error);
  } finally {
    client.release();
  }
};

// Se programa la tarea para ejecutarse una vez a la semana (domingos a las 2:00 AM)
const snapshotJob = cron.schedule('0 2 * * 0', takeProfileSnapshots, {
  scheduled: false, // Lo dejamos en false para que no inicie automáticamente al importar
  timezone: "America/Guatemala"
});

// --- FIN DE LA TAREA DE SNAPSHOTS ---

// --- NUEVA TAREA DE RECORDATORIOS DIARIOS ---

const sendDailyReminders = async () => {
  console.log('⏰ Ejecutando tarea de recordatorios diarios...');
  const client = await pool.connect();
  try {
    // 1. Encontramos a los usuarios que NO han respondido hoy
    const usersToNotifyQuery = `
      SELECT id FROM users WHERE id NOT IN (
        SELECT DISTINCT user_id FROM answers WHERE DATE(answered_at) = CURRENT_DATE
      );
    `;
    const usersResult = await client.query(usersToNotifyQuery);
    const usersToNotify = usersResult.rows;

    if (usersToNotify.length === 0) {
      console.log('Todos los usuarios están al día. No se envían recordatorios.');
      return;
    }

    const userIds = usersToNotify.map(u => u.id);
    
    // 2. Obtenemos las suscripciones de esos usuarios
    const subsQuery = `SELECT * FROM push_subscriptions WHERE user_id = ANY($1::int[])`;
    const subsResult = await client.query(subsQuery, [userIds]);
    const subscriptions = subsResult.rows;

    // 3. Enviamos la notificación a cada suscripción
    const payload = {
      title: 'Tu Momento de Reflexión Diaria ✨',
      body: 'No olvides completar tus dilemas de hoy para continuar tu viaje de autoconocimiento.',
      icon: '/icon-192x192.png'
    };

    let notificationsSent = 0;
    for (const sub of subscriptions) {
      await sendNotification(sub.subscription_object, payload);
      notificationsSent++;
    }
    
    console.log(`✅ Tarea de recordatorios completada. Se intentó enviar ${notificationsSent} notificaciones.`);

  } catch (error) {
    console.error('❌ Error durante la tarea de recordatorios:', error);
  } finally {
    client.release();
  }
};

// Se programa la tarea para ejecutarse todos los días a las 7 PM
const reminderJob = cron.schedule('0 19 * * *', sendDailyReminders, {
  scheduled: false, // Lo dejamos en false para que no inicie automáticamente al importar
  timezone: "America/Guatemala"
});

// --- FIN DE LA NUEVA TAREA ---

// Exportamos ambos jobs para que server.js pueda controlarlos
module.exports = {
  snapshotJob,
  reminderJob,
  _test_takeProfileSnapshots: takeProfileSnapshots,
  _test_sendDailyReminders: sendDailyReminders
};