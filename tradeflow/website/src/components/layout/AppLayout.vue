<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out"
         :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }">
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">T</span>
          </div>
          <span class="ml-2 text-xl font-semibold text-gray-900 dark:text-white">TradeFlow</span>
        </div>
        <button @click="toggleSidebar" class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
          <XIcon class="w-5 h-5" />
        </button>
      </div>

      <nav class="mt-6 px-3">
        <div class="space-y-1">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            :class="[
              $route.path === item.href
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
            ]"
          >
            <component :is="item.icon" class="mr-3 h-5 w-5 flex-shrink-0" />
            {{ item.name }}
          </router-link>
        </div>

        <!-- User section -->
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center px-3">
            <div class="flex-shrink-0">
              <img
                v-if="authStore.currentUser?.profileImage"
                :src="authStore.currentUser.profileImage"
                :alt="authStore.currentUser.firstName"
                class="h-8 w-8 rounded-full"
              />
              <div v-else class="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span class="text-white text-sm font-medium">
                  {{ authStore.currentUser?.firstName?.[0] }}{{ authStore.currentUser?.lastName?.[0] }}
                </span>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ authStore.currentUser?.firstName }} {{ authStore.currentUser?.lastName }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ authStore.currentUser?.role }}
              </p>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Top navigation -->
      <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:bg-gray-800 dark:border-gray-700">
        <button @click="toggleSidebar" class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
          <MenuIcon class="w-5 h-5" />
        </button>

        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div class="flex flex-1"></div>
          <div class="flex items-center gap-x-4 lg:gap-x-6">
            <!-- Theme toggle -->
            <button
              @click="toggleTheme"
              class="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <SunIcon v-if="isDark" class="w-5 h-5" />
              <MoonIcon v-else class="w-5 h-5" />
            </button>

            <!-- Notifications -->
            <button class="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 relative">
              <BellIcon class="w-5 h-5" />
              <span v-if="unreadNotifications > 0" class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {{ unreadNotifications }}
              </span>
            </button>

            <!-- Clerk header -->
            <div class="hidden sm:block">
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>

            <!-- User menu -->
            <div class="relative">
              <button
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center gap-x-2 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <img
                  v-if="authStore.currentUser?.profileImage"
                  :src="authStore.currentUser.profileImage"
                  :alt="authStore.currentUser.firstName"
                  class="h-6 w-6 rounded-full"
                />
                <div v-else class="h-6 w-6 rounded-full bg-primary-600 flex items-center justify-center">
                  <span class="text-white text-xs font-medium">
                    {{ authStore.currentUser?.firstName?.[0] }}{{ authStore.currentUser?.lastName?.[0] }}
                  </span>
                </div>
                <ChevronDownIcon class="w-4 h-4" />
              </button>

              <!-- User dropdown -->
              <div
                v-if="userMenuOpen"
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700"
              >
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Your Profile
                </router-link>
                <router-link
                  to="/settings"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
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

      <!-- Page content -->
      <main class="py-6">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <slot />
        </div>
      </main>
    </div>

    <!-- Mobile sidebar overlay -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/vue'
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  CubeIcon,
  CalendarIcon,
  ChartBarIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  DocumentIcon,
  BellIcon,
  MenuIcon,
  XIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()

const sidebarOpen = ref(false)
const userMenuOpen = ref(false)
const isDark = ref(false)
const unreadNotifications = ref(3)

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Customers', href: '/customers', icon: UsersIcon },
  { name: 'Jobs', href: '/jobs', icon: ClipboardDocumentListIcon },
  { name: 'Quotes', href: '/quotes', icon: DocumentTextIcon },
  { name: 'Invoices', href: '/invoices', icon: DocumentTextIcon },
  { name: 'Inventory', href: '/inventory', icon: CubeIcon },
  { name: 'Schedule', href: '/schedule', icon: CalendarIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
  { name: 'Team', href: '/team', icon: UserGroupIcon },
  { name: 'Messages', href: '/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Documents', href: '/documents', icon: DocumentIcon },
]

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const handleSignOut = async () => {
  await authStore.signOut()
  userMenuOpen.value = false
}

onMounted(() => {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('.relative')) {
      userMenuOpen.value = false
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('click', () => {})
})
</script>