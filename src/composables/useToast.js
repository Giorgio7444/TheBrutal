import { useUIStore } from '@/stores/ui'

/**
 * Composable for managing toast notifications.
 * Provides a convenient wrapper around useUIStore for toast functionality.
 */
export const useToast = () => {
  const uiStore = useUIStore()

  return {
    toasts: uiStore.toasts,
    addToast: uiStore.addToast,
    removeToast: uiStore.removeToast,
    success: uiStore.success,
    error: uiStore.error,
    info: uiStore.info,
    warning: uiStore.warning,
  }
}

