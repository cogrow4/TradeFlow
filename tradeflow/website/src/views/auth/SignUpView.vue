<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Already have an account?
        <router-link to="/auth/signin" class="font-medium text-primary-600 hover:text-primary-500">
          Sign in
        </router-link>
      </p>
    </div>

    <div class="space-y-6">
      <!-- Clerk Sign Up Component will be integrated here -->
      <div class="clerk-signup-container">
        <!-- This will be replaced with Clerk's SignUp component -->
        <div class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading registration form...</p>
        </div>
      </div>

      <!-- Terms and conditions -->
      <div class="text-xs text-gray-500 dark:text-gray-400">
        By creating an account, you agree to our
        <a href="#" class="text-primary-600 hover:text-primary-500">Terms of Service</a>
        and
        <a href="#" class="text-primary-600 hover:text-primary-500">Privacy Policy</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useClerk } from '@clerk/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const { signUp } = useClerk()
const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  // Initialize Clerk sign-up component
  // This will be properly integrated with Clerk's Vue components
})
</script>