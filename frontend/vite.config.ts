import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@src': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/api/core'),
      core: path.resolve(__dirname, './src/api/core')
    }
  },
  server: {
    port: 3000,
    headers: {
      'cache-control': 'no-store'
    },
    proxy: {
      // Proxy API requests to the backend server
      '^/api/(?!.*\\.ts$).*': {
        // Exclude .ts files from being proxied
        target: process.env.VITE_API_BASE_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err);
          });
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core packages
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router-dom/')
          ) {
            return 'react-vendor';
          }

          // Radix UI components
          if (id.includes('node_modules/@radix-ui/')) {
            return 'radix-ui';
          }

          // Other UI libraries
          if (
            id.includes('node_modules/lucide-react/') ||
            id.includes('node_modules/recharts/') ||
            id.includes('node_modules/sonner/') ||
            id.includes('node_modules/embla-carousel-react/')
          ) {
            return 'ui-components';
          }
        }
      }
    }
  }
});
