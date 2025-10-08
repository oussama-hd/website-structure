const oracledb = require("oracledb");
require("dotenv").config();

const path = require("path");

try {
  oracledb.initOracleClient({
    libDir: process.platform === "win32"
      ? "C:\\oracle\\instantclient_19_28"
      : "/opt/oracle/instantclient_19_28"
  });
} catch (err) {
  console.error("initOracleClient error:", err);
}

async function getConnection() {
  return await oracledb.getConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
  });
}

function parseNumber(value) {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
}

exports.addAgency = async (req, res) => {
  const body = req.body || {};
  const files = req.files || {};

  // 🧩 Validation basique
  const required = [
    "AUS_FIRSTNAME",
    "AUS_LASTNAME",
    "AUS_PHONE",
    "AUS_SEXE",
    "AUS_ADDRESS",
    "AUS_EMAIL",
    "AUS_BIRTHDATE",
    "AUS_EDUCATION_LEVEL",
    "AUS_INSURANCE_EXPERIENCE",
    "AUS_HAS_LOCATION",
    "AUS_WILAYA",
    "AUS_COMMUNE",
    "AUS_MOTIVATION",
    "AUS_REASON_CHOICE",
    "AUS_ROADMAP"
  ];
  const missing = required.filter((k) => !(k in body) || body[k] === "");
  if (missing.length) {
    return res.status(400).json({
      success: false,
      error: `Paramètres manquants: ${missing.join(", ")}`
    });
  }

  // ✅ Chemins des fichiers uploadés (on les stocke sous forme de texte)
  const diplomasPaths = Array.isArray(files.AUS_DIPLOMAS)
    ? files.AUS_DIPLOMAS.map((f) => `/uploads/${f.filename}`).join(", ")
    : "";

  const certificatesPaths = Array.isArray(files.AUS_CERTIFICATES)
    ? files.AUS_CERTIFICATES.map((f) => `/uploads/${f.filename}`).join(", ")
    : "";

  // ✅ Calculs totaux
  const totalY1 =
    parseNumber(body.AUS_BP_Y1_AUTO) +
    parseNumber(body.AUS_BP_Y1_SIMPLE_RISKS) +
    parseNumber(body.AUS_BP_Y1_FLEETS) +
    parseNumber(body.AUS_BP_Y1_MULTIRISKS);

  const totalY2 =
    parseNumber(body.AUS_BP_Y2_AUTO) +
    parseNumber(body.AUS_BP_Y2_SIMPLE_RISKS) +
    parseNumber(body.AUS_BP_Y2_FLEETS) +
    parseNumber(body.AUS_BP_Y2_MULTIRISKS);

  const totalY3 =
    parseNumber(body.AUS_BP_Y3_AUTO) +
    parseNumber(body.AUS_BP_Y3_SIMPLE_RISKS) +
    parseNumber(body.AUS_BP_Y3_FLEETS) +
    parseNumber(body.AUS_BP_Y3_MULTIRISKS);

  let conn;
  try {
    conn = await getConnection();

    const sql = `
      INSERT INTO BI_AGA.AGENCY (
        AUS_ID,
        AUS_FIRSTNAME,
        AUS_LASTNAME,
        AUS_PHONE,
        AUS_SEXE,
        AUS_ADDRESS,
        AUS_EMAIL,
        AUS_AGE,
        AUS_BIRTHDATE,
        AUS_EDUCATION_LEVEL,
        AUS_INSURANCE_EXPERIENCE,
        AUS_DIPLOMAS,
        AUS_CERTIFICATES,
        AUS_HAS_LOCATION,
        AUS_LOCATION_STATUS,
        AUS_WILAYA,
        AUS_COMMUNE,
        AUS_EXACT_ADDRESS,
        AUS_MOTIVATION,
        AUS_REASON_CHOICE,
        AUS_ROADMAP,
        AUS_RECRUITMENT_COUNT,
        AUS_ESTIMATED_REVENUE,
        AUS_BP_Y1_AUTO,
        AUS_BP_Y1_SIMPLE_RISKS,
        AUS_BP_Y1_FLEETS,
        AUS_BP_Y1_MULTIRISKS,
        AUS_BP_Y1_TOTAL,
        AUS_BP_Y2_AUTO,
        AUS_BP_Y2_SIMPLE_RISKS,
        AUS_BP_Y2_FLEETS,
        AUS_BP_Y2_MULTIRISKS,
        AUS_BP_Y2_TOTAL,
        AUS_BP_Y3_AUTO,
        AUS_BP_Y3_SIMPLE_RISKS,
        AUS_BP_Y3_FLEETS,
        AUS_BP_Y3_MULTIRISKS,
        AUS_BP_Y3_TOTAL,
        AUS_STATUS,
        CREATED_AT,
        UPDATED_AT
      ) VALUES (
        BI_AGA.AGENCY_SEQ.NEXTVAL,
        :AUS_FIRSTNAME,
        :AUS_LASTNAME,
        :AUS_PHONE,
        :AUS_SEXE,
        :AUS_ADDRESS,
        :AUS_EMAIL,
        :AUS_AGE,
        CASE WHEN :AUS_BIRTHDATE IS NOT NULL AND :AUS_BIRTHDATE <> '' 
          THEN TO_DATE(:AUS_BIRTHDATE, 'YYYY-MM-DD') 
          ELSE NULL 
        END,
        :AUS_EDUCATION_LEVEL,
        :AUS_INSURANCE_EXPERIENCE,
        :AUS_DIPLOMAS,
        :AUS_CERTIFICATES,
        :AUS_HAS_LOCATION,
        :AUS_LOCATION_STATUS,
        :AUS_WILAYA,
        :AUS_COMMUNE,
        :AUS_EXACT_ADDRESS,
        :AUS_MOTIVATION,
        :AUS_REASON_CHOICE,
        :AUS_ROADMAP,
        :AUS_RECRUITMENT_COUNT,
        :AUS_ESTIMATED_REVENUE,
        :AUS_BP_Y1_AUTO,
        :AUS_BP_Y1_SIMPLE_RISKS,
        :AUS_BP_Y1_FLEETS,
        :AUS_BP_Y1_MULTIRISKS,
        :AUS_BP_Y1_TOTAL,
        :AUS_BP_Y2_AUTO,
        :AUS_BP_Y2_SIMPLE_RISKS,
        :AUS_BP_Y2_FLEETS,
        :AUS_BP_Y2_MULTIRISKS,
        :AUS_BP_Y2_TOTAL,
        :AUS_BP_Y3_AUTO,
        :AUS_BP_Y3_SIMPLE_RISKS,
        :AUS_BP_Y3_FLEETS,
        :AUS_BP_Y3_MULTIRISKS,
        :AUS_BP_Y3_TOTAL,
        'EN_ATTENTE',
        SYSDATE,
        SYSDATE
      )
      RETURNING AUS_ID INTO :id
    `;

    const binds = {
      AUS_FIRSTNAME: body.AUS_FIRSTNAME,
      AUS_LASTNAME: body.AUS_LASTNAME,
      AUS_PHONE: body.AUS_PHONE,
      AUS_SEXE: body.AUS_SEXE,
      AUS_ADDRESS: body.AUS_ADDRESS,
      AUS_EMAIL: body.AUS_EMAIL,
      AUS_AGE: body.AUS_AGE ? parseInt(body.AUS_AGE, 10) : null,
      AUS_BIRTHDATE: body.AUS_BIRTHDATE || null,
      AUS_EDUCATION_LEVEL: body.AUS_EDUCATION_LEVEL,
      AUS_INSURANCE_EXPERIENCE: body.AUS_INSURANCE_EXPERIENCE,
      AUS_DIPLOMAS: diplomasPaths, // ✅ CLOB string
      AUS_CERTIFICATES: certificatesPaths, // ✅ CLOB string
      AUS_HAS_LOCATION: body.AUS_HAS_LOCATION === "true" || body.AUS_HAS_LOCATION === true ? 1 : 0,
      AUS_LOCATION_STATUS: body.AUS_LOCATION_STATUS || null,
      AUS_WILAYA: body.AUS_WILAYA,
      AUS_COMMUNE: body.AUS_COMMUNE,
      AUS_EXACT_ADDRESS: body.AUS_EXACT_ADDRESS || null,
      AUS_MOTIVATION: body.AUS_MOTIVATION,
      AUS_REASON_CHOICE: body.AUS_REASON_CHOICE,
      AUS_ROADMAP: body.AUS_ROADMAP,
      AUS_RECRUITMENT_COUNT: body.AUS_RECRUITMENT_COUNT ? parseInt(body.AUS_RECRUITMENT_COUNT, 10) : null,
      AUS_ESTIMATED_REVENUE: body.AUS_ESTIMATED_REVENUE ? parseFloat(body.AUS_ESTIMATED_REVENUE) : null,
      AUS_BP_Y1_AUTO: parseNumber(body.AUS_BP_Y1_AUTO),
      AUS_BP_Y1_SIMPLE_RISKS: parseNumber(body.AUS_BP_Y1_SIMPLE_RISKS),
      AUS_BP_Y1_FLEETS: parseNumber(body.AUS_BP_Y1_FLEETS),
      AUS_BP_Y1_MULTIRISKS: parseNumber(body.AUS_BP_Y1_MULTIRISKS),
      AUS_BP_Y1_TOTAL: totalY1,
      AUS_BP_Y2_AUTO: parseNumber(body.AUS_BP_Y2_AUTO),
      AUS_BP_Y2_SIMPLE_RISKS: parseNumber(body.AUS_BP_Y2_SIMPLE_RISKS),
      AUS_BP_Y2_FLEETS: parseNumber(body.AUS_BP_Y2_FLEETS),
      AUS_BP_Y2_MULTIRISKS: parseNumber(body.AUS_BP_Y2_MULTIRISKS),
      AUS_BP_Y2_TOTAL: totalY2,
      AUS_BP_Y3_AUTO: parseNumber(body.AUS_BP_Y3_AUTO),
      AUS_BP_Y3_SIMPLE_RISKS: parseNumber(body.AUS_BP_Y3_SIMPLE_RISKS),
      AUS_BP_Y3_FLEETS: parseNumber(body.AUS_BP_Y3_FLEETS),
      AUS_BP_Y3_MULTIRISKS: parseNumber(body.AUS_BP_Y3_MULTIRISKS),
      AUS_BP_Y3_TOTAL: totalY3,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    };

    const result = await conn.execute(sql, binds, { autoCommit: true });
    const newId = result.outBinds.id[0];

    res.status(201).json({
      success: true,
      message: "Demande d'agence ajoutée avec succès",
      data: {
        id: newId,
        reference: `AA-${String(newId).padStart(6, "0")}`,
        diplomas: diplomasPaths.split(", "),
        certificates: certificatesPaths.split(", ")
      },
    });
  } catch (err) {
    console.error("❌ Error adding agency:", err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    if (conn) try { await conn.close(); } catch (e) {}
  }
};

exports.getAllAgencies = async (req, res) => {
  let conn;

  // 🔹 Fonction utilitaire pour parser les champs JSON stockés en texte
  function parseJsonSafe(value) {
    try {
      return value ? JSON.parse(value) : [];
    } catch (e) {
      console.error("Erreur parse JSON:", e.message);
      return [];
    }
  }

  try {
    conn = await getConnection();

    const sql = `
      SELECT 
        AUS_ID,
        AUS_FIRSTNAME,
        AUS_LASTNAME,
        AUS_PHONE,
        AUS_SEXE,
        AUS_ADDRESS,
        AUS_EMAIL,
        AUS_AGE,
        TO_CHAR(AUS_BIRTHDATE, 'YYYY-MM-DD') AS AUS_BIRTHDATE,
        AUS_EDUCATION_LEVEL,
        AUS_INSURANCE_EXPERIENCE,
        AUS_DIPLOMAS,
        AUS_CERTIFICATES,
        AUS_HAS_LOCATION,
        AUS_LOCATION_STATUS,
        AUS_WILAYA,
        AUS_COMMUNE,
        AUS_EXACT_ADDRESS,

        AUS_RECRUITMENT_COUNT,
        AUS_ESTIMATED_REVENUE,
        AUS_BP_Y1_AUTO,
        AUS_BP_Y1_SIMPLE_RISKS,
        AUS_BP_Y1_FLEETS,
        AUS_BP_Y1_MULTIRISKS,
        AUS_BP_Y1_TOTAL,
        AUS_BP_Y2_AUTO,
        AUS_BP_Y2_SIMPLE_RISKS,
        AUS_BP_Y2_FLEETS,
        AUS_BP_Y2_MULTIRISKS,
        AUS_BP_Y2_TOTAL,
        AUS_BP_Y3_AUTO,
        AUS_BP_Y3_SIMPLE_RISKS,
        AUS_BP_Y3_FLEETS,
        AUS_BP_Y3_MULTIRISKS,
        AUS_BP_Y3_TOTAL,
        AUS_STATUS,
        TO_CHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS CREATED_AT,
        TO_CHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS UPDATED_AT
      FROM BI_AGA.AGENCY
      ORDER BY CREATED_AT DESC
    `;

    const result = await conn.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    const BASE_URL = `${req.protocol}://${req.get("host")}`;

    const data = result.rows.map(row => ({
      ...row,
      AUS_DIPLOMAS: parseJsonSafe(row.AUS_DIPLOMAS).map(p => `${BASE_URL}${p}`),
      AUS_CERTIFICATES: parseJsonSafe(row.AUS_CERTIFICATES).map(p => `${BASE_URL}${p}`),
      reference: `AA-${String(row.AUS_ID).padStart(6, "0")}`
    }));

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (err) {
    console.error("❌ Error fetching agencies:", err);
    res.status(500).json({ success: false, error: err.message || "Internal server error" });
  } finally {
    if (conn) try { await conn.close(); } catch (e) { /* ignore */ }
  }
};
