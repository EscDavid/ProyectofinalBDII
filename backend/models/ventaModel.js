import {db} from "../config/db.js";

export const Venta = {
  obtenerFiltradas: async ({ sortField, sortOrder, limit, offset, id_usuario, countOnly }) => {

    let where = "";
    let params = [];

    if (id_usuario) {
      where = "WHERE v.id_usuario = ?";
      params.push(id_usuario);
    }

    if (countOnly) {
      const [rows] = await db.query(`SELECT COUNT(*) AS total FROM ventas ${where}`, params);
      return rows[0].total;
    }

    const [rows] = await db.query(`
      SELECT 
        v.id_venta, 
        p.nombre AS producto, 
        v.cantidad, 
        v.total, 
        v.fecha,
        u.nombre AS usuario_nombre
      FROM ventas v
      INNER JOIN productos p ON v.id_producto = p.id_producto
      INNER JOIN usuarios u ON v.id_usuario = u.id_usuario
      ${where}
      ORDER BY ${sortField} ${sortOrder}
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    return rows;
  },

  obtenerPorId: async (id) => {
    const [rows] = await db.query(`
      SELECT 
        v.id_venta, 
        p.nombre AS producto, 
        v.cantidad, 
        v.total, 
        v.fecha,
        u.nombre AS usuario_nombre,
        u.id_usuario
      FROM ventas v 
      INNER JOIN productos p ON v.id_producto = p.id_producto 
      INNER JOIN usuarios u ON v.id_usuario = u.id_usuario
      WHERE v.id_venta = ?`, [id]);
    return rows[0];
  },

  crear: async ({ id_producto, id_usuario, cantidad }) => {
    const [rows] = await db.query(
      "CALL RegistrarVenta(?, ?, ?)",
      [id_producto, cantidad, id_usuario]
    );
    return rows[0][0].id_venta; 
  },

  eliminar: async (id) => {
    const [venta] = await db.query(`
      SELECT id_producto, cantidad 
      FROM ventas 
      WHERE id_venta = ?`, [id]);
    
    if (venta.length === 0) return false;

    const { id_producto, cantidad } = venta[0];

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        "UPDATE productos SET stock = stock + ? WHERE id_producto = ?",
        [cantidad, id_producto]
      );

      const [result] = await connection.query(
        "DELETE FROM ventas WHERE id_venta = ?", 
        [id]
      );

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  generarReporte: async ({ fecha_inicio, fecha_fin, id_usuario }) => {
    const [rows] = await db.query("CALL GenerarReporteVentas(?, ?, ?)", [
      fecha_inicio,
      fecha_fin,
      id_usuario || null
    ]);

    return rows[0];
  }
};