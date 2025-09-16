<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Settings
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your company settings and preferences
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Company Settings -->
      <div class="lg:col-span-2 space-y-6">
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Company Information</h3>
          <form @submit.prevent="handleSaveCompany" class="space-y-4">
            <div>
              <label for="companyName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
              <input
                type="text"
                id="companyName"
                v-model="companyForm.name"
                class="input-field mt-1"
                required
              />
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="contactEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Email</label>
                <input
                  type="email"
                  id="contactEmail"
                  v-model="companyForm.contactEmail"
                  class="input-field mt-1"
                  required
                />
              </div>
              <div>
                <label for="contactPhone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Phone</label>
                <input
                  type="tel"
                  id="contactPhone"
                  v-model="companyForm.contactPhone"
                  class="input-field mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <label for="companyStreet" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Street Address</label>
              <input
                type="text"
                id="companyStreet"
                v-model="companyForm.address.street"
                class="input-field mt-1"
                required
              />
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label for="companyCity" class="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                <input
                  type="text"
                  id="companyCity"
                  v-model="companyForm.address.city"
                  class="input-field mt-1"
                  required
                />
              </div>
              <div>
                <label for="companyState" class="block text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
                <input
                  type="text"
                  id="companyState"
                  v-model="companyForm.address.state"
                  class="input-field mt-1"
                  required
                />
              </div>
              <div>
                <label for="companyZipCode" class="block text-sm font-medium text-gray-700 dark:text-gray-300">ZIP Code</label>
                <input
                  type="text"
                  id="companyZipCode"
                  v-model="companyForm.address.zipCode"
                  class="input-field mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <label for="companyCountry" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
              <input
                type="text"
                id="companyCountry"
                v-model="companyForm.address.country"
                class="input-field mt-1"
                required
              />
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                class="btn-primary"
                :disabled="isSaving"
              >
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>

        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Business Settings</h3>
          <div class="space-y-4">
            <div>
              <label for="defaultTaxRate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Tax Rate (%)</label>
              <input
                type="number"
                id="defaultTaxRate"
                v-model.number="businessSettings.defaultTaxRate"
                step="0.01"
                min="0"
                max="100"
                class="input-field mt-1"
              />
            </div>

            <div>
              <label for="invoiceTerms" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Invoice Terms (days)</label>
              <input
                type="number"
                id="invoiceTerms"
                v-model.number="businessSettings.invoiceTerms"
                min="0"
                class="input-field mt-1"
              />
            </div>

            <div>
              <label for="quoteExpiry" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Quote Expiry (days)</label>
              <input
                type="number"
                id="quoteExpiry"
                v-model.number="businessSettings.quoteExpiry"
                min="0"
                class="input-field mt-1"
              />
            </div>

            <div class="flex justify-end">
              <button
                type="button"
                class="btn-primary"
                @click="saveBusinessSettings"
                :disabled="isSaving"
              >
                {{ isSaving ? 'Saving...' : 'Save Settings' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Sidebar -->
      <div class="space-y-6">
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Subscription</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Current Plan:</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white capitalize">
                {{ authStore.currentCompany?.subscriptionTier || 'Free' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Status:</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ authStore.currentCompany?.subscriptionStatus || 'Active' }}
              </span>
            </div>
            <button type="button" class="btn-primary w-full">
              Upgrade Plan
            </button>
          </div>
        </div>

        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Danger Zone</h3>
          <div class="space-y-3">
            <button type="button" class="btn-secondary w-full text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" @click="exportData">
              Export All Data
            </button>
            <button type="button" class="btn-secondary w-full text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" @click="deleteCompany">
              Delete Company
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const isSaving = ref(false)

const companyForm = ref({
  name: '',
  contactEmail: '',
  contactPhone: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
})

const businessSettings = ref({
  defaultTaxRate: 0,
  invoiceTerms: 30,
  quoteExpiry: 30,
})

onMounted(() => {
  if (authStore.currentCompany) {
    companyForm.value = {
      name: authStore.currentCompany.name || '',
      contactEmail: authStore.currentCompany.contactEmail || '',
      contactPhone: authStore.currentCompany.contactPhone || '',
      address: authStore.currentCompany.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
    }
  }
})

const handleSaveCompany = async () => {
  isSaving.value = true
  try {
    // This would need to be implemented in the backend
    console.log('Save company:', companyForm.value)
    alert('Company information updated successfully!')
  } catch (error) {
    console.error('Failed to update company:', error)
    alert('Failed to update company information. Please try again.')
  } finally {
    isSaving.value = false
  }
}

const saveBusinessSettings = async () => {
  isSaving.value = true
  try {
    // This would need to be implemented in the backend
    console.log('Save business settings:', businessSettings.value)
    alert('Business settings updated successfully!')
  } catch (error) {
    console.error('Failed to update business settings:', error)
    alert('Failed to update business settings. Please try again.')
  } finally {
    isSaving.value = false
  }
}

const exportData = () => {
  alert('Data export functionality will be implemented here')
}

const deleteCompany = () => {
  if (confirm('Are you sure you want to delete this company? This action cannot be undone and will delete all associated data.')) {
    alert('Company deletion functionality will be implemented here')
  }
}
</script>