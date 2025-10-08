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


// Helper pour parser un nombre (retourne 0 si NaN / vide)
const parseNumber = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};


exports.addAgency = async (req, res) => {
  const body = req.body || {};
  const files = req.files || {};

  // Validate required fields (simple validation)
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

  const diplomasPaths = Array.isArray(files.AUS_DIPLOMAS)
  ? files.AUS_DIPLOMAS.map(f => `/uploads/${f.filename}`)
  : [];

const certificatesPaths = Array.isArray(files.AUS_CERTIFICATES)
  ? files.AUS_CERTIFICATES.map(f => `/uploads/${f.filename}`)
  : [];

  // Calculs business plan (années 1/2/3)
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
        -- si AUS_BIRTHDATE vide, on passe NULL
        CASE WHEN :AUS_BIRTHDATE IS NOT NULL AND :AUS_BIRTHDATE <> '' THEN TO_DATE(:AUS_BIRTHDATE, 'YYYY-MM-DD') ELSE NULL END,
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

    // Prepare binds: on étend body mais on s'assure d'inclure les totaux et conversions nécessaires
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
      AUS_DIPLOMAS: JSON.stringify(diplomasPaths),
      AUS_CERTIFICATES: JSON.stringify(certificatesPaths),
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

      AUS_BP_Y1_AUTO: body.AUS_BP_Y1_AUTO ? parseNumber(body.AUS_BP_Y1_AUTO) : null,
      AUS_BP_Y1_SIMPLE_RISKS: body.AUS_BP_Y1_SIMPLE_RISKS ? parseNumber(body.AUS_BP_Y1_SIMPLE_RISKS) : null,
      AUS_BP_Y1_FLEETS: body.AUS_BP_Y1_FLEETS ? parseNumber(body.AUS_BP_Y1_FLEETS) : null,
      AUS_BP_Y1_MULTIRISKS: body.AUS_BP_Y1_MULTIRISKS ? parseNumber(body.AUS_BP_Y1_MULTIRISKS) : null,
      AUS_BP_Y1_TOTAL: totalY1,

      AUS_BP_Y2_AUTO: body.AUS_BP_Y2_AUTO ? parseNumber(body.AUS_BP_Y2_AUTO) : null,
      AUS_BP_Y2_SIMPLE_RISKS: body.AUS_BP_Y2_SIMPLE_RISKS ? parseNumber(body.AUS_BP_Y2_SIMPLE_RISKS) : null,
      AUS_BP_Y2_FLEETS: body.AUS_BP_Y2_FLEETS ? parseNumber(body.AUS_BP_Y2_FLEETS) : null,
      AUS_BP_Y2_MULTIRISKS: body.AUS_BP_Y2_MULTIRISKS ? parseNumber(body.AUS_BP_Y2_MULTIRISKS) : null,
      AUS_BP_Y2_TOTAL: totalY2,

      AUS_BP_Y3_AUTO: body.AUS_BP_Y3_AUTO ? parseNumber(body.AUS_BP_Y3_AUTO) : null,
      AUS_BP_Y3_SIMPLE_RISKS: body.AUS_BP_Y3_SIMPLE_RISKS ? parseNumber(body.AUS_BP_Y3_SIMPLE_RISKS) : null,
      AUS_BP_Y3_FLEETS: body.AUS_BP_Y3_FLEETS ? parseNumber(body.AUS_BP_Y3_FLEETS) : null,
      AUS_BP_Y3_MULTIRISKS: body.AUS_BP_Y3_MULTIRISKS ? parseNumber(body.AUS_BP_Y3_MULTIRISKS) : null,
      AUS_BP_Y3_TOTAL: totalY3,

      // out bind pour récupérer l'ID inséré
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const options = { autoCommit: true };

    const result = await conn.execute(sql, binds, options);

    const newId = result.outBinds && result.outBinds.id && result.outBinds.id[0]
      ? result.outBinds.id[0]
      : null;

    if (!newId) {
      throw new Error("Impossible de récupérer l'ID créé");
    }

    res.status(201).json({
      success: true,
      message: "Demande d'agence ajoutée avec succès",
      data: {
        id: newId,
        reference: `AA-${String(newId).padStart(6, "0")}`,
        diplomas: diplomasPaths,
        certificates: certificatesPaths
      }
    });
  } catch (err) {
    console.error("❌ Error adding agency:", err);
    // Si Oracle renvoie un texte d'erreur plus explicite, le renvoyer : err.message
    res.status(500).json({ success: false, error: err.message || "Internal server error" });
  } finally {
    if (conn) try { await conn.close(); } catch (e) { /* ignore */ }
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

// Helper pour décoder JSON en sécurité
function parseJsonSafe(value) {
  try {
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

/**
 * Récupérer une demande d'agence par ID
 */
exports.getAgencyById = async (req, res) => {
  const { id } = req.params;
  let conn;
  
  try {
    conn = await getConnection();
    
    const result = await conn.execute(
      `SELECT 
        AUS_ID,
        AUS_FIRSTNAME,
        AUS_LASTNAME,
        AUS_PHONE,
        AUS_SEXE,
        AUS_ADDRESS,
        AUS_EMAIL,
        AUS_AGE,
        TO_CHAR(AUS_BIRTHDATE, 'YYYY-MM-DD') as AUS_BIRTHDATE,
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
        AUS_COMMENTS,
        TO_CHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') as CREATED_AT,
        TO_CHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') as UPDATED_AT
      FROM BI_AGA.AGENCY
      WHERE AUS_ID = :id`,
      { id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Demande d'agence non trouvée" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (err) {
    console.error("❌ Error fetching agency:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("❌ Error closing connection:", err);
      }
    }
  }
};

/**
 * Mettre à jour le statut d'une demande
 */
exports.updateAgencyStatus = async (req, res) => {
  const { id } = req.params;
  const { status, comments } = req.body;
  
  let conn;
  
  try {
    conn = await getConnection();
    
    // Valider le statut
    const validStatuses = ['EN_ATTENTE', 'EN_COURS', 'APPROUVEE', 'REJETEE'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: "Statut invalide. Valeurs acceptées: " + validStatuses.join(', ')
      });
    }
    
    const result = await conn.execute(
      `UPDATE BI_AGA.AGENCY 
       SET AUS_STATUS = :status,
           AUS_COMMENTS = :comments,
           UPDATED_AT = SYSDATE
       WHERE AUS_ID = :id`,
      { status, comments: comments || null, id },
      { autoCommit: true }
    );
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Demande d'agence non trouvée" 
      });
    }
    
    res.status(200).json({ 
      success: true,
      message: "Statut mis à jour avec succès" 
    });
    
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("❌ Error closing connection:", err);
      }
    }
  }
};

/**
 * Mettre à jour une demande d'agence
 */
exports.updateAgency = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  let conn;
  
  try {
    conn = await getConnection();
    
    // Construire la requête UPDATE dynamiquement
    const fields = [];
    const binds = { id };
    
    const allowedFields = [
      'AUS_FIRSTNAME', 'AUS_LASTNAME', 'AUS_PHONE', 'AUS_SEXE', 'AUS_ADDRESS',
      'AUS_EMAIL', 'AUS_AGE', 'AUS_EDUCATION_LEVEL', 'AUS_INSURANCE_EXPERIENCE',
      'AUS_WILAYA', 'AUS_COMMUNE', 'AUS_EXACT_ADDRESS', 'AUS_MOTIVATION',
      'AUS_REASON_CHOICE', 'AUS_ROADMAP', 'AUS_RECRUITMENT_COUNT',
      'AUS_ESTIMATED_REVENUE', 'AUS_LOCATION_STATUS'
    ];
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        fields.push(`${field} = :${field}`);
        binds[field] = updateData[field];
      }
    });
    
    if (fields.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Aucun champ à mettre à jour" 
      });
    }
    
    fields.push('UPDATED_AT = SYSDATE');
    
    const query = `UPDATE BI_AGA.AGENCY SET ${fields.join(', ')} WHERE AUS_ID = :id`;
    
    const result = await conn.execute(query, binds, { autoCommit: true });
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Demande d'agence non trouvée" 
      });
    }
    
    res.status(200).json({ 
      success: true,
      message: "Demande d'agence mise à jour avec succès" 
    });
    
  } catch (err) {
    console.error("❌ Error updating agency:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("❌ Error closing connection:", err);
      }
    }
  }
};

/**
 * Supprimer une demande d'agence
 */
exports.deleteAgency = async (req, res) => {
  const { id } = req.params;
  let conn;
  
  try {
    conn = await getConnection();
    
    const result = await conn.execute(
      `DELETE FROM BI_AGA.AGENCY WHERE AUS_ID = :id`,
      { id },
      { autoCommit: true }
    );
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Demande d'agence non trouvée" 
      });
    }
    
    res.status(200).json({ 
      success: true,
      message: "Demande d'agence supprimée avec succès" 
    });
    
  } catch (err) {
    console.error("❌ Error deleting agency:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("❌ Error closing connection:", err);
      }
    }
  }
};

/**
 * Obtenir les statistiques des demandes
 */
exports.getAgencyStats = async (req, res) => {
  let conn;
  
  try {
    conn = await getConnection();
    
    const result = await conn.execute(
      `SELECT 
        COUNT(*) as TOTAL,
        SUM(CASE WHEN AUS_STATUS = 'EN_ATTENTE' THEN 1 ELSE 0 END) as EN_ATTENTE,
        SUM(CASE WHEN AUS_STATUS = 'EN_COURS' THEN 1 ELSE 0 END) as EN_COURS,
        SUM(CASE WHEN AUS_STATUS = 'APPROUVEE' THEN 1 ELSE 0 END) as APPROUVEE,
        SUM(CASE WHEN AUS_STATUS = 'REJETEE' THEN 1 ELSE 0 END) as REJETEE,
        COUNT(DISTINCT AUS_WILAYA) as WILAYAS_COUNT
      FROM BI_AGA.AGENCY`,
      {},
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (err) {
    console.error("❌ Error fetching stats:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("❌ Error closing connection:", err);
      }
    }
  }
};