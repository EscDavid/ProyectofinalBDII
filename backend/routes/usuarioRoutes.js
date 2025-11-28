import { Router } from "express";
import { body } from "express-validator";
import { loginUser, crearUsuario, obtenerUsuarios } from "../controllers/usuarioController.js";
import {validateFields} from "../middlewares/validateFields.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").notEmpty(),
  ],
  validateFields,
  loginUser
);

router.post(
  "/register",
  verifyToken,
  [
    body("nombre").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("id_rol").isInt(),
  ],
  validateFields,
  crearUsuario
);


router.get("/", verifyToken, obtenerUsuarios);

export default router;
