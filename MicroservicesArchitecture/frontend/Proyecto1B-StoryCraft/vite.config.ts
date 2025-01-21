import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  /*
  server: {
    proxy: {
      // Redirigir las solicitudes HTTP/WS a tu backend
      '/api': {
        target: 'http://localhost:3000', // URL del backend
        changeOrigin: true, // Cambia el origen para que coincida con el backend
        secure: false, // Si el backend no usa HTTPS
        ws: true, // Habilita WebSocket proxying
      },
    },
  },*/
})
