import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Antd from 'ant-design-vue';
import App from './App.vue'
import 'ant-design-vue/dist/reset.css';
import router from './router'
import './access'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd);
app.mount('#app');

