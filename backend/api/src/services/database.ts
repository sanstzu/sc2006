import mysql from "mysql2/promise";
import { ObjectLiteralElementLike } from "typescript";

const instance = mysql;
var connection: mysql.Connection;

export async function initializeConnection() {
  connection = instance.createPool({
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
  if (connection == null) throw new Error("Connection not initialized");
  const [rows, fields] = await connection.execute(query);
  if (Array.isArray(rows)) {
    return [rows, fields];
  } else {
    throw new Error("Unexpected result type");
  }
}
