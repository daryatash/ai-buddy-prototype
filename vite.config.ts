import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'node:path';
import { githubPagesSpa } from '@sctg/vite-plugin-github-pages-spa';

// https://vite.dev/config/
export default defineConfig({
  base: '/ai-buddy-prototype/',
  plugins: [
    react(),
    githubPagesSpa(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
