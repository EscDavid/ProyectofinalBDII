import { Router } from "express";
import { body } from "express-validator";
import {
  crearProducto,
  obtenerProductosDashboard,
  obtenerProductoPorId,
  actualizarProducto,
  obtenerTipoProducto,eliminarProducto
} from "../controllers/productoController.js";
import {validateFields} from "../middlewares/validateFields.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

// Obtener productos (dashboard con paginación y filtros)
router.get("/dashboard", verifyToken,obtenerProductosDashboard);

// Obtener tipos de producto
router.get("/productTypes",  verifyToken,obtenerTipoProducto);

// Obtener producto por ID
router.get("/:id", verifyToken, obtenerProductoPorId);

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
  verifyToken,validateFields,
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
  verifyToken, validateFields,
  actualizarProducto
);

router.delete("/:id",  verifyToken,validateFields, eliminarProducto);


export default router;
