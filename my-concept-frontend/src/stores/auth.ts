import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Try to load userId from local storage on initialization
  const userId = ref<string | null>(localStorage.getItem('userId'))

  function setUserId(id: string | null) {
    userId.value = id
    if (id) {
      localStorage.setItem('userId', id) // Store in local storage
    } else {
      localStorage.removeItem('userId') // Remove from local storage on logout
    }
  }

  const isAuthenticated = computed(() => !!userId.value)

  return { userId, setUserId, isAuthenticated }
})
