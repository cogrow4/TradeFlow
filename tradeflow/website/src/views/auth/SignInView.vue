<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Sign in to your account</h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Or
        <router-link to="/auth/signup" class="font-medium text-primary-600 hover:text-primary-500">
          create a new account
        </router-link>
      </p>
    </div>

    <div class="space-y-6">
      <!-- Clerk Sign In Component will be integrated here -->
      <div class="clerk-signin-container">
        <!-- This will be replaced with Clerk's SignIn component -->
        <div class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading authentication...</p>
        </div>
      </div>

      <!-- Demo credentials for development -->
      <div class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">Demo Credentials</h3>
        <p class="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
          For development: Use any email and password to sign in
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useClerk } from '@clerk/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const { signIn } = useClerk()
const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  // Initialize Clerk sign-in component
  // This will be properly integrated with Clerk's Vue components
})
</script>