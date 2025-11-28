import { Router } from "express";
import { body } from "express-validator";
import {
  obtenerVentasDashboard,
  obtenerVentaPorId,
  crearVenta,
  eliminarVenta,
  generarReporteVentas,
} from "../controllers/ventaController.js";
import validarCampos from "../middlewares/validarCampos.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { verificarRolAdmin } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/dashboard", verificarToken, obtenerVentasDashboard);
router.get("/reporte", verificarToken, generarReporteVentas);

router.get("/:id", verificarToken, obtenerVentaPorId);

router.post(
  "/",
  verificarToken,
  [
    body("id_producto").isInt({ gt: 0 }),
    body("id_usuario").isInt({ gt: 0 }),
    body("cantidad").isInt({ gt: 0 }),
  ],
  validarCampos,
  crearVenta
);

router.delete("/:id", verificarToken, verificarRolAdmin, eliminarVenta);

export default router;
