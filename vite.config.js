import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://stocklinker.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/oauth2': {
        target: 'https://stocklinker.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/login/oauth2': {
        target: 'https://stocklinker.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
