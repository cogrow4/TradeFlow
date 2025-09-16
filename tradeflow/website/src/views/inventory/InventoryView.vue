<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Inventory
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your inventory and track stock levels
        </p>
      </div>
      <div class="flex space-x-3">
        <button type="button" class="btn-secondary" @click="exportInventory">
          <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
          Export
        </button>
        <button type="button" class="btn-primary" @click="showCreateModal = true">
          <PlusIcon class="h-4 w-4 mr-2" />
          Add Item
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
          <div class="mt-1 relative">
            <input
              type="text"
              id="search"
              v-model="searchTerm"
              class="input-field pl-10"
              placeholder="Search inventory..."
            />
            <MagnifyingGlassIcon class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select id="category" v-model="categoryFilter" class="input-field mt-1">
            <option value="">All Categories</option>
            <option value="electrical">Electrical</option>
            <option value="plumbing">Plumbing</option>
            <option value="hvac">HVAC</option>
            <option value="tools">Tools</option>
            <option value="safety">Safety</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="flex items-end">
          <button type="button" class="btn-secondary w-full" @click="clearFilters">
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Low Stock Alert -->
    <div v-if="lowStockItems.length > 0" class="card p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
      <div class="flex">
        <div class="flex-shrink-0">
          <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Low Stock Alert
          </h3>
          <div class="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
            <p>{{ lowStockItems.length }} item(s) are running low on stock.</p>
          </div>
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
        <p class="text-red-600 dark:text-red-400">Error loading inventory: {{ error }}</p>
        <button type="button" class="btn-primary mt-4" @click="loadInventory">
          Retry
        </button>
      </div>
    </div>

    <!-- Inventory Grid -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div
        v-for="item in filteredInventory"
        :key="item._id"
        class="card p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ item.name }}</h3>
            <p v-if="item.sku" class="text-sm text-gray-500 dark:text-gray-400">SKU: {{ item.sku }}</p>
            <p v-if="item.description" class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ item.description }}</p>
          </div>
          <div class="ml-4 flex-shrink-0">
            <span
              :class="getStockStatusColor(item.currentStock, item.minStockLevel)"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            >
              {{ item.currentStock }} in stock
            </span>
          </div>
        </div>

        <div class="mt-4 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Unit Cost:</span>
            <span class="text-gray-900 dark:text-white">${{ item.unitCost.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Selling Price:</span>
            <span class="text-gray-900 dark:text-white">${{ item.sellingPrice.toFixed(2) }}</span>
          </div>
          <div v-if="item.category" class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Category:</span>
            <span class="text-gray-900 dark:text-white capitalize">{{ item.category }}</span>
          </div>
        </div>

        <div class="mt-4 flex space-x-2">
          <button
            type="button"
            class="flex-1 btn-secondary text-sm"
            @click="editItem(item)"
          >
            Edit
          </button>
          <button
            type="button"
            class="flex-1 btn-primary text-sm"
            @click="adjustStock(item)"
          >
            Adjust Stock
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredInventory.length === 0" class="text-center py-12">
      <CubeIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No inventory items found</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Get started by adding your first inventory item.
      </p>
      <div class="mt-6">
        <button type="button" class="btn-primary" @click="showCreateModal = true">
          <PlusIcon class="h-4 w-4 mr-2" />
          Add Item
        </button>
      </div>
    </div>

    <!-- Inventory Item Modal -->
    <InventoryItemModal
      v-if="showCreateModal || editingItem"
      :item="editingItem"
      @save="handleSaveItem"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import InventoryItemModal from '@/components/inventory/InventoryItemModal.vue'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  CubeIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'
import { useQuery, useMutation } from '@/lib/mock-convex'
import { api } from '@/lib/convex'

const authStore = useAuthStore()

const searchTerm = ref('')
const categoryFilter = ref('')
const showCreateModal = ref(false)
const editingItem = ref(null)

// Convex integration
const { data: inventory, isLoading, error, refetch: refetchInventory } = useQuery(
  api.inventory.getInventory,
  () => ({ companyId: authStore.currentCompany?._id }),
  { enabled: computed(() => !!authStore.currentCompany?._id) }
)
const createItemMutation = useMutation(api.inventory.createInventoryItem)
const updateItemMutation = useMutation(api.inventory.updateInventoryItem)

const filteredInventory = computed(() => {
  if (!inventory.value) return []
  let filtered = inventory.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.sku?.toLowerCase().includes(search) ||
      item.description?.toLowerCase().includes(search)
    )
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(item => item.category === categoryFilter.value)
  }

  return filtered
})

const lowStockItems = computed(() => {
  if (!inventory.value) return []
  return inventory.value.filter(item => 
    item.minStockLevel && item.currentStock <= item.minStockLevel
  )
})

const getStockStatusColor = (currentStock: number, minStockLevel?: number) => {
  if (!minStockLevel) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  if (currentStock <= minStockLevel) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  if (currentStock <= minStockLevel * 2) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
}

const editItem = (item: any) => {
  editingItem.value = item
}

const adjustStock = (item: any) => {
  // This would open a stock adjustment modal
  console.log('Adjust stock for:', item)
}

const handleSaveItem = async (itemData: any) => {
  try {
    if (!authStore.currentCompany?._id) {
      console.error('No company ID found for the current user.')
      return
    }

    if (editingItem.value) {
      await updateItemMutation.value.mutate({ itemId: editingItem.value._id, ...itemData })
    } else {
      await createItemMutation.value.mutate({ companyId: authStore.currentCompany._id, ...itemData })
    }
    refetchInventory()
    closeModal()
  } catch (error) {
    console.error('Failed to save inventory item:', error)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingItem.value = null
}

const clearFilters = () => {
  searchTerm.value = ''
  categoryFilter.value = ''
}

const exportInventory = () => {
  const csvContent = generateCSV(filteredInventory.value)
  downloadCSV(csvContent, 'inventory.csv')
}

const generateCSV = (data: any[]) => {
  const headers = ['Name', 'SKU', 'Category', 'Current Stock', 'Min Stock Level', 'Unit Cost', 'Selling Price']
  const rows = data.map(item => [
    item.name,
    item.sku || '',
    item.category || '',
    item.currentStock,
    item.minStockLevel || '',
    item.unitCost,
    item.sellingPrice,
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

const loadInventory = () => {
  refetchInventory()
}
</script>