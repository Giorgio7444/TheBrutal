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
            <span
              class="text-neutral-950 dark:text-white shrink-0"
              style="font-family: 'Playfair Display', serif; font-size: 1.5rem;"
            >
              {{ category.name }}
            </span>
            <span class="text-sm text-neutral-500 dark:text-neutral-400 hidden sm:block">
              {{ category.description }}
            </span>
            <span class="text-neutral-400 dark:text-neutral-600 text-xl shrink-0">→</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const categories = [
  { name: 'Video d\'ispirazione', slug: 'video-ispirazione', description: 'Contenuti video selezionati che esplorano The Brutalist' },
  { name: 'Articoli esterni interessanti', slug: 'articoli-esterni', description: 'Letture esterne curate dalla redazione' },
  { name: 'Bibliografia consigliata', slug: 'bibliografia', description: 'Testi fondamentali per lo studio di The Brutalist' },
  { name: 'Gli articoli fondamentali', slug: 'articoli-fondamentali', description: 'La selezione essenziale della piattaforma' },
  { name: 'Newsletter', slug: 'newsletter', description: 'Archivio delle newsletter della community' },
]

const goToCategory = (slug) => {
  router.push(`/articles?tag=${slug}`)
}
</script>
