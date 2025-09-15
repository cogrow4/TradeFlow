import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useClerk } from '@clerk/vue'
import { convex } from '@/lib/convex'

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
      // Ensure user exists in Convex and fetch profile
      const upsertedUserId = await convex.mutation(
        'users:createOrUpdateUser',
        {
          clerkId: user.value.id,
          email: user.value.primaryEmailAddress?.emailAddress || '',
          firstName: user.value.firstName || '',
          lastName: user.value.lastName || '',
          profileImage: user.value.imageUrl || undefined,
        }
      )

      const profile = await convex.query('users:getUserByClerkId', { clerkId: user.value.id })
      currentUser.value = profile

      if (profile?.companyId) {
        await loadCompanyData(profile.companyId)
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
    }
  }

  const loadCompanyData = async (companyId: string) => {
    try {
      const company = await convex.query('companies:getCompany', { companyId } as any)
      currentCompany.value = company
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
      await convex.mutation('users:updateUserProfile', {
        userId: currentUser.value._id,
        ...updates,
      })
      currentUser.value = { ...currentUser.value, ...updates }
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