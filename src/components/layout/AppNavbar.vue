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

        <!-- Center Navigation (desktop) -->
        <div class="hidden md:flex items-right gap-6">
          <router-link
            to="/articles"
            class="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            Articoli
          </router-link>
          <router-link
            to="/categories"
            class="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            Categorie
          </router-link>
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
        <div class="flex items-center gap-2">
          <!-- Hamburger (mobile) -->
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Apri menu di navigazione"
          >
            <svg v-if="!isMobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
            </svg>
          </button>

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
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          </button>

          <!-- Auth Section -->
          <div v-if="authStore.isAuthenticated" class="flex items-center gap-2">
            <!-- Write button (mobile icon) -->
            <router-link
              to="/editor"
              class="md:hidden p-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors"
              aria-label="Scrivi un articolo"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </router-link>
            <!-- Write button (desktop) -->
            <router-link
              to="/editor"
              class="hidden md:inline-flex px-4 py-2 rounded-lg bg-teal-600 dark:bg-teal-600 text-white hover:bg-teal-700 dark:hover:bg-teal-700 transition-colors text-sm font-medium"
            >
              Scrivi
            </router-link>
            <!-- User dropdown -->
            <div v-if="isProfileReady" class="relative" ref="dropdownRef">
              <button
                @click="isMenuOpen = !isMenuOpen"
                class="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Menu utente"
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
              <div
                v-show="isMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800"
              >
                <router-link
                  :to="`/profile/${authStore.profile?.username}`"
                  @click="isMenuOpen = false"
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
            <div v-else class="px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400">
              Caricamento...
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

    <!-- Mobile Menu Drawer (FEAT 4) -->
    <Transition name="slide">
      <div
        v-show="isMobileMenuOpen"
        class="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
      >
        <div class="px-[5vw] py-4 space-y-1">
          <router-link
            v-for="link in mobileLinks"
            :key="link.to"
            :to="link.to"
            @click="isMobileMenuOpen = false"
            class="block px-4 py-3 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            {{ link.label }}
          </router-link>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const isDark = ref(false)
const isMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)
const dropdownRef = ref(null)
const isProfileReady = computed(() => !!authStore.profile?.username)

const mobileLinks = [
  { to: '/articles', label: 'Articoli' },
  { to: '/categories', label: 'Categorie' },
  { to: '/manifesto', label: 'Manifesto' },
  { to: '/excursus', label: 'Excursus' },
]

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
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isMenuOpen.value = false
  }
}

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
  isMenuOpen.value = false
  await authStore.signOut()
  router.push('/')
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
