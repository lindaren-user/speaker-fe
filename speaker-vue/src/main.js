import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import 'element-plus/dist/index.css';
import '@/assets/css/global.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import '@/assets/iconfont/iconfont.css';
import 'vant/lib/index.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

// 全局注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app');
