import { createApp } from 'vue'
import pinia from './pinia'
import router from './router'
import i18n from './i18n'
import App from './app.vue'
import 'primeicons/primeicons.css'
import './style.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')
