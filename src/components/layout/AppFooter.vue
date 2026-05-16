<template>
  <footer class="border-t border-secondary/20 bg-primary mt-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- About -->
        <div>
          <h3 class="font-sans text-lg font-bold mb-4 text-secondary">The Brutal</h3>
          <p class="text-secondary/60 text-sm leading-relaxed">
            La pagina dedicata al Post Brutalismo. Il nostro obiettivo è la ricerca di una nuova estetica nel mondo digitale e di come questa possa aiutarci a pensare in una maniera più accessibile, funzionale e onesta nei confronti del mezzo.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-sans text-sm font-bold mb-4 text-secondary uppercase tracking-wider">
            Navigazione
          </h4>
          <ul class="space-y-2">
            <li>
              <router-link to="/articles" class="text-sm text-secondary/60 hover:text-secondary transition-colors">
                Articoli
              </router-link>
            </li>
            <li>
              <router-link to="/categories" class="text-sm text-secondary/60 hover:text-secondary transition-colors">
                Categorie
              </router-link>
            </li>
            <li>
              <router-link to="/manifesto" class="text-sm text-secondary/60 hover:text-secondary transition-colors">
                Manifesto
              </router-link>
            </li>
            <li>
              <router-link to="/excursus" class="text-sm text-secondary/60 hover:text-secondary transition-colors">
                Excursus
              </router-link>
            </li>
            <li v-if="authStore.isAuthenticated">
              <router-link to="/editor" class="text-sm text-secondary/60 hover:text-secondary transition-colors">
                Scrivi un articolo
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Info -->
        <div>
          <h4 class="font-sans text-sm font-bold mb-4 text-secondary uppercase tracking-wider">
            Progetto
          </h4>
          <p class="text-secondary/60 text-sm leading-relaxed">
            Progetto accademico realizzato per il corso di Progettazione Multimediale presso LABA Brescia, anno accademico 2025/2026.
          </p>
        </div>
      </div>

      <div class="border-t border-secondary/20 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p class="text-secondary/60 text-sm">
          © 2026 The Brutal. Progetto accademico per il corso di Progettazione Multimediale.
        </p>
        <p class="text-secondary/40 text-xs">
          Progetto accademico LABA Brescia 2026
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
