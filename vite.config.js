

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import veauryVitePlugins from 'veaury/vite/index.js'
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    veauryVitePlugins({
      type: 'vue',
      // Configuration of @vitejs/plugin-vue
      vueOptions:{ vue:vue({
        template: {
            transformAssetUrls: {
                base: null,
                includeAbsolute: false,
            },
        },
    })
  }

    }),
    // vue(),

  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  build: {
    chunkSizeWarningLimit:500,
    build: {
      outDir: "../app/"
    }
  },
  base: process.env.NODE_ENV === 'production'
          ? './' // prod
          : '/', // dev
  server: {
    port: 8080,
    host:false
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
