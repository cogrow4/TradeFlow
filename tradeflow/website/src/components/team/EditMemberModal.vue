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
                  Edit Team Member
                </h3>
                <div class="mt-4 space-y-4">
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        v-model="formData.firstName"
                        class="input-field mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        v-model="formData.lastName"
                        class="input-field mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label for="phoneNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      v-model="formData.phoneNumber"
                      class="input-field mt-1"
                    />
                  </div>

                  <div>
                    <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                    <select id="role" v-model="formData.role" class="input-field mt-1" required>
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                      <option v-if="member.role === 'owner'" value="owner">Owner</option>
                    </select>
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
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Update Member
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
  member: any
}>()

const emit = defineEmits<{
  save: [data: any]
  close: []
}>()

const formData = ref({
  firstName: '',
  lastName: '',
  phoneNumber: '',
  role: 'employee',
  skills: [] as string[],
  certifications: [] as string[],
})

const skillsInput = ref('')
const certificationsInput = ref('')

onMounted(() => {
  if (props.member) {
    formData.value = {
      firstName: props.member.firstName || '',
      lastName: props.member.lastName || '',
      phoneNumber: props.member.phoneNumber || '',
      role: props.member.role || 'employee',
      skills: props.member.skills || [],
      certifications: props.member.certifications || [],
    }
    skillsInput.value = (props.member.skills || []).join(', ')
    certificationsInput.value = (props.member.certifications || []).join(', ')
  }
})

const handleSubmit = () => {
  const data = {
    ...formData.value,
    skills: skillsInput.value ? skillsInput.value.split(',').map(s => s.trim()).filter(s => s) : [],
    certifications: certificationsInput.value ? certificationsInput.value.split(',').map(c => c.trim()).filter(c => c) : [],
  }
  emit('save', data)
}
</script>