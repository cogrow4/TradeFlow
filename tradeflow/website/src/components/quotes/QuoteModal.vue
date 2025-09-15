<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  {{ isEditing ? 'Edit Quote' : 'Create New Quote' }}
                </h3>

                <div class="space-y-6">
                  <!-- Quote Header -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Quote Title *
                      </label>
                      <input
                        id="title"
                        v-model="form.title"
                        type="text"
                        required
                        class="input-field mt-1"
                        placeholder="Electrical Installation Quote"
                      />
                    </div>
                    <div>
                      <label for="customerId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Customer *
                      </label>
                      <select
                        id="customerId"
                        v-model="form.customerId"
                        required
                        class="input-field mt-1"
                      >
                        <option value="">Select a customer</option>
                        <option v-for="customer in customers" :key="customer._id" :value="customer._id">
                          {{ customer.firstName }} {{ customer.lastName }} - {{ customer.email }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      id="description"
                      v-model="form.description"
                      rows="3"
                      class="input-field mt-1"
                      placeholder="Detailed description of the work to be performed..."
                    ></textarea>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="validUntil" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Valid Until *
                      </label>
                      <input
                        id="validUntil"
                        v-model="form.validUntil"
                        type="date"
                        required
                        class="input-field mt-1"
                      />
                    </div>
                    <div>
                      <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status
                      </label>
                      <select
                        id="status"
                        v-model="form.status"
                        class="input-field mt-1"
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="expired">Expired</option>
                      </select>
                    </div>
                  </div>

                  <!-- Line Items -->
                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="text-md font-medium text-gray-900 dark:text-white">Line Items</h4>
                      <button
                        type="button"
                        @click="addLineItem"
                        class="btn-secondary text-sm"
                      >
                        <PlusIcon class="h-4 w-4 mr-1" />
                        Add Item
                      </button>
                    </div>

                    <div class="space-y-3">
                      <div
                        v-for="(item, index) in form.lineItems"
                        :key="index"
                        class="grid grid-cols-12 gap-2 items-end"
                      >
                        <div class="col-span-5">
                          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Description
                          </label>
                          <input
                            v-model="item.description"
                            type="text"
                            class="input-field mt-1 text-sm"
                            placeholder="Item description"
                          />
                        </div>
                        <div class="col-span-2">
                          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Category
                          </label>
                          <select
                            v-model="item.category"
                            class="input-field mt-1 text-sm"
                          >
                            <option value="labor">Labor</option>
                            <option value="materials">Materials</option>
                            <option value="equipment">Equipment</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div class="col-span-1">
                          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Qty
                          </label>
                          <input
                            v-model.number="item.quantity"
                            type="number"
                            step="0.01"
                            min="0"
                            class="input-field mt-1 text-sm"
                            @input="updateLineItemTotal(index)"
                          />
                        </div>
                        <div class="col-span-2">
                          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Unit Price
                          </label>
                          <input
                            v-model.number="item.unitPrice"
                            type="number"
                            step="0.01"
                            min="0"
                            class="input-field mt-1 text-sm"
                            @input="updateLineItemTotal(index)"
                          />
                        </div>
                        <div class="col-span-1">
                          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Total
                          </label>
                          <input
                            :value="item.totalPrice.toFixed(2)"
                            type="text"
                            readonly
                            class="input-field mt-1 text-sm bg-gray-50 dark:bg-gray-700"
                          />
                        </div>
                        <div class="col-span-1">
                          <button
                            type="button"
                            @click="removeLineItem(index)"
                            class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <TrashIcon class="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Totals -->
                  <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div class="space-y-2">
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Subtotal:</span>
                        <span class="text-gray-900 dark:text-white">${{ subtotal.toFixed(2) }}</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Tax ({{ (form.taxRate * 100).toFixed(1) }}%):</span>
                        <span class="text-gray-900 dark:text-white">${{ taxAmount.toFixed(2) }}</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">GST ({{ (form.gstRate * 100).toFixed(1) }}%):</span>
                        <span class="text-gray-900 dark:text-white">${{ gstAmount.toFixed(2) }}</span>
                      </div>
                      <div class="flex justify-between text-lg font-medium border-t border-gray-200 dark:border-gray-700 pt-2">
                        <span class="text-gray-900 dark:text-white">Total:</span>
                        <span class="text-gray-900 dark:text-white">${{ total.toFixed(2) }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Terms and Notes -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="terms" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Terms & Conditions
                      </label>
                      <textarea
                        id="terms"
                        v-model="form.terms"
                        rows="3"
                        class="input-field mt-1"
                        placeholder="Payment terms, warranty, etc."
                      ></textarea>
                    </div>
                    <div>
                      <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        v-model="form.notes"
                        rows="3"
                        class="input-field mt-1"
                        placeholder="Additional notes or special instructions..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              class="btn-primary sm:ml-3 sm:w-auto"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Quote' : 'Create Quote') }}
            </button>
            <button
              type="button"
              class="btn-secondary mt-3 sm:mt-0 sm:w-auto"
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
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  quote: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const authStore = useAuthStore()

const isSubmitting = ref(false)
const customers = ref([])

const isEditing = computed(() => !!props.quote)

const form = ref({
  title: '',
  description: '',
  customerId: '',
  status: 'draft',
  validUntil: '',
  lineItems: [
    {
      description: '',
      category: 'labor',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    }
  ],
  taxRate: 0.08, // 8% default
  gstRate: 0.05, // 5% default
  terms: '',
  notes: ''
})

const subtotal = computed(() => {
  return form.value.lineItems.reduce((sum, item) => sum + item.totalPrice, 0)
})

const taxAmount = computed(() => {
  return subtotal.value * form.value.taxRate
})

const gstAmount = computed(() => {
  return subtotal.value * form.value.gstRate
})

const total = computed(() => {
  return subtotal.value + taxAmount.value + gstAmount.value
})

// Initialize form with quote data if editing
watch(() => props.quote, (quote) => {
  if (quote) {
    form.value = {
      title: quote.title || '',
      description: quote.description || '',
      customerId: quote.customerId || '',
      status: quote.status || 'draft',
      validUntil: quote.validUntil ? new Date(quote.validUntil).toISOString().split('T')[0] : '',
      lineItems: quote.lineItems?.length ? quote.lineItems : [
        {
          description: '',
          category: 'labor',
          quantity: 1,
          unitPrice: 0,
          totalPrice: 0
        }
      ],
      taxRate: quote.taxRate || 0.08,
      gstRate: quote.gstRate || 0.05,
      terms: quote.terms || '',
      notes: quote.notes || ''
    }
  }
}, { immediate: true })

const addLineItem = () => {
  form.value.lineItems.push({
    description: '',
    category: 'labor',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0
  })
}

const removeLineItem = (index: number) => {
  if (form.value.lineItems.length > 1) {
    form.value.lineItems.splice(index, 1)
  }
}

const updateLineItemTotal = (index: number) => {
  const item = form.value.lineItems[index]
  item.totalPrice = item.quantity * item.unitPrice
}

const loadCustomers = async () => {
  try {
    const response = await fetch('/api/customers', {
      headers: {
        'Authorization': `Bearer ${await authStore.currentUser?.getToken()}`
      }
    })
    
    if (response.ok) {
      customers.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to load customers:', error)
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    const quoteData = {
      ...form.value,
      validUntil: new Date(form.value.validUntil).getTime(),
      subtotal: subtotal.value,
      taxAmount: taxAmount.value,
      gstAmount: gstAmount.value,
      total: total.value
    }
    
    emit('save', quoteData)
  } catch (error) {
    console.error('Failed to save quote:', error)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadCustomers()
})
</script>