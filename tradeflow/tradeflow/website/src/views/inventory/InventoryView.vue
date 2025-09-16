<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Inventory
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your parts, materials, and equipment inventory.
        </p>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0 space-x-3">
        <button
          type="button"
          class="btn-secondary"
          @click="exportInventory"
        >
          <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
          Export
        </button>
        <button
          type="button"
          class="btn-secondary"
          @click="showReorderModal = true"
        >
          <ExclamationTriangleIcon class="h-4 w-4 mr-2" />
          Reorder Alert
        </button>
        <button
          type="button"
          class="btn-primary"
          @click="showCreateModal = true"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          Add Item
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
              <CubeIcon class="w-5 h-5 text-white" />
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Total Items
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">
                {{ stats.totalItems }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
              <ExclamationTriangleIcon class="w-5 h-5 text-white" />
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Low Stock
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">
                {{ stats.lowStockItems }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
              <CurrencyDollarIcon class="w-5 h-5 text-white" />
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Total Value
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">
                ${{ stats.totalValue.toLocaleString() }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
              <TruckIcon class="w-5 h-5 text-white" />
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Suppliers
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">
                {{ stats.totalSuppliers }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card p-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search inventory
          </label>
          <div class="mt-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="search"
              v-model="searchTerm"
              type="text"
              placeholder="Search by name, SKU, or barcode..."
              class="input-field pl-10"
            />
          </div>
        </div>
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            id="category"
            v-model="categoryFilter"
            class="input-field mt-1"
          >
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <div>
          <label for="supplier" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Supplier
          </label>
          <select
            id="supplier"
            v-model="supplierFilter"
            class="input-field mt-1"
          >
            <option value="">All Suppliers</option>
            <option v-for="supplier in suppliers" :key="supplier._id" :value="supplier._id">
              {{ supplier.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="stockStatus" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Stock Status
          </label>
          <select
            id="stockStatus"
            v-model="stockStatusFilter"
            class="input-field mt-1"
          >
            <option value="">All Items</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Item
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                SKU
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Stock
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Cost Price
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Selling Price
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Supplier
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="item in filteredInventory"
              :key="item._id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ item.name }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                    {{ item.description }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ item.sku }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  {{ item.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-sm text-gray-900 dark:text-white mr-2">
                    {{ item.currentStock }} {{ item.unit }}
                  </span>
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    :class="getStockStatusColor(item)"
                  >
                    {{ getStockStatus(item) }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ${{ item.costPrice.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ${{ item.sellingPrice.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ item.supplier?.name || 'No supplier' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="editItem(item)"
                    class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Edit
                  </button>
                  <button
                    @click="adjustStock(item)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  >
                    Adjust
                  </button>
                  <button
                    @click="deleteItem(item)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div v-if="filteredInventory.length === 0" class="text-center py-12">
        <CubeIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No inventory items found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by adding your first inventory item.
        </p>
        <div class="mt-6">
          <button
            type="button"
            class="btn-primary"
            @click="showCreateModal = true"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            Add Item
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Item Modal -->
    <InventoryItemModal
      v-if="showCreateModal || editingItem"
      :item="editingItem"
      @close="closeModal"
      @save="handleSaveItem"
    />

    <!-- Stock Adjustment Modal -->
    <StockAdjustmentModal
      v-if="adjustingItem"
      :item="adjustingItem"
      @close="closeAdjustmentModal"
      @adjust="handleStockAdjustment"
    />

    <!-- Reorder Alert Modal -->
    <ReorderAlertModal
      v-if="showReorderModal"
      @close="showReorderModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import InventoryItemModal from '@/components/inventory/InventoryItemModal.vue'
import StockAdjustmentModal from '@/components/inventory/StockAdjustmentModal.vue'
import ReorderAlertModal from '@/components/inventory/ReorderAlertModal.vue'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  CubeIcon,
  CurrencyDollarIcon,
  TruckIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()

const inventory = ref([])
const suppliers = ref([])
const categories = ref([])
const searchTerm = ref('')
const categoryFilter = ref('')
const supplierFilter = ref('')
const stockStatusFilter = ref('')
const showCreateModal = ref(false)
const editingItem = ref(null)
const adjustingItem = ref(null)
const showReorderModal = ref(false)

const stats = ref({
  totalItems: 0,
  lowStockItems: 0,
  totalValue: 0,
  totalSuppliers: 0
})

const filteredInventory = computed(() => {
  let filtered = inventory.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.sku.toLowerCase().includes(search) ||
      item.barcode?.toLowerCase().includes(search) ||
      item.description?.toLowerCase().includes(search)
    )
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(item => item.category === categoryFilter.value)
  }

  if (supplierFilter.value) {
    filtered = filtered.filter(item => item.supplierId === supplierFilter.value)
  }

  if (stockStatusFilter.value) {
    filtered = filtered.filter(item => {
      const status = getStockStatus(item)
      return status.toLowerCase().replace(' ', '_') === stockStatusFilter.value
    })
  }

  return filtered
})

const getStockStatus = (item: any) => {
  if (item.currentStock <= 0) return 'Out of Stock'
  if (item.currentStock <= item.reorderPoint) return 'Low Stock'
  return 'In Stock'
}

const getStockStatusColor = (item: any) => {
  const status = getStockStatus(item)
  const colors = {
    'In Stock': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Low Stock': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Out of Stock': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }
  return colors[status] || colors['In Stock']
}

const loadInventory = async () => {
  try {
    const response = await fetch('/api/inventory', {
      headers: {
        'Authorization': `Bearer ${await authStore.currentUser?.getToken()}`
      }
    })
    
    if (response.ok) {
      inventory.value = await response.json()
      updateStats()
    }
  } catch (error) {
    console.error('Failed to load inventory:', error)
  }
}

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

const updateStats = () => {
  stats.value = {
    totalItems: inventory.value.length,
    lowStockItems: inventory.value.filter(item => item.currentStock <= item.reorderPoint).length,
    totalValue: inventory.value.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0),
    totalSuppliers: suppliers.value.length
  }

  // Extract unique categories
  categories.value = [...new Set(inventory.value.map(item => item.category))]
}

const editItem = (item: any) => {
  editingItem.value = item
}

const adjustStock = (item: any) => {
  adjustingItem.value = item
}

const deleteItem = async (item: any) => {
  if (confirm(`Are you sure you want to delete ${item.name}?`)) {
    try {
      const response = await fetch(`/api/inventory/${item._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await authStore.currentUser?.getToken()}`
        }
      })
      
      if (response.ok) {
        await loadInventory()
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }
}

const handleSaveItem = async (itemData: any) => {
  try {
    const url = editingItem.value 
      ? `/api/inventory/${editingItem.value._id}`
      : '/api/inventory'
    
    const method = editingItem.value ? 'PATCH' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await authStore.currentUser?.getToken()}`
      },
      body: JSON.stringify(itemData)
    })
    
    if (response.ok) {
      await loadInventory()
      closeModal()
    }
  } catch (error) {
    console.error('Failed to save item:', error)
  }
}

const handleStockAdjustment = async (itemId: string, adjustment: any) => {
  try {
    const response = await fetch(`/api/inventory/${itemId}/adjust`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await authStore.currentUser?.getToken()}`
      },
      body: JSON.stringify(adjustment)
    })
    
    if (response.ok) {
      await loadInventory()
      closeAdjustmentModal()
    }
  } catch (error) {
    console.error('Failed to adjust stock:', error)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingItem.value = null
}

const closeAdjustmentModal = () => {
  adjustingItem.value = null
}

const exportInventory = () => {
  const csvContent = generateCSV(filteredInventory.value)
  downloadCSV(csvContent, 'inventory.csv')
}

const generateCSV = (data: any[]) => {
  const headers = ['Name', 'SKU', 'Category', 'Current Stock', 'Cost Price', 'Selling Price', 'Supplier', 'Status']
  const rows = data.map(item => [
    item.name,
    item.sku,
    item.category,
    item.currentStock,
    item.costPrice,
    item.sellingPrice,
    item.supplier?.name || 'No supplier',
    getStockStatus(item)
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
  loadInventory()
  loadSuppliers()
})
</script>