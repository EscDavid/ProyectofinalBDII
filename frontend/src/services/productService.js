import { API } from "./api";

export const productService = {
  getDashboard: async (params) => {
    const res = await API.get("/productos/dashboard", { params });
    return res.data; 
  },

  getProductTypes: async () => {
    const res = await API.get("/productos/productTypes");
    return res.data;
  },

  getById: async (id) => {
    const res = await API.get(`/productos/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await API.post("/productos", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await API.put(`/productos/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await API.delete(`/productos/${id}`);
    return res.data;
  },
};

