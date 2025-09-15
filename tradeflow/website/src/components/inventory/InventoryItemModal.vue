<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  {{ isEditing ? 'Edit Inventory Item' : 'Add New Inventory Item' }}
                </h3>

                <div class="space-y-4">
                  <!-- Basic Information -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Item Name *
                      </label>
                      <input
                        id="name"
                        v-model="form.name"
                        type="text"
                        required
                        class="input-field mt-1"
                        placeholder="Electrical Wire"
                      />
                    </div>
                    <div>
                      <label for="sku" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        SKU *
                      </label>
                      <input
                        id="sku"
                        v-model="form.sku"
                        type="text"
                        required
                        class="input-field mt-1"
                        placeholder="WIRE-001"
                      />
                    </div>
                  </div>

                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      id="description"
                      v-model="form.description"
                      rows="2"
                      class="input-field mt-1"
                      placeholder="Detailed description of the item..."
                    ></textarea>
                  </div>

                  <!-- Category and Barcode -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Category *
                      </label>
                      <input
                        id="category"
                        v-model="form.category"
                        type="text"
                        required
                        class="input-field mt-1"
                        placeholder="Electrical, Plumbing, HVAC"
                      />
                    </div>
                    <div>
                      <label for="barcode" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Barcode
                      </label>
                      <input
                        id="barcode"
                        v-model="form.barcode"
                        type="text"
                        class="input-field mt-1"
                        placeholder="123456789012"
                      />
                    </div>
                  </div>

                  <!-- Unit and Location -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="unit" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Unit *
                      </label>
                      <select
                        id="unit"
                        v-model="form.unit"
                        required
                        class="input-field mt-1"
                      >
                        <option value="">Select unit</option>
                        <option value="each">Each</option>
                        <option value="meter">Meter</option>
                        <option value="foot">Foot</option>
                        <option value="kg">Kilogram</option>
                        <option value="lb">Pound</option>
                        <option value="box">Box</option>
                        <option value="roll">Roll</option>
                        <option value="sheet">Sheet</option>
                      </select>
                    </div>
                    <div>
                      <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Location
                      </label>
                      <input
                        id="location"
                        v-model="form.location"
                        type="text"
                        class="input-field mt-1"
                        placeholder="Warehouse A, Shelf 1"
                      />
                    </div>
                  </div>

                  <!-- Pricing -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="costPrice" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Cost Price *
                      </label>
                      <div class="mt-1 relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          id="costPrice"
                          v-model.number="form.costPrice"
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          class="input-field pl-7"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label for="sellingPrice" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Selling Price *
                      </label>
                      <div class="mt-1 relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          id="sellingPrice"
                          v-model.number="form.sellingPrice"
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          class="input-field pl-7"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Stock Levels -->
                  <div class="grid grid-cols-3 gap-4">
                    <div>
                      <label for="currentStock" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current Stock *
                      </label>
                      <input
                        id="currentStock"
                        v-model.number="form.currentStock"
                        type="number"
                        min="0"
                        required
                        class="input-field mt-1"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label for="minimumStock" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Minimum Stock
                      </label>
                      <input
                        id="minimumStock"
                        v-model.number="form.minimumStock"
                        type="number"
                        min="0"
                        class="input-field mt-1"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label for="reorderPoint" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Reorder Point
                      </label>
                      <input
                        id="reorderPoint"
                        v-model.number="form.reorderPoint"
                        type="number"
                        min="0"
                        class="input-field mt-1"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <!-- Supplier -->
                  <div>
                    <label for="supplierId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Supplier
                    </label>
                    <select
                      id="supplierId"
                      v-model="form.supplierId"
                      class="input-field mt-1"
                    >
                      <option value="">Select supplier</option>
                      <option v-for="supplier in suppliers" :key="supplier._id" :value="supplier._id">
                        {{ supplier.name }}
                      </option>
                    </select>
                  </div>

                  <!-- Status -->
                  <div>
                    <label class="flex items-center">
                      <input
                        v-model="form.isActive"
                        type="checkbox"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span class="ml-2 text-sm text-gray-900 dark:text-white">
                        Active (item is available for use)
                      </span>
                    </label>
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
              {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Item' : 'Create Item') }}
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

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const authStore = useAuthStore()

const isSubmitting = ref(false)
const suppliers = ref([])

const isEditing = computed(() => !!props.item)

const form = ref({
  name: '',
  description: '',
  sku: '',
  barcode: '',
  category: '',
  unit: '',
  costPrice: 0,
  sellingPrice: 0,
  currentStock: 0,
  minimumStock: 0,
  reorderPoint: 0,
  supplierId: '',
  location: '',
  isActive: true
})

// Initialize form with item data if editing
watch(() => props.item, (item) => {
  if (item) {
    form.value = {
      name: item.name || '',
      description: item.description || '',
      sku: item.sku || '',
      barcode: item.barcode || '',
      category: item.category || '',
      unit: item.unit || '',
      costPrice: item.costPrice || 0,
      sellingPrice: item.sellingPrice || 0,
      currentStock: item.currentStock || 0,
      minimumStock: item.minimumStock || 0,
      reorderPoint: item.reorderPoint || 0,
      supplierId: item.supplierId || '',
      location: item.location || '',
      isActive: item.isActive !== false
    }
  }
}, { immediate: true })

const loadSuppliers = async () => {
  try {
    const response = await fetch('/api/suppliers', {
      headers: {
        'Authorization': `Bearer ${await authStore.currentUser?.getToken()}`
      }
    })
    
    if (response.ok) {
      suppliers.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to load suppliers:', error)
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    const itemData = {
      ...form.value,
      markup: form.value.costPrice > 0 ? ((form.value.sellingPrice - form.value.costPrice) / form.value.costPrice) * 100 : 0
    }
    
    emit('save', itemData)
  } catch (error) {
    console.error('Failed to save item:', error)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadSuppliers()
})
</script>