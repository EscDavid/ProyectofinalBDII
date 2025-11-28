import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:3000", // tu backend
});

// Interceptor para agregar el token automáticamente
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

