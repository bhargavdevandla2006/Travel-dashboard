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
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // Ensure Set-Cookie domains are rewritten to the dev host so cookies
        // created by the backend are valid for the browser origin.
        cookieDomainRewrite: "localhost",
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
