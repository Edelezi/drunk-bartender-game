import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  plugins: [],
  build: {
    minify: false,
  },
  resolve: {
    alias: {
      '#src': path.resolve(__dirname, './src/'),
    },
  },
});
