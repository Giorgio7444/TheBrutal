<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppFooter from '@/components/layout/AppFooter.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'

const route = useRoute()
const showChrome = computed(() => route.name !== 'Home')
</script>

<template>
  <div class="min-h-screen bg-primary text-secondary">
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
