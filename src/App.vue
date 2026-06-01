<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'

const route = useRoute()
const showChrome = computed(() => route.name !== 'Home')
</script>

<template>
  <div class="app-shell min-h-screen bg-secondary text-primary">
    <AppNavbar />

    <main>
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

    <AppFooter v-if="showChrome" />
    <ToastNotification />
  </div>
</template>

<style>
main > * {
  background-color: #000000 !important;
  color: #f1f1f1 !important;
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
