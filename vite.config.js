import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [vue()]

  // Devtools solo in sviluppo
  if (mode === 'development') {
    const { default: VueDevTools } = await import('vite-plugin-vue-devtools')
    plugins.push(VueDevTools())
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    build: {
      // Chunk splitting per vendor pesanti
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'supabase': ['@supabase/supabase-js'],
            'editor': [
              '@tiptap/vue-3',
              '@tiptap/starter-kit',
              '@tiptap/extension-image',
              '@tiptap/extension-link',
              '@tiptap/extension-placeholder',
            ],
          },
        },
      },
      // Target moderno per bundle più piccoli
      target: 'es2020',
      // Compressione CSS
      cssMinify: true,
    },
  }
})
