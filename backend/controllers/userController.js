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

exports.addAgency = async (req, res) => {
  const {
    AUS_FIRSTNAME,
    AUS_LASTNAME,
    AUS_PHONE,
    AUS_SEXE,
    AUS_ADDRESS,
    AUS_EMAIL,
    AUS_AGE,
    AUS_BIRTHDATE,
  } = req.body;

  try {
    const conn = await getConnection();

    await conn.execute(
      `
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
        CREATED_AT
      ) VALUES (
        BI_AGA.AGENCY_SEQ.NEXTVAL,
        :AUS_FIRSTNAME,
        :AUS_LASTNAME,
        :AUS_PHONE,
        :AUS_SEXE,
        :AUS_ADDRESS,
        :AUS_EMAIL,
        :AUS_AGE,
        TO_DATE(:AUS_BIRTHDATE, 'YYYY-MM-DD'),
        SYSDATE
      ) `,
      { AUS_FIRSTNAME, AUS_LASTNAME, AUS_PHONE, AUS_SEXE, AUS_ADDRESS, AUS_EMAIL, AUS_AGE, AUS_BIRTHDATE },
      { autoCommit: true }
    );
    

    res.status(201).json({ message: "Agency added successfully" });
    await conn.close();
  } catch (err) {
    console.error("❌ Error adding user:", err);
    res.status(500).json({ error: err.message });
  }
};
