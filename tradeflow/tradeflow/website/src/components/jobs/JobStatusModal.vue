<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Update Job Status
              </h3>

              <div class="mb-4">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Job: <span class="font-medium">{{ job.jobNumber }} - {{ job.title }}</span>
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Current Status: <span class="font-medium">{{ job.status }}</span>
                </p>
              </div>

              <div class="space-y-4">
                <div>
                  <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Status *
                  </label>
                  <select
                    id="status"
                    v-model="newStatus"
                    required
                    class="input-field mt-1"
                  >
                    <option value="">Select status</option>
                    <option value="quoted">Quoted</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>

                <div v-if="newStatus === 'in_progress'">
                  <label for="actualStart" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Actual Start Time
                  </label>
                  <input
                    id="actualStart"
                    v-model="actualStart"
                    type="datetime-local"
                    class="input-field mt-1"
                  />
                </div>

                <div v-if="newStatus === 'completed'">
                  <label for="actualEnd" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Completion Time
                  </label>
                  <input
                    id="actualEnd"
                    v-model="actualEnd"
                    type="datetime-local"
                    class="input-field mt-1"
                  />
                </div>

                <div v-if="newStatus === 'completed' || newStatus === 'cancelled'">
                  <label for="completionNotes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ newStatus === 'completed' ? 'Completion' : 'Cancellation' }} Notes
                  </label>
                  <textarea
                    id="completionNotes"
                    v-model="completionNotes"
                    rows="3"
                    class="input-field mt-1"
                    :placeholder="newStatus === 'completed' ? 'Describe what was completed...' : 'Reason for cancellation...'"
                  ></textarea>
                </div>

                <div v-if="newStatus === 'on_hold'">
                  <label for="holdReason" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reason for Hold
                  </label>
                  <textarea
                    id="holdReason"
                    v-model="completionNotes"
                    rows="3"
                    class="input-field mt-1"
                    placeholder="Why is this job on hold?"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            class="btn-primary sm:ml-3 sm:w-auto"
            :disabled="!newStatus || isSubmitting"
            @click="handleUpdate"
          >
            {{ isSubmitting ? 'Updating...' : 'Update Status' }}
          </button>
          <button
            type="button"
            class="btn-secondary mt-3 sm:mt-0 sm:w-auto"
            @click="$emit('close')"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  job: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'update'])

const isSubmitting = ref(false)
const newStatus = ref('')
const actualStart = ref('')
const actualEnd = ref('')
const completionNotes = ref('')

const handleUpdate = async () => {
  if (!newStatus.value) return

  isSubmitting.value = true
  
  try {
    const updateData = {
      status: newStatus.value,
      actualStart: actualStart.value ? new Date(actualStart.value).getTime() : undefined,
      actualEnd: actualEnd.value ? new Date(actualEnd.value).getTime() : undefined,
      completionNotes: completionNotes.value || undefined
    }
    
    emit('update', props.job._id, newStatus.value, completionNotes.value)
  } catch (error) {
    console.error('Failed to update job status:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>