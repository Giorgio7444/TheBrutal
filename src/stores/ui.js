import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const toasts = ref([])
  let nextId = 0

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = nextId++
    toasts.value.push({ id, message, type })
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
  }

  const removeToast = (id) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  const success = (message) => addToast(message, 'success')
  const error = (message) => addToast(message, 'error')
  const info = (message) => addToast(message, 'info')
  const warning = (message) => addToast(message, 'warning')

  return { toasts, addToast, removeToast, success, error, info, warning }
})
