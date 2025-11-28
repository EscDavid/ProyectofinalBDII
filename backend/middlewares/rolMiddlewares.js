export function verificarRolAdmin(req, res, next) {
    if (req.user?.rol !== "ADMIN") {
      return res.status(403).json({ message: "Acceso denegado. Requiere rol ADMIN." });
    }
    next();
  }
  