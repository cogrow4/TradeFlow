<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  {{ isEditing ? 'Edit Customer' : 'Add New Customer' }}
                </h3>

                <div class="space-y-4">
                  <!-- Name Fields -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        First Name *
                      </label>
                      <input
                        id="firstName"
                        v-model="form.firstName"
                        type="text"
                        required
                        class="input-field mt-1"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Last Name *
                      </label>
                      <input
                        id="lastName"
                        v-model="form.lastName"
                        type="text"
                        required
                        class="input-field mt-1"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <!-- Contact Information -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <input
                        id="email"
                        v-model="form.email"
                        type="email"
                        class="input-field mt-1"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone
                      </label>
                      <input
                        id="phone"
                        v-model="form.phone"
                        type="tel"
                        class="input-field mt-1"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <!-- Customer Type and Status -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="customerType" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Customer Type *
                      </label>
                      <select
                        id="customerType"
                        v-model="form.customerType"
                        required
                        class="input-field mt-1"
                      >
                        <option value="">Select type</option>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="industrial">Industrial</option>
                      </select>
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
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="prospect">Prospect</option>
                      </select>
                    </div>
                  </div>

                  <!-- Address -->
                  <div>
                    <label for="street" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Street Address *
                    </label>
                    <input
                      id="street"
                      v-model="form.address.street"
                      type="text"
                      required
                      class="input-field mt-1"
                      placeholder="123 Main St"
                    />
                  </div>

                  <div class="grid grid-cols-3 gap-4">
                    <div>
                      <label for="city" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        City *
                      </label>
                      <input
                        id="city"
                        v-model="form.address.city"
                        type="text"
                        required
                        class="input-field mt-1"
                        placeholder="Anytown"
                      />
                    </div>
                    <div>
                      <label for="state" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        State *
                      </label>
                      <input
                        id="state"
                        v-model="form.address.state"
                        type="text"
                        required
                        class="input-field mt-1"
                        placeholder="CA"
                      />
                    </div>
                    <div>
                      <label for="zipCode" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        ZIP Code *
                      </label>
                      <input
                        id="zipCode"
                        v-model="form.address.zipCode"
                        type="text"
                        required
                        class="input-field mt-1"
                        placeholder="12345"
                      />
                    </div>
                  </div>

                  <div>
                    <label for="country" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Country *
                    </label>
                    <input
                      id="country"
                      v-model="form.address.country"
                      type="text"
                      required
                      class="input-field mt-1"
                      placeholder="United States"
                    />
                  </div>

                  <!-- Billing Address (Optional) -->
                  <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div class="flex items-center">
                      <input
                        id="differentBilling"
                        v-model="differentBilling"
                        type="checkbox"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label for="differentBilling" class="ml-2 block text-sm text-gray-900 dark:text-white">
                        Different billing address
                      </label>
                    </div>

                    <div v-if="differentBilling" class="mt-4 space-y-4">
                      <div>
                        <label for="billingStreet" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Billing Street Address
                        </label>
                        <input
                          id="billingStreet"
                          v-model="form.billingAddress.street"
                          type="text"
                          class="input-field mt-1"
                          placeholder="123 Main St"
                        />
                      </div>

                      <div class="grid grid-cols-3 gap-4">
                        <div>
                          <label for="billingCity" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Billing City
                          </label>
                          <input
                            id="billingCity"
                            v-model="form.billingAddress.city"
                            type="text"
                            class="input-field mt-1"
                            placeholder="Anytown"
                          />
                        </div>
                        <div>
                          <label for="billingState" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Billing State
                          </label>
                          <input
                            id="billingState"
                            v-model="form.billingAddress.state"
                            type="text"
                            class="input-field mt-1"
                            placeholder="CA"
                          />
                        </div>
                        <div>
                          <label for="billingZipCode" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Billing ZIP Code
                          </label>
                          <input
                            id="billingZipCode"
                            v-model="form.billingAddress.zipCode"
                            type="text"
                            class="input-field mt-1"
                            placeholder="12345"
                          />
                        </div>
                      </div>

                      <div>
                        <label for="billingCountry" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Billing Country
                        </label>
                        <input
                          id="billingCountry"
                          v-model="form.billingAddress.country"
                          type="text"
                          class="input-field mt-1"
                          placeholder="United States"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Additional Information -->
                  <div>
                    <label for="source" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      How did they find you?
                    </label>
                    <input
                      id="source"
                      v-model="form.source"
                      type="text"
                      class="input-field mt-1"
                      placeholder="Google, Referral, etc."
                    />
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
                      placeholder="Any additional notes about this customer..."
                    ></textarea>
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
              {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Customer' : 'Create Customer') }}
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
import { ref, computed, watch } from 'vue'

const props = defineProps({
  customer: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const isSubmitting = ref(false)
const differentBilling = ref(false)

const isEditing = computed(() => !!props.customer)

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  customerType: '',
  status: 'active',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  },
  billingAddress: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  },
  source: '',
  notes: ''
})

// Initialize form with customer data if editing
watch(() => props.customer, (customer) => {
  if (customer) {
    form.value = {
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      email: customer.email || '',
      phone: customer.phone || '',
      customerType: customer.customerType || '',
      status: customer.status || 'active',
      address: {
        street: customer.address?.street || '',
        city: customer.address?.city || '',
        state: customer.address?.state || '',
        zipCode: customer.address?.zipCode || '',
        country: customer.address?.country || 'United States'
      },
      billingAddress: {
        street: customer.billingAddress?.street || '',
        city: customer.billingAddress?.city || '',
        state: customer.billingAddress?.state || '',
        zipCode: customer.billingAddress?.zipCode || '',
        country: customer.billingAddress?.country || 'United States'
      },
      source: customer.source || '',
      notes: customer.notes || ''
    }
    
    // Check if billing address is different
    differentBilling.value = !!(
      customer.billingAddress?.street ||
      customer.billingAddress?.city ||
      customer.billingAddress?.state ||
      customer.billingAddress?.zipCode
    )
  }
}, { immediate: true })

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    const customerData = {
      ...form.value,
      billingAddress: differentBilling.value ? form.value.billingAddress : undefined
    }
    
    emit('save', customerData)
  } catch (error) {
    console.error('Failed to save customer:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>