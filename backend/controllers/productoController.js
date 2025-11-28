import { Producto } from "../models/productoModel.js";
import { logAction } from "../libs/logger.js";
import { getProductosFilteredDB, obtenerProductoPorId, obtenerTipoProducto, crearProducto,eliminarProducto, actualizarProducto } from "../models/productoModel.js"; 


export const obtenerProductosDashboard = async (req, res) => {
  try {
    let {
      page = 1,
      perPage = 10,
      sortField = "created_at",
      sortOrder = "asc",
    } = req.query;

    
    page = Math.max(1, Number(page));
    perPage = Math.max(1, Math.min(Number(perPage), 100));
    const offset = (page - 1) * perPage;

    const allowedFields = ["nombre", "precio", "stock", "created_at"];
    if (!allowedFields.includes(sortField)) sortField = "created_at";

    const allowedOrders = ["asc", "desc"];
    if (!allowedOrders.includes(sortOrder.toLowerCase())) sortOrder = "asc";

    
    const productos = await getProductosFilteredDB({
      sortField,
      sortOrder,
      limit: perPage,
      offset,
    });

    const totalRecords = await getProductosFilteredDB({
      countOnly: true,
    });

    const totalPages = Math.ceil(totalRecords / perPage);

    res.json({ productos, totalRecords, totalPages });
  } catch (err) {
    console.error(`Error en productos/dashboard: ${err.message}`);
    logAction(`Error en productos/dashboard: ${err.message}`);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

export const obtenerProductoPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

    const producto = await Producto.obtenerProductoPorId(id);
    if (!producto)
      return res.status(404).json({ message: "Producto no encontrado" });

    res.json(producto);
  } catch (err) {
    console.error(`Error al obtener producto: ${err.message}`);
    res.status(500).json({ message: "Error al obtener producto" });
  }
};


export const obtenerTipoProducto = async (req, res) => {
  try {
    const types = await getTipoProducto();
    res.json(types);
  } catch (error) {
    console.error("Error obteniendo tipo de producto:", error.message);
    res.status(500).json({ error: "Error obteniendo tipo de producto" });
  }
};


export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, id_tipo } = req.body;

  
    if (!nombre || precio == null || stock == null)
      return res
        .status(400)
        .json({ message: "Campos obligatorios: nombre, precio, stock" });

    if (precio < 0 || stock < 0)
      return res.status(400).json({ message: "Precio y stock deben ser positivos" });

    const id = await Producto.crearProducto({ nombre, descripcion, precio, stock, id_tipo });
    logAction(`Nuevo producto creado: ${nombre}`);
    res.status(201).json({ message: "Producto creado", id });
  } catch (err) {
    console.error(`Error al crear producto: ${err.message}`);
    res.status(500).json({ message: "Error al crear producto" });
  }
};


export const actualizarProducto = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, descripcion, precio, stock, id_tipo } = req.body;

    if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });
    if (!nombre || precio == null || stock == null)
      return res.status(400).json({ message: "Campos obligatorios faltantes" });

    const actualizado = await Producto.actualizarProducto(id, { nombre, descripcion, precio, stock, id_tipo });
    if (!actualizado) return res.status(404).json({ message: "Producto no encontrado" });

    logAction(`Producto actualizado ID: ${id}`);
    res.json({ message: "Producto actualizado correctamente" });
  } catch (err) {
    console.error(`Error al actualizar producto: ${err.message}`);
    res.status(500).json({ message: "Error al actualizar producto" });
  }
};


export const eliminarProducto = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

    const eliminado = await Producto.eliminarProducto(id);
    if (!eliminado) return res.status(404).json({ message: "Producto no encontrado" });

    logAction(`Producto eliminado ID: ${id}`);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    console.error(`Error al eliminar producto: ${err.message}`);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};
