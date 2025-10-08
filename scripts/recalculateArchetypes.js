// src/scripts/recalculateArchetypes.js
const { Pool } = require("pg");
const { calculateArchetype } = require("../src/services/profileService");
require("dotenv").config();

(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const { rows } = await pool.query("SELECT * FROM profile_snapshots");

  for (const snapshot of rows) {
    const archetype = calculateArchetype(snapshot);
    await pool.query(
      "UPDATE profile_snapshots SET archetype_name=$1 WHERE id=$2",
      [archetype.name, snapshot.id]
    );
  }

  console.log("✅ Arquetipos recalculados y actualizados.");
  await pool.end();
})();