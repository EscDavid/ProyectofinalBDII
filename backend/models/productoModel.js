import db from "../config/db.js";

export const getProductosFilteredDB = async ({
  sortField,
  sortOrder,
  limit = 10,
  offset = 0,
  countOnly = false,
} = {}) => {
  if (countOnly) {
    const [rows] = await db.query("SELECT COUNT(*) AS count FROM productos");
    return rows[0].count;
  }

  let query = `
    SELECT 
      p.id_producto AS id,
      p.nombre,
      tp.nombre AS tipo,
      p.stock,
      p.precio,
      p.created_at
    FROM productos p
    INNER JOIN tipo_productos tp ON p.id_tipo = tp.id_tipo
  `;

  const allowedFields = ["created_at", "stock", "tipo", "precio", "nombre"];
  const allowedOrders = ["asc", "desc"];

  const safeSortField = allowedFields.includes(sortField)
    ? sortField
    : "created_at";

  const safeSortOrder = allowedOrders.includes(sortOrder?.toLowerCase())
    ? sortOrder.toUpperCase()
    : "ASC";

  let orderField;

  switch (safeSortField) {
    case "tipo":
      orderField = "tp.nombre";
      break;
    case "stock":
      orderField = "p.stock";
      break;
    case "precio":
      orderField = "p.precio";
      break;
    case "nombre":
      orderField = "p.nombre";
      break;
    default:
      orderField = `p.${safeSortField}`;
  }

  query += ` ORDER BY ${orderField} ${safeSortOrder} LIMIT ? OFFSET ?`;

  const [rows] = await db.query(query, [
    parseInt(limit, 10),
    parseInt(offset, 10),
  ]);

  return rows;
};

export const getTipoProducto = async () => {
  const [rows] = await db.query(
    `SELECT id_tipo AS id, nombre FROM tipo_productos ORDER BY nombre ASC`
  );
  return rows;
};

export const Producto = {
  async obtenerProductoPorId(id) {
    const [rows] = await db.query(
      `
      SELECT 
        p.id_producto AS id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.stock,
        tp.nombre AS tipo,
        p.created_at,
        p.updated_at
      FROM productos p
      LEFT JOIN tipo_productos tp ON p.id_tipo = tp.id_tipo
      WHERE p.id_producto = ?
    `,
      [id]
    );
    return rows[0];
  },

  async crearProducto({ nombre, descripcion, precio, stock, id_tipo }) {
    const [result] = await db.query(
      `INSERT INTO productos (nombre, descripcion, precio, stock, id_tipo)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, descripcion, precio, stock, id_tipo]
    );
    return result.insertId;
  },

  async actualizarProducto(id, { nombre, descripcion, precio, stock, id_tipo }) {
    const [result] = await db.query(
      `UPDATE productos
       SET nombre = ?, descripcion = ?, precio = ?, stock = ?, id_tipo = ?
       WHERE id_producto = ?`,
      [nombre, descripcion, precio, stock, id_tipo, id]
    );
    return result.affectedRows;
  },

  async eliminarProducto(id) {
    const [result] = await db.query(
      "DELETE FROM productos WHERE id_producto = ?",
      [id]
    );
    return result.affectedRows;
  },
};
