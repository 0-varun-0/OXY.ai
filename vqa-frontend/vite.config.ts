import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // explicit entry (optional) if you have multiple pages:
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
      },
    },
  },
  // ensure heavy dependencies are pre-bundled
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "framer-motion",
      "lucide-react"
    ],
  },
});
