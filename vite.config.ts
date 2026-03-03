import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
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
