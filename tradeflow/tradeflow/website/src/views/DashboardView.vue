<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Dashboard
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back, {{ authStore.currentUser?.firstName }}! Here's what's happening with your business.
        </p>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <button
          type="button"
          class="btn-primary"
          @click="createNewJob"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          New Job
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
              <UsersIcon class="w-5 h-5 text-white" />
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Total Customers
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">
                {{ stats.totalCustomers }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
              <ClipboardDocumentListIcon class="w-5 h-5 text-white" />
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Active Jobs
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">
                {{ stats.activeJobs }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
              <CurrencyDollarIcon class="w-5 h-5 text-white" />
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Pending Invoices
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">
                ${{ stats.pendingAmount.toLocaleString() }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
              <ChartBarIcon class="w-5 h-5 text-white" />
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Total Revenue
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">
                ${{ stats.totalRevenue.toLocaleString() }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Recent Jobs -->
      <div class="card">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Jobs</h3>
        </div>
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div
            v-for="job in recentJobs"
            :key="job._id"
            class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
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
              </div>
              <div class="flex items-center space-x-2">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusColor(job.status)"
                >
                  {{ job.status.replace('_', ' ') }}
                </span>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(job.createdAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <router-link
            to="/jobs"
            class="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            View all jobs
          </router-link>
        </div>
      </div>

      <!-- Upcoming Schedule -->
      <div class="card">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Upcoming Schedule</h3>
        </div>
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div
            v-for="job in upcomingJobs"
            :key="job._id"
            class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            @click="$router.push(`/jobs/${job._id}`)"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ job.title }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ job.location.address }}
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatTime(job.scheduledStart) }}
                </span>
                <CalendarIcon class="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        <div class="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <router-link
            to="/schedule"
            class="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            View full schedule
          </router-link>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <button
            @click="$router.push('/customers')"
            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <UsersIcon class="w-8 h-8 text-primary-600 mb-2" />
            <span class="text-sm font-medium text-gray-900 dark:text-white">Add Customer</span>
          </button>
          <button
            @click="$router.push('/quotes')"
            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <DocumentTextIcon class="w-8 h-8 text-primary-600 mb-2" />
            <span class="text-sm font-medium text-gray-900 dark:text-white">Create Quote</span>
          </button>
          <button
            @click="$router.push('/invoices')"
            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ReceiptPercentIcon class="w-8 h-8 text-primary-600 mb-2" />
            <span class="text-sm font-medium text-gray-900 dark:text-white">Send Invoice</span>
          </button>
          <button
            @click="$router.push('/inventory')"
            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <CubeIcon class="w-8 h-8 text-primary-600 mb-2" />
            <span class="text-sm font-medium text-gray-900 dark:text-white">Check Inventory</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  PlusIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarIcon,
  DocumentTextIcon,
  ReceiptPercentIcon,
  CubeIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const stats = ref({
  totalCustomers: 0,
  activeJobs: 0,
  pendingAmount: 0,
  totalRevenue: 0,
})

const recentJobs = ref([])
const upcomingJobs = ref([])

const createNewJob = () => {
  router.push('/jobs?action=create')
}

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

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
        stats.value = await response.json()
      }
    }

    // Load recent jobs
    const jobsResponse = await fetch('/api/jobs?limit=5', {
      headers: {
        'Authorization': `Bearer ${await authStore.currentUser?.getToken()}`
      }
    })
    
    if (jobsResponse.ok) {
      recentJobs.value = await jobsResponse.json()
    }

    // Load upcoming jobs
    const upcomingResponse = await fetch('/api/jobs?status=scheduled&limit=5', {
      headers: {
        'Authorization': `Bearer ${await authStore.currentUser?.getToken()}`
      }
    })
    
    if (upcomingResponse.ok) {
      upcomingJobs.value = await upcomingResponse.json()
    }
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>