import { Venta } from "../models/ventaModel.js";
import { logAction } from "../libs/logger.js";

export const obtenerVentasDashboard = async (req, res) => {
  try {
    let {
      page = 1,
      perPage = 10,
      sortField = "fecha",
      sortOrder = "desc",
    } = req.query;

    page = Math.max(1, Number(page));
    perPage = Math.max(1, Math.min(Number(perPage), 100));
    const offset = (page - 1) * perPage;

    const ventas = await Venta.obtenerFiltradas({
      sortField,
      sortOrder,
      limit: perPage,
      offset,
    });

    const totalRecords = await Venta.obtenerFiltradas({ countOnly: true });
    const totalPages = Math.ceil(totalRecords / perPage);

    res.json({ ventas, totalRecords, totalPages });
  } catch (err) {
    console.error("Error en ventas/dashboard:", err.message);
    res.status(500).json({ message: "Error al obtener ventas" });
  }
};

export const obtenerVentaPorId = async (req, res) => {
  try {
    const venta = await Venta.obtenerPorId(req.params.id);
    if (!venta) return res.status(404).json({ message: "Venta no encontrada" });
    res.json(venta);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener venta" });
  }
};

export const crearVenta = async (req, res) => {
  try {
    const { id_producto, id_usuario, cantidad } = req.body;
    const id = await Venta.crear({ id_producto, id_usuario, cantidad });
    logAction(`Venta registrada: producto ${id_producto}, usuario ${id_usuario}`);
    res.status(201).json({ message: "Venta registrada correctamente", id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const eliminarVenta = async (req, res) => {
  try {
    const eliminado = await Venta.eliminar(req.params.id);
    if (!eliminado) return res.status(404).json({ message: "Venta no encontrada" });
    logAction(`Venta eliminada ID: ${req.params.id}`);
    res.json({ message: "Venta eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar venta" });
  }
};

export const generarReporteVentas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, id_usuario } = req.query;
    if (!fecha_inicio || !fecha_fin)
      return res.status(400).json({ message: "Debe especificar fecha_inicio y fecha_fin" });

    const reporte = await Venta.generarReporte({ fecha_inicio, fecha_fin, id_usuario });
    res.json(reporte);
  } catch (err) {
    console.error("Error generando reporte de ventas:", err.message);
    res.status(500).json({ message: "Error al generar reporte de ventas" });
  }
};
