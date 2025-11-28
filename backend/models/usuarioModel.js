import {db}from "../config/db.js";
import bcrypt from "bcrypt";

export const User = {
  async obtenerTodos() {
    const [rows] = await db.query(`
      SELECT u.id_usuario, u.nombre, u.email, r.nombre AS rol
      FROM usuarios u
      JOIN roles r ON u.id_rol = r.id_rol
    `);
    return rows;
  },

  async crear({ nombre, email, password, id_rol }) {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO usuarios (nombre, email, password_hash, id_rol)
       VALUES (?, ?, ?, ?)`,
      [nombre, email, hash, id_rol]
    );
    return result.insertId;
  },

  async autenticar(email, password) {
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    const usuario = rows[0];
    if (!usuario) return null;

    const valido = await bcrypt.compare(password, usuario.password_hash);
    return valido ? usuario : null;
  },
};
