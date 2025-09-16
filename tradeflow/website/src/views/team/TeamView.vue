<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Team
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your team members and their roles
        </p>
      </div>
      <div class="flex space-x-3">
        <button type="button" class="btn-primary" @click="showInviteModal = true">
          <PlusIcon class="h-4 w-4 mr-2" />
          Invite Member
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-6">
      <div class="text-center">
        <p class="text-red-600 dark:text-red-400">Error loading team members: {{ error }}</p>
        <button type="button" class="btn-primary mt-4" @click="loadTeamMembers">
          Retry
        </button>
      </div>
    </div>

    <!-- Team Members Grid -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="member in teamMembers"
        :key="member._id"
        class="card p-6"
      >
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <div class="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <span class="text-lg font-medium text-gray-700 dark:text-gray-300">
                {{ member.firstName?.[0] }}{{ member.lastName?.[0] }}
              </span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ member.firstName }} {{ member.lastName }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ member.email }}</p>
            <span :class="getRoleColor(member.role)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1">
              {{ member.role }}
            </span>
          </div>
        </div>

        <div v-if="member.phoneNumber" class="mt-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">Phone: {{ member.phoneNumber }}</p>
        </div>

        <div v-if="member.skills && member.skills.length > 0" class="mt-4">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Skills:</p>
          <div class="mt-1 flex flex-wrap gap-1">
            <span
              v-for="skill in member.skills"
              :key="skill"
              class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <div v-if="member.certifications && member.certifications.length > 0" class="mt-4">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Certifications:</p>
          <div class="mt-1 flex flex-wrap gap-1">
            <span
              v-for="cert in member.certifications"
              :key="cert"
              class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            >
              {{ cert }}
            </span>
          </div>
        </div>

        <div class="mt-4 flex space-x-2">
          <button
            type="button"
            class="flex-1 btn-secondary text-sm"
            @click="editMember(member)"
          >
            Edit
          </button>
          <button
            v-if="member.role !== 'owner'"
            type="button"
            class="flex-1 btn-secondary text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            @click="removeMember(member)"
          >
            Remove
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="teamMembers.length === 0" class="text-center py-12">
      <UserGroupIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No team members found</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Get started by inviting your first team member.
      </p>
      <div class="mt-6">
        <button type="button" class="btn-primary" @click="showInviteModal = true">
          <PlusIcon class="h-4 w-4 mr-2" />
          Invite Member
        </button>
      </div>
    </div>

    <!-- Invite Modal -->
    <InviteModal
      v-if="showInviteModal"
      @save="handleInviteMember"
      @close="closeInviteModal"
    />

    <!-- Edit Member Modal -->
    <EditMemberModal
      v-if="editingMember"
      :member="editingMember"
      @save="handleUpdateMember"
      @close="closeEditModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import InviteModal from '@/components/team/InviteModal.vue'
import EditMemberModal from '@/components/team/EditMemberModal.vue'
import {
  PlusIcon,
  UserGroupIcon,
} from '@heroicons/vue/24/outline'
import { useQuery, useMutation } from '@/lib/mock-convex'
import { api } from '@/lib/convex'

const authStore = useAuthStore()

const showInviteModal = ref(false)
const editingMember = ref(null)

// Convex integration
const { data: teamMembers, isLoading, error, refetch: refetchTeamMembers } = useQuery(
  api.users.getTeamMembers,
  () => ({ companyId: authStore.currentCompany?._id }),
  { enabled: computed(() => !!authStore.currentCompany?._id) }
)
const updateUserProfileMutation = useMutation(api.users.updateUserProfile)

const getRoleColor = (role: string) => {
  const colors = {
    owner: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    employee: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  }
  return colors[role] || colors.employee
}

const editMember = (member: any) => {
  editingMember.value = member
}

const removeMember = async (member: any) => {
  if (!confirm(`Are you sure you want to remove ${member.firstName} ${member.lastName} from the team?`)) {
    return
  }

  try {
    // This would need to be implemented in the backend
    console.log('Remove member:', member)
    refetchTeamMembers()
  } catch (error) {
    console.error('Failed to remove team member:', error)
  }
}

const handleInviteMember = async (inviteData: any) => {
  try {
    // This would need to be implemented in the backend
    console.log('Invite member:', inviteData)
    closeInviteModal()
  } catch (error) {
    console.error('Failed to invite team member:', error)
  }
}

const handleUpdateMember = async (memberData: any) => {
  try {
    await updateUserProfileMutation.value.mutate({
      userId: editingMember.value._id,
      ...memberData,
    })
    refetchTeamMembers()
    closeEditModal()
  } catch (error) {
    console.error('Failed to update team member:', error)
  }
}

const closeInviteModal = () => {
  showInviteModal.value = false
}

const closeEditModal = () => {
  editingMember.value = null
}

const loadTeamMembers = () => {
  refetchTeamMembers()
}
</script>