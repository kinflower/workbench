import './assets/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

import messageBox from './components/message.vue'
import dialogView from './components/dialog.vue'
import HeadView from './components/HeadView.vue'

const app = createApp(App)

app.component('messageBox', messageBox)
app.component('dialogView', dialogView)
app.component('HeadView', HeadView)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.mount('#app')
