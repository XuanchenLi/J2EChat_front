import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import installElementPlus from './plugins/element'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus'

const app = createApp(App)
installElementPlus(app)
app.use(ElementPlus).use(store).use(router).mount('#app')
app.config.globalProperties.$http = axios;
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
axios.defaults.withCredentials = true;
