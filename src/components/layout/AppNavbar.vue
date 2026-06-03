<template>
  <header class="sticky top-0 z-40 bg-secondary">
    <div class="flex max-w-90vw items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <router-link to="/" class="inline-flex items-center">
        <img src="../../../assets/logo.svg" alt="Italian Spotlight" class="h-7 w-auto" />
      </router-link>

      <button
        type="button"
        class="inline-flex flex-col gap-1.5 p-2 transition-opacity hover:opacity-80"
        :aria-expanded="menuOpen"
        aria-label="Menu"
        @click="menuOpen = !menuOpen"
      >
        <span
          class="block h-0.5 w-6 bg-primary transition-transform duration-200"
          :class="menuOpen ? 'translate-y-2 rotate-45' : ''"
        />
        <span
          class="block h-0.5 w-6 bg-primary transition-opacity duration-200"
          :class="menuOpen ? 'opacity-0' : ''"
        />
        <span
          class="block h-0.5 w-6 bg-primary transition-transform duration-200"
          :class="menuOpen ? '-translate-y-2 -rotate-45' : ''"
        />
      </button>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
    <nav
      v-if="menuOpen"
      class="absolute z-50 bg-secondary shadow-lg origin-top-right right-[0vw]"
      @click="menuOpen = false"
    >
      <div class="mx-auto flex max-w-[90vw] flex-col px-4 py-2 text-sm font-medium text-primary sm:px-6 lg:px-8 gap-4 items-end">
        <router-link to="/designers" class="transition-opacity hover:opacity-80">
          Designers
        </router-link>
        <router-link to="/manifesto" class="transition-opacity hover:opacity-80">
          Manifesto
        </router-link>
        <router-link to="/Bookshelf" class="transition-opacity hover:opacity-80">
          Bookshelf
        </router-link>
        <router-link
          v-if="authStore.isAuthenticated && profileHref"
          :to="profileHref"
          class="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span class="max-w-[10rem] truncate">{{ profileLabel }}</span>
          <UserAvatar :avatar-url="avatarUrl" :username="profileLabel" size="sm" />
        </router-link>
        <div
          v-else-if="authStore.isAuthenticated"
          class="inline-flex items-center gap-2"
        >
          <span class="max-w-[10rem] truncate">{{ profileLabel }}</span>
          <UserAvatar :avatar-url="avatarUrl" :username="profileLabel" size="sm" />
        </div>
        <router-link
          v-if="isAdmin"
          to="/admin/posts"
          class="transition-opacity hover:opacity-80"
        >
          Admin
        </router-link>
        <button
          v-if="authStore.isAuthenticated"
          type="button"
          class="transition-opacity hover:opacity-80"
          @click.stop="handleSignOut"
        >
          Esci
        </button>
        <router-link
          v-else-if="!authStore.isAuthenticated"
          to="/login"
          class="transition-opacity hover:opacity-80"
        >
          Accedi
        </router-link>
      </div>
    </nav>
    </Transition>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAdminState } from '@/composables/useAdminState'
import UserAvatar from '@/components/ui/UserAvatar.vue'

const authStore = useAuthStore()
const router = useRouter()
const { isAdmin } = useAdminState()

const menuOpen = ref(false)

const profileLabel = computed(() => {
  return authStore.profile?.display_name || authStore.profile?.username || authStore.user?.displayName || 'Profilo'
})
const avatarUrl = computed(() => {
  return authStore.profile?.avatar_url || null
})
const profileHref = computed(() => {
  const username = authStore.profile?.username
  return username ? `/profile/${username}` : null
})

const handleSignOut = async () => {
  menuOpen.value = false
  await authStore.signOut()
  await router.push('/login')
}
</script>