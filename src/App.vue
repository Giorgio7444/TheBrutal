<script setup>
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'
</script>

<template>
  <div class="min-h-screen bg-primary text-secondary">
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
