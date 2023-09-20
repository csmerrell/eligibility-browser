import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // make sure you have an index.ts file for the router in a 'router' folder
import { createPinia } from 'pinia' // make sure you have installed Pinia

// Initialize Pinia store
const pinia = createPinia()

// Create the app instance
const app = createApp(App)

// Use the router and store
app.use(router)
app.use(pinia)

// Mount the app
app.mount('#app')
