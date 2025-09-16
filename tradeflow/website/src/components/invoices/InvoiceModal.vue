<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                  {{ isEditing ? 'Edit Invoice' : 'Create Invoice' }}
                </h3>
                <div class="mt-4 space-y-4">
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label for="invoiceNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Invoice Number</label>
                      <input
                        type="text"
                        id="invoiceNumber"
                        v-model="formData.invoiceNumber"
                        class="input-field mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                      <input
                        type="text"
                        id="title"
                        v-model="formData.title"
                        class="input-field mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label for="customerId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer</label>
                      <select id="customerId" v-model="formData.customerId" class="input-field mt-1" required>
                        <option value="">Select a customer</option>
                        <option v-for="customer in customers" :key="customer._id" :value="customer._id">
                          {{ customer.firstName }} {{ customer.lastName }}
                        </option>
                      </select>
                    </div>
                    <div>
                      <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                      <select id="status" v-model="formData.status" class="input-field mt-1" required>
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="paid">Paid</option>
                        <option value="partially_paid">Partially Paid</option>
                        <option value="overdue">Overdue</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label for="issueDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Issue Date</label>
                      <input
                        type="date"
                        id="issueDate"
                        v-model="formData.issueDate"
                        class="input-field mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label for="dueDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                      <input
                        type="date"
                        id="dueDate"
                        v-model="formData.dueDate"
                        class="input-field mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label for="subtotal" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Subtotal</label>
                      <input
                        type="number"
                        id="subtotal"
                        v-model.number="formData.subtotal"
                        step="0.01"
                        class="input-field mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label for="taxRate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tax Rate (%)</label>
                      <input
                        type="number"
                        id="taxRate"
                        v-model.number="formData.taxRate"
                        step="0.01"
                        min="0"
                        max="100"
                        class="input-field mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
                    <textarea
                      id="notes"
                      v-model="formData.notes"
                      rows="3"
                      class="input-field mt-1"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ isEditing ? 'Update' : 'Create' }}
            </button>
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="$emit('close')"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useQuery } from '@/lib/mock-convex'
import { api } from '@/lib/convex'

const props = defineProps<{
  invoice?: any
}>()

const emit = defineEmits<{
  save: [data: any]
  close: []
}>()

const authStore = useAuthStore()

const { data: customers } = useQuery(
  api.customers.getCustomers,
  () => ({ companyId: authStore.currentCompany?._id }),
  { enabled: computed(() => !!authStore.currentCompany?._id) }
)

const isEditing = computed(() => !!props.invoice)

const formData = ref({
  invoiceNumber: '',
  title: '',
  customerId: '',
  status: 'draft',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
  subtotal: 0,
  taxRate: 0,
  totalAmount: 0,
  amountPaid: 0,
  balanceDue: 0,
  notes: '',
})

onMounted(() => {
  if (props.invoice) {
    formData.value = {
      invoiceNumber: props.invoice.invoiceNumber || '',
      title: props.invoice.title || '',
      customerId: props.invoice.customerId || '',
      status: props.invoice.status || 'draft',
      issueDate: props.invoice.issueDate ? new Date(props.invoice.issueDate).toISOString().split('T')[0] : '',
      dueDate: props.invoice.dueDate ? new Date(props.invoice.dueDate).toISOString().split('T')[0] : '',
      subtotal: props.invoice.subtotal || 0,
      taxRate: props.invoice.taxRate ? props.invoice.taxRate * 100 : 0,
      totalAmount: props.invoice.totalAmount || 0,
      amountPaid: props.invoice.amountPaid || 0,
      balanceDue: props.invoice.balanceDue || 0,
      notes: props.invoice.notes || '',
    }
  }
})

const handleSubmit = () => {
  const data = {
    ...formData.value,
    taxRate: formData.value.taxRate / 100, // Convert percentage to decimal
    issueDate: new Date(formData.value.issueDate).getTime(),
    dueDate: new Date(formData.value.dueDate).getTime(),
  }
  emit('save', data)
}
</script>