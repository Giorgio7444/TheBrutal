<template>
  <footer>
    <div class="mx-auto w-screen px-4 sm:px-6 lg:px-8 py-12 bg-secondary border-t-2">

        <div>
          <h3 class="mr-6 ml-6 font-sans text-lg font-bold mb-4 text-primary mt-[5vh]">Italian Spotlight</h3>
          <p class="mr-6 ml-6 text-primary text-sm mr-[20vw] mb-[5vh]">
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
