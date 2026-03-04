<template>
  <nav class="fixed top-0 z-50 w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 transition-colors">
    <div class="w-full px-[5vw]">
      <div class="flex items-center justify-between h-12">
        <!-- Logo -->
        <router-link
          to="/"
          class="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span class="font-sans text-lg font-bold text-neutral-950 dark:text-white hidden sm:block">
            The Brutal
          </span>
        </router-link>

        <!-- Center Navigation -->
        <div class="hidden md:flex items-right gap-6">
          <router-link
            to="/"
            class="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            Articoli
          </router-link>
          <a
            href="#"
            class="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            Categorie
          </a>
          <router-link
            to="/manifesto"
            class="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            Manifesto
          </router-link>
          <router-link
            to="/excursus"
            class="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            Excursus
          </router-link>
        </div>

        <!-- Right Section -->
        <div class="flex items-center gap-4">
          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            :aria-label="isDark ? 'Passa a modalità chiara' : 'Passa a modalità scura'"
          >
            <svg
              v-if="isDark"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <svg
              v-else
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1h0zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.828-2.828l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414zm.707 5.657a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707zm-7.071 0l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM3 11a1 1 0 100-2H2a1 1 0 100 2h1zm5-10a1 1 0 011 1v1a1 1 0 11-2 0V2a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <!-- Auth Section -->
          <div v-if="authStore.isAuthenticated" class="flex items-center gap-4">
            <router-link
              :to="`/editor`"
              class="px-4 py-2 rounded-lg bg-teal-600 dark:bg-teal-600 text-white hover:bg-teal-700 dark:hover:bg-teal-700 transition-colors text-sm font-medium"
            >
              Scrivi
            </router-link>
            <div class="relative group">
              <button
                class="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <img
                  v-if="authStore.profile?.avatar_url"
                  :src="authStore.profile.avatar_url"
                  :alt="authStore.profile.username"
                  class="w-6 h-6 rounded-full object-cover"
                />
                <div
                  v-else
                  class="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold"
                >
                  {{ (authStore.profile?.username || 'U')[0].toUpperCase() }}
                </div>
                <span class="text-sm font-medium hidden sm:block">
                  {{ authStore.profile?.username || 'Utente' }}
                </span>
              </button>
              <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                <router-link
                  :to="`/profile/${authStore.profile?.username}`"
                  class="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 first:rounded-t-lg"
                >
                  Profilo
                </router-link>
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 last:rounded-b-lg border-t border-neutral-200 dark:border-neutral-800"
                >
                  Esci
                </button>
              </div>
            </div>
          </div>

          <router-link
            v-else
            to="/auth"
            class="px-4 py-2 rounded-lg bg-teal-600 dark:bg-teal-600 text-white hover:bg-teal-700 dark:hover:bg-teal-700 transition-colors text-sm font-medium"
          >
            Accedi
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const isDark = ref(false)

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
  if (shouldBeDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  isDark.value = document.documentElement.classList.contains('dark')
})

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const handleLogout = async () => {
  await authStore.signOut()
  router.push('/')
}
</script>
