<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Messages
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Communicate with your team and customers
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Message Channels -->
      <div class="lg:col-span-1">
        <div class="card p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Channels</h3>
          <div class="space-y-2">
            <button
              v-for="channel in channels"
              :key="channel.id"
              :class="[
                'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors',
                selectedChannel?.id === channel.id
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              ]"
              @click="selectChannel(channel)"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-2 w-2 rounded-full bg-green-400"></div>
                </div>
                <span class="ml-3">{{ channel.name }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div class="lg:col-span-2">
        <div class="card h-96 flex flex-col">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ selectedChannel?.name || 'Select a channel' }}
            </h3>
          </div>
          
          <div class="flex-1 overflow-y-auto p-4 space-y-4">
            <div v-if="!selectedChannel" class="text-center py-8">
              <ChatBubbleLeftRightIcon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No channel selected</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Select a channel to start messaging.
              </p>
            </div>
            
            <div v-else-if="messages.length === 0" class="text-center py-8">
              <ChatBubbleLeftRightIcon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No messages yet</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Start the conversation by sending a message.
              </p>
            </div>
            
            <div v-else>
              <div
                v-for="message in messages"
                :key="message._id"
                class="flex space-x-3"
              >
                <div class="flex-shrink-0">
                  <div class="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ message.sender?.firstName?.[0] }}{{ message.sender?.lastName?.[0] }}
                    </span>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ message.sender?.firstName }} {{ message.sender?.lastName }}
                    </span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatTime(message.sentAt) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">{{ message.content }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="selectedChannel" class="p-4 border-t border-gray-200 dark:border-gray-700">
            <form @submit.prevent="sendMessage" class="flex space-x-2">
              <input
                type="text"
                v-model="newMessage"
                placeholder="Type a message..."
                class="flex-1 input-field"
                required
              />
              <button
                type="submit"
                class="btn-primary"
                :disabled="!newMessage.trim()"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline'
import { useQuery, useMutation } from '@/lib/mock-convex'
import { api } from '@/lib/convex'

const authStore = useAuthStore()

const selectedChannel = ref(null)
const newMessage = ref('')

// Mock channels - in a real app, these would come from Convex
const channels = ref([
  { id: 'general', name: 'General', type: 'team' },
  { id: 'jobs', name: 'Jobs', type: 'team' },
  { id: 'support', name: 'Support', type: 'team' },
])

// Convex integration
const { data: messages, refetch: refetchMessages } = useQuery(
  api.messages.getMessages,
  () => ({ 
    companyId: authStore.currentCompany?._id,
    channelId: selectedChannel.value?.id 
  }),
  { enabled: computed(() => !!authStore.currentCompany?._id && !!selectedChannel.value) }
)
const sendMessageMutation = useMutation(api.messages.sendMessage)

const selectChannel = (channel: any) => {
  selectedChannel.value = channel
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedChannel.value || !authStore.currentUser) return

  try {
    await sendMessageMutation.value.mutate({
      companyId: authStore.currentCompany._id,
      senderId: authStore.currentUser._id,
      channelId: selectedChannel.value.id,
      content: newMessage.value.trim(),
    })
    newMessage.value = ''
    refetchMessages()
  } catch (error) {
    console.error('Failed to send message:', error)
  }
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>