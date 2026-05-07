import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://cm9vfha0dk.execute-api.eu-north-1.amazonaws.com',
        changeOrigin: true,
      },
    },
  },
});
