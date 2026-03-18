<script setup>
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50 transition-colors">
    <AppNavbar />
    
    <main class="pt-16">
      <router-view v-slot="{ Component, route }">
        <Transition
          name="fade"
          mode="out-in"
        >
          <component
            :is="Component"
            :key="route.path"
            class="transition-opacity duration-200"
          />
        </Transition>
      </router-view>
    </main>

    <AppFooter />
    <ToastNotification />
  </div>
</template>

<style>
/* Font già caricati in index.html — nessun @import duplicato */

h1, h2, h3, h4, h5, h6 {
  font-family: 'Playfair Display', serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
