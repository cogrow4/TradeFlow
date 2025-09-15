import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { ClerkPlugin } from '@clerk/vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// Configure Clerk
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_demo'

app.use(createPinia())
app.use(router)
app.use(ClerkPlugin, {
  publishableKey: clerkPublishableKey,
  afterSignInUrl: '/',
  afterSignUpUrl: '/',
})

app.mount('#app')
