import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const header = req.headers["authorization"];

  if (!header)
    return res.status(401).json({ message: "Token requerido" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id_usuario: decoded.id_usuario,
      rol: decoded.rol
    };

    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido" });
  }
};

export default verifyToken;