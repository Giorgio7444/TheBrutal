<template>
  <footer class="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 mt-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- About -->
        <div>
          <h3 class="font-sans text-lg font-bold mb-4 text-neutral-950 dark:text-white">
            Estetica Digitale
          </h3>
          <p class="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
            Una piattaforma di publishing per esplorare e condividere riflessioni sulla bellezza e l'estetica nel mondo digitale.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-semibold text-neutral-950 dark:text-white mb-4">
            Link rapidi
          </h4>
          <ul class="space-y-2">
            <li>
              <router-link
                to="/"
                class="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors text-sm"
              >
                Home
              </router-link>
            </li>
            <li>
              <a
                href="#"
                class="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors text-sm"
              >
                Categorie
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors text-sm"
              >
                Chi siamo
              </a>
            </li>
          </ul>
        </div>

        <!-- Social -->
        <div>
          <h4 class="font-semibold text-neutral-950 dark:text-white mb-4">
            Social
          </h4>
          <div class="flex gap-4">
            <a
              href="#"
              class="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
              title="Twitter"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
              </svg>
            </a>
            <a
              href="#"
              class="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
              title="Instagram"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="2" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37Z" fill="currentColor" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
              </svg>
            </a>
            <a
              href="#"
              class="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
              title="GitHub"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div class="border-t border-neutral-200 dark:border-neutral-800 mt-8 pt-8">
        <p class="text-center text-neutral-600 dark:text-neutral-400 text-sm">
          © 2026 Estetica Digitale. Progetto universitario per la tesi di Progettazione Multimediale.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>
