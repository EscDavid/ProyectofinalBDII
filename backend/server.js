import app from './app.js';

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});