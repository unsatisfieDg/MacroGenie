import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for flexible deployment
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Security: Disable source maps in production
    sourcemap: false,
    // Minify and obfuscate code
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log statements
        drop_debugger: true, // Remove debugger statements
      },
      mangle: true, // Shorten variable names (obfuscation)
      format: {
        comments: false, // Remove all comments
      },
    },
    // Optimize build
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'recharts-vendor': ['recharts'],
          'icons-vendor': ['lucide-react']
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
