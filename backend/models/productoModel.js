import { db } from "../config/db.js";

export const Producto = {
  obtenerProductosFiltrados: async ({ sortField, sortOrder, limit, offset, countOnly }) => {
    if (countOnly) {
      const [rows] = await db.query("SELECT COUNT(*) AS total FROM productos");
      return rows[0].total;
    }

    const [rows] = await db.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.precio,
        p.stock,
        tp.nombre AS tipo,
        p.created_at,
        tp.nombre as tipo_nombre
      FROM productos p
      INNER JOIN tipo_productos tp ON tp.id_tipo = p.id_tipo
      ORDER BY ${sortField} ${sortOrder}
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    return rows;
  },

  obtenerPorId: async (id) => {
    const [rows] = await db.query(`
      SELECT 
        p.id_producto, 
        p.nombre, 
        p.descripcion,
        p.precio, 
        p.stock, 
        p.id_tipo,
        p.created_at,
        p.updated_at,
        tp.nombre as tipo_nombre
      FROM productos p
      INNER JOIN tipo_productos tp ON tp.id_tipo = p.id_tipo 
      WHERE p.id_producto = ?`, [id]);
    return rows[0];
  },

  obtenerTipos: async () => {
    const [rows] = await db.query("SELECT * FROM tipo_productos");
    return rows;
  },

  crear: async (data) => {
    const [result] = await db.query("INSERT INTO productos SET ?", data);
    return result.insertId;
  },

  actualizar: async (id, data) => {
    const [result] = await db.query("UPDATE productos SET ? WHERE id_producto = ?", [data, id]);
    return result.affectedRows > 0;
  },

  eliminar: async (id) => {
    const [result] = await db.query("DELETE FROM productos WHERE id_producto = ?", [id]);
    return result.affectedRows > 0;
  }
};