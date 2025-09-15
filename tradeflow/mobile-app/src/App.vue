<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import MobileLayout from '@/components/layout/MobileLayout.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initialize()
})
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900 mobile-safe-area">
    <MobileLayout v-if="authStore.isAuthenticated">
      <RouterView />
    </MobileLayout>
    <AuthLayout v-else>
      <RouterView />
    </AuthLayout>
  </div>
</template>
