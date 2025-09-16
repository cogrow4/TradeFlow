<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Profile
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your personal information and preferences
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Profile Information -->
      <div class="lg:col-span-2 space-y-6">
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h3>
          <form @submit.prevent="handleSaveProfile" class="space-y-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  v-model="profileForm.firstName"
                  class="input-field mt-1"
                  required
                />
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  v-model="profileForm.lastName"
                  class="input-field mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                id="email"
                :value="authStore.currentUser?.email"
                class="input-field mt-1 bg-gray-100 dark:bg-gray-700"
                disabled
              />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Email cannot be changed here. Use your account settings.
              </p>
            </div>

            <div>
              <label for="phoneNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                v-model="profileForm.phoneNumber"
                class="input-field mt-1"
              />
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="street" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Street Address</label>
                <input
                  type="text"
                  id="street"
                  v-model="profileForm.address.street"
                  class="input-field mt-1"
                />
              </div>
              <div>
                <label for="city" class="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                <input
                  type="text"
                  id="city"
                  v-model="profileForm.address.city"
                  class="input-field mt-1"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label for="state" class="block text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
                <input
                  type="text"
                  id="state"
                  v-model="profileForm.address.state"
                  class="input-field mt-1"
                />
              </div>
              <div>
                <label for="zipCode" class="block text-sm font-medium text-gray-700 dark:text-gray-300">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  v-model="profileForm.address.zipCode"
                  class="input-field mt-1"
                />
              </div>
              <div>
                <label for="country" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
                <input
                  type="text"
                  id="country"
                  v-model="profileForm.address.country"
                  class="input-field mt-1"
                />
              </div>
            </div>

            <div>
              <label for="skills" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills (comma-separated)</label>
              <input
                type="text"
                id="skills"
                v-model="skillsInput"
                class="input-field mt-1"
                placeholder="e.g., Electrical, Plumbing, HVAC"
              />
            </div>

            <div>
              <label for="certifications" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Certifications (comma-separated)</label>
              <input
                type="text"
                id="certifications"
                v-model="certificationsInput"
                class="input-field mt-1"
                placeholder="e.g., Master Electrician, OSHA 30"
              />
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                class="btn-primary"
                :disabled="isSaving"
              >
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Profile Summary -->
      <div class="space-y-6">
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Summary</h3>
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <span class="text-lg font-medium text-gray-700 dark:text-gray-300">
                    {{ authStore.currentUser?.firstName?.[0] }}{{ authStore.currentUser?.lastName?.[0] }}
                  </span>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ authStore.currentUser?.firstName }} {{ authStore.currentUser?.lastName }}
                </h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ authStore.currentUser?.email }}</p>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {{ authStore.currentUser?.role }}
                </span>
              </div>
            </div>

            <div v-if="authStore.currentUser?.skills && authStore.currentUser.skills.length > 0">
              <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300">Skills</h5>
              <div class="mt-1 flex flex-wrap gap-1">
                <span
                  v-for="skill in authStore.currentUser.skills"
                  :key="skill"
                  class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {{ skill }}
                </span>
              </div>
            </div>

            <div v-if="authStore.currentUser?.certifications && authStore.currentUser.certifications.length > 0">
              <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300">Certifications</h5>
              <div class="mt-1 flex flex-wrap gap-1">
                <span
                  v-for="cert in authStore.currentUser.certifications"
                  :key="cert"
                  class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  {{ cert }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Account Actions</h3>
          <div class="space-y-3">
            <button type="button" class="btn-secondary w-full" @click="changePassword">
              Change Password
            </button>
            <button type="button" class="btn-secondary w-full text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" @click="deleteAccount">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const isSaving = ref(false)
const skillsInput = ref('')
const certificationsInput = ref('')

const profileForm = ref({
  firstName: '',
  lastName: '',
  phoneNumber: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  skills: [] as string[],
  certifications: [] as string[],
})

onMounted(() => {
  if (authStore.currentUser) {
    profileForm.value = {
      firstName: authStore.currentUser.firstName || '',
      lastName: authStore.currentUser.lastName || '',
      phoneNumber: authStore.currentUser.phoneNumber || '',
      address: authStore.currentUser.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      skills: authStore.currentUser.skills || [],
      certifications: authStore.currentUser.certifications || [],
    }
    skillsInput.value = (authStore.currentUser.skills || []).join(', ')
    certificationsInput.value = (authStore.currentUser.certifications || []).join(', ')
  }
})

const handleSaveProfile = async () => {
  isSaving.value = true
  try {
    const data = {
      ...profileForm.value,
      skills: skillsInput.value ? skillsInput.value.split(',').map(s => s.trim()).filter(s => s) : [],
      certifications: certificationsInput.value ? certificationsInput.value.split(',').map(c => c.trim()).filter(c => c) : [],
    }
    await authStore.updateProfile(data)
    alert('Profile updated successfully!')
  } catch (error) {
    console.error('Failed to update profile:', error)
    alert('Failed to update profile. Please try again.')
  } finally {
    isSaving.value = false
  }
}

const changePassword = () => {
  alert('Password change functionality will be implemented here')
}

const deleteAccount = () => {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    alert('Account deletion functionality will be implemented here')
  }
}
</script>