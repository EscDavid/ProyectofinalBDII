import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import productoRoutes from "./routes/productoRoutes.js";
import ventaRoutes from "./routes/ventaRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import dotenv from "dotenv";
dotenv.config();


const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
}));
app.use(express.json());

app.use("/user", usuarioRoutes);
app.use("/productos", productoRoutes);
app.use("/ventas", ventaRoutes);

app.get("/", (req, res) => {
  res.json({ message: "backend activo" });
});

app.use(errorHandler);

export default app;
