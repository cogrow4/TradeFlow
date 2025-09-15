<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Jobs
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your jobs, track progress, and monitor completion.
        </p>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0 space-x-3">
        <button
          type="button"
          class="btn-secondary"
          @click="exportJobs"
        >
          <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
          Export
        </button>
        <button
          type="button"
          class="btn-primary"
          @click="showCreateModal = true"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          New Job
        </button>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card p-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search jobs
          </label>
          <div class="mt-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="search"
              v-model="searchTerm"
              type="text"
              placeholder="Search by job number, title, or customer..."
              class="input-field pl-10"
            />
          </div>
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            id="status"
            v-model="statusFilter"
            class="input-field mt-1"
          >
            <option value="">All Statuses</option>
            <option value="quoted">Quoted</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>
        <div>
          <label for="assignedTo" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Assigned To
          </label>
          <select
            id="assignedTo"
            v-model="assignedFilter"
            class="input-field mt-1"
          >
            <option value="">All Team Members</option>
            <option v-for="member in teamMembers" :key="member._id" :value="member._id">
              {{ member.firstName }} {{ member.lastName }}
            </option>
          </select>
        </div>
        <div>
          <label for="priority" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Priority
          </label>
          <select
            id="priority"
            v-model="priorityFilter"
            class="input-field mt-1"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Jobs Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Job
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Priority
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Assigned To
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Scheduled
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Location
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="job in filteredJobs"
              :key="job._id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              @click="$router.push(`/jobs/${job._id}`)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ job.jobNumber }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                    {{ job.title }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ job.customer?.firstName }} {{ job.customer?.lastName }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ job.customer?.email }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusColor(job.status)">
                  {{ job.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getPriorityColor(job.priority)">
                  {{ job.priority }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ job.assignedTo ? getAssignedMemberName(job.assignedTo) : 'Unassigned' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ job.scheduledStart ? formatDate(job.scheduledStart) : 'Not scheduled' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <div class="truncate max-w-xs">
                  {{ job.location.address }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click.stop="editJob(job)"
                    class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Edit
                  </button>
                  <button
                    @click.stop="updateJobStatus(job)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  >
                    Update Status
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div v-if="filteredJobs.length === 0" class="text-center py-12">
        <ClipboardDocumentListIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No jobs found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new job.
        </p>
        <div class="mt-6">
          <button
            type="button"
            class="btn-primary"
            @click="showCreateModal = true"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            New Job
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Job Modal -->
    <JobModal
      v-if="showCreateModal || editingJob"
      :job="editingJob"
      @close="closeModal"
      @save="handleSaveJob"
    />

    <!-- Status Update Modal -->
    <JobStatusModal
      v-if="statusUpdateJob"
      :job="statusUpdateJob"
      @close="closeStatusModal"
      @update="handleStatusUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { convex } from '@/lib/convex'
import JobModal from '@/components/jobs/JobModal.vue'
import JobStatusModal from '@/components/jobs/JobStatusModal.vue'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()

const jobs = ref([])
const teamMembers = ref([])
const searchTerm = ref('')
const statusFilter = ref('')
const assignedFilter = ref('')
const priorityFilter = ref('')
const showCreateModal = ref(false)
const editingJob = ref(null)
const statusUpdateJob = ref(null)

const filteredJobs = computed(() => {
  let filtered = jobs.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(job =>
      job.jobNumber.toLowerCase().includes(search) ||
      job.title.toLowerCase().includes(search) ||
      job.customer?.firstName.toLowerCase().includes(search) ||
      job.customer?.lastName.toLowerCase().includes(search)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(job => job.status === statusFilter.value)
  }

  if (assignedFilter.value) {
    filtered = filtered.filter(job => job.assignedTo === assignedFilter.value)
  }

  if (priorityFilter.value) {
    filtered = filtered.filter(job => job.priority === priorityFilter.value)
  }

  return filtered
})

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

const getAssignedMemberName = (userId: string) => {
  const member = teamMembers.value.find(m => m._id === userId)
  return member ? `${member.firstName} ${member.lastName}` : 'Unknown'
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}

const loadJobs = async () => {
  try {
    if (!authStore.currentCompany?._id) return
    jobs.value = await convex.query('jobs:getJobs', {
      companyId: authStore.currentCompany._id,
    } as any)
  } catch (error) {
    console.error('Failed to load jobs:', error)
  }
}

const loadTeamMembers = async () => {
  try {
    if (!authStore.currentCompany?._id) return
    teamMembers.value = await convex.query('companies:getCompany', { companyId: authStore.currentCompany._id } as any)
  } catch (error) {
    console.error('Failed to load team members:', error)
  }
}

const editJob = (job: any) => {
  editingJob.value = job
}

const updateJobStatus = (job: any) => {
  statusUpdateJob.value = job
}

const handleSaveJob = async (jobData: any) => {
  try {
    if (!authStore.currentCompany?._id) return
    if (editingJob.value) {
      await convex.mutation('jobs:updateJob', {
        jobId: editingJob.value._id,
        ...jobData,
      } as any)
    } else {
      await convex.mutation('jobs:createJob', {
        companyId: authStore.currentCompany._id,
        customerId: jobData.customerId,
        title: jobData.title,
        description: jobData.description,
        jobType: jobData.jobType,
        priority: jobData.priority,
        location: jobData.location,
        assignedTo: jobData.assignedTo || undefined,
        teamMembers: jobData.teamMembers || [],
        scheduledStart: jobData.scheduledStart,
        scheduledEnd: jobData.scheduledEnd,
        estimatedHours: jobData.estimatedHours,
        notes: jobData.notes || undefined,
      } as any)
    }
    await loadJobs()
    closeModal()
  } catch (error) {
    console.error('Failed to save job:', error)
  }
}

const handleStatusUpdate = async (jobId: string, status: string, notes?: string) => {
  try {
    await convex.mutation('jobs:updateJobStatus', {
      jobId,
      status: status as any,
      completionNotes: notes,
    } as any)
    await loadJobs()
    closeStatusModal()
  } catch (error) {
    console.error('Failed to update job status:', error)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingJob.value = null
}

const closeStatusModal = () => {
  statusUpdateJob.value = null
}

const exportJobs = () => {
  // Implement CSV export functionality
  const csvContent = generateCSV(filteredJobs.value)
  downloadCSV(csvContent, 'jobs.csv')
}

const generateCSV = (data: any[]) => {
  const headers = ['Job Number', 'Title', 'Customer', 'Status', 'Priority', 'Assigned To', 'Scheduled', 'Location']
  const rows = data.map(job => [
    job.jobNumber,
    job.title,
    `${job.customer?.firstName} ${job.customer?.lastName}`,
    job.status,
    job.priority,
    job.assignedTo ? getAssignedMemberName(job.assignedTo) : 'Unassigned',
    job.scheduledStart ? formatDate(job.scheduledStart) : 'Not scheduled',
    job.location.address
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
  loadJobs()
  loadTeamMembers()
})
</script>