<template>
  <div class="min-h-screen bg-primary">
    <div class="py-20 px-4">
      <div class="mx-auto max-w-7xl">
        <h1
          class="text-secondary mb-12"
          style="font-family: 'Playfair Display', serif; font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 400;"
        >
          Categorie
        </h1>

        <div class="divide-y divide-secondary/20 border-t border-b border-secondary/20">
          <button
            v-for="category in categories"
            :key="category.slug"
            @click="goToCategory(category.slug)"
            class="w-full flex items-center justify-between gap-6 py-6 px-4 text-left hover:bg-secondary/5 transition-colors cursor-pointer"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-1">
                <span
                  class="text-secondary shrink-0"
                  style="font-family: 'Playfair Display', serif; font-size: 1.5rem;"
                >
                  {{ category.name }}
                </span>
                <span class="text-xs font-medium text-secondary bg-tertiary/20 px-2 py-0.5 rounded-full shrink-0">
                  {{ category.count }} articoli
                </span>
              </div>
              <span class="text-sm text-secondary/60 hidden sm:block">
                {{ category.description }}
              </span>
            </div>
            <span class="text-secondary/50 text-xl shrink-0">→</span>
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
  { name: 'Gli articoli fondamentali', slug: 'articoli-fondamentali', description: 'La selezione essenziale della piattaforma: i contributi che definiscono la visione Post-Brutalista di Italian Spotlight.', count: 12 },
  { name: 'Newsletter', slug: 'newsletter', description: 'Archivio completo delle newsletter: aggiornamenti, nuove pubblicazioni e approfondimenti dalla community.', count: 23 },
]

const goToCategory = (slug) => {
  router.push(`/designers?tag=${slug}`)
}
</script>
