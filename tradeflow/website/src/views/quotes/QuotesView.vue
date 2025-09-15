<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Quotes
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create and manage professional quotes for your customers.
        </p>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0 space-x-3">
        <button
          type="button"
          class="btn-secondary"
          @click="exportQuotes"
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
          New Quote
        </button>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card p-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search quotes
          </label>
          <div class="mt-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="search"
              v-model="searchTerm"
              type="text"
              placeholder="Search by quote number, customer, or title..."
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
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        <div>
          <label for="customer" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Customer
          </label>
          <select
            id="customer"
            v-model="customerFilter"
            class="input-field mt-1"
          >
            <option value="">All Customers</option>
            <option v-for="customer in customers" :key="customer._id" :value="customer._id">
              {{ customer.firstName }} {{ customer.lastName }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Quotes Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Quote
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Valid Until
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="quote in filteredQuotes"
              :key="quote._id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              @click="$router.push(`/quotes/${quote._id}`)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ quote.quoteNumber }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                    {{ quote.title }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ quote.customer?.firstName }} {{ quote.customer?.lastName }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ quote.customer?.email }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusColor(quote.status)">
                  {{ quote.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ${{ quote.total.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(quote.validUntil) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(quote.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click.stop="editQuote(quote)"
                    class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Edit
                  </button>
                  <button
                    @click.stop="duplicateQuote(quote)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  >
                    Duplicate
                  </button>
                  <button
                    @click.stop="sendQuote(quote)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    :disabled="quote.status === 'sent'"
                  >
                    Send
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div v-if="filteredQuotes.length === 0" class="text-center py-12">
        <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No quotes found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new quote.
        </p>
        <div class="mt-6">
          <button
            type="button"
            class="btn-primary"
            @click="showCreateModal = true"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            New Quote
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Quote Modal -->
    <QuoteModal
      v-if="showCreateModal || editingQuote"
      :quote="editingQuote"
      @close="closeModal"
      @save="handleSaveQuote"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import QuoteModal from '@/components/quotes/QuoteModal.vue'
import { convex } from '@/lib/convex'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()

const quotes = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const customers = ref([])
const searchTerm = ref('')
const statusFilter = ref('')
const customerFilter = ref('')
const showCreateModal = ref(false)
const editingQuote = ref(null)

const filteredQuotes = computed(() => {
  let filtered = quotes.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(quote =>
      quote.quoteNumber.toLowerCase().includes(search) ||
      quote.title.toLowerCase().includes(search) ||
      quote.customer?.firstName.toLowerCase().includes(search) ||
      quote.customer?.lastName.toLowerCase().includes(search)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(quote => quote.status === statusFilter.value)
  }

  if (customerFilter.value) {
    filtered = filtered.filter(quote => quote.customerId === customerFilter.value)
  }

  return filtered
})

const getStatusColor = (status: string) => {
  const colors = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    expired: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  }
  return colors[status] || colors.draft
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}

const loadQuotes = async () => {
  try {
    if (!authStore.currentCompany?._id) return
    isLoading.value = true
    quotes.value = await convex.query('quotes:getQuotesByCompany', {
      companyId: authStore.currentCompany._id,
    } as any)
  } catch (error) {
    console.error('Failed to load quotes:', error)
    errorMessage.value = 'Failed to load quotes.'
  } finally {
    isLoading.value = false
  }
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

const editQuote = (quote: any) => {
  editingQuote.value = quote
}

const duplicateQuote = async (quote: any) => {
  try {
    if (!authStore.currentCompany?._id) return
    await convex.mutation('quotes:createQuote', {
      companyId: authStore.currentCompany._id,
      customerId: quote.customerId,
      jobId: quote.jobId,
      title: `${quote.title} (Copy)`,
      description: quote.description,
      status: 'draft',
      validUntil: quote.validUntil,
      lineItems: quote.lineItems,
      subtotal: quote.subtotal,
      taxRate: quote.taxRate,
      taxAmount: quote.taxAmount,
      gstRate: quote.gstRate,
      gstAmount: quote.gstAmount,
      total: quote.total,
      notes: quote.notes,
      terms: quote.terms,
      createdBy: authStore.currentUser?._id,
    } as any)
    await loadQuotes()
  } catch (error) {
    console.error('Failed to duplicate quote:', error)
  }
}

const sendQuote = async (quote: any) => {
  try {
    // Update status to sent
    await convex.mutation('quotes:updateQuote', {
      quoteId: quote._id,
      status: 'sent',
      sentAt: Date.now(),
    } as any)

    // Send email using Convex action (Resend)
    const customer = customers.value.find((c: any) => c._id === quote.customerId)
    if (customer?.email) {
      await convex.action('actions/email:sendEmail', {
        to: customer.email,
        subject: `Quote ${quote.quoteNumber} from TradeFlow`,
        html: `<p>Hi ${customer.firstName},</p><p>Please find your quote <strong>${quote.quoteNumber}</strong> totaling <strong>$${quote.total.toFixed(2)}</strong>.</p>`
      } as any)
    }

    await loadQuotes()
  } catch (error) {
    console.error('Failed to send quote:', error)
  }
}

const handleSaveQuote = async (quoteData: any) => {
  try {
    if (!authStore.currentCompany?._id) return
    if (editingQuote.value) {
      await convex.mutation('quotes:updateQuote', {
        quoteId: editingQuote.value._id,
        ...quoteData,
      } as any)
    } else {
      await convex.mutation('quotes:createQuote', {
        companyId: authStore.currentCompany._id,
        ...quoteData,
        createdBy: authStore.currentUser?._id,
      } as any)
    }
    await loadQuotes()
    closeModal()
  } catch (error) {
    console.error('Failed to save quote:', error)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingQuote.value = null
}

const exportQuotes = () => {
  const csvContent = generateCSV(filteredQuotes.value)
  downloadCSV(csvContent, 'quotes.csv')
}

const generateCSV = (data: any[]) => {
  const headers = ['Quote Number', 'Title', 'Customer', 'Status', 'Amount', 'Valid Until', 'Created']
  const rows = data.map(quote => [
    quote.quoteNumber,
    quote.title,
    `${quote.customer?.firstName} ${quote.customer?.lastName}`,
    quote.status,
    quote.total,
    formatDate(quote.validUntil),
    formatDate(quote.createdAt)
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
  loadQuotes()
  loadCustomers()
})
</script>