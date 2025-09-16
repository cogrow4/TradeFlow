<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Invoice Details
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View and manage invoice information
        </p>
      </div>
      <div class="flex space-x-3">
        <button type="button" class="btn-secondary" @click="$router.back()">
          Back
        </button>
        <button type="button" class="btn-primary" @click="editInvoice">
          Edit Invoice
        </button>
        <button v-if="invoice?.status === 'draft'" type="button" class="btn-secondary" @click="sendInvoice">
          Send Invoice
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="error" class="card p-6">
      <div class="text-center">
        <p class="text-red-600 dark:text-red-400">Error loading invoice: {{ error }}</p>
        <button type="button" class="btn-primary mt-4" @click="loadInvoice">
          Retry
        </button>
      </div>
    </div>

    <div v-else-if="invoice" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Invoice Info -->
      <div class="lg:col-span-2 space-y-6">
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Invoice Information</h3>
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Invoice Number</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">#{{ invoice.invoiceNumber }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Title</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ invoice.title }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Customer</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ getCustomerName(invoice.customerId) }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
              <dd class="mt-1">
                <span :class="getStatusColor(invoice.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ invoice.status }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Issue Date</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(invoice.issueDate) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Due Date</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(invoice.dueDate) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Subtotal</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">${{ invoice.subtotal.toLocaleString() }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Tax Rate</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ (invoice.taxRate * 100).toFixed(1) }}%</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</dt>
              <dd class="mt-1 text-lg font-semibold text-gray-900 dark:text-white">${{ invoice.totalAmount.toLocaleString() }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Amount Paid</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">${{ invoice.amountPaid.toLocaleString() }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Balance Due</dt>
              <dd class="mt-1 text-lg font-semibold" :class="invoice.balanceDue > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                ${{ invoice.balanceDue.toLocaleString() }}
              </dd>
            </div>
          </dl>
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
                <tr v-for="(item, index) in invoice.lineItems" :key="index">
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
                  <td class="px-6 py-3 text-sm text-gray-900 dark:text-white">${{ invoice.subtotal.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td colspan="4" class="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">Tax ({{ (invoice.taxRate * 100).toFixed(1) }}%):</td>
                  <td class="px-6 py-3 text-sm text-gray-900 dark:text-white">${{ (invoice.totalAmount - invoice.subtotal).toFixed(2) }}</td>
                </tr>
                <tr>
                  <td colspan="4" class="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">Total:</td>
                  <td class="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">${{ invoice.totalAmount.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td colspan="4" class="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">Amount Paid:</td>
                  <td class="px-6 py-3 text-sm text-gray-900 dark:text-white">${{ invoice.amountPaid.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td colspan="4" class="px-6 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">Balance Due:</td>
                  <td class="px-6 py-3 text-sm font-semibold" :class="invoice.balanceDue > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                    ${{ invoice.balanceDue.toFixed(2) }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Payment History -->
        <div v-if="invoice.paymentHistory && invoice.paymentHistory.length > 0" class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment History</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Method</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transaction ID</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="payment in invoice.paymentHistory" :key="payment.transactionId || payment.date">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(payment.date) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${{ payment.amount.toFixed(2) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ payment.method }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ payment.transactionId || 'N/A' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="invoice.notes" class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Notes</h3>
          <p class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{{ invoice.notes }}</p>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <button v-if="invoice.balanceDue > 0" type="button" class="btn-primary w-full" @click="recordPayment">
              Record Payment
            </button>
            <button type="button" class="btn-secondary w-full" @click="viewCustomer">
              View Customer
            </button>
            <button v-if="invoice.jobId" type="button" class="btn-secondary w-full" @click="viewJob">
              View Job
            </button>
            <button v-if="invoice.quoteId" type="button" class="btn-secondary w-full" @click="viewQuote">
              View Quote
            </button>
          </div>
        </div>

        <!-- PDF Download -->
        <div v-if="invoice.pdfUrl" class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Documents</h3>
          <button type="button" class="btn-secondary w-full" @click="downloadPDF">
            Download PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Invoice Modal -->
    <InvoiceModal
      v-if="showEditModal"
      :invoice="invoice"
      @save="handleSaveInvoice"
      @close="closeEditModal"
    />

    <!-- Payment Modal -->
    <PaymentModal
      v-if="showPaymentModal"
      :invoice="invoice"
      @save="handleRecordPayment"
      @close="closePaymentModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import InvoiceModal from '@/components/invoices/InvoiceModal.vue'
import PaymentModal from '@/components/invoices/PaymentModal.vue'
import { useQuery, useMutation } from '@/lib/mock-convex'
import { api } from '@/lib/convex'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const invoiceId = computed(() => route.params.id as string)
const showEditModal = ref(false)
const showPaymentModal = ref(false)

// Convex queries
const { data: invoice, isLoading, error } = useQuery(
  api.invoices.getInvoiceById,
  () => ({ invoiceId: invoiceId.value }),
  { enabled: computed(() => !!invoiceId.value) }
)

const { data: customers } = useQuery(
  api.customers.getCustomers,
  () => ({ companyId: authStore.currentCompany?._id }),
  { enabled: computed(() => !!authStore.currentCompany?._id) }
)

const updateInvoiceMutation = useMutation(api.invoices.updateInvoice)
const updateInvoiceStatusMutation = useMutation(api.invoices.updateInvoiceStatus)
const sendEmailAction = useMutation(api.actions.email.sendEmail)

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

const editInvoice = () => {
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const recordPayment = () => {
  showPaymentModal.value = true
}

const closePaymentModal = () => {
  showPaymentModal.value = false
}

const handleSaveInvoice = async (invoiceData: any) => {
  try {
    await updateInvoiceMutation.value.mutate({ invoiceId: invoice.value._id, ...invoiceData })
    closeEditModal()
  } catch (error) {
    console.error('Failed to update invoice:', error)
  }
}

const handleRecordPayment = async (paymentData: any) => {
  try {
    // This would need to be implemented in the backend
    console.log('Record payment:', paymentData)
    closePaymentModal()
  } catch (error) {
    console.error('Failed to record payment:', error)
  }
}

const sendInvoice = async () => {
  if (!confirm(`Are you sure you want to send Invoice #${invoice.value.invoiceNumber} to ${getCustomerName(invoice.value.customerId)}?`)) {
    return
  }

  try {
    const customer = customers.value?.find(c => c._id === invoice.value.customerId)
    if (!customer?.email) {
      alert('Customer email not found. Cannot send email.')
      return
    }

    const emailHtml = `
      <p>Dear ${customer.firstName},</p>
      <p>Please find your invoice #${invoice.value.invoiceNumber} for "${invoice.value.title}" attached.</p>
      <p>Total Amount: $${invoice.value.totalAmount.toLocaleString()}</p>
      <p>Due Date: ${formatDate(invoice.value.dueDate)}</p>
      <p>Best regards,</p>
      <p>${authStore.currentCompany?.name || 'TradeFlow Team'}</p>
    `

    await sendEmailAction.value.mutate({
      to: customer.email,
      subject: `Invoice from ${authStore.currentCompany?.name || 'TradeFlow'} - #${invoice.value.invoiceNumber}`,
      html: emailHtml,
    })

    await updateInvoiceStatusMutation.value.mutate({ invoiceId: invoice.value._id, status: 'sent' })
    alert('Invoice sent successfully!')
  } catch (error) {
    console.error('Failed to send invoice email:', error)
    alert('Failed to send invoice email. Please try again.')
  }
}

const viewCustomer = () => {
  router.push({ name: 'customer-detail', params: { id: invoice.value.customerId } })
}

const viewJob = () => {
  router.push({ name: 'job-detail', params: { id: invoice.value.jobId } })
}

const viewQuote = () => {
  router.push({ name: 'quote-detail', params: { id: invoice.value.quoteId } })
}

const downloadPDF = () => {
  if (invoice.value.pdfUrl) {
    window.open(invoice.value.pdfUrl, '_blank')
  }
}

const loadInvoice = () => {
  // This will trigger the query to refetch
}
</script>