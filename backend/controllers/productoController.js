import { Producto } from "../models/productoModel.js";
import { logAction } from "../libs/logger.js";

export const obtenerProductosDashboard = async (req, res) => {
  try {
    let { page = 1, perPage = 10, sortField = "created_at", sortOrder = "asc" } = req.query;

    page = Math.max(1, Number(page));
    perPage = Math.max(1, Math.min(Number(perPage), 100));
    const offset = (page - 1) * perPage;

    const allowedFields = ["nombre", "precio", "stock", "created_at"];
    if (!allowedFields.includes(sortField)) sortField = "created_at";

    const allowedOrders = ["asc", "desc"];
    if (!allowedOrders.includes(sortOrder.toLowerCase())) sortOrder = "asc";

    const productos = await Producto.obtenerProductosFiltrados({
      sortField,
      sortOrder,
      limit: perPage,
      offset
    });

    const totalRecords = await Producto.obtenerProductosFiltrados({ countOnly: true });

    res.json({
      productos,
      totalRecords,
      totalPages: Math.ceil(totalRecords / perPage)
    });

  } catch (err) {
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

export const obtenerProductoPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const producto = await Producto.obtenerPorId(id);

    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });

    res.json(producto);
  } catch {
    res.status(500).json({ message: "Error al obtener producto" });
  }
};

export const obtenerTipoProducto = async (req, res) => {
  try {
    const tipos = await Producto.obtenerTipos();
    res.json(tipos);
  } catch {
    res.status(500).json({ message: "Error al obtener tipos" });
  }
};

export const crearProducto = async (req, res) => {
  try {
    const id = await Producto.crear(req.body);
    logAction(`Producto creado`);
    res.status(201).json({ message: "Producto creado", id });
  } catch {
    res.status(500).json({ message: "Error al crear producto" });
  }
};

export const actualizarProducto = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const ok = await Producto.actualizar(id, req.body);
    if (!ok)
      return res.status(404).json({ message: "Producto no encontrado" });

    logAction(`Producto actualizado ${id}`);
    res.json({ message: "Producto actualizado" });

  } catch {
    res.status(500).json({ message: "Error al actualizar producto" });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const ok = await Producto.eliminar(id);

    if (!ok) return res.status(404).json({ message: "Producto no encontrado" });

    logAction(`Producto eliminado ${id}`);
    res.json({ message: "Producto eliminado" });

  } catch {
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};
