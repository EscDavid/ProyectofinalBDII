import db from "../config/db.js";

export const Venta = {
  async obtenerFiltradas({ sortField, sortOrder, limit = 10, offset = 0, countOnly = false } = {}) {
    if (countOnly) {
      const [rows] = await db.query("SELECT COUNT(*) AS count FROM ventas");
      return rows[0].count;
    }

    const allowedFields = ["fecha", "usuario", "producto", "total"];
    const allowedOrders = ["asc", "desc"];

    const safeSortField = allowedFields.includes(sortField) ? sortField : "fecha";
    const safeSortOrder = allowedOrders.includes(sortOrder?.toLowerCase())
      ? sortOrder.toUpperCase()
      : "DESC";

    let orderField;
    switch (safeSortField) {
      case "usuario":
        orderField = "u.nombre";
        break;
      case "producto":
        orderField = "p.nombre";
        break;
      case "total":
        orderField = "v.total";
        break;
      default:
        orderField = "v.fecha";
    }

    const query = `
      SELECT 
        v.id_venta AS id,
        p.nombre AS producto,
        u.nombre AS usuario,
        v.cantidad,
        v.total,
        DATE_FORMAT(v.fecha, '%Y-%m-%d %H:%i:%s') AS fecha
      FROM ventas v
      JOIN productos p ON v.id_producto = p.id_producto
      JOIN usuarios u ON v.id_usuario = u.id_usuario
      ORDER BY ${orderField} ${safeSortOrder}
      LIMIT ? OFFSET ?
    `;

    const [rows] = await db.query(query, [parseInt(limit, 10), parseInt(offset, 10)]);
    return rows;
  },

  async obtenerPorId(id) {
    const [rows] = await db.query(
      `
      SELECT 
        v.id_venta AS id,
        p.nombre AS producto,
        u.nombre AS usuario,
        v.cantidad,
        v.total,
        v.fecha
      FROM ventas v
      JOIN productos p ON v.id_producto = p.id_producto
      JOIN usuarios u ON v.id_usuario = u.id_usuario
      WHERE v.id_venta = ?
    `,
      [id]
    );
    return rows[0];
  },

  async crear({ id_producto, id_usuario, cantidad }) {
    const [[producto]] = await db.query(
      "SELECT precio, stock FROM productos WHERE id_producto = ?",
      [id_producto]
    );
    if (!producto) throw new Error("Producto no encontrado");
    if (producto.stock < cantidad) throw new Error("Stock insuficiente");

    const total = producto.precio * cantidad;
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        "UPDATE productos SET stock = stock - ? WHERE id_producto = ?",
        [cantidad, id_producto]
      );

      const [result] = await connection.query(
        `INSERT INTO ventas (id_producto, id_usuario, cantidad, total)
         VALUES (?, ?, ?, ?)`,
        [id_producto, id_usuario, cantidad, total]
      );

      await connection.commit();
      connection.release();
      return result.insertId;
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  },

  async eliminar(id) {
    const [result] = await db.query("DELETE FROM ventas WHERE id_venta = ?", [id]);
    return result.affectedRows;
  },

  async generarReporte({ fecha_inicio, fecha_fin, id_usuario = null }) {
    const [rows] = await db.query("CALL GenerarReporteVentas(?, ?, ?)", [
      fecha_inicio,
      fecha_fin,
      id_usuario,
    ]);
    return rows[0];
  },
};
