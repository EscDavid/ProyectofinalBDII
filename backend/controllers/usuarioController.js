import jwt from "jsonwebtoken";
import { User } from "../models/usuarioModel.js";
import { logAction } from "../libs/logger.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await User.autenticar(email, password);
    if (!usuario) return res.status(401).json({ message: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.id_rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    logAction(`Usuario logueado: ${usuario.email}`);
    res.json({ token, usuario: { id: usuario.id_usuario, nombre: usuario.nombre, rol: usuario.id_rol } });
  } catch (err) {
    res.status(500).json({ message: "Error en autenticación" });
  }
};

export const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, id_rol } = req.body;
    const id = await User.crear({ nombre, email, password, id_rol });
    logAction(`Usuario creado: ${email}`);
    res.status(201).json({ message: "Usuario creado", id });
  } catch (err) {
    res.status(500).json({ message: "Error al crear usuario" });
  }
};

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.obtenerTodos();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};
