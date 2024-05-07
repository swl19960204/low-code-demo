import './styles/reset.css'
import './assets/iconfont/iconfont.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import { registerCustomComp } from './components/Custom'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// app.use(registerCustomComp);
app.use(createPinia())
app.use(router)

app.mount('#app')
