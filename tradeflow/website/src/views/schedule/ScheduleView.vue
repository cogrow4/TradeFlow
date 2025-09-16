<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Schedule
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your team's schedule and appointments
        </p>
      </div>
      <div class="flex space-x-3">
        <button type="button" class="btn-primary" @click="showCreateModal = true">
          <PlusIcon class="h-4 w-4 mr-2" />
          Add Event
        </button>
      </div>
    </div>

    <!-- Calendar View -->
    <div class="card p-6">
      <div class="text-center">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Calendar View</h3>
        <p class="text-gray-500 dark:text-gray-400">Calendar functionality will be implemented here</p>
        <div class="mt-4 p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Calendar component coming soon</p>
        </div>
      </div>
    </div>

    <!-- Upcoming Events -->
    <div class="card p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
      <div v-if="upcomingEvents.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No upcoming events scheduled</p>
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="event in upcomingEvents"
          :key="event._id"
          class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div class="h-3 w-3 rounded-full" :style="{ backgroundColor: event.color || '#3b82f6' }"></div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ event.title }}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDateTime(event.start) }} - {{ formatDateTime(event.end) }}
              </p>
              <p v-if="event.location" class="text-sm text-gray-500 dark:text-gray-400">{{ event.location }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span :class="getTypeColor(event.type)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
              {{ event.type }}
            </span>
            <button
              type="button"
              class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
              @click="editEvent(event)"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Modal -->
    <EventModal
      v-if="showCreateModal || editingEvent"
      :event="editingEvent"
      @save="handleSaveEvent"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import EventModal from '@/components/schedule/EventModal.vue'
import {
  PlusIcon,
  CalendarIcon,
} from '@heroicons/vue/24/outline'
import { useQuery, useMutation } from '@/lib/mock-convex'
import { api } from '@/lib/convex'

const authStore = useAuthStore()

const showCreateModal = ref(false)
const editingEvent = ref(null)

// Convex integration
const { data: events, isLoading, error, refetch: refetchEvents } = useQuery(
  api.schedules.getSchedules,
  () => ({ companyId: authStore.currentCompany?._id }),
  { enabled: computed(() => !!authStore.currentCompany?._id) }
)
const createEventMutation = useMutation(api.schedules.createSchedule)
const updateEventMutation = useMutation(api.schedules.updateSchedule)

const upcomingEvents = computed(() => {
  if (!events.value) return []
  const now = Date.now()
  return events.value
    .filter(event => event.start > now)
    .sort((a, b) => a.start - b.start)
    .slice(0, 10) // Show next 10 events
})

const getTypeColor = (type: string) => {
  const colors = {
    job: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    meeting: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  }
  return colors[type] || colors.other
}

const formatDateTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString()
}

const editEvent = (event: any) => {
  editingEvent.value = event
}

const handleSaveEvent = async (eventData: any) => {
  try {
    if (!authStore.currentCompany?._id) {
      console.error('No company ID found for the current user.')
      return
    }

    if (editingEvent.value) {
      await updateEventMutation.value.mutate({ scheduleId: editingEvent.value._id, ...eventData })
    } else {
      await createEventMutation.value.mutate({ companyId: authStore.currentCompany._id, ...eventData })
    }
    refetchEvents()
    closeModal()
  } catch (error) {
    console.error('Failed to save event:', error)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingEvent.value = null
}
</script>