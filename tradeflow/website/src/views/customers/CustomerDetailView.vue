<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Customer Details
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View and manage customer information
        </p>
      </div>
      <div class="flex space-x-3">
        <button type="button" class="btn-secondary" @click="$router.back()">
          Back
        </button>
        <button type="button" class="btn-primary" @click="editCustomer">
          Edit Customer
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="error" class="card p-6">
      <div class="text-center">
        <p class="text-red-600 dark:text-red-400">Error loading customer: {{ error }}</p>
        <button type="button" class="btn-primary mt-4" @click="loadCustomer">
          Retry
        </button>
      </div>
    </div>

    <div v-else-if="customer" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Customer Info -->
      <div class="lg:col-span-2 space-y-6">
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Customer Information</h3>
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ customer.firstName }} {{ customer.lastName }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ customer.email || 'Not provided' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ customer.phone || 'Not provided' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Type</dt>
              <dd class="mt-1">
                <span :class="getTypeColor(customer.customerType)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ customer.customerType }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
              <dd class="mt-1">
                <span :class="getStatusColor(customer.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ customer.status }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Jobs</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ customer.totalJobs }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">${{ customer.totalSpent.toLocaleString() }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Last Job</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ customer.lastJobDate ? formatDate(customer.lastJobDate) : 'Never' }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Address -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Address</h3>
          <div class="text-sm text-gray-900 dark:text-white">
            <p>{{ customer.address.street }}</p>
            <p>{{ customer.address.city }}, {{ customer.address.state }} {{ customer.address.zipCode }}</p>
            <p>{{ customer.address.country }}</p>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="customer.notes" class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Notes</h3>
          <p class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{{ customer.notes }}</p>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <button type="button" class="btn-primary w-full" @click="createJob">
              Create New Job
            </button>
            <button type="button" class="btn-secondary w-full" @click="createQuote">
              Create Quote
            </button>
            <button type="button" class="btn-secondary w-full" @click="createInvoice">
              Create Invoice
            </button>
          </div>
        </div>

        <!-- Recent Jobs -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Jobs</h3>
          <div v-if="recentJobs.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
            No jobs found
          </div>
          <div v-else class="space-y-3">
            <div v-for="job in recentJobs" :key="job._id" class="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ job.title }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">#{{ job.jobNumber }}</p>
                </div>
                <span :class="getJobStatusColor(job.status)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                  {{ job.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Modal -->
    <CustomerModal
      v-if="showEditModal"
      :customer="customer"
      @save="handleSaveCustomer"
      @close="closeEditModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import CustomerModal from '@/components/customers/CustomerModal.vue'
import { useQuery, useMutation } from '@/lib/mock-convex'
import { api } from '@/lib/convex'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const customerId = computed(() => route.params.id as string)
const showEditModal = ref(false)

// Convex queries
const { data: customer, isLoading, error } = useQuery(
  api.customers.getCustomerById,
  () => ({ customerId: customerId.value }),
  { enabled: computed(() => !!customerId.value) }
)

const { data: jobs } = useQuery(
  api.jobs.getJobs,
  () => ({ companyId: authStore.currentCompany?._id }),
  { enabled: computed(() => !!authStore.currentCompany?._id) }
)

const updateCustomerMutation = useMutation(api.customers.updateCustomer)

const recentJobs = computed(() => {
  if (!jobs.value || !customer.value) return []
  return jobs.value
    .filter(job => job.customerId === customer.value._id)
    .slice(0, 5)
})

const getTypeColor = (type: string) => {
  const colors = {
    residential: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    commercial: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    industrial: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  }
  return colors[type] || colors.residential
}

const getStatusColor = (status: string) => {
  const colors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    prospect: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  }
  return colors[status] || colors.active
}

const getJobStatusColor = (status: string) => {
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

const editCustomer = () => {
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const handleSaveCustomer = async (customerData: any) => {
  try {
    await updateCustomerMutation.value.mutate({ customerId: customer.value._id, ...customerData })
    closeEditModal()
  } catch (error) {
    console.error('Failed to update customer:', error)
  }
}

const createJob = () => {
  router.push({ name: 'jobs', query: { customerId: customer.value._id } })
}

const createQuote = () => {
  router.push({ name: 'quotes', query: { customerId: customer.value._id } })
}

const createInvoice = () => {
  router.push({ name: 'invoices', query: { customerId: customer.value._id } })
}

const loadCustomer = () => {
  // This will trigger the query to refetch
}
</script>