import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [
        react(),
        eslint({
            lintOnStart: true,
            failOnError: mode === "production",
        }),
    ],
    server: {
        proxy: {
            "/api": "http://localhost:8001",
        },
    },
    // To automatically open the app in the browser whenever the server starts,
    // uncomment the following lines:
    // server: {
    //   open: true
    // }
}));