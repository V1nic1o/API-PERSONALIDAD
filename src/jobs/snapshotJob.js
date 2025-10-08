// src/jobs/snapshotJob.js
const cron = require('node-cron');
const { pool } = require('../config/database');
const { sendNotification } = require('../services/notificationService');

// Utilidad: fecha de "hoy" consistente con la app (America/Guatemala)
const TODAY_GT_SQL = "(NOW() AT TIME ZONE 'America/Guatemala')::date";

async function snapshotUserNow(userId, externalClient = null) {
  const client = externalClient || (await pool.connect());
  let localClient = !externalClient;

  try {
    // Leemos el perfil actual
    const profRes = await client.query(
      `SELECT user_id, openness, conscientiousness, extraversion, agreeableness, neuroticism
       FROM profiles
       WHERE user_id = $1`,
      [userId]
    );
    if (profRes.rows.length === 0) {
      console.warn(`⚠️ snapshotUserNow: perfil no encontrado user_id=${userId}`);
      return { updated: false, reason: 'no_profile' };
    }
    const p = profRes.rows[0];

    // Upsert del snapshot del día (GT). Actualiza si ya existe.
    const upsert = `
      INSERT INTO profile_snapshots (
        user_id, snapshot_date, openness, conscientiousness, extraversion, agreeableness, neuroticism
      )
      VALUES (
        $1, ${TODAY_GT_SQL}, $2, $3, $4, $5, $6
      )
      ON CONFLICT (user_id, snapshot_date)
      DO UPDATE SET
        openness = EXCLUDED.openness,
        conscientiousness = EXCLUDED.conscientiousness,
        extraversion = EXCLUDED.extraversion,
        agreeableness = EXCLUDED.agreeableness,
        neuroticism = EXCLUDED.neuroticism
      ;
    `;
    await client.query(upsert, [
      p.user_id,
      p.openness,
      p.conscientiousness,
      p.extraversion,
      p.agreeableness,
      p.neuroticism,
    ]);
    return { updated: true };
  } catch (err) {
    console.error('❌ snapshotUserNow error:', err);
    throw err;
  } finally {
    if (localClient) client.release();
  }
}

/* =========================================================
   TAREA PERIÓDICA: asegurar snapshots del día para todos
   ---------------------------------------------------------
   - Idempotente: si ya existe, no duplica.
   ========================================================= */
const takeProfileSnapshots = async () => {
  console.log('📸 Ejecutando tarea: asegurando snapshots de perfiles (hoy)...');
  const client = await pool.connect();
  try {
    const profilesResult = await client.query('SELECT * FROM profiles');
    const profiles = profilesResult.rows;

    if (profiles.length === 0) {
      console.log('No hay perfiles para tomar snapshots. Tarea finalizada.');
      return;
    }

    let createdOrTouched = 0;
    for (const profile of profiles) {
      const upsert = `
        INSERT INTO profile_snapshots (
          user_id, snapshot_date, openness, conscientiousness, extraversion, agreeableness, neuroticism
        )
        VALUES (
          $1, ${TODAY_GT_SQL}, $2, $3, $4, $5, $6
        )
        ON CONFLICT (user_id, snapshot_date)
        DO UPDATE SET
          openness = EXCLUDED.openness,
          conscientiousness = EXCLUDED.conscientiousness,
          extraversion = EXCLUDED.extraversion,
          agreeableness = EXCLUDED.agreeableness,
          neuroticism = EXCLUDED.neuroticism
        ;
      `;
      const result = await client.query(upsert, [
        profile.user_id,
        profile.openness,
        profile.conscientiousness,
        profile.extraversion,
        profile.agreeableness,
        profile.neuroticism,
      ]);

      // rowCount puede ser 1 tanto para INSERT como para UPDATE.
      if (result.rowCount > 0) createdOrTouched++;
    }
    console.log(`✅ Snapshots de hoy asegurados/actualizados: ${createdOrTouched}. Total perfiles: ${profiles.length}.`);
  } catch (error) {
    console.error('❌ Error durante la tarea de snapshots:', error);
  } finally {
    client.release();
  }
};

// PROGRAMACIÓN DE SNAPSHOTS (respaldo cada 15 minutos)
const snapshotJob = cron.schedule('*/15 * * * *', takeProfileSnapshots, {
  scheduled: false,
  timezone: 'America/Guatemala',
});

/* =========================================================
   RECORDATORIOS DIARIOS (sin cambios funcionales,
   solo TZ consistente)
   ========================================================= */
const sendDailyReminders = async () => {
  console.log('⏰ Ejecutando tarea de recordatorios diarios...');
  const client = await pool.connect();
  try {
    // Usuarios que NO han respondido nada "hoy" (GT)
    const usersToNotifyQuery = `
      SELECT u.id
      FROM users u
      WHERE u.id NOT IN (
        SELECT DISTINCT a.user_id
        FROM answers a
        WHERE a.answered_at >= date_trunc('day', (NOW() AT TIME ZONE 'America/Guatemala'))
          AND a.answered_at <  date_trunc('day', (NOW() AT TIME ZONE 'America/Guatemala')) + INTERVAL '1 day'
      );
    `;
    const usersResult = await client.query(usersToNotifyQuery);
    const usersToNotify = usersResult.rows;

    if (usersToNotify.length === 0) {
      console.log('Todos los usuarios están al día. No se envían recordatorios.');
      return;
    }

    const userIds = usersToNotify.map(u => u.id);

    const subsQuery = `SELECT * FROM push_subscriptions WHERE user_id = ANY($1::int[])`;
    const subsResult = await client.query(subsQuery, [userIds]);
    const subscriptions = subsResult.rows;

    const payload = {
      title: 'Tu Momento de Reflexión Diaria ✨',
      body: 'No olvides completar tus dilemas de hoy para continuar tu viaje de autoconocimiento.',
      icon: '/icon-192x192.png',
    };

    let notificationsSent = 0;
    for (const sub of subscriptions) {
      try {
        await sendNotification(sub.subscription_object, payload);
        notificationsSent++;
      } catch (e) {
        console.warn(`⚠️ Falló envío a user_id=${sub.user_id}:`, e.message);
      }
    }

    console.log(`✅ Recordatorios: ${notificationsSent}/${subscriptions.length} notificaciones intentadas (usuarios candidatos: ${userIds.length}).`);
  } catch (error) {
    console.error('❌ Error durante la tarea de recordatorios:', error);
  } finally {
    client.release();
  }
};

// Corre todos los días a las 7 PM GT
const reminderJob = cron.schedule('0 19 * * *', sendDailyReminders, {
  scheduled: false,
  timezone: 'America/Guatemala',
});

// Exportamos jobs + utilidades de test/manual
module.exports = {
  snapshotJob,
  reminderJob,
  snapshotUserNow, // <— para uso inmediato tras processAnswer
  _test_takeProfileSnapshots: takeProfileSnapshots,
  _test_sendDailyReminders: sendDailyReminders,
};