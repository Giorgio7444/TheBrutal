<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950">
    <!-- Hero Section -->
    <div class="border-b border-neutral-200 dark:border-neutral-800 py-20 px-4">
      <div class="mx-auto max-w-7xl">
        <div class="text-center mb-12">
          <h1 class="font-sans text-5xl md:text-6xl font-bold text-neutral-950 dark:text-white mb-4">
            The Brutal List
          </h1>
          <p class="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Un luogo in cui potrai scoprire un nuovo punto di vista, quello dei Post Brutalisti. Gli articoli presenti in questa sezione hanno l'obiettivo di incentivare, esplorare ed espandere la causa Post Brutalista.
          </p>
        </div>

        <!-- Tag Filter -->
        <div class="flex flex-wrap gap-2 justify-center">
          <button
            v-for="tag in popularTags"
            :key="tag"
            @click="toggleTagFilter(tag)"
            :class="[
              'px-4 py-2 rounded-none text-sm font-medium transition-colors border',
              selectedTags.includes(tag)
                ? 'bg-teal-100 dark:bg-teal-950 border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300'
                : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-teal-300 dark:hover:border-teal-700'
            ]"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </div>

    <!-- Articles Grid -->
    <div class="py-20 px-4">
      <div class="mx-auto max-w-7xl">
        <div v-if="articlesStore.loading && articles.length === 0" class="text-center py-20">
          <div class="inline-flex flex-col items-center gap-4">
            <div class="w-12 h-12 border-4 border-neutral-200 dark:border-neutral-800 border-t-teal-600 dark:border-t-teal-600 rounded-full animate-spin" />
            <p class="text-neutral-600 dark:text-neutral-400">Caricamento articoli...</p>
          </div>
        </div>

        <div v-else-if="articles.length === 0" class="text-center py-20">
          <p class="text-neutral-600 dark:text-neutral-400 text-lg">
            Nessun articolo trovato. Torna più tardi!
          </p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleCard
            v-for="article in articles"
            :key="article.id"
            :article="article"
          />
        </div>

        <!-- Load More Button -->
        <div v-if="articlesStore.hasMore && !usingPlaceholders" class="flex justify-center mt-12">
          <button
            @click="loadMore"
            :disabled="articlesStore.loading"
            class="px-6 py-3 rounded-none border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium text-neutral-950 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ articlesStore.loading ? 'Caricamento...' : 'Carica altri articoli' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useArticlesStore } from '@/stores/articles'
import ArticleCard from '@/components/ui/ArticleCard.vue'
import { placeholderArticles } from '@/data/placeholders'

const route = useRoute()
const articlesStore = useArticlesStore()
const articles = ref([])
const selectedTags = ref([])
const usingPlaceholders = ref(false)
const popularTags = ref(['Design System', 'Estetica', 'Tipografia', 'Composizione', 'Ispirazione', 'Teoria e Tecnica'])

onMounted(async () => {
  if (route.query.tag) {
    selectedTags.value = [route.query.tag]
  }
  await fetchArticles()
})

const fetchArticles = async () => {
  try {
    const data = await articlesStore.fetchPublishedArticles(selectedTags.value, 0)
    if (data && data.length > 0) {
      articles.value = data
      usingPlaceholders.value = false
    } else {
      articles.value = getFilteredPlaceholders()
      usingPlaceholders.value = true
    }
  } catch (err) {
    console.error('Fetch articles error:', err)
    articles.value = getFilteredPlaceholders()
    usingPlaceholders.value = true
  }
}

const getFilteredPlaceholders = () => {
  if (selectedTags.value.length === 0) return placeholderArticles
  return placeholderArticles.filter(a =>
    a.tags.some(t => selectedTags.value.includes(t))
  )
}

const loadMore = async () => {
  try {
    const nextPage = articlesStore.currentPage + 1
    const data = await articlesStore.fetchPublishedArticles(selectedTags.value, nextPage)
    articles.value.push(...data)
  } catch (err) {
    console.error('Load more error:', err)
  }
}

const toggleTagFilter = (tag) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
  } else {
    selectedTags.value.push(tag)
  }
}

watch(selectedTags, async () => {
  articles.value = []
  await fetchArticles()
}, { deep: true })
</script>
