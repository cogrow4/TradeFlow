<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Job Details
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View and manage job information
        </p>
      </div>
      <div class="flex space-x-3">
        <button type="button" class="btn-secondary" @click="$router.back()">
          Back
        </button>
        <button type="button" class="btn-primary" @click="editJob">
          Edit Job
        </button>
        <button type="button" class="btn-secondary" @click="updateStatus">
          Update Status
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="error" class="card p-6">
      <div class="text-center">
        <p class="text-red-600 dark:text-red-400">Error loading job: {{ error }}</p>
        <button type="button" class="btn-primary mt-4" @click="loadJob">
          Retry
        </button>
      </div>
    </div>

    <div v-else-if="job" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Job Info -->
      <div class="lg:col-span-2 space-y-6">
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Job Information</h3>
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Job Number</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">#{{ job.jobNumber }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Title</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ job.title }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Customer</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ job.customer?.firstName }} {{ job.customer?.lastName }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
              <dd class="mt-1">
                <span :class="getStatusColor(job.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ job.status }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</dt>
              <dd class="mt-1">
                <span :class="getPriorityColor(job.priority)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ job.priority }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Scheduled Start</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ job.scheduledStart ? formatDate(job.scheduledStart) : 'Not scheduled' }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Scheduled End</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ job.scheduledEnd ? formatDate(job.scheduledEnd) : 'Not scheduled' }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Actual Start</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ job.actualStart ? formatDate(job.actualStart) : 'Not started' }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Actual End</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ job.actualEnd ? formatDate(job.actualEnd) : 'Not completed' }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Description -->
        <div v-if="job.description" class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Description</h3>
          <p class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{{ job.description }}</p>
        </div>

        <!-- Location -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Location</h3>
          <div class="text-sm text-gray-900 dark:text-white">
            <p>{{ job.location.address }}</p>
            <div v-if="job.location.latitude && job.location.longitude" class="mt-2">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Coordinates: {{ job.location.latitude }}, {{ job.location.longitude }}
              </p>
            </div>
          </div>
        </div>

        <!-- Assigned Team Members -->
        <div v-if="job.assignedToUsers && job.assignedToUsers.length > 0" class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Assigned Team Members</h3>
          <div class="space-y-2">
            <div v-for="member in job.assignedToUsers" :key="member._id" class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ member.firstName?.[0] }}{{ member.lastName?.[0] }}
                  </span>
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ member.firstName }} {{ member.lastName }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ member.email }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Materials -->
        <div v-if="job.materials && job.materials.length > 0" class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Materials</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit Cost</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="material in job.materials" :key="material.inventoryItemId">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ material.inventoryItemId }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ material.quantity }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${{ material.unitCost.toFixed(2) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${{ (material.quantity * material.unitCost).toFixed(2) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Labor Hours -->
        <div v-if="job.laborHours && job.laborHours.length > 0" class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Labor Hours</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Team Member</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hours</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rate</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="labor in job.laborHours" :key="`${labor.userId}-${labor.date}`">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ getTeamMemberName(labor.userId) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ formatDate(labor.date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ labor.hours }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${{ labor.rate.toFixed(2) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${{ (labor.hours * labor.rate).toFixed(2) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Completion Notes -->
        <div v-if="job.completionNotes" class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Completion Notes</h3>
          <p class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{{ job.completionNotes }}</p>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <button type="button" class="btn-primary w-full" @click="createQuote">
              Create Quote
            </button>
            <button type="button" class="btn-secondary w-full" @click="createInvoice">
              Create Invoice
            </button>
            <button type="button" class="btn-secondary w-full" @click="viewCustomer">
              View Customer
            </button>
          </div>
        </div>

        <!-- Photos -->
        <div v-if="job.photos && job.photos.length > 0" class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Photos</h3>
          <div class="grid grid-cols-2 gap-2">
            <div v-for="photo in job.photos" :key="photo" class="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <img :src="photo" :alt="`Job photo`" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Job Modal -->
    <JobModal
      v-if="showEditModal"
      :job="job"
      @save="handleSaveJob"
      @close="closeEditModal"
    />

    <!-- Status Update Modal -->
    <JobStatusModal
      v-if="showStatusModal"
      :job="job"
      @update="handleStatusUpdate"
      @close="closeStatusModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import JobModal from '@/components/jobs/JobModal.vue'
import JobStatusModal from '@/components/jobs/JobStatusModal.vue'
import { useQuery, useMutation } from '@/lib/mock-convex'
import { api } from '@/lib/convex'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const jobId = computed(() => route.params.id as string)
const showEditModal = ref(false)
const showStatusModal = ref(false)

// Convex queries
const { data: job, isLoading, error } = useQuery(
  api.jobs.getJobById,
  () => ({ jobId: jobId.value }),
  { enabled: computed(() => !!jobId.value) }
)

const { data: teamMembers } = useQuery(
  api.users.getTeamMembers,
  () => ({ companyId: authStore.currentCompany?._id }),
  { enabled: computed(() => !!authStore.currentCompany?._id) }
)

const updateJobMutation = useMutation(api.jobs.updateJob)
const updateJobStatusMutation = useMutation(api.jobs.updateJobStatus)

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
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }
  return colors[priority] || colors.medium
}

const getTeamMemberName = (userId: string) => {
  const member = teamMembers.value?.find(m => m._id === userId)
  return member ? `${member.firstName} ${member.lastName}` : 'Unknown'
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}

const editJob = () => {
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const updateStatus = () => {
  showStatusModal.value = true
}

const closeStatusModal = () => {
  showStatusModal.value = false
}

const handleSaveJob = async (jobData: any) => {
  try {
    await updateJobMutation.value.mutate({ jobId: job.value._id, ...jobData })
    closeEditModal()
  } catch (error) {
    console.error('Failed to update job:', error)
  }
}

const handleStatusUpdate = async (status: string, notes?: string) => {
  try {
    await updateJobStatusMutation.value.mutate({ jobId: job.value._id, status, completionNotes: notes })
    closeStatusModal()
  } catch (error) {
    console.error('Failed to update job status:', error)
  }
}

const createQuote = () => {
  router.push({ name: 'quotes', query: { jobId: job.value._id } })
}

const createInvoice = () => {
  router.push({ name: 'invoices', query: { jobId: job.value._id } })
}

const viewCustomer = () => {
  router.push({ name: 'customer-detail', params: { id: job.value.customerId } })
}

const loadJob = () => {
  // This will trigger the query to refetch
}
</script>