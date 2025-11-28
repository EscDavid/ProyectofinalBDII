import { Router } from "express";
import { body } from "express-validator";
import {
  crearProducto,
  obtenerProductosDashboard,
  obtenerProductoPorId,
  actualizarProducto,
  registrarVenta,
  obtenerVentas,
  obtenerTipoProducto
} from "../controllers/productoController.js";
import validarCampos from "../middlewares/validarCampos.js";

const router = Router();

// Obtener productos (dashboard con paginación y filtros)
router.get("/dashboard", obtenerProductosDashboard);

// Obtener tipos de producto
router.get("/productTypes", obtenerTipoProducto);

// Obtener producto por ID
router.get("/:id", obtenerProductoPorId);

// Crear producto
router.post(
  "/",
  [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("precio")
      .isFloat({ gt: 0 })
      .withMessage("El precio debe ser mayor a 0"),
    body("stock")
      .isInt({ min: 0 })
      .withMessage("El stock debe ser un número entero mayor o igual a 0"),
    body("id_tipo")
      .isInt({ gt: 0 })
      .withMessage("Debe seleccionar un tipo de producto válido"),
  ],
  validarCampos,
  crearProducto
);

// Actualizar producto
router.put(
  "/:id",
  [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("precio")
      .isFloat({ gt: 0 })
      .withMessage("El precio debe ser mayor a 0"),
    body("stock")
      .isInt({ min: 0 })
      .withMessage("El stock debe ser un número entero mayor o igual a 0"),
    body("id_tipo")
      .isInt({ gt: 0 })
      .withMessage("Debe seleccionar un tipo de producto válido"),
  ],
  validarCampos,
  actualizarProducto
);

// Registrar una venta
router.post(
  "/venta",
  [
    body("id_producto")
      .isInt({ gt: 0 })
      .withMessage("Debe indicar un producto válido"),
    body("cantidad")
      .isInt({ gt: 0 })
      .withMessage("La cantidad debe ser mayor a 0"),
  ],
  validarCampos,
  registrarVenta
);

// Obtener historial de ventas
router.get("/ventas/historial", obtenerVentas);

export default router;
