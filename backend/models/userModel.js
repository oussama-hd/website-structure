// models/userModel.js
const oracledb = require("oracledb");

async function getUsers() {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(`SELECT ID, NAME, EMAIL FROM USERS`, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    return result.rows;
  } finally {
    if (connection) await connection.close();
  }
}

async function createUser({ name, email }) {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `INSERT INTO USERS (ID, NAME, EMAIL) VALUES (USERS_SEQ.NEXTVAL, :name, :email)`,
      { name, email },
      { autoCommit: true }
    );
    return result.rowsAffected;
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = { getUsers, createUser };
