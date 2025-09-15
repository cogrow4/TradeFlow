<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Top Navigation -->
    <div class="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 mobile-safe-area">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">T</span>
          </div>
          <span class="ml-2 text-lg font-semibold text-gray-900 dark:text-white">TradeFlow</span>
        </div>
        
        <div class="flex items-center space-x-3">
          <!-- Network Status -->
          <div class="flex items-center">
            <div
              class="w-2 h-2 rounded-full"
              :class="authStore.isOnline ? 'bg-green-500' : 'bg-red-500'"
            ></div>
            <span class="ml-1 text-xs text-gray-500 dark:text-gray-400">
              {{ authStore.isOnline ? 'Online' : 'Offline' }}
            </span>
          </div>

          <!-- Notifications -->
          <button class="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <BellIcon class="w-6 h-6" />
            <span v-if="unreadNotifications > 0" class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {{ unreadNotifications }}
            </span>
          </button>

          <!-- User Menu -->
          <div class="relative">
            <button
              @click="userMenuOpen = !userMenuOpen"
              class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <img
                v-if="authStore.currentUser?.profileImage"
                :src="authStore.currentUser.profileImage"
                :alt="authStore.currentUser.firstName"
                class="w-8 h-8 rounded-full"
              />
              <div v-else class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span class="text-white text-sm font-medium">
                  {{ authStore.currentUser?.firstName?.[0] }}{{ authStore.currentUser?.lastName?.[0] }}
                </span>
              </div>
              <ChevronDownIcon class="w-4 h-4 text-gray-400" />
            </button>

            <!-- User dropdown -->
            <div
              v-if="userMenuOpen"
              class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                @click="userMenuOpen = false"
              >
                Your Profile
              </router-link>
              <router-link
                to="/settings"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                @click="userMenuOpen = false"
              >
                Settings
              </router-link>
              <button
                @click="handleSignOut"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="pb-20">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mobile-safe-area">
      <nav class="flex items-center justify-around py-2">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          class="flex flex-col items-center py-2 px-3 rounded-lg transition-colors duration-200"
          :class="[
            $route.path === item.href
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          <component :is="item.icon" class="w-6 h-6 mb-1" />
          <span class="text-xs font-medium">{{ item.name }}</span>
        </router-link>
      </nav>
    </div>

    <!-- Floating Action Button -->
    <button
      @click="showQuickActions = true"
      class="fixed bottom-20 right-4 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 z-30"
    >
      <PlusIcon class="w-6 h-6" />
    </button>

    <!-- Quick Actions Modal -->
    <div
      v-if="showQuickActions"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end justify-center"
      @click="showQuickActions = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-t-xl w-full max-w-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div class="grid grid-cols-2 gap-4">
          <button
            @click="navigateTo('/jobs?action=create')"
            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ClipboardDocumentListIcon class="w-8 h-8 text-primary-600 mb-2" />
            <span class="text-sm font-medium text-gray-900 dark:text-white">New Job</span>
          </button>
          <button
            @click="navigateTo('/customers?action=create')"
            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <UsersIcon class="w-8 h-8 text-primary-600 mb-2" />
            <span class="text-sm font-medium text-gray-900 dark:text-white">Add Customer</span>
          </button>
          <button
            @click="navigateTo('/quotes?action=create')"
            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <DocumentTextIcon class="w-8 h-8 text-primary-600 mb-2" />
            <span class="text-sm font-medium text-gray-900 dark:text-white">Create Quote</span>
          </button>
          <button
            @click="navigateTo('/inventory?action=scan')"
            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <QrCodeIcon class="w-8 h-8 text-primary-600 mb-2" />
            <span class="text-sm font-medium text-gray-900 dark:text-white">Scan Barcode</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  CubeIcon,
  CalendarIcon,
  ChartBarIcon,
  BellIcon,
  ChevronDownIcon,
  PlusIcon,
  QrCodeIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const userMenuOpen = ref(false)
const showQuickActions = ref(false)
const unreadNotifications = ref(3)

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Jobs', href: '/jobs', icon: ClipboardDocumentListIcon },
  { name: 'Customers', href: '/customers', icon: UsersIcon },
  { name: 'Schedule', href: '/schedule', icon: CalendarIcon },
  { name: 'More', href: '/more', icon: ChartBarIcon },
]

const navigateTo = (path: string) => {
  router.push(path)
  showQuickActions.value = false
}

const handleSignOut = async () => {
  await authStore.signOut()
  userMenuOpen.value = false
}

onMounted(() => {
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('.relative')) {
      userMenuOpen.value = false
    }
  })

  // Sync pending changes when coming online
  if (authStore.isOnline) {
    authStore.syncPendingChanges()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', () => {})
})
</script>