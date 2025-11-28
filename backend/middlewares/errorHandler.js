export const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: Object.values(err.errors).map(val => val.message)
      });
    }
  
    if (err.code === 11000) {
      return res.status(400).json({
        error: 'Registro duplicado'
      });
    }
  
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
  
    res.status(500).json({ 
      error: "Error interno del servidor",
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  };