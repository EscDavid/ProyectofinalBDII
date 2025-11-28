import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      components: path.resolve(__dirname, "src/components"),
      pages: path.resolve(__dirname, "src/pages"),
      layout: path.resolve(__dirname, "src/layout"),
      services: path.resolve(__dirname, "src/services"),
      context: path.resolve(__dirname, "src/context"),
    },
  },
});
