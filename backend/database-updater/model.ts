import mysql from "mysql2/promise";

const instance = mysql;
var pool: mysql.Pool;

export async function initializeConnection() {
  pool = instance.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 5,
    maxIdle: 5,
    idleTimeout: 60000,
    queueLimit: 0,
  });
}

export async function query(query: string) {
  var res;
  if (pool == null) throw console.error("Connection not initialized");
  const connection = await pool.getConnection();

  const [rows, fields] = await connection.query(query);
  connection.release();
  return [rows, fields];
}
