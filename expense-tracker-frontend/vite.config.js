import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // The Spring Boot backend has no CORS configuration, so a browser app on
  // http://localhost:5173 cannot call http://localhost:8080 directly.
  // In development we let Vite forward /api requests to the backend instead.
  const backendTarget = env.VITE_PROXY_TARGET || "http://localhost:8080";

  const proxy = {
    "/api": { target: backendTarget, changeOrigin: true },
  };

  return {
    plugins: [react()],
    server: { port: 5173, proxy },
    preview: { port: 4173, proxy },
  };
});
