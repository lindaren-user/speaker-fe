import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { VantResolver } from 'unplugin-vue-components/resolvers';

import purgeCSS from 'vite-plugin-purgecss';

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    Components({
      resolvers: [ElementPlusResolver(), VantResolver()],
    }),
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [ElementPlusResolver()],
    }),
    purgeCSS({
      content: ['./src/**/*.html', './src/**/*.vue', './src/**/*.js'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9090',
        // target: 'http://8.134.24.85:9090',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
