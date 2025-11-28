import { Router } from "express";
import { body } from "express-validator";
import { loginUser, crearUsuario, obtenerUsuarios } from "../controllers/usuarioController.js";
import validarCampos from "../middlewares/validateFields.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { verificarRolAdmin } from "../middlewares/roleMiddleware.js";

const router = Router();

router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").notEmpty(),
  ],
  validarCampos,
  loginUser
);

router.post(
  "/",
  verificarToken,
  verificarRolAdmin,
  [
    body("nombre").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("id_rol").isInt(),
  ],
  validarCampos,
  crearUsuario
);

router.get("/", verificarToken, verificarRolAdmin, obtenerUsuarios);

export default router;
