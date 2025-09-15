import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useClerk } from '@clerk/vue'
import { Preferences } from '@capacitor/preferences'
import { Network } from '@capacitor/network'

export const useAuthStore = defineStore('auth', () => {
  const { user, isLoaded, isSignedIn } = useClerk()
  
  const isLoading = ref(false)
  const currentUser = ref(null)
  const currentCompany = ref(null)
  const isOnline = ref(true)

  const isAuthenticated = computed(() => isSignedIn.value && !!currentUser.value)

  const initialize = async () => {
    isLoading.value = true
    try {
      // Check network status
      const status = await Network.getStatus()
      isOnline.value = status.connected

      // Listen for network changes
      Network.addListener('networkStatusChange', (status) => {
        isOnline.value = status.connected
      })

      if (isSignedIn.value && user.value) {
        await loadUserData()
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error)
    } finally {
      isLoading.value = false
    }
  }

  const loadUserData = async () => {
    if (!user.value) return

    try {
      // Try to load from local storage first (offline support)
      const { value: cachedUser } = await Preferences.get({ key: 'currentUser' })
      if (cachedUser && !isOnline.value) {
        currentUser.value = JSON.parse(cachedUser)
        return
      }

      // Load from server if online
      if (isOnline.value) {
        const response = await fetch('/api/users/me', {
          headers: {
            'Authorization': `Bearer ${await user.value.getToken()}`
          }
        })
        
        if (response.ok) {
          const userData = await response.json()
          currentUser.value = userData
          
          // Cache user data locally
          await Preferences.set({
            key: 'currentUser',
            value: JSON.stringify(userData)
          })
          
          if (userData.companyId) {
            await loadCompanyData(userData.companyId)
          }
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
    }
  }

  const loadCompanyData = async (companyId: string) => {
    try {
      // Try to load from local storage first
      const { value: cachedCompany } = await Preferences.get({ key: 'currentCompany' })
      if (cachedCompany && !isOnline.value) {
        currentCompany.value = JSON.parse(cachedCompany)
        return
      }

      if (isOnline.value) {
        const response = await fetch(`/api/companies/${companyId}`, {
          headers: {
            'Authorization': `Bearer ${await user.value?.getToken()}`
          }
        })
        
        if (response.ok) {
          const companyData = await response.json()
          currentCompany.value = companyData
          
          // Cache company data locally
          await Preferences.set({
            key: 'currentCompany',
            value: JSON.stringify(companyData)
          })
        }
      }
    } catch (error) {
      console.error('Failed to load company data:', error)
    }
  }

  const signOut = async () => {
    isLoading.value = true
    try {
      // Clear local storage
      await Preferences.remove({ key: 'currentUser' })
      await Preferences.remove({ key: 'currentCompany' })
      
      currentUser.value = null
      currentCompany.value = null
      // Clerk will handle the actual sign out
    } catch (error) {
      console.error('Failed to sign out:', error)
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (updates: any) => {
    if (!currentUser.value) return

    try {
      if (isOnline.value) {
        const response = await fetch(`/api/users/${currentUser.value._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user.value?.getToken()}`
          },
          body: JSON.stringify(updates)
        })

        if (response.ok) {
          currentUser.value = { ...currentUser.value, ...updates }
          
          // Update local cache
          await Preferences.set({
            key: 'currentUser',
            value: JSON.stringify(currentUser.value)
          })
        }
      } else {
        // Queue for sync when online
        await queueForSync('updateProfile', { userId: currentUser.value._id, updates })
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const queueForSync = async (action: string, data: any) => {
    try {
      const { value: syncQueue } = await Preferences.get({ key: 'syncQueue' })
      const queue = syncQueue ? JSON.parse(syncQueue) : []
      
      queue.push({
        action,
        data,
        timestamp: Date.now()
      })
      
      await Preferences.set({
        key: 'syncQueue',
        value: JSON.stringify(queue)
      })
    } catch (error) {
      console.error('Failed to queue for sync:', error)
    }
  }

  const syncPendingChanges = async () => {
    if (!isOnline.value) return

    try {
      const { value: syncQueue } = await Preferences.get({ key: 'syncQueue' })
      if (!syncQueue) return

      const queue = JSON.parse(syncQueue)
      
      for (const item of queue) {
        try {
          await processSyncItem(item)
        } catch (error) {
          console.error('Failed to sync item:', item, error)
        }
      }
      
      // Clear sync queue after successful sync
      await Preferences.remove({ key: 'syncQueue' })
    } catch (error) {
      console.error('Failed to sync pending changes:', error)
    }
  }

  const processSyncItem = async (item: any) => {
    const { action, data } = item
    
    switch (action) {
      case 'updateProfile':
        await updateProfile(data.updates)
        break
      // Add more sync actions as needed
    }
  }

  return {
    // State
    isLoading,
    currentUser,
    currentCompany,
    isOnline,
    
    // Getters
    isAuthenticated,
    
    // Actions
    initialize,
    loadUserData,
    loadCompanyData,
    signOut,
    updateProfile,
    queueForSync,
    syncPendingChanges,
  }
})