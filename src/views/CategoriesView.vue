<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950">
    <div class="py-20 px-4">
      <div class="mx-auto max-w-7xl">
        <h1
          class="text-neutral-950 dark:text-white mb-12"
          style="font-family: 'Playfair Display', serif; font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 400;"
        >
          Categorie
        </h1>

        <div class="divide-y divide-neutral-200 dark:divide-neutral-800 border-t border-b border-neutral-200 dark:border-neutral-800">
          <button
            v-for="category in categories"
            :key="category.slug"
            @click="goToCategory(category.slug)"
            class="w-full flex items-center justify-between gap-6 py-6 px-4 text-left hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-1">
                <span
                  class="text-neutral-950 dark:text-white shrink-0"
                  style="font-family: 'Playfair Display', serif; font-size: 1.5rem;"
                >
                  {{ category.name }}
                </span>
                <span class="text-xs font-medium text-teal-700 dark:text-teal-400 bg-teal-100 dark:bg-teal-950 px-2 py-0.5 rounded-full shrink-0">
                  {{ category.count }} articoli
                </span>
              </div>
              <span class="text-sm text-neutral-500 dark:text-neutral-400 hidden sm:block">
                {{ category.description }}
              </span>
            </div>
            <span class="text-neutral-400 dark:text-neutral-600 text-xl shrink-0">→</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const categories = [
  { name: 'Video d\'ispirazione', slug: 'video-ispirazione', description: 'Documentari, interviste e video-saggi che esplorano l\'estetica brutalista nel digitale e nell\'architettura.', count: 8 },
  { name: 'Articoli esterni interessanti', slug: 'articoli-esterni', description: 'Letture selezionate dalla redazione: saggi critici, analisi di design e riflessioni sul rapporto tra forma e funzione.', count: 15 },
  { name: 'Bibliografia consigliata', slug: 'bibliografia', description: 'Testi fondamentali sul brutalismo, dal "New Brutalism" di Banham alle teorie contemporanee del web design radicale.', count: 6 },
  { name: 'Gli articoli fondamentali', slug: 'articoli-fondamentali', description: 'La selezione essenziale della piattaforma: i contributi che definiscono la visione Post-Brutalista di The Brutal.', count: 12 },
  { name: 'Newsletter', slug: 'newsletter', description: 'Archivio completo delle newsletter: aggiornamenti, nuove pubblicazioni e approfondimenti dalla community.', count: 23 },
]

const goToCategory = (slug) => {
  router.push(`/articles?tag=${slug}`)
}

onMounted(() => {
  document.title = 'Categorie — The Brutal'
})
</script>
