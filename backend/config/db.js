// config/db.js
require("dotenv").config();
const oracledb = require("oracledb");

async function initOracle() {
  try {
    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
    });
    console.log("✅ Connexion Oracle établie (pool)");
  } catch (err) {
    console.error("❌ Erreur de connexion Oracle :", err);
    process.exit(1);
  }
}

async function closePool() {
  try {
    await oracledb.getPool().close(0);
    console.log("🔴 Pool Oracle fermé");
  } catch (err) {
    console.error("❌ Erreur fermeture pool :", err);
  }
}

module.exports = { initOracle, closePool };
