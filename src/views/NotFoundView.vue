<template>
  <div class="min-h-screen flex items-center justify-center px-4 bg-primary">
    <div class="text-center">
      <h1
        class="text-secondary mb-4"
        style="font-family: 'Playfair Display', serif; font-size: clamp(8rem, 20vw, 20rem); font-weight: 700; line-height: 0.85;"
      >
        404
      </h1>
      <p class="text-secondary/70 text-lg md:text-xl mb-2 max-w-md mx-auto">
        Questa pagina non esiste. Come molte cose.
      </p>
      <p class="text-secondary/50 text-sm mb-8">
        Il brutalismo non decora l'assenza. La dichiara.
      </p>
      <router-link to="/" class="inline-block px-8 py-4 border-2 border-secondary text-secondary hover:bg-secondary hover:text-primary transition-colors text-sm font-medium uppercase tracking-widest">
        Torna alla home
      </router-link>
    </div>
  </div>
</template>
