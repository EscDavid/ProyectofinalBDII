import { Venta } from "../models/ventaModel.js";
import { logAction } from "../libs/logger.js";

export const obtenerVentasDashboard = async (req, res) => {
  try {
    let { page = 1, perPage = 10, sortField = "fecha", sortOrder = "desc", id_usuario } = req.query;

    const offset = (page - 1) * perPage;

    const ventas = await Venta.obtenerFiltradas({
      sortField,
      sortOrder,
      limit: perPage,
      offset,
      id_usuario
    });

    const totalRecords = await Venta.obtenerFiltradas({ countOnly: true, id_usuario });

    res.json({
      ventas,
      totalRecords,
      totalPages: Math.ceil(totalRecords / perPage)
    });

  } catch (err) {
    res.status(500).json({ message: "Error al obtener ventas" });
  }
};

export const obtenerVentaPorId = async (req, res) => {
  try {
    const venta = await Venta.obtenerPorId(req.params.id);

    if (!venta) return res.status(404).json({ message: "Venta no encontrada" });

    if (req.user.rol !== "ADMIN" && venta.id_usuario !== req.user.id_usuario)
      return res.status(403).json({ message: "No autorizado" });

    res.json(venta);

  } catch {
    res.status(500).json({ message: "Error al obtener venta" });
  }
};

export const crearVenta = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const { id_producto, cantidad } = req.body;

    const id = await Venta.crear({ id_producto, id_usuario, cantidad });
    logAction(`Venta creada por usuario ${id_usuario}`);

    res.status(201).json({ message: "Venta creada", id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const eliminarVenta = async (req, res) => {
  try {
    const venta = await Venta.obtenerPorId(req.params.id);

    if (!venta) return res.status(404).json({ message: "Venta no existe" });

    if (req.user.rol !== "ADMIN" && venta.id_usuario !== req.user.id_usuario)
      return res.status(403).json({ message: "No autorizado" });

    await Venta.eliminar(req.params.id);
    logAction(`Venta eliminada ${req.params.id}`);

    res.json({ message: "Venta eliminada" });

  } catch {
    res.status(500).json({ message: "Error al eliminar venta" });
  }
};

export const generarReporteVentas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, id_usuario } = req.query;

    const reporte = await Venta.generarReporte({ fecha_inicio, fecha_fin, id_usuario });

    res.json(reporte);
  } catch {
    res.status(500).json({ message: "Error al generar reporte" });
  }
};
