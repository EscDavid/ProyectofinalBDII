import { Router } from "express";
import { body } from "express-validator";
import {
    obtenerVentasDashboard,
    obtenerVentaPorId,
    crearVenta,
    eliminarVenta,
    generarReporteVentas,
} from "../controllers/ventaController.js";
import { validateFields } from "../middlewares/validateFields.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { restrictToUserData } from "../middlewares/restrictToUserData.js";

const router = Router();

router.get("/dashboard", verifyToken, validateFields, restrictToUserData, obtenerVentasDashboard);
router.get("/reporte", verifyToken, validateFields, restrictToUserData, generarReporteVentas);

router.get("/:id", verifyToken, validateFields, restrictToUserData, obtenerVentaPorId);
router.post("/", verifyToken, validateFields, restrictToUserData, crearVenta);
router.delete("/:id", verifyToken, validateFields, restrictToUserData, eliminarVenta);


export default router;