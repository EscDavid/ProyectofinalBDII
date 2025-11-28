import {db }from "../config/db.js";

export const Producto = {
  obtenerProductosFiltrados: async ({ sortField, sortOrder, limit, offset, countOnly }) => {
    if (countOnly) {
      const [rows] = await db.query("SELECT COUNT(*) AS total FROM producto");
      return rows[0].total;
    }

    const [rows] = await db.query(`
      SELECT * FROM producto
      ORDER BY ${sortField} ${sortOrder}
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    return rows;
  },

  obtenerPorId: async (id) => {
    const [rows] = await db.query("SELECT * FROM producto WHERE id_producto = ?", [id]);
    return rows[0];
  },

  obtenerTipos: async () => {
    const [rows] = await db.query("SELECT * FROM tipo_producto");
    return rows;
  },

  crear: async (data) => {
    const [result] = await db.query("INSERT INTO producto SET ?", data);
    return result.insertId;
  },

  actualizar: async (id, data) => {
    const [result] = await db.query("UPDATE producto SET ? WHERE id_producto = ?", [data, id]);
    return result.affectedRows > 0;
  },

  eliminar: async (id) => {
    const [result] = await db.query("DELETE FROM producto WHERE id_producto = ?", [id]);
    return result.affectedRows > 0;
  }
};