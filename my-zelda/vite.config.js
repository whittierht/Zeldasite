import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        full: resolve(__dirname, 'src/compendium/full.html'),
      },
    },
  },
  server: {
    open: 'index.html', 
  },
});
