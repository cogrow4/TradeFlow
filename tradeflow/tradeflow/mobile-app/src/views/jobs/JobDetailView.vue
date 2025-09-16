<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 mobile-safe-area">
      <div class="flex items-center justify-between px-4 py-3">
        <button @click="$router.back()" class="p-2 -ml-2">
          <ArrowLeftIcon class="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </button>
        <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Job Details</h1>
        <button @click="showJobMenu = true" class="p-2 -mr-2">
          <EllipsisVerticalIcon class="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="job" class="space-y-4 p-4">
      <!-- Job Header -->
      <div class="card p-4">
        <div class="flex items-start justify-between mb-3">
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ job.title }}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ job.jobNumber }}</p>
          </div>
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            :class="getStatusColor(job.status)"
          >
            {{ job.status.replace('_', ' ') }}
          </span>
        </div>
        
        <p class="text-gray-700 dark:text-gray-300 mb-4">{{ job.description }}</p>
        
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-500 dark:text-gray-400">Priority:</span>
            <span class="ml-2 font-medium" :class="getPriorityColor(job.priority)">
              {{ job.priority }}
            </span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">Type:</span>
            <span class="ml-2 font-medium text-gray-900 dark:text-white">{{ job.jobType }}</span>
          </div>
        </div>
      </div>

      <!-- Customer Info -->
      <div class="card p-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Customer</h3>
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <span class="text-primary-700 dark:text-primary-200 font-medium">
              {{ job.customer?.firstName[0] }}{{ job.customer?.lastName[0] }}
            </span>
          </div>
          <div class="flex-1">
            <p class="font-medium text-gray-900 dark:text-white">
              {{ job.customer?.firstName }} {{ job.customer?.lastName }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ job.customer?.email }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ job.customer?.phone }}</p>
          </div>
          <button
            @click="callCustomer"
            class="p-2 bg-green-100 dark:bg-green-900 rounded-lg"
          >
            <PhoneIcon class="w-5 h-5 text-green-600 dark:text-green-400" />
          </button>
        </div>
      </div>

      <!-- Location -->
      <div class="card p-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Location</h3>
        <div class="space-y-3">
          <div class="flex items-start space-x-3">
            <MapPinIcon class="w-5 h-5 text-gray-400 mt-0.5" />
            <div class="flex-1">
              <p class="text-gray-900 dark:text-white">{{ job.location.address }}</p>
              <p v-if="job.location.instructions" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ job.location.instructions }}
              </p>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <button
              @click="openMaps"
              class="flex-1 btn-primary text-sm py-2"
            >
              <MapIcon class="w-4 h-4 mr-2" />
              Open in Maps
            </button>
            <button
              @click="getDirections"
              class="flex-1 btn-secondary text-sm py-2"
            >
              <ArrowTopRightOnSquareIcon class="w-4 h-4 mr-2" />
              Directions
            </button>
          </div>
        </div>
      </div>

      <!-- Schedule -->
      <div class="card p-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Schedule</h3>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-gray-500 dark:text-gray-400">Scheduled Start:</span>
            <span class="font-medium text-gray-900 dark:text-white">
              {{ job.scheduledStart ? formatDateTime(job.scheduledStart) : 'Not scheduled' }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-500 dark:text-gray-400">Scheduled End:</span>
            <span class="font-medium text-gray-900 dark:text-white">
              {{ job.scheduledEnd ? formatDateTime(job.scheduledEnd) : 'Not scheduled' }}
            </span>
          </div>
          <div v-if="job.actualStart" class="flex items-center justify-between">
            <span class="text-gray-500 dark:text-gray-400">Actual Start:</span>
            <span class="font-medium text-gray-900 dark:text-white">
              {{ formatDateTime(job.actualStart) }}
            </span>
          </div>
          <div v-if="job.actualEnd" class="flex items-center justify-between">
            <span class="text-gray-500 dark:text-gray-400">Actual End:</span>
            <span class="font-medium text-gray-900 dark:text-white">
              {{ formatDateTime(job.actualEnd) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Time Tracking -->
      <div class="card p-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Time Tracking</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-gray-500 dark:text-gray-400">Estimated Hours:</span>
            <span class="font-medium text-gray-900 dark:text-white">
              {{ job.estimatedHours || 'Not set' }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-500 dark:text-gray-400">Actual Hours:</span>
            <span class="font-medium text-gray-900 dark:text-white">
              {{ job.actualHours || '0' }}
            </span>
          </div>
          
          <div class="flex space-x-2">
            <button
              v-if="!isTracking"
              @click="startTimeTracking"
              class="flex-1 btn-primary text-sm py-2"
            >
              <PlayIcon class="w-4 h-4 mr-2" />
              Start Timer
            </button>
            <button
              v-else
              @click="stopTimeTracking"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4 rounded-lg"
            >
              <StopIcon class="w-4 h-4 mr-2" />
              Stop Timer
            </button>
            <button
              @click="addManualTime"
              class="flex-1 btn-secondary text-sm py-2"
            >
              <ClockIcon class="w-4 h-4 mr-2" />
              Add Time
            </button>
          </div>
        </div>
      </div>

      <!-- Photos -->
      <div class="card p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Photos</h3>
          <button
            @click="takePhoto"
            class="btn-primary text-sm py-2 px-3"
          >
            <CameraIcon class="w-4 h-4 mr-2" />
            Add Photo
          </button>
        </div>
        
        <div v-if="job.photos && job.photos.length > 0" class="grid grid-cols-2 gap-2">
          <div
            v-for="photo in job.photos"
            :key="photo.timestamp"
            class="relative"
          >
            <img
              :src="photo.url"
              :alt="photo.caption"
              class="w-full h-24 object-cover rounded-lg"
              @click="viewPhoto(photo)"
            />
            <p v-if="photo.caption" class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
              {{ photo.caption }}
            </p>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <CameraIcon class="mx-auto h-12 w-12 text-gray-400" />
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">No photos yet</p>
        </div>
      </div>

      <!-- Materials & Labor -->
      <div class="card p-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Materials & Labor</h3>
        
        <div v-if="job.materials && job.materials.length > 0" class="mb-4">
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">Materials Used</h4>
          <div class="space-y-2">
            <div
              v-for="material in job.materials"
              :key="material.inventoryId"
              class="flex items-center justify-between text-sm"
            >
              <span class="text-gray-700 dark:text-gray-300">{{ material.name }}</span>
              <span class="text-gray-500 dark:text-gray-400">
                {{ material.quantity }} × ${{ material.unitCost.toFixed(2) }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="job.labor && job.labor.length > 0">
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">Labor</h4>
          <div class="space-y-2">
            <div
              v-for="labor in job.labor"
              :key="labor.userId"
              class="flex items-center justify-between text-sm"
            >
              <span class="text-gray-700 dark:text-gray-300">{{ labor.userName }}</span>
              <span class="text-gray-500 dark:text-gray-400">
                {{ labor.hours }}h × ${{ labor.rate.toFixed(2) }}
              </span>
            </div>
          </div>
        </div>

        <button
          @click="addMaterial"
          class="w-full btn-secondary text-sm py-2 mt-3"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Material/Labor
        </button>
      </div>

      <!-- Notes -->
      <div class="card p-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Notes</h3>
        <div v-if="job.notes" class="text-gray-700 dark:text-gray-300 mb-3">
          {{ job.notes }}
        </div>
        <button
          @click="addNote"
          class="w-full btn-secondary text-sm py-2"
        >
          <PencilIcon class="w-4 h-4 mr-2" />
          Add Note
        </button>
      </div>

      <!-- Actions -->
      <div class="space-y-2 pb-20">
        <button
          v-if="job.status === 'scheduled'"
          @click="startJob"
          class="w-full btn-primary py-3"
        >
          <PlayIcon class="w-5 h-5 mr-2" />
          Start Job
        </button>
        <button
          v-if="job.status === 'in_progress'"
          @click="completeJob"
          class="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium"
        >
          <CheckIcon class="w-5 h-5 mr-2" />
          Complete Job
        </button>
        <button
          @click="updateStatus"
          class="w-full btn-secondary py-3"
        >
          <PencilIcon class="w-5 h-5 mr-2" />
          Update Status
        </button>
      </div>
    </div>

    <!-- Job Menu -->
    <div
      v-if="showJobMenu"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end justify-center"
      @click="showJobMenu = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-t-xl w-full max-w-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Job Actions</h3>
        <div class="space-y-2">
          <button
            @click="editJob"
            class="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
          >
            Edit Job
          </button>
          <button
            @click="duplicateJob"
            class="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
          >
            Duplicate Job
          </button>
          <button
            @click="createQuote"
            class="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
          >
            Create Quote
          </button>
          <button
            @click="createInvoice"
            class="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
          >
            Create Invoice
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Camera, Geolocation } from '@capacitor/camera'
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  MapPinIcon,
  MapIcon,
  ArrowTopRightOnSquareIcon,
  PhoneIcon,
  PlayIcon,
  StopIcon,
  ClockIcon,
  CameraIcon,
  PlusIcon,
  PencilIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const job = ref(null)
const showJobMenu = ref(false)
const isTracking = ref(false)

const getStatusColor = (status: string) => {
  const colors = {
    quoted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    scheduled: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    in_progress: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    on_hold: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  }
  return colors[status] || colors.quoted
}

const getPriorityColor = (priority: string) => {
  const colors = {
    low: 'text-gray-600 dark:text-gray-400',
    medium: 'text-blue-600 dark:text-blue-400',
    high: 'text-orange-600 dark:text-orange-400',
    urgent: 'text-red-600 dark:text-red-400',
  }
  return colors[priority] || colors.medium
}

const formatDateTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString()
}

const loadJob = async () => {
  try {
    const response = await fetch(`/api/jobs/${route.params.id}`, {
      headers: {
        'Authorization': `Bearer ${await authStore.currentUser?.getToken()}`
      }
    })
    
    if (response.ok) {
      job.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to load job:', error)
  } finally {
    loading.value = false
  }
}

const callCustomer = () => {
  if (job.value?.customer?.phone) {
    window.open(`tel:${job.value.customer.phone}`)
  }
}

const openMaps = () => {
  if (job.value?.location?.address) {
    const encodedAddress = encodeURIComponent(job.value.location.address)
    window.open(`https://maps.google.com/maps?q=${encodedAddress}`)
  }
}

const getDirections = () => {
  if (job.value?.location?.address) {
    const encodedAddress = encodeURIComponent(job.value.location.address)
    window.open(`https://maps.google.com/maps/dir/?api=1&destination=${encodedAddress}`)
  }
}

const takePhoto = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: 'uri'
    })

    // Upload photo to server
    const formData = new FormData()
    formData.append('photo', image.webPath)
    formData.append('jobId', job.value._id)

    const response = await fetch('/api/jobs/photos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await authStore.currentUser?.getToken()}`
      },
      body: formData
    })

    if (response.ok) {
      await loadJob() // Reload job to show new photo
    }
  } catch (error) {
    console.error('Failed to take photo:', error)
  }
}

const viewPhoto = (photo: any) => {
  // Open photo in full screen
  window.open(photo.url, '_blank')
}

const startTimeTracking = () => {
  isTracking.value = true
  // Start timer logic
}

const stopTimeTracking = () => {
  isTracking.value = false
  // Stop timer and record time
}

const addManualTime = () => {
  // Show modal to add manual time entry
}

const addMaterial = () => {
  // Navigate to add material screen
}

const addNote = () => {
  // Show modal to add note
}

const startJob = async () => {
  try {
    const response = await fetch(`/api/jobs/${job.value._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await authStore.currentUser?.getToken()}`
      },
      body: JSON.stringify({
        status: 'in_progress',
        actualStart: Date.now()
      })
    })

    if (response.ok) {
      await loadJob()
    }
  } catch (error) {
    console.error('Failed to start job:', error)
  }
}

const completeJob = async () => {
  try {
    const response = await fetch(`/api/jobs/${job.value._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await authStore.currentUser?.getToken()}`
      },
      body: JSON.stringify({
        status: 'completed',
        actualEnd: Date.now()
      })
    })

    if (response.ok) {
      await loadJob()
    }
  } catch (error) {
    console.error('Failed to complete job:', error)
  }
}

const updateStatus = () => {
  // Show status update modal
}

const editJob = () => {
  router.push(`/jobs/${job.value._id}/edit`)
}

const duplicateJob = () => {
  // Duplicate job logic
}

const createQuote = () => {
  router.push(`/quotes?jobId=${job.value._id}`)
}

const createInvoice = () => {
  router.push(`/invoices?jobId=${job.value._id}`)
}

onMounted(() => {
  loadJob()
})
</script>