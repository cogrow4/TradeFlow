<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                  Record Payment
                </h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                    <input
                      type="number"
                      id="amount"
                      v-model.number="formData.amount"
                      step="0.01"
                      :max="invoice.balanceDue"
                      class="input-field mt-1"
                      required
                    />
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Balance due: ${{ invoice.balanceDue.toLocaleString() }}
                    </p>
                  </div>

                  <div>
                    <label for="method" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
                    <select id="method" v-model="formData.method" class="input-field mt-1" required>
                      <option value="">Select payment method</option>
                      <option value="cash">Cash</option>
                      <option value="check">Check</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="paypal">PayPal</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label for="transactionId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Transaction ID (Optional)</label>
                    <input
                      type="text"
                      id="transactionId"
                      v-model="formData.transactionId"
                      class="input-field mt-1"
                    />
                  </div>

                  <div>
                    <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (Optional)</label>
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
              Record Payment
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
import { ref } from 'vue'

const props = defineProps<{
  invoice: any
}>()

const emit = defineEmits<{
  save: [data: any]
  close: []
}>()

const formData = ref({
  amount: 0,
  method: '',
  transactionId: '',
  notes: '',
})

const handleSubmit = () => {
  const data = {
    ...formData.value,
    date: Date.now(),
  }
  emit('save', data)
}
</script>