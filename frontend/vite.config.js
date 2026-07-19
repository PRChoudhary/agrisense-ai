import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },

  test: {
    environment: 'jsdom',
    setupFiles: ['./src/vitest.setup.js'],
    globals: true,
  },

  build: {
    // Increase warning limit slightly (530KB for React+Framer+Recharts is expected)
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Split vendor libraries into separate cacheable chunks
        manualChunks: {
          // React core — cached longest
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],

          // Animation library
          'vendor-motion': ['framer-motion'],

          // Data layer
          'vendor-query': ['@tanstack/react-query', '@tanstack/react-query-devtools'],

          // Charts
          'vendor-charts': ['recharts'],

          // Maps
          'vendor-maps': ['leaflet', 'react-leaflet'],

          // Forms + validation
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],

          // i18n
          'vendor-i18n': ['i18next', 'react-i18next'],

          // Utilities
          'vendor-utils': ['axios', 'clsx', 'tailwind-merge', 'date-fns'],

          // Markdown rendering (used by CopilotPage)
          'vendor-markdown': ['react-markdown'],
        },
      },
    },
  },
})
