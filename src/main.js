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
app.use(router)
app.mount('#app')

// Initialize auth after mounting the app to avoid blocking the initial render
authStore.initializeAuth().catch((err) => {
  console.error('Failed to initialize auth:', err)
})


