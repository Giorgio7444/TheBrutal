<template>
  <nav class="fixed top-0 z-50 w-full bg-primary/80 backdrop-blur-sm border-b border-secondary/20">
    <div class="w-full px-[5vw]">
      <div class="flex items-center justify-between h-12">
        <!-- Logo -->
        <router-link
          to="/"
          class="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span class="font-sans text-lg font-bold text-secondary hidden sm:block">
            The Brutal
          </span>
        </router-link>

        <!-- Center Navigation (desktop) -->
        <div class="hidden md:flex items-center gap-6">
          <router-link
            to="/articles"
            class="text-sm font-medium text-secondary/60 hover:text-secondary transition-colors"
          >
            Articoli
          </router-link>
          <router-link
            to="/categories"
            class="text-sm font-medium text-secondary/60 hover:text-secondary transition-colors"
          >
            Categorie
          </router-link>
          <router-link
            to="/manifesto"
            class="text-sm font-medium text-secondary/60 hover:text-secondary transition-colors"
          >
            Manifesto
          </router-link>
          <router-link
            to="/excursus"
            class="text-sm font-medium text-secondary/60 hover:text-secondary transition-colors"
          >
            Excursus
          </router-link>
        </div>

        <!-- Right Section -->
        <div class="flex items-center gap-2">
          <!-- Hamburger (mobile) -->
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden p-2 rounded-lg hover:bg-secondary/10 transition-colors"
            aria-label="Apri menu di navigazione"
          >
            <svg v-if="!isMobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
            </svg>
          </button>

          <!-- Auth Section -->
          <div v-if="authStore.isAuthenticated" class="flex items-center gap-2">
            <!-- Write button (mobile icon) -->
            <router-link
              to="/editor"
              class="md:hidden p-2 rounded-lg bg-primary border border-secondary/20 hover:opacity-80 transition-colors inline-flex items-center gap-2"
              aria-label="Scrivi un articolo"
            >
              <div class="w-3 h-3 rounded-full bg-tertiary flex-shrink-0"></div>
              <span class="text-sm font-medium text-secondary">Scrivi</span>
            </router-link>
            <!-- Write button (desktop) -->
            <router-link
              to="/editor"
              class="hidden md:inline-flex px-4 py-2 rounded-lg bg-primary border border-secondary/20 hover:opacity-80 transition-colors items-center gap-2"
            >
              <div class="w-3 h-3 rounded-full bg-tertiary flex-shrink-0"></div>
              <span class="text-sm font-medium text-secondary">Scrivi</span>
            </router-link>
            <!-- User dropdown -->
            <div v-if="isProfileReady" class="relative" ref="dropdownRef">
              <button
                @click="isMenuOpen = !isMenuOpen"
                class="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/10 transition-colors"
                aria-label="Menu utente"
              >
                <img
                  v-if="authStore.profile?.avatar_url"
                  :src="authStore.profile.avatar_url"
                  :alt="authStore.profile?.display_name || authStore.profile?.username || 'Utente'"
                  referrerpolicy="no-referrer"
                  class="w-6 h-6 rounded-full object-cover"
                />
                <div
                  v-else
                  class="w-6 h-6 rounded-full bg-tertiary flex items-center justify-center text-secondary text-xs font-bold"
                >
                  {{ (authStore.profile?.display_name || authStore.profile?.username || 'U')[0].toUpperCase() }}
                </div>
                <span class="text-sm font-medium hidden sm:block">
                  {{ authStore.profile?.display_name || authStore.profile?.username || 'Utente' }}
                </span>
              </button>
              <div
                v-show="isMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-primary rounded-lg shadow-lg border border-secondary/20"
              >
                <router-link
                  :to="`/profile/${authStore.profile?.username}`"
                  @click="isMenuOpen = false"
                  class="block px-4 py-2 text-sm text-secondary hover:bg-secondary/10 first:rounded-t-lg"
                >
                  Profilo
                </router-link>
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-secondary hover:bg-secondary/10 last:rounded-b-lg border-t border-secondary/20"
                >
                  Esci
                </button>
              </div>
            </div>
            <div v-else class="px-3 py-2 text-sm text-secondary/50">
              Caricamento...
            </div>
          </div>

          <router-link
            v-else
            to="/auth"
            class="px-4 py-2 rounded-lg bg-primary border border-secondary/20 hover:opacity-80 transition-colors inline-flex items-center gap-2"
          >
            <div class="w-3 h-3 rounded-full bg-tertiary flex-shrink-0"></div>
            <span class="text-sm font-medium text-secondary">Accedi</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Drawer -->
    <Transition name="slide">
      <div
        v-show="isMobileMenuOpen"
        class="md:hidden border-t border-secondary/20 bg-primary"
      >
        <div class="px-[5vw] py-4 space-y-1">
          <router-link
            v-for="link in mobileLinks"
            :key="link.to"
            :to="link.to"
            @click="isMobileMenuOpen = false"
            class="block px-4 py-3 rounded-lg text-sm font-medium text-secondary/60 hover:bg-secondary/10 hover:text-secondary transition-colors"
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
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
})

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isMenuOpen.value = false
  }
}

const handleKeyDown = (event) => {
  if (event.key === 'Escape' && isMenuOpen.value) {
    isMenuOpen.value = false
  }
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false
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
