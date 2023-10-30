import mysql from "mysql2/promise";
import { ObjectLiteralElementLike } from "typescript";

const instance = mysql;
var pool: mysql.Pool;

export async function initializeConnection() {
  pool = instance.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
  });
}

export async function query(query: string): Promise<[object[], object]> {
  if (pool == null) throw console.error("Connection not initialized");
  const connection = await pool.getConnection();
  const [rows, fields] = await connection.execute(query);
  connection.release();
  if (Array.isArray(rows)) {
    return [rows, fields];
  } else {
    throw new Error("Unexpected result type");
  }
}
