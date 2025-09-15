<template>
  <div class="p-4 space-y-6">
    <!-- Welcome Header -->
    <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
      <h1 class="text-2xl font-bold mb-2">
        Welcome back, {{ authStore.currentUser?.firstName }}!
      </h1>
      <p class="text-primary-100">
        Here's what's happening with your business today.
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 gap-4">
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Active Jobs</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.activeJobs }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
            <ClipboardDocumentListIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Today's Revenue</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ stats.todayRevenue.toLocaleString() }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <CurrencyDollarIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Pending Invoices</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.pendingInvoices }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
            <DocumentTextIcon class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Low Stock Items</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.lowStockItems }}</p>
          </div>
          <div class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
            <ExclamationTriangleIcon class="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Schedule -->
    <div class="card">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Today's Schedule</h3>
          <router-link
            to="/schedule"
            class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
          >
            View All
          </router-link>
        </div>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="job in todaysJobs"
          :key="job._id"
          class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          @click="$router.push(`/jobs/${job._id}`)"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ job.title }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ job.customer?.firstName }} {{ job.customer?.lastName }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ job.location.address }}
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatTime(job.scheduledStart) }}
              </span>
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                :class="getStatusColor(job.status)"
              >
                {{ job.status.replace('_', ' ') }}
              </span>
            </div>
          </div>
        </div>
        <div v-if="todaysJobs.length === 0" class="p-8 text-center">
          <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No jobs scheduled</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You have a free day! Enjoy your time off.
          </p>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="activity in recentActivity"
          :key="activity.id"
          class="p-4"
        >
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center"
                :class="getActivityIconColor(activity.type)"
              >
                <component :is="getActivityIcon(activity.type)" class="w-4 h-4 text-white" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-white">
                {{ activity.description }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatTimeAgo(activity.timestamp) }}
              </p>
            </div>
          </div>
        </div>
        <div v-if="recentActivity.length === 0" class="p-8 text-center">
          <ClockIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No recent activity</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Start by creating your first job or customer.
          </p>
        </div>
      </div>
    </div>

    <!-- Offline Indicator -->
    <div
      v-if="!authStore.isOnline"
      class="fixed bottom-20 left-4 right-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3"
    >
      <div class="flex items-center">
        <ExclamationTriangleIcon class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
        <p class="text-sm text-yellow-800 dark:text-yellow-200">
          You're offline. Changes will sync when you're back online.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()

const stats = ref({
  activeJobs: 0,
  todayRevenue: 0,
  pendingInvoices: 0,
  lowStockItems: 0,
})

const todaysJobs = ref([])
const recentActivity = ref([])

const getStatusColor = (status: string) => {
  const colors = {
    quoted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    scheduled: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    in_progress: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    on_hold: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  }
  return colors[status] || colors.quoted
}

const getActivityIcon = (type: string) => {
  const icons = {
    job_created: ClipboardDocumentListIcon,
    job_completed: CheckCircleIcon,
    customer_added: UserIcon,
    invoice_sent: DocumentTextIcon,
    payment_received: CurrencyDollarIcon,
  }
  return icons[type] || ClockIcon
}

const getActivityIconColor = (type: string) => {
  const colors = {
    job_created: 'bg-blue-500',
    job_completed: 'bg-green-500',
    customer_added: 'bg-purple-500',
    invoice_sent: 'bg-yellow-500',
    payment_received: 'bg-green-500',
  }
  return colors[type] || 'bg-gray-500'
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatTimeAgo = (timestamp: number) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const loadDashboardData = async () => {
  try {
    // Load company stats
    if (authStore.currentCompany) {
      const response = await fetch(`/api/companies/${authStore.currentCompany._id}/stats`, {
        headers: {
          'Authorization': `Bearer ${await authStore.currentUser?.getToken()}`
        }
      })
      
      if (response.ok) {
        const companyStats = await response.json()
        stats.value = {
          activeJobs: companyStats.activeJobs,
          todayRevenue: companyStats.todayRevenue || 0,
          pendingInvoices: companyStats.pendingInvoices || 0,
          lowStockItems: companyStats.lowStockItems || 0,
        }
      }
    }

    // Load today's jobs
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
    const endOfDay = startOfDay + 86400000

    const jobsResponse = await fetch(`/api/jobs?startDate=${startOfDay}&endDate=${endOfDay}`, {
      headers: {
        'Authorization': `Bearer ${await authStore.currentUser?.getToken()}`
      }
    })
    
    if (jobsResponse.ok) {
      todaysJobs.value = await jobsResponse.json()
    }

    // Load recent activity
    const activityResponse = await fetch('/api/activity/recent', {
      headers: {
        'Authorization': `Bearer ${await authStore.currentUser?.getToken()}`
      }
    })
    
    if (activityResponse.ok) {
      recentActivity.value = await activityResponse.json()
    }
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>