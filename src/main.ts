import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@/styles/tailwind.scss'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'
import { initializeApp } from 'firebase/app'
// import { firebaseConfig } from './assets/config'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VCalendar, {})
export const firebase = initializeApp({
  apiKey: import.meta.env.API_KEY,
  authDomain: import.meta.env.AUTH_DOMAIN,
  databaseURL: import.meta.env.DATABASE_URL,
  projectId: import.meta.env.PROJECT_ID,
  storageBucket: import.meta.env.STORAGE_BUCKET,
  messagingSenderId: import.meta.env.MESSAGING_SENDER_ID,
  appId: import.meta.env.APP_ID,
  measurementId: import.meta.env.MEASUREMENT_ID,
})

app.mount('#app')
