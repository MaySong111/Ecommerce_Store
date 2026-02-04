import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../backend/WebApplication1/wwwroot",
    emptyOutDir: true,
    chunkSizeWarningLimit:1024
  },
  server: {
    port: 3000,
  },
});
