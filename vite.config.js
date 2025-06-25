import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        full: resolve(__dirname, 'src/compendiums/full.html'),
        botw: resolve(__dirname, 'src/compendiums/botw.html'),
        totk: resolve(__dirname, 'src/compendiums/totk.html'),
        item: resolve(__dirname, 'src/compendiums/item.html')
      },
    },
  },
  server: {
    open: 'index.html', 
  },
});
