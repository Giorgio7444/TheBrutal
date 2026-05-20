<template>
  <footer class="min-h-screen bg-secondary mb-40">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 bg-secondary">

        <!-- About -->
        <div>
          <h3 class="font-sans text-lg font-bold mb-4 text-primary">Italian Spotlight</h3>
          <p class="text-primary text-sm mr-[20vw]">
            Italian Spotlight è un progetto che vuole nobilitare l'eccellenza italiana del visual design, puntando la luce sui designer che hanno reso grande il nostro paese.
          </p>
        </div>



  </div>
  </footer>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
