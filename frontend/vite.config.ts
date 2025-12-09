import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: ".",                 // project root is 'frontend'
  plugins: [react()],
  build: {
    outDir: "dist",          // Vercel will serve this
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
    },
  },
});
