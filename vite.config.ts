import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3001', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  // هاد الجزء هو "السر" باش تخرج البوت من السيت الرئيسي
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'), // السيت ديال LorPulse
        chat: path.resolve(__dirname, 'chat.html'),  // البوت المستقل ديال الكليان
      },
    },
  },
});