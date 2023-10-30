import mysql from "mysql2/promise";

const instance = mysql;
var connection: mysql.Connection;

export async function initializeConnection() {
  connection = instance.createPool({
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
  if (connection == null) throw console.error("Connection not initialized");
  const [rows, fields] = await connection.execute(query);
  return [rows, fields];
}
