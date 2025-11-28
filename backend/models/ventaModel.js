import {db} from "../config/db.js";

export const Venta = {
  obtenerFiltradas: async ({ sortField, sortOrder, limit, offset, id_usuario, countOnly }) => {

    let where = "";
    let params = [];

    if (id_usuario) {
      where = "WHERE id_usuario = ?";
      params.push(id_usuario);
    }

    if (countOnly) {
      const [rows] = await db.query(`SELECT COUNT(*) AS total FROM venta ${where}`, params);
      return rows[0].total;
    }

    const [rows] = await db.query(`
      SELECT * FROM venta
      ${where}
      ORDER BY ${sortField} ${sortOrder}
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    return rows;
  },

  obtenerPorId: async (id) => {
    const [rows] = await db.query("SELECT * FROM venta WHERE id_venta = ?", [id]);
    return rows[0];
  },

  crear: async ({ id_producto, id_usuario, cantidad }) => {
    const [result] = await db.query(
      "INSERT INTO venta SET id_producto=?, id_usuario=?, cantidad=?, fecha=NOW()",
      [id_producto, id_usuario, cantidad]
    );
    return result.insertId;
  },

  eliminar: async (id) => {
    const [result] = await db.query("DELETE FROM venta WHERE id_venta = ?", [id]);
    return result.affectedRows > 0;
  },

  generarReporte: async ({ fecha_inicio, fecha_fin, id_usuario }) => {
    const [rows] = await db.query("CALL GenerarReporteVentas(?,?,?)", [
      fecha_inicio,
      fecha_fin,
      id_usuario || null
    ]);

    return rows[0];
  }
};
