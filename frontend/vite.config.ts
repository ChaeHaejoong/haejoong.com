import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://localhost:3030",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
      "/uploads": {
        target: "http://localhost:3030",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
