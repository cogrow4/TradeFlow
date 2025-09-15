import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useClerk } from '@clerk/vue'

export const useAuthStore = defineStore('auth', () => {
  const { user, isLoaded, isSignedIn } = useClerk()
  
  const isLoading = ref(false)
  const currentUser = ref(null)
  const currentCompany = ref(null)

  const isAuthenticated = computed(() => isSignedIn.value && !!currentUser.value)

  const initialize = async () => {
    isLoading.value = true
    try {
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
      // Load user from Convex
      const response = await fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${await user.value.getToken()}`
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        currentUser.value = userData
        
        if (userData.companyId) {
          await loadCompanyData(userData.companyId)
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
    }
  }

  const loadCompanyData = async (companyId: string) => {
    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        headers: {
          'Authorization': `Bearer ${await user.value?.getToken()}`
        }
      })
      
      if (response.ok) {
        currentCompany.value = await response.json()
      }
    } catch (error) {
      console.error('Failed to load company data:', error)
    }
  }

  const signOut = async () => {
    isLoading.value = true
    try {
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
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  return {
    // State
    isLoading,
    currentUser,
    currentCompany,
    
    // Getters
    isAuthenticated,
    
    // Actions
    initialize,
    loadUserData,
    loadCompanyData,
    signOut,
    updateProfile,
  }
})