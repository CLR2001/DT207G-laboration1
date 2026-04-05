import { defineConfig } from "vite";

export default defineConfig({
  server: {
    watch: {
      ignored: ["!**/views/**/*.ejs"],
    },
  },
  build: {
    outDir: 'public/dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/main.ts',
      output: {
        entryFileNames: 'main.js',
        assetFileNames: 'style.css'
      }
    }
  }
});