import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const proxyTarget = env.VITE_PROXY_TARGET || "http://127.0.0.1:8000";
  const espTarget = env.VITE_ESP_URL || "http://192.168.0.216";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
        },
        "/esp": {
          target: espTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/esp/, "") || "/",
        },
      },
    },
  };
});
