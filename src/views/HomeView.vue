<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950">
    <!-- Hero Section -->
    <section class="relative flex items-center justify-center px-4" style="min-height: 100vh;">
      <div class="text-center max-w-4xl mx-auto">
        <h1
          class="text-neutral-950 dark:text-white mb-4"
          style="font-family: 'Host Grotesk', sans-serif; font-size: clamp(3rem, 10vw, 8rem); font-weight: 700; line-height: 0.95;"
        >
          TheBrutal
        </h1>
        <p class="text-neutral-600 dark:text-neutral-400 text-xl md:text-2xl tracking-widest uppercase mb-12">
          Post-Brutalismo Digitale
        </p>
        <router-link
          to="/articles"
          class="inline-block px-8 py-4 border-2 border-neutral-950 dark:border-white text-neutral-950 dark:text-white hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-colors text-sm font-medium uppercase tracking-widest"
        >
          Leggi gli articoli
        </router-link>
      </div>
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg class="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>

    <!-- Featured Articles -->
    <section class="py-20 px-4 border-t border-neutral-200 dark:border-neutral-800">
      <div class="mx-auto max-w-7xl">
        <h2
          class="text-neutral-950 dark:text-white mb-12"
          style="font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 400;"
        >
          Articoli in evidenza
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleCard
            v-for="article in featuredArticles"
            :key="article.id"
            :article="article"
          />
        </div>
      </div>
    </section>

    <!-- Chi siamo -->
    <section class="py-20 px-4 border-t border-neutral-200 dark:border-neutral-800">
      <div class="mx-auto max-w-3xl">
        <h2
          class="text-neutral-950 dark:text-white mb-8"
          style="font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 400;"
        >
          Chi siamo
        </h2>
        <div class="prose dark:prose-invert prose-neutral max-w-none">
          <p class="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            <strong class="text-neutral-950 dark:text-white">The Brutal</strong> è una piattaforma editoriale indipendente
            dedicata alla ricerca e alla diffusione del Post-Brutalismo digitale. Crediamo che il design debba essere onesto,
            accessibile e strutturalmente consapevole. In un panorama dominato da interfacce prevedibili, proponiamo una visione
            alternativa: il medium digitale ha una propria estetica, una propria materialità, e merita di essere esplorato
            senza maschere.
          </p>
          <p class="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            Attraverso articoli, riflessioni critiche e contributi della community, costruiamo un archivio vivente
            di idee, pratiche e sperimentazioni che ridefiniscono il rapporto tra forma e funzione nel web contemporaneo.
          </p>
        </div>
      </div>
    </section>

    <!-- Link rapidi -->
    <section class="py-20 px-4 border-t border-neutral-200 dark:border-neutral-800">
      <div class="mx-auto max-w-7xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <router-link
            to="/manifesto"
            class="group block p-8 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
          >
            <h3
              class="text-neutral-950 dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors"
              style="font-family: 'Playfair Display', serif; font-size: 1.75rem;"
            >
              Manifesto
            </h3>
            <p class="text-neutral-600 dark:text-neutral-400">
              I cinque principi fondamentali del Post-Brutalismo digitale. Onestà, struttura, accessibilità.
            </p>
            <span class="inline-block mt-4 text-sm text-neutral-400 dark:text-neutral-600 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              Leggi il manifesto →
            </span>
          </router-link>

          <router-link
            to="/excursus"
            class="group block p-8 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
          >
            <h3
              class="text-neutral-950 dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors"
              style="font-family: 'Playfair Display', serif; font-size: 1.75rem;"
            >
              Excursus
            </h3>
            <p class="text-neutral-600 dark:text-neutral-400">
              Dal béton brut al pixel grezzo: un viaggio storico-critico attraverso il brutalismo nell'architettura e nel web.
            </p>
            <span class="inline-block mt-4 text-sm text-neutral-400 dark:text-neutral-600 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              Leggi l'excursus →
            </span>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useArticlesStore } from '@/stores/articles'
import ArticleCard from '@/components/ui/ArticleCard.vue'
import { placeholderArticles } from '@/data/placeholders'

const articlesStore = useArticlesStore()
const featuredArticles = ref([])

onMounted(async () => {
  try {
    const data = await articlesStore.fetchPublishedArticles([], 0)
    featuredArticles.value = data && data.length > 0 ? data.slice(0, 3) : placeholderArticles
  } catch {
    featuredArticles.value = placeholderArticles
  }
})
</script>
