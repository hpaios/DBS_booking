import { defineConfig, loadEnv } from "vite";
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    base: "/",
    build: {
      chunkSizeWarningLimit: 1000
    },
    server: {
      proxy: {
        // 🔵 Публічний API (з токеном)
        "/roapi": {
          target: "https://api.roapp.io/v2",
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/roapi/, ""),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader(
                "Authorization",
                `Bearer ${env.VITE_ROAPP_TOKEN}`
              );
              proxyReq.setHeader("Accept", "application/json");
            });
          },
        },

        // 🟢 Внутрішній API (без токена)
        "/dbs": {
          target: "https://dbs.roapp.page",
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/dbs/, ""),
        },
      },
    },
  };
});
