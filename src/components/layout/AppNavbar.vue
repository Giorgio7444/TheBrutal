<template>
  <header class="sticky top-0 z-40 bg-secondary">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <router-link to="/" class="inline-flex items-center">
        <img src="../../../assets/logo.svg" alt="Italian Spotlight" class="h-7 w-auto" />
      </router-link>

      <nav class="flex items-center gap-4 text-sm font-medium text-primary">
        <router-link v-if="isAdmin" to="/admin/posts" class="transition-opacity hover:opacity-80">
          Admin
        </router-link>
        <router-link v-else-if="!authStore.isAuthenticated" to="/login" class="transition-opacity hover:opacity-80">
          Accedi
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useAdminState } from '@/composables/useAdminState'

const authStore = useAuthStore()
const { isAdmin } = useAdminState()
</script>