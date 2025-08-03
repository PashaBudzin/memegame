import { resolve } from "node:path";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        TanStackRouterVite({ autoCodeSplitting: true }),
        viteReact(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },

    build: {
        outDir: "../dist/web",
    },

    server: {
        proxy: {
            "/api": {
                target: "http://localhost:8080/api",
                changeOrigin: true,
                secure: false,
            },
            "/ws": {
                target: "ws://localhost:8080/ws",
                rewriteWsOrigin: true,
                ws: true,
            },
        },
    },
});
