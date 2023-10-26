import mysql from "mysql2/promise";

const instance = mysql;
var connection: mysql.Connection;

export async function initializeConnection() {
  connection = await instance.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
  
}

export async function query(query: string) {
  if (connection == null) throw new Error("Connection not initialized");
  const [rows, fields] = await connection.execute(query);
  return [rows, fields];
}