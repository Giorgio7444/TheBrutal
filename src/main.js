import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import './main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const authStore = useAuthStore(pinia)

authStore.initializeAuth()
  .then(() => {
    app.use(router)
    app.mount('#app')
  })
  .catch((err) => {
    console.error('Auth init failed:', err)
    app.use(router)
    app.mount('#app')
  })


