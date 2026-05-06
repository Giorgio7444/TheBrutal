<template>
  <div class="min-h-screen flex items-center justify-center px-4 bg-neutral-50 dark:bg-neutral-950">
    <div class="text-center">
      <h1
        class="text-neutral-950 dark:text-white mb-4"
        style="font-family: 'Playfair Display', serif; font-size: clamp(8rem, 20vw, 20rem); font-weight: 700; line-height: 0.85;"
      >
        404
      </h1>
      <p class="text-neutral-600 dark:text-neutral-400 text-lg md:text-xl mb-2 max-w-md mx-auto">
        Questa pagina non esiste. Come molte cose.
      </p>
      <p class="text-neutral-400 dark:text-neutral-600 text-sm mb-8">
        Il brutalismo non decora l'assenza. La dichiara.
      </p>
      <router-link
        to="/"
        class="inline-block px-8 py-4 border-2 border-neutral-950 dark:border-white text-neutral-950 dark:text-white hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-colors text-sm font-medium uppercase tracking-widest"
      >
        Torna alla home
      </router-link>
    </div>
  </div>
</template>
