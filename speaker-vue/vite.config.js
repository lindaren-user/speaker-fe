import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
// 按需导入
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // 自动导入 Element Plus 组件
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    // 自动导入 Element Plus 相关 API
    AutoImport({
      imports: [
        'vue', // 自动导入 vue
        'vue-router', // 自动导入 vue-router
      ],
      resolvers: [ElementPlusResolver()],
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
        // target: 'http://localhost:9090',
        target: 'http://8.134.24.85:9090',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
