import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export const useAdminState = () => {
  const authStore = useAuthStore()

  const isAdmin = computed(() => authStore.profile?.admin === true)
  const adminReady = computed(() => !authStore.loading && (authStore.user !== null || authStore.profile !== null))

  return {
    authStore,
    isAdmin,
    adminReady,
  }
}