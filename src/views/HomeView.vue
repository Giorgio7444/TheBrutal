<template>
  <div class="min-h-screen bg-primary text-secondary flex items-center justify-center px-4">
    <div class="bottonihome flex flex-wrap gap-8 justify-center max-w-6xl">
      <router-link
        to="/articles"
        class="bg-primary border border-secondary/20 px-8 py-4 inline-flex items-center gap-4 hover:opacity-80 transition-opacity"
      >
        <div class="w-4 h-4 rounded-full bg-tertiary flex-shrink-0"></div>
        <h3>Esplora</h3>
      </router-link>
      <router-link
        to="/auth"
        class="bg-primary border border-secondary/20 px-8 py-4 inline-flex items-center gap-4 hover:opacity-80 transition-opacity"
      >
        <div class="w-4 h-4 rounded-full bg-tertiary flex-shrink-0"></div>
        <h3>Iscrizioni</h3>
      </router-link>
      <router-link
        to="/manifesto"
        class="bg-primary border border-secondary/20 px-8 py-4 inline-flex items-center gap-4 hover:opacity-80 transition-opacity"
      >
        <div class="w-4 h-4 rounded-full bg-tertiary flex-shrink-0"></div>
        <h3>Manifesto</h3>
      </router-link>
      <router-link
        to="/profile"
        class="bg-primary border border-secondary/20 px-8 py-4 inline-flex items-center gap-4 hover:opacity-80 transition-opacity"
      >
        <div class="w-4 h-4 rounded-full bg-tertiary flex-shrink-0"></div>
        <h3>Profilo</h3>
      </router-link>
    </div>
  </div>
</template>

<script setup>
// Home completamente vuota con solo 4 pulsanti
</script>
