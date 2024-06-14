import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@/styles/tailwind.scss'
import SetupCalendar from 'v-calendar'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(SetupCalendar, {})

app.mount('#app')
