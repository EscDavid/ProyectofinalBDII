export const restrictToUserData = (req, res, next) => {
    const { rol, id_usuario } = req.user;
  
    
    if (rol === "ADMIN") return next();
  
   
    req.query.id_usuario = id_usuario;
    req.body.id_usuario = id_usuario;
  
    next();
  };
  