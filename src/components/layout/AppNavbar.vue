<template>
  <header class="sticky top-0 z-40 bg-secondary">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <router-link to="/" class="inline-flex items-center">
        <img src="../../../assets/logo.svg" alt="Italian Spotlight" class="h-7 w-auto" />
      </router-link>

      <nav class="flex items-center gap-4 text-sm font-medium text-primary">
        <router-link
          v-if="authStore.isAuthenticated && profileHref"
          :to="profileHref"
          class="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <UserAvatar :avatar-url="avatarUrl" :username="profileLabel" size="sm" />
          <span class="max-w-[10rem] truncate">{{ profileLabel }}</span>
        </router-link>

        <div
          v-else-if="authStore.isAuthenticated"
          class="inline-flex items-center gap-2"
        >
          <UserAvatar :avatar-url="avatarUrl" :username="profileLabel" size="sm" />
          <span class="max-w-[10rem] truncate">{{ profileLabel }}</span>
        </div>

        <router-link
          v-if="isAdmin"
          to="/admin/posts"
          class="transition-opacity hover:opacity-80"
        >
          Admin
        </router-link>

        <router-link
          v-else-if="!authStore.isAuthenticated"
          to="/login"
          class="transition-opacity hover:opacity-80"
        >
          Accedi
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAdminState } from '@/composables/useAdminState'
import UserAvatar from '@/components/ui/UserAvatar.vue'

const authStore = useAuthStore()
const { isAdmin } = useAdminState()

const profileLabel = computed(() => {
  return authStore.profile?.display_name || authStore.profile?.username || authStore.user?.displayName || 'Profilo'
})

const avatarUrl = computed(() => {
  return authStore.profile?.avatar_url || authStore.user?.photoURL || null
})

const profileHref = computed(() => {
  const username = authStore.profile?.username
  return username ? `/profile/${username}` : null
})
</script>