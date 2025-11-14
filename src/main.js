import { createApp } from 'vue'
import App from './App.vue'
import router from './router'   // ✅ 一定要匯入 router

createApp(App)
  .use(router)                 // ✅ 一定要 use(router)
  .mount('#app')
