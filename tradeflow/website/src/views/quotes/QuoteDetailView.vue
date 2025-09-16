<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Quote Details
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View and manage quote information
        </p>
      </div>
      <div class="flex space-x-3">
        <button type="button" class="btn-secondary" @click="$router.back()">
          Back
        </button>
        <button type="button" class="btn-primary" @click="editQuote">
          Edit Quote
        </button>
        <button v-if="quote?.status === 'draft'" type="button" class="btn-secondary" @click="sendQuote">
          Send Quote
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="error" class="card p-6">
      <div class="text-center">
        <p class="text-red-600 dark:text-red-400">Error loading quote: {{ error }}</p>
        <button type="button" class="btn-primary mt-4" @click="loadQuote">
          Retry
        </button>
      </div>
    </div>

    <div v-else-if="quote" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Quote Info -->
      <div class="lg:col-span-2 space-y-6">
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Quote Information</h3>
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Quote Number</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">#{{ quote.quoteNumber }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Title</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ quote.title }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Customer</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ getCustomerName(quote.customerId) }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
              <dd class="mt-1">
                <span :class="getStatusColor(quote.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ quote.status }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Issue Date</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(quote.issueDate) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Expiry Date</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(quote.expiryDate) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Subtotal</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">${{ quote.subtotal.toLocaleString() }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Tax Rate</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ (quote.taxRate * 100).toFixed(1) }}%</dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</dt>
              <dd class="mt-1 text-lg font-semibold text-gray-900 dark:text-white">${{ quote.totalAmount.toLocaleString() }}</dd>
            </div>
          </dl>
        </div>

        <!-- Description -->
        <div v-if="quote.description" class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Description</h3>
          <p class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{{ quote.description }}</p>
        </div>

        <!-- Line Items -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Line Items</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit Price</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(item, index) in quote.lineItems" :key="index">
                  <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">{{ item.description }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getTypeColor(item.type)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {{ item.type }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ item.quantity }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${{ item.unitPrice.toFixed(2) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${{ (item.quantity * item.unitPrice).toFixed(2) }}</td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <td colspan="4" class="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">Subtotal:</td>
                  <td class="px-6 py-3 text-sm text-gray-900 dark:text-white">${{ quote.subtotal.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td colspan="4" class="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">Tax ({{ (quote.taxRate * 100).toFixed(1) }}%):</td>
                  <td class="px-6 py-3 text-sm text-gray-900 dark:text-white">${{ (quote.totalAmount - quote.subtotal).toFixed(2) }}</td>
                </tr>
                <tr>
                  <td colspan="4" class="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">Total:</td>
                  <td class="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">${{ quote.totalAmount.toFixed(2) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="quote.notes" class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Notes</h3>
          <p class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{{ quote.notes }}</p>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <button v-if="quote.status === 'accepted'" type="button" class="btn-primary w-full" @click="createJob">
              Create Job
            </button>
            <button v-if="quote.status === 'accepted'" type="button" class="btn-secondary w-full" @click="createInvoice">
              Create Invoice
            </button>
            <button type="button" class="btn-secondary w-full" @click="viewCustomer">
              View Customer
            </button>
            <button v-if="quote.jobId" type="button" class="btn-secondary w-full" @click="viewJob">
              View Job
            </button>
          </div>
        </div>

        <!-- PDF Download -->
        <div v-if="quote.pdfUrl" class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Documents</h3>
          <button type="button" class="btn-secondary w-full" @click="downloadPDF">
            Download PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Quote Modal -->
    <QuoteModal
      v-if="showEditModal"
      :quote="quote"
      @save="handleSaveQuote"
      @close="closeEditModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import QuoteModal from '@/components/quotes/QuoteModal.vue'
import { useQuery, useMutation } from '@/lib/mock-convex'
import { api } from '@/lib/convex'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const quoteId = computed(() => route.params.id as string)
const showEditModal = ref(false)

// Convex queries
const { data: quote, isLoading, error } = useQuery(
  api.quotes.getQuoteById,
  () => ({ quoteId: quoteId.value }),
  { enabled: computed(() => !!quoteId.value) }
)

const { data: customers } = useQuery(
  api.customers.getCustomers,
  () => ({ companyId: authStore.currentCompany?._id }),
  { enabled: computed(() => !!authStore.currentCompany?._id) }
)

const updateQuoteMutation = useMutation(api.quotes.updateQuote)
const updateQuoteStatusMutation = useMutation(api.quotes.updateQuoteStatus)
const sendEmailAction = useMutation(api.actions.email.sendEmail)

const getCustomerName = (customerId: string) => {
  const customer = customers.value?.find(c => c._id === customerId)
  return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer'
}

const getStatusColor = (status: string) => {
  const colors = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    revised: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  }
  return colors[status] || colors.draft
}

const getTypeColor = (type: string) => {
  const colors = {
    material: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    labor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    equipment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    service: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  }
  return colors[type] || colors.service
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}

const editQuote = () => {
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const handleSaveQuote = async (quoteData: any) => {
  try {
    await updateQuoteMutation.value.mutate({ quoteId: quote.value._id, ...quoteData })
    closeEditModal()
  } catch (error) {
    console.error('Failed to update quote:', error)
  }
}

const sendQuote = async () => {
  if (!confirm(`Are you sure you want to send Quote #${quote.value.quoteNumber} to ${getCustomerName(quote.value.customerId)}?`)) {
    return
  }

  try {
    const customer = customers.value?.find(c => c._id === quote.value.customerId)
    if (!customer?.email) {
      alert('Customer email not found. Cannot send email.')
      return
    }

    const emailHtml = `
      <p>Dear ${customer.firstName},</p>
      <p>Please find your quote #${quote.value.quoteNumber} for "${quote.value.title}" attached.</p>
      <p>Total Amount: $${quote.value.totalAmount.toLocaleString()}</p>
      <p>Expiry Date: ${formatDate(quote.value.expiryDate)}</p>
      <p>Best regards,</p>
      <p>${authStore.currentCompany?.name || 'TradeFlow Team'}</p>
    `

    await sendEmailAction.value.mutate({
      to: customer.email,
      subject: `Your Quote from ${authStore.currentCompany?.name || 'TradeFlow'} - #${quote.value.quoteNumber}`,
      html: emailHtml,
    })

    await updateQuoteStatusMutation.value.mutate({ quoteId: quote.value._id, status: 'sent' })
    alert('Quote sent successfully!')
  } catch (error) {
    console.error('Failed to send quote email:', error)
    alert('Failed to send quote email. Please try again.')
  }
}

const createJob = () => {
  router.push({ name: 'jobs', query: { quoteId: quote.value._id } })
}

const createInvoice = () => {
  router.push({ name: 'invoices', query: { quoteId: quote.value._id } })
}

const viewCustomer = () => {
  router.push({ name: 'customer-detail', params: { id: quote.value.customerId } })
}

const viewJob = () => {
  router.push({ name: 'job-detail', params: { id: quote.value.jobId } })
}

const downloadPDF = () => {
  if (quote.value.pdfUrl) {
    window.open(quote.value.pdfUrl, '_blank')
  }
}

const loadQuote = () => {
  // This will trigger the query to refetch
}
</script>