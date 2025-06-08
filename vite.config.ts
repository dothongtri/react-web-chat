import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server: {
    port: 3000, // 👉 Đổi số này theo ý bạn
    proxy: {
      "/api": "http://localhost:8080",
    },
    headers: {
    },
  },
});
