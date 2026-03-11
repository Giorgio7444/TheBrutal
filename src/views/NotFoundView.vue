<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="text-center">
      <h1 class="font-sans text-6xl font-bold text-neutral-950 dark:text-white mb-4">
        404
      </h1>
      <p class="text-neutral-600 dark:text-neutral-400 text-lg mb-8">
        Pagina non trovata
      </p>
      <router-link
        to="/"
        class="px-6 py-3 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors font-medium inline-block"
      >
        Torna alla home
      </router-link>
    </div>
  </div>
</template>

<script setup>
</script>
