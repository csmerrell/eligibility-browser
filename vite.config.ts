import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import compressionPlugin from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    compressionPlugin({
      algorithm: 'gzip', // You can also use 'brotli' or both 'gzip' and 'brotli'
      ext: '.gz', // File extension for the compressed files
      threshold: 10240, // Only compress files larger than 10KB
      deleteOriginFile: false // Keep the original files
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
