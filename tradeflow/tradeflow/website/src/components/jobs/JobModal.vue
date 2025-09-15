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
                  {{ isEditing ? 'Edit Job' : 'Create New Job' }}
                </h3>

                <div class="space-y-4">
                  <!-- Job Details -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Job Title *
                      </label>
                      <input
                        id="title"
                        v-model="form.title"
                        type="text"
                        required
                        class="input-field mt-1"
                        placeholder="Electrical Installation"
                      />
                    </div>
                    <div>
                      <label for="jobType" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Job Type *
                      </label>
                      <input
                        id="jobType"
                        v-model="form.jobType"
                        type="text"
                        required
                        class="input-field mt-1"
                        placeholder="Installation, Repair, Maintenance"
                      />
                    </div>
                  </div>

                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      v-model="form.description"
                      rows="3"
                      required
                      class="input-field mt-1"
                      placeholder="Detailed description of the work to be performed..."
                    ></textarea>
                  </div>

                  <!-- Customer Selection -->
                  <div>
                    <label for="customerId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Customer *
                    </label>
                    <select
                      id="customerId"
                      v-model="form.customerId"
                      required
                      class="input-field mt-1"
                    >
                      <option value="">Select a customer</option>
                      <option v-for="customer in customers" :key="customer._id" :value="customer._id">
                        {{ customer.firstName }} {{ customer.lastName }} - {{ customer.email }}
                      </option>
                    </select>
                  </div>

                  <!-- Priority and Assignment -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="priority" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Priority
                      </label>
                      <select
                        id="priority"
                        v-model="form.priority"
                        class="input-field mt-1"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label for="assignedTo" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Assign To
                      </label>
                      <select
                        id="assignedTo"
                        v-model="form.assignedTo"
                        class="input-field mt-1"
                      >
                        <option value="">Unassigned</option>
                        <option v-for="member in teamMembers" :key="member._id" :value="member._id">
                          {{ member.firstName }} {{ member.lastName }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- Scheduling -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="scheduledStart" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Scheduled Start
                      </label>
                      <input
                        id="scheduledStart"
                        v-model="form.scheduledStart"
                        type="datetime-local"
                        class="input-field mt-1"
                      />
                    </div>
                    <div>
                      <label for="scheduledEnd" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Scheduled End
                      </label>
                      <input
                        id="scheduledEnd"
                        v-model="form.scheduledEnd"
                        type="datetime-local"
                        class="input-field mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label for="estimatedHours" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Estimated Hours
                    </label>
                    <input
                      id="estimatedHours"
                      v-model="form.estimatedHours"
                      type="number"
                      step="0.5"
                      min="0"
                      class="input-field mt-1"
                      placeholder="8"
                    />
                  </div>

                  <!-- Location -->
                  <div>
                    <label for="address" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Job Location *
                    </label>
                    <input
                      id="address"
                      v-model="form.location.address"
                      type="text"
                      required
                      class="input-field mt-1"
                      placeholder="123 Main St, Anytown, CA 12345"
                    />
                  </div>

                  <div>
                    <label for="locationInstructions" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Location Instructions
                    </label>
                    <textarea
                      id="locationInstructions"
                      v-model="form.location.instructions"
                      rows="2"
                      class="input-field mt-1"
                      placeholder="Special instructions for finding the location..."
                    ></textarea>
                  </div>

                  <!-- Team Members -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Team Members
                    </label>
                    <div class="space-y-2">
                      <label
                        v-for="member in teamMembers"
                        :key="member._id"
                        class="flex items-center"
                      >
                        <input
                          :id="`member-${member._id}`"
                          v-model="form.teamMembers"
                          :value="member._id"
                          type="checkbox"
                          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span class="ml-2 text-sm text-gray-900 dark:text-white">
                          {{ member.firstName }} {{ member.lastName }}
                        </span>
                      </label>
                    </div>
                  </div>

                  <!-- Notes -->
                  <div>
                    <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      v-model="form.notes"
                      rows="3"
                      class="input-field mt-1"
                      placeholder="Any additional notes or special requirements..."
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
              {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Job' : 'Create Job') }}
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
  job: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const authStore = useAuthStore()

const isSubmitting = ref(false)
const customers = ref([])
const teamMembers = ref([])

const isEditing = computed(() => !!props.job)

const form = ref({
  title: '',
  description: '',
  jobType: '',
  customerId: '',
  priority: 'medium',
  assignedTo: '',
  scheduledStart: '',
  scheduledEnd: '',
  estimatedHours: '',
  location: {
    address: '',
    instructions: ''
  },
  teamMembers: [],
  notes: ''
})

// Initialize form with job data if editing
watch(() => props.job, (job) => {
  if (job) {
    form.value = {
      title: job.title || '',
      description: job.description || '',
      jobType: job.jobType || '',
      customerId: job.customerId || '',
      priority: job.priority || 'medium',
      assignedTo: job.assignedTo || '',
      scheduledStart: job.scheduledStart ? new Date(job.scheduledStart).toISOString().slice(0, 16) : '',
      scheduledEnd: job.scheduledEnd ? new Date(job.scheduledEnd).toISOString().slice(0, 16) : '',
      estimatedHours: job.estimatedHours || '',
      location: {
        address: job.location?.address || '',
        instructions: job.location?.instructions || ''
      },
      teamMembers: job.teamMembers || [],
      notes: job.notes || ''
    }
  }
}, { immediate: true })

const loadCustomers = async () => {
  try {
    const response = await fetch('/api/customers', {
      headers: {
        'Authorization': `Bearer ${await authStore.currentUser?.getToken()}`
      }
    })
    
    if (response.ok) {
      customers.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to load customers:', error)
  }
}

const loadTeamMembers = async () => {
  try {
    const response = await fetch('/api/users/team', {
      headers: {
        'Authorization': `Bearer ${await authStore.currentUser?.getToken()}`
      }
    })
    
    if (response.ok) {
      teamMembers.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to load team members:', error)
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    const jobData = {
      ...form.value,
      scheduledStart: form.value.scheduledStart ? new Date(form.value.scheduledStart).getTime() : undefined,
      scheduledEnd: form.value.scheduledEnd ? new Date(form.value.scheduledEnd).getTime() : undefined,
      estimatedHours: form.value.estimatedHours ? parseFloat(form.value.estimatedHours) : undefined,
    }
    
    emit('save', jobData)
  } catch (error) {
    console.error('Failed to save job:', error)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadCustomers()
  loadTeamMembers()
})
</script>