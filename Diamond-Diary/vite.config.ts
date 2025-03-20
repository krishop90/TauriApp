import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 5173, // 1420 se 5173 kar do
    strictPort: true, // Yeh ensure karta hai ki 5173 hi use ho
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 5183, // HMR port alag rakh sakte hain, par 5173 se conflict nahi hona chahiye
      }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));