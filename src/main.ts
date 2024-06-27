import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@/styles/tailwind.scss'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from './assets/config'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VCalendar, {})
export const firebase = initializeApp(firebaseConfig)

app.mount('#app')
