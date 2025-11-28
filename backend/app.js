import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import productoRoutes from "./routes/productoRoutes.js";
import ventaRoutes from "./routes/ventaRoutes.js";

const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
}));
app.use(express.json());


app.use("/productos", productoRoutes);
app.use("/ventas", ventaRoutes);

app.get("/", (req, res) => {
  res.json({ message: "backend activo" });
});

app.use(errorHandler);

export default app;
