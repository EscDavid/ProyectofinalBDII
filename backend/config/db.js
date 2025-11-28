import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,     
  user: process.env.DB_USER,      
  password: process.env.DB_PASS,   
  database: process.env.DB_NAME,   
  port: Number(process.env.DB_PORT), 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Conexión a MySQL exitosa");
    connection.release();
  } catch (err) {
    console.error("Error al conectar a MySQL:", err);
  }
})();
