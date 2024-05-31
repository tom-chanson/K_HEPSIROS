import react from "@vitejs/plugin-react";
import { internalIpV4 } from "internal-ip";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const mobile = !!/android|ios/.exec(process.env.TAURI_ENV_PLATFORM);

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    react(),
    VitePWA({
      workbox: {
        globPatterns: ["**/*"],
      },
      // add this to cache all the
      // static assets in the public folder
      includeAssets: ["**/*"],
      manifest: {
        theme_color: "#f69435",
        background_color: "#f69435",
        display: "standalone",
        scope: "/",
        start_url: "/",
        short_name: "K'HEPSIROS",
        description: "",
        name: "K'HEPSIROS",
        icons: [
          {
            src: "/logo192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ], // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: mobile ? "0.0.0.0" : false,
    hmr: mobile
      ? {
          protocol: "ws",
          host: await internalIpV4(),
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
    proxy: {
      "/edt": {
        target: "https://edtmobiliteng.wigorservices.net/WebPsDyn.aspx",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/edt/, ""),
      },
    },
  },
}));
