import { defineConfig } from "vite";
import zaloMiniApp from "zmp-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default () => {
  return defineConfig({

    base: "",
    plugins: [zaloMiniApp(), react()],
    server: {
      port: 2999,
    },
    build: {
      assetsInlineLimit: 0,
    },
    resolve: {
      alias: {
        "@": path.join(__dirname, "src"),
      },
    },
  });
};
