import { Producto} from "../models/productoModel.js";
import { Venta } from "../models/ventaModel.js";

export const validateFields = async (req, res, next) => {
    const path = req.route.path.toLowerCase();
    const method = req.method;

    try {
       
        if (path.includes("productos")) {
            const { nombre, descripcion, precio, stock, id_tipo } = req.body;

     
            if (method === "POST" || method === "PUT") {

                if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
                    return res.status(400).json({ message: "El nombre es obligatorio" });
                }

                if (precio == null || isNaN(precio) || Number(precio) < 0) {
                    return res.status(400).json({ message: "El precio debe ser un número >= 0" });
                }

                if (stock == null || isNaN(stock) || Number(stock) < 0) {
                    return res.status(400).json({ message: "El stock debe ser un número >= 0" });
                }

          
                if (id_tipo) {
                    const tipos = await Producto.obtenerTipos();
                    const tipoExiste = tipos.some(t => t.id_tipo === Number(id_tipo));

                    if (!tipoExiste) {
                        return res.status(400).json({ message: "El tipo de producto no existe" });
                    }
                }
            }

            if (method === "PUT" || method === "DELETE") {
                const id = Number(req.params.id);
                if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

                const producto = await Producto.obtenerProductoPorId(id);
                if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
            }
        }

       
        if (path.includes("ventas")) {
            const { id_producto, id_usuario, cantidad } = req.body;

            if (method === "POST") {
                if (!id_producto || isNaN(id_producto))
                    return res.status(400).json({ message: "id_producto es obligatorio y numérico" });

                if (!id_usuario || isNaN(id_usuario))
                    return res.status(400).json({ message: "id_usuario es obligatorio y numérico" });

                if (!cantidad || isNaN(cantidad) || Number(cantidad) <= 0)
                    return res.status(400).json({ message: "La cantidad debe ser un número > 0" });

                const producto = await Venta.obtenerProducto(id_producto);
                if (!producto) {
                    return res.status(404).json({ message: "El producto no existe" });
                }

                const usuario = await Venta.obtenerUsuario(id_usuario);
                if (!usuario) {
                    return res.status(404).json({ message: "El usuario no existe" });
                }

                const stock = await Venta.obtenerStock(id_producto);
                if (stock < cantidad) {
                    return res.status(400).json({ message: "Stock insuficiente" });
                }
            }

            
            if (method === "DELETE") {
                const venta = await Venta.obtenerPorId(req.params.id);
                if (!venta) return res.status(404).json({ message: "Venta no encontrada" });
            }
        }

        next();
    } catch (error) {
        console.error("Error en validateFields:", error.message);
        return res.status(500).json({ message: "Error interno en validación" });
    }
};
