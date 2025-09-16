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
                  {{ isEditing ? 'Edit Event' : 'Create Event' }}
                </h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <input
                      type="text"
                      id="title"
                      v-model="formData.title"
                      class="input-field mt-1"
                      required
                    />
                  </div>

                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <textarea
                      id="description"
                      v-model="formData.description"
                      rows="3"
                      class="input-field mt-1"
                    ></textarea>
                  </div>

                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                      <select id="type" v-model="formData.type" class="input-field mt-1" required>
                        <option value="job">Job</option>
                        <option value="meeting">Meeting</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label for="color" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                      <input
                        type="color"
                        id="color"
                        v-model="formData.color"
                        class="input-field mt-1 h-10"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label for="start" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date & Time</label>
                      <input
                        type="datetime-local"
                        id="start"
                        v-model="formData.start"
                        class="input-field mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label for="end" class="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date & Time</label>
                      <input
                        type="datetime-local"
                        id="end"
                        v-model="formData.end"
                        class="input-field mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                    <input
                      type="text"
                      id="location"
                      v-model="formData.location"
                      class="input-field mt-1"
                    />
                  </div>

                  <div>
                    <label class="flex items-center">
                      <input
                        type="checkbox"
                        v-model="formData.allDay"
                        class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                      />
                      <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">All day event</span>
                    </label>
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
              {{ isEditing ? 'Update' : 'Create' }}
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
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  event?: any
}>()

const emit = defineEmits<{
  save: [data: any]
  close: []
}>()

const isEditing = computed(() => !!props.event)

const formData = ref({
  title: '',
  description: '',
  type: 'job',
  start: '',
  end: '',
  location: '',
  allDay: false,
  color: '#3b82f6',
})

onMounted(() => {
  if (props.event) {
    formData.value = {
      title: props.event.title || '',
      description: props.event.description || '',
      type: props.event.type || 'job',
      start: props.event.start ? new Date(props.event.start).toISOString().slice(0, 16) : '',
      end: props.event.end ? new Date(props.event.end).toISOString().slice(0, 16) : '',
      location: props.event.location || '',
      allDay: props.event.allDay || false,
      color: props.event.color || '#3b82f6',
    }
  } else {
    // Set default start time to next hour
    const now = new Date()
    now.setHours(now.getHours() + 1, 0, 0, 0)
    formData.value.start = now.toISOString().slice(0, 16)
    
    // Set default end time to 2 hours later
    const endTime = new Date(now)
    endTime.setHours(endTime.getHours() + 2)
    formData.value.end = endTime.toISOString().slice(0, 16)
  }
})

const handleSubmit = () => {
  const data = {
    ...formData.value,
    start: new Date(formData.value.start).getTime(),
    end: new Date(formData.value.end).getTime(),
  }
  emit('save', data)
}
</script>