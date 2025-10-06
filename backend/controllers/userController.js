const oracledb = require("oracledb");
require("dotenv").config();

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

exports.getAllUsers = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT * FROM BI_AGA.USERS`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await conn.close();
    return res.json(result.rows); 
  } catch (err) {
    if (conn) {
      try { await conn.close(); } catch (e) { console.error("Close error:", e); }
    }
    return res.status(500).json({ error: err.message });
  }
};


//   const {
//     AUS_FIRSTNAME,
//     AUS_LASTNAME,
//     AUS_PHONE,
//     AUS_SEXE,
//     AUS_ADDRESS,
//     AUS_EMAIL,
//     AUS_AGE,
//     AUS_BIRTHDATE,
//   } = req.body;

//   try {
//     const conn = await getConnection();

//     await conn.execute(
//       `
//       INSERT INTO BI_AGA.AGENCY (
//         AUS_ID,
//         AUS_FIRSTNAME,
//         AUS_LASTNAME,
//         AUS_PHONE,
//         AUS_SEXE,
//         AUS_ADDRESS,
//         AUS_EMAIL,
//         AUS_AGE,
//         AUS_BIRTHDATE,
//         CREATED_AT
//       ) VALUES (
//         BI_AGA.AGENCY_SEQ.NEXTVAL,
//         :AUS_FIRSTNAME,
//         :AUS_LASTNAME,
//         :AUS_PHONE,
//         :AUS_SEXE,
//         :AUS_ADDRESS,
//         :AUS_EMAIL,
//         :AUS_AGE,
//         TO_DATE(:AUS_BIRTHDATE, 'YYYY-MM-DD'),
//         SYSDATE
//       ) `,
//       { AUS_FIRSTNAME, AUS_LASTNAME, AUS_PHONE, AUS_SEXE, AUS_ADDRESS, AUS_EMAIL, AUS_AGE, AUS_BIRTHDATE },
//       { autoCommit: true }
//     );
    

//     res.status(201).json({ message: "Agency added successfully" });
//     await conn.close();
//   } catch (err) {
//     console.error("❌ Error adding user:", err);
//     res.status(500).json({ error: err.message });
//   }
// };


// ********************************************************************************************
// // *****************************************************************************************
// ============================================
// FILE: controllers/agencyController.js
// ============================================

/**
 * Ajouter une nouvelle demande d'agence
 */
exports.addAgency = async (req, res) => {
  const {
    // Informations personnelles
    AUS_FIRSTNAME,
    AUS_LASTNAME,
    AUS_PHONE,
    AUS_SEXE,
    AUS_ADDRESS,
    AUS_EMAIL,
    AUS_AGE,
    AUS_BIRTHDATE,
    
    // Expériences professionnelles
    AUS_EDUCATION_LEVEL,
    AUS_INSURANCE_EXPERIENCE,
    AUS_DIPLOMAS,
    AUS_CERTIFICATES,
    
    // Informations sur l'agence
    AUS_HAS_LOCATION,
    AUS_LOCATION_STATUS,
    AUS_WILAYA,
    AUS_COMMUNE,
    AUS_EXACT_ADDRESS,
    
    // Questionnaire
    AUS_MOTIVATION,
    AUS_REASON_CHOICE,
    AUS_ROADMAP,
    AUS_RECRUITMENT_COUNT,
    AUS_ESTIMATED_REVENUE,
    
    // Business Plan - Année 1
    AUS_BP_Y1_AUTO,
    AUS_BP_Y1_SIMPLE_RISKS,
    AUS_BP_Y1_FLEETS,
    AUS_BP_Y1_MULTIRISKS,
    
    // Business Plan - Année 2
    AUS_BP_Y2_AUTO,
    AUS_BP_Y2_SIMPLE_RISKS,
    AUS_BP_Y2_FLEETS,
    AUS_BP_Y2_MULTIRISKS,
    
    // Business Plan - Année 3
    AUS_BP_Y3_AUTO,
    AUS_BP_Y3_SIMPLE_RISKS,
    AUS_BP_Y3_FLEETS,
    AUS_BP_Y3_MULTIRISKS
  } = req.body;

  let conn;

  try {
    conn = await getConnection();

    const totalY1 = (parseFloat(AUS_BP_Y1_AUTO) || 0) + 
                    (parseFloat(AUS_BP_Y1_SIMPLE_RISKS) || 0) + 
                    (parseFloat(AUS_BP_Y1_FLEETS) || 0) + 
                    (parseFloat(AUS_BP_Y1_MULTIRISKS) || 0);
                    
    const totalY2 = (parseFloat(AUS_BP_Y2_AUTO) || 0) + 
                    (parseFloat(AUS_BP_Y2_SIMPLE_RISKS) || 0) + 
                    (parseFloat(AUS_BP_Y2_FLEETS) || 0) + 
                    (parseFloat(AUS_BP_Y2_MULTIRISKS) || 0);
                    
    const totalY3 = (parseFloat(AUS_BP_Y3_AUTO) || 0) + 
                    (parseFloat(AUS_BP_Y3_SIMPLE_RISKS) || 0) + 
                    (parseFloat(AUS_BP_Y3_FLEETS) || 0) + 
                    (parseFloat(AUS_BP_Y3_MULTIRISKS) || 0);

    // Convertir les arrays en JSON string si nécessaire
    const diplomasJson = Array.isArray(AUS_DIPLOMAS) ? JSON.stringify(AUS_DIPLOMAS) : AUS_DIPLOMAS;
    const certificatesJson = Array.isArray(AUS_CERTIFICATES) ? JSON.stringify(AUS_CERTIFICATES) : AUS_CERTIFICATES;

    const result = await conn.execute(
      `INSERT INTO BI_AGA.AGENCY (
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
      )
      VALUES (
        BI_AGA.AGENCY_SEQ.NEXTVAL,
        :AUS_FIRSTNAME,
        :AUS_LASTNAME,
        :AUS_PHONE,
        :AUS_SEXE,
        :AUS_ADDRESS,
        :AUS_EMAIL,
        :AUS_AGE,
        TO_DATE(:AUS_BIRTHDATE, 'YYYY-MM-DD'),
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
      RETURNING AUS_ID INTO :id`,
      {
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
        AUS_DIPLOMAS: diplomasJson,
        AUS_CERTIFICATES: certificatesJson,
        AUS_HAS_LOCATION: AUS_HAS_LOCATION ? 1 : 0,
        AUS_LOCATION_STATUS,
        AUS_WILAYA,
        AUS_COMMUNE,
        AUS_EXACT_ADDRESS,
        AUS_MOTIVATION,
        AUS_REASON_CHOICE,
        AUS_ROADMAP,
        AUS_RECRUITMENT_COUNT,
        AUS_ESTIMATED_REVENUE,
        AUS_BP_Y1_AUTO: AUS_BP_Y1_AUTO || 0,
        AUS_BP_Y1_SIMPLE_RISKS: AUS_BP_Y1_SIMPLE_RISKS || 0,
        AUS_BP_Y1_FLEETS: AUS_BP_Y1_FLEETS || 0,
        AUS_BP_Y1_MULTIRISKS: AUS_BP_Y1_MULTIRISKS || 0,
        AUS_BP_Y1_TOTAL: totalY1,
        AUS_BP_Y2_AUTO: AUS_BP_Y2_AUTO || 0,
        AUS_BP_Y2_SIMPLE_RISKS: AUS_BP_Y2_SIMPLE_RISKS || 0,
        AUS_BP_Y2_FLEETS: AUS_BP_Y2_FLEETS || 0,
        AUS_BP_Y2_MULTIRISKS: AUS_BP_Y2_MULTIRISKS || 0,
        AUS_BP_Y2_TOTAL: totalY2,
        AUS_BP_Y3_AUTO: AUS_BP_Y3_AUTO || 0,
        AUS_BP_Y3_SIMPLE_RISKS: AUS_BP_Y3_SIMPLE_RISKS || 0,
        AUS_BP_Y3_FLEETS: AUS_BP_Y3_FLEETS || 0,
        AUS_BP_Y3_MULTIRISKS: AUS_BP_Y3_MULTIRISKS || 0,
        AUS_BP_Y3_TOTAL: totalY3,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );
    
    

    const newId = result.outBinds.id[0];

    res.status(201).json({ 
      success: true,
      message: "Demande d'agence ajoutée avec succès",
      data: {
        id: newId,
        reference: `AA-${newId.toString().padStart(6, '0')}`
      }
    });

  } catch (err) {
    console.error("❌ Error adding agency:", err);
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

// const oracledb = require('oracledb');
// const getConnection = require('../config/database');

/**
 * Récupérer toutes les demandes d'agence
 * 
 */
exports.getAllAgencies = async (req, res) => {
  const { status, wilaya, page = 1, limit = 10 } = req.query;
  
  let conn;
  
  try {
    conn = await getConnection();
    
    // Construire la requête avec filtres
    let whereClause = '';
    const binds = {};
    
    if (status) {
      whereClause += ' AND AUS_STATUS = :status';
      binds.status = status;
    }
    
    if (wilaya) {
      whereClause += ' AND AUS_WILAYA = :wilaya';
      binds.wilaya = wilaya;
    }
    
    // Pagination
    const offset = (page - 1) * limit;
    binds.limit = parseInt(limit);
    binds.offset = parseInt(offset);
    
    const query = `
      SELECT * FROM (
        SELECT a.*, ROWNUM rnum FROM (
          SELECT 
            AUS_ID,
            AUS_FIRSTNAME,
            AUS_LASTNAME,
            AUS_PHONE,
            AUS_EMAIL,
            AUS_WILAYA,
            AUS_COMMUNE,
            AUS_STATUS,
            TO_CHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') as CREATED_AT,
            TO_CHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') as UPDATED_AT
          FROM BI_AGA.AGENCY
          WHERE 1=1 ${whereClause}
          ORDER BY CREATED_AT DESC
        ) a WHERE ROWNUM <= :limit + :offset
      ) WHERE rnum > :offset
    `;
    
    const result = await conn.execute(query, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    
    // Compter le total
    const countQuery = `
      SELECT COUNT(*) as TOTAL 
      FROM BI_AGA.AGENCY 
      WHERE 1=1 ${whereClause}
    `;
    const countResult = await conn.execute(countQuery, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    const total = countResult.rows[0].TOTAL;
    
    res.status(200).json({
      success: true,
      data: result.rows,
      pagination: {
        total: total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (err) {
    console.error("❌ Error fetching agencies:", err);
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




// // ============================================
// // FILE: app.js (Configuration principale)
// // ============================================

// const express = require('express');
// const cors = require('cors');
// const agencyRoutes = require('./routes/agencyRoutes');

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api/agency', agencyRoutes);

// // Route de santé
// app.get('/api/health', (req, res) => {
//   res.json({
//     status: 'OK',
//     timestamp: new Date().toISOString(),
//     service: 'Agency Management API'
//   });
// });

// // Gestion des erreurs 404
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route non trouvée'
//   });
// });

// // Gestion des erreurs globales
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: 'Erreur serveur',
//     error: err.message
//   });
// });

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`🚀 Serveur démarré sur le port ${PORT}`);
//   console.log(`📍 API disponible sur http://localhost:${PORT}/api/agency`);
// });

// module.exports = app;