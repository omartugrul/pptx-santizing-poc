import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'configure-response-headers',
      configureServer: (server) => {
        server.middlewares.use((req, res, next) => {
          res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')

          // Set correct MIME type for WASM files
          if (req.url && req.url.endsWith('.wasm')) {
            res.setHeader('Content-Type', 'application/wasm')
          }

          next()
        })
      }
    }
  ],
  define: {
    global: 'globalThis'
  },
  optimizeDeps: {
    exclude: ['pspdfkit']
  },
  assetsInclude: ['**/*.wasm']
})
