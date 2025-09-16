<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Documents
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your business documents and files
        </p>
      </div>
      <div class="flex space-x-3">
        <button type="button" class="btn-primary" @click="showUploadModal = true">
          <PlusIcon class="h-4 w-4 mr-2" />
          Upload Document
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
              placeholder="Search documents..."
            />
            <MagnifyingGlassIcon class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
          <select id="type" v-model="typeFilter" class="input-field mt-1">
            <option value="">All Types</option>
            <option value="invoice">Invoice</option>
            <option value="quote">Quote</option>
            <option value="contract">Contract</option>
            <option value="photo">Photo</option>
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

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-6">
      <div class="text-center">
        <p class="text-red-600 dark:text-red-400">Error loading documents: {{ error }}</p>
        <button type="button" class="btn-primary mt-4" @click="loadDocuments">
          Retry
        </button>
      </div>
    </div>

    <!-- Documents Grid -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div
        v-for="document in filteredDocuments"
        :key="document._id"
        class="card p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <DocumentIcon class="h-8 w-8 text-gray-400" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ document.name }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDate(document.uploadedAt) }}
                </p>
              </div>
            </div>
            
            <div class="mt-3">
              <span :class="getTypeColor(document.type)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                {{ document.type }}
              </span>
            </div>
            
            <div class="mt-3">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Uploaded by: {{ document.uploadedBy?.firstName }} {{ document.uploadedBy?.lastName }}
              </p>
            </div>
          </div>
        </div>

        <div class="mt-4 flex space-x-2">
          <button
            type="button"
            class="flex-1 btn-secondary text-sm"
            @click="downloadDocument(document)"
          >
            Download
          </button>
          <button
            type="button"
            class="flex-1 btn-secondary text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            @click="deleteDocument(document)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredDocuments.length === 0" class="text-center py-12">
      <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No documents found</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Get started by uploading your first document.
      </p>
      <div class="mt-6">
        <button type="button" class="btn-primary" @click="showUploadModal = true">
          <PlusIcon class="h-4 w-4 mr-2" />
          Upload Document
        </button>
      </div>
    </div>

    <!-- Upload Modal -->
    <UploadModal
      v-if="showUploadModal"
      @save="handleUploadDocument"
      @close="closeUploadModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import UploadModal from '@/components/documents/UploadModal.vue'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentIcon,
} from '@heroicons/vue/24/outline'
import { useQuery, useMutation } from '@/lib/mock-convex'
import { api } from '@/lib/convex'

const authStore = useAuthStore()

const searchTerm = ref('')
const typeFilter = ref('')
const showUploadModal = ref(false)

// Convex integration
const { data: documents, isLoading, error, refetch: refetchDocuments } = useQuery(
  api.documents.getDocuments,
  () => ({ companyId: authStore.currentCompany?._id }),
  { enabled: computed(() => !!authStore.currentCompany?._id) }
)
const deleteDocumentMutation = useMutation(api.documents.deleteDocument)

const filteredDocuments = computed(() => {
  if (!documents.value) return []
  let filtered = documents.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(doc =>
      doc.name.toLowerCase().includes(search)
    )
  }

  if (typeFilter.value) {
    filtered = filtered.filter(doc => doc.type === typeFilter.value)
  }

  return filtered
})

const getTypeColor = (type: string) => {
  const colors = {
    invoice: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    quote: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    contract: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    photo: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  }
  return colors[type] || colors.other
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}

const downloadDocument = (document: any) => {
  window.open(document.url, '_blank')
}

const deleteDocument = async (document: any) => {
  if (!confirm(`Are you sure you want to delete "${document.name}"?`)) {
    return
  }

  try {
    await deleteDocumentMutation.value.mutate({ documentId: document._id })
    refetchDocuments()
  } catch (error) {
    console.error('Failed to delete document:', error)
  }
}

const handleUploadDocument = async (documentData: any) => {
  try {
    // This would need to be implemented in the backend
    console.log('Upload document:', documentData)
    closeUploadModal()
    refetchDocuments()
  } catch (error) {
    console.error('Failed to upload document:', error)
  }
}

const closeUploadModal = () => {
  showUploadModal.value = false
}

const clearFilters = () => {
  searchTerm.value = ''
  typeFilter.value = ''
}

const loadDocuments = () => {
  refetchDocuments()
}
</script>