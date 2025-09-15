<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Customers
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your customer relationships and track job history.
        </p>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0 space-x-3">
        <button
          type="button"
          class="btn-secondary"
          @click="exportCustomers"
        >
          <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
          Export
        </button>
        <button
          type="button"
          class="btn-primary"
          @click="showCreateModal = true"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          Add Customer
        </button>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card p-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search customers
          </label>
          <div class="mt-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="search"
              v-model="searchTerm"
              type="text"
              placeholder="Search by name, email, or phone..."
              class="input-field pl-10"
            />
          </div>
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            id="status"
            v-model="statusFilter"
            class="input-field mt-1"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="prospect">Prospect</option>
          </select>
        </div>
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Customer Type
          </label>
          <select
            id="type"
            v-model="typeFilter"
            class="input-field mt-1"
          >
            <option value="">All Types</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Customers Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Contact
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Jobs
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Spent
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last Job
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="customer in filteredCustomers"
              :key="customer._id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              @click="$router.push(`/customers/${customer._id}`)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <span class="text-sm font-medium text-primary-700 dark:text-primary-200">
                        {{ customer.firstName[0] }}{{ customer.lastName[0] }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ customer.firstName }} {{ customer.lastName }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ customer.address.city }}, {{ customer.address.state }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ customer.email || 'No email' }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ customer.phone || 'No phone' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                      :class="getTypeColor(customer.customerType)">
                  {{ customer.customerType }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusColor(customer.status)">
                  {{ customer.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ customer.totalJobs }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ${{ customer.totalSpent.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ customer.lastJobDate ? formatDate(customer.lastJobDate) : 'Never' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click.stop="editCustomer(customer)"
                    class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Edit
                  </button>
                  <button
                    @click.stop="deleteCustomer(customer)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div v-if="filteredCustomers.length === 0" class="text-center py-12">
        <UsersIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No customers found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new customer.
        </p>
        <div class="mt-6">
          <button
            type="button"
            class="btn-primary"
            @click="showCreateModal = true"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            Add Customer
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Customer Modal -->
    <CustomerModal
      v-if="showCreateModal || editingCustomer"
      :customer="editingCustomer"
      @close="closeModal"
      @save="handleSaveCustomer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { convex } from '@/lib/convex'
import CustomerModal from '@/components/customers/CustomerModal.vue'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()

const customers = ref([])
const searchTerm = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const showCreateModal = ref(false)
const editingCustomer = ref(null)

const filteredCustomers = computed(() => {
  let filtered = customers.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(customer =>
      customer.firstName.toLowerCase().includes(search) ||
      customer.lastName.toLowerCase().includes(search) ||
      customer.email?.toLowerCase().includes(search) ||
      customer.phone?.includes(search)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(customer => customer.status === statusFilter.value)
  }

  if (typeFilter.value) {
    filtered = filtered.filter(customer => customer.customerType === typeFilter.value)
  }

  return filtered
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

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}

const loadCustomers = async () => {
  try {
    if (!authStore.currentCompany?._id) return
    customers.value = await convex.query('customers:getCustomers', {
      companyId: authStore.currentCompany._id,
    } as any)
  } catch (error) {
    console.error('Failed to load customers:', error)
  }
}

const editCustomer = (customer: any) => {
  editingCustomer.value = customer
}

const deleteCustomer = async (customer: any) => {
  if (confirm(`Are you sure you want to delete ${customer.firstName} ${customer.lastName}?`)) {
    try {
      await convex.mutation('customers:deleteCustomer', { customerId: customer._id })
      await loadCustomers()
    } catch (error) {
      console.error('Failed to delete customer:', error)
    }
  }
}

const handleSaveCustomer = async (customerData: any) => {
  try {
    if (!authStore.currentCompany?._id) return
    if (editingCustomer.value) {
      await convex.mutation('customers:updateCustomer', {
        customerId: editingCustomer.value._id,
        ...customerData,
      } as any)
    } else {
      await convex.mutation('customers:createCustomer', {
        companyId: authStore.currentCompany._id,
        ...customerData,
      } as any)
    }
    await loadCustomers()
    closeModal()
  } catch (error) {
    console.error('Failed to save customer:', error)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingCustomer.value = null
}

const exportCustomers = () => {
  // Implement CSV export functionality
  const csvContent = generateCSV(filteredCustomers.value)
  downloadCSV(csvContent, 'customers.csv')
}

const generateCSV = (data: any[]) => {
  const headers = ['Name', 'Email', 'Phone', 'Type', 'Status', 'Total Jobs', 'Total Spent', 'Last Job']
  const rows = data.map(customer => [
    `${customer.firstName} ${customer.lastName}`,
    customer.email || '',
    customer.phone || '',
    customer.customerType,
    customer.status,
    customer.totalJobs,
    customer.totalSpent,
    customer.lastJobDate ? formatDate(customer.lastJobDate) : 'Never'
  ])
  
  return [headers, ...rows].map(row => row.join(',')).join('\n')
}

const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

onMounted(() => {
  loadCustomers()
})
</script>