import  {API} from "./api";

export const ventaService = {
  getDashboard: (params) => API.get("/venta/dashboard", { params }),

  getById: (id) => API.get(`/venta/${id}`),

  create: (data) => API.post("/venta", data),

  delete: (id) => API.delete(`/venta/${id}`),

  getReporte: (params) => API.get("/venta/reporte", { params }),
};
