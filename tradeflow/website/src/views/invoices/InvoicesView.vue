<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Invoices
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your invoices and track payments
        </p>
      </div>
      <div class="flex space-x-3">
        <button type="button" class="btn-secondary" @click="exportInvoices">
          <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
          Export
        </button>
        <button type="button" class="btn-primary" @click="showCreateModal = true">
          <PlusIcon class="h-4 w-4 mr-2" />
          Create Invoice
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
          <div class="mt-1 relative">
            <input
              type="text"
              id="search"
              v-model="searchTerm"
              class="input-field pl-10"
              placeholder="Search invoices..."
            />
            <MagnifyingGlassIcon class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <select id="status" v-model="statusFilter" class="input-field mt-1">
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label for="customer" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer</label>
          <select id="customer" v-model="customerFilter" class="input-field mt-1">
            <option value="">All Customers</option>
            <option v-for="customer in customers" :key="customer._id" :value="customer._id">
              {{ customer.firstName }} {{ customer.lastName }}
            </option>
          </select>
        </div>
        <div class="flex items-end">
          <button type="button" class="btn-secondary w-full" @click="clearFilters">
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-6">
      <div class="text-center">
        <p class="text-red-600 dark:text-red-400">Error loading invoices: {{ error }}</p>
        <button type="button" class="btn-primary mt-4" @click="loadInvoices">
          Retry
        </button>
      </div>
    </div>

    <!-- Invoices Table -->
    <div v-else class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Invoice
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Issue Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Due Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Balance
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="invoice in filteredInvoices" :key="invoice._id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    #{{ invoice.invoiceNumber }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ invoice.title }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ getCustomerName(invoice.customerId) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusColor(invoice.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ invoice.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ formatDate(invoice.issueDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ formatDate(invoice.dueDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ${{ invoice.totalAmount.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="invoice.balanceDue > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                ${{ invoice.balanceDue.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    type="button"
                    class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                    @click="viewInvoice(invoice)"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                    @click="editInvoice(invoice)"
                  >
                    Edit
                  </button>
                  <button
                    v-if="invoice.status === 'draft'"
                    type="button"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    @click="sendInvoice(invoice)"
                  >
                    Send
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredInvoices.length === 0" class="text-center py-12">
        <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No invoices found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new invoice.
        </p>
        <div class="mt-6">
          <button type="button" class="btn-primary" @click="showCreateModal = true">
            <PlusIcon class="h-4 w-4 mr-2" />
            Create Invoice
          </button>
        </div>
      </div>
    </div>

    <!-- Invoice Modal -->
    <InvoiceModal
      v-if="showCreateModal || editingInvoice"
      :invoice="editingInvoice"
      @save="handleSaveInvoice"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import InvoiceModal from '@/components/invoices/InvoiceModal.vue'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from '@heroicons/vue/24/outline'
import { useQuery, useMutation } from '@/lib/mock-convex'
import { api } from '@/lib/convex'

const router = useRouter()
const authStore = useAuthStore()

const searchTerm = ref('')
const statusFilter = ref('')
const customerFilter = ref('')
const showCreateModal = ref(false)
const editingInvoice = ref(null)

// Convex integration
const { data: invoices, isLoading, error, refetch: refetchInvoices } = useQuery(
  api.invoices.getInvoices,
  () => ({ companyId: authStore.currentCompany?._id }),
  { enabled: computed(() => !!authStore.currentCompany?._id) }
)
const { data: customers } = useQuery(
  api.customers.getCustomers,
  () => ({ companyId: authStore.currentCompany?._id }),
  { enabled: computed(() => !!authStore.currentCompany?._id) }
)
const createInvoiceMutation = useMutation(api.invoices.createInvoice)
const updateInvoiceMutation = useMutation(api.invoices.updateInvoice)
const updateInvoiceStatusMutation = useMutation(api.invoices.updateInvoiceStatus)
const sendEmailAction = useMutation(api.actions.email.sendEmail)

const filteredInvoices = computed(() => {
  if (!invoices.value) return []
  let filtered = invoices.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(invoice =>
      invoice.invoiceNumber.toLowerCase().includes(search) ||
      invoice.title.toLowerCase().includes(search) ||
      getCustomerName(invoice.customerId).toLowerCase().includes(search)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(invoice => invoice.status === statusFilter.value)
  }

  if (customerFilter.value) {
    filtered = filtered.filter(invoice => invoice.customerId === customerFilter.value)
  }

  return filtered
})

const getCustomerName = (customerId: string) => {
  const customer = customers.value?.find(c => c._id === customerId)
  return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer'
}

const getStatusColor = (status: string) => {
  const colors = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    partially_paid: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  }
  return colors[status] || colors.draft
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}

const viewInvoice = (invoice: any) => {
  router.push({ name: 'invoice-detail', params: { id: invoice._id } })
}

const editInvoice = (invoice: any) => {
  editingInvoice.value = invoice
}

const sendInvoice = async (invoice: any) => {
  if (!confirm(`Are you sure you want to send Invoice #${invoice.invoiceNumber} to ${getCustomerName(invoice.customerId)}?`)) {
    return
  }

  try {
    const customer = customers.value?.find(c => c._id === invoice.customerId)
    if (!customer?.email) {
      alert('Customer email not found. Cannot send email.')
      return
    }

    const emailHtml = `
      <p>Dear ${customer.firstName},</p>
      <p>Please find your invoice #${invoice.invoiceNumber} for "${invoice.title}" attached.</p>
      <p>Total Amount: $${invoice.totalAmount.toLocaleString()}</p>
      <p>Due Date: ${formatDate(invoice.dueDate)}</p>
      <p>Best regards,</p>
      <p>${authStore.currentCompany?.name || 'TradeFlow Team'}</p>
    `

    await sendEmailAction.value.mutate({
      to: customer.email,
      subject: `Invoice from ${authStore.currentCompany?.name || 'TradeFlow'} - #${invoice.invoiceNumber}`,
      html: emailHtml,
    })

    await updateInvoiceStatusMutation.value.mutate({ invoiceId: invoice._id, status: 'sent' })
    refetchInvoices()
    alert('Invoice sent successfully!')
  } catch (error) {
    console.error('Failed to send invoice email:', error)
    alert('Failed to send invoice email. Please try again.')
  }
}

const handleSaveInvoice = async (invoiceData: any) => {
  try {
    if (!authStore.currentCompany?._id) {
      console.error('No company ID found for the current user.')
      return
    }

    if (editingInvoice.value) {
      await updateInvoiceMutation.value.mutate({ invoiceId: editingInvoice.value._id, ...invoiceData })
    } else {
      await createInvoiceMutation.value.mutate({ companyId: authStore.currentCompany._id, ...invoiceData })
    }
    refetchInvoices()
    closeModal()
  } catch (error) {
    console.error('Failed to save invoice:', error)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingInvoice.value = null
}

const clearFilters = () => {
  searchTerm.value = ''
  statusFilter.value = ''
  customerFilter.value = ''
}

const exportInvoices = () => {
  const csvContent = generateCSV(filteredInvoices.value)
  downloadCSV(csvContent, 'invoices.csv')
}

const generateCSV = (data: any[]) => {
  const headers = ['Invoice Number', 'Title', 'Customer', 'Status', 'Issue Date', 'Due Date', 'Total Amount', 'Balance Due']
  const rows = data.map(invoice => [
    invoice.invoiceNumber,
    invoice.title,
    getCustomerName(invoice.customerId),
    invoice.status,
    formatDate(invoice.issueDate),
    formatDate(invoice.dueDate),
    invoice.totalAmount,
    invoice.balanceDue,
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

const loadInvoices = () => {
  refetchInvoices()
}
</script>