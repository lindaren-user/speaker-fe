import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css' //导入 ElementPlus 组件库所需的全局 CSS 样式
import "@/assets/css/global.css"
import '@/assets/iconfont/iconfont.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
