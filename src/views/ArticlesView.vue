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
              'px-4 py-2 rounded-full text-sm font-medium transition-colors border',
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
        <div v-if="articlesStore.hasMore" class="flex justify-center mt-12">
          <button
            @click="loadMore"
            :disabled="articlesStore.loading"
            class="px-6 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium text-neutral-950 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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

const placeholderArticles = [
  {
    id: 'placeholder-1',
    title: 'Il Brutalismo Digitale: origini e significato',
    excerpt: 'Come il brutalismo architettonico ha ispirato un movimento estetico nel web design contemporaneo, sfidando le convenzioni del design pulito e minimalista.',
    cover_url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=400&fit=crop',
    tags: ['Estetica', 'Teoria e Tecnica'],
    profiles: { username: 'marco_b', avatar_url: null },
    likes: [{ count: 24 }],
    created_at: '2026-02-15T10:30:00Z',
    published: true,
  },
  {
    id: 'placeholder-2',
    title: 'Tipografia raw: quando il carattere diventa struttura',
    excerpt: 'Un\'esplorazione dell\'uso tipografico nel design brutalista, dove il testo non è solo contenuto ma diventa elemento architettonico della pagina.',
    cover_url: 'https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?w=800&h=400&fit=crop',
    tags: ['Tipografia', 'Composizione'],
    profiles: { username: 'lucia_design', avatar_url: null },
    likes: [{ count: 18 }],
    created_at: '2026-02-10T14:00:00Z',
    published: true,
  },
  {
    id: 'placeholder-3',
    title: 'Anti-design: la bellezza dell\'imperfezione',
    excerpt: 'In un\'epoca di interfacce levigate e prevedibili, l\'anti-design propone una nuova forma di autenticità visiva che rompe gli schemi consolidati.',
    cover_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=400&fit=crop',
    tags: ['Estetica', 'Ispirazione'],
    profiles: { username: 'giovanni_r', avatar_url: null },
    likes: [{ count: 31 }],
    created_at: '2026-01-28T09:15:00Z',
    published: true,
  },
  {
    id: 'placeholder-4',
    title: 'Griglie rotte: sperimentazione nel layout web',
    excerpt: 'Come i designer brutalisti utilizzano griglie asimmetriche e sovrapposizioni per creare esperienze visive che sfidano le aspettative dell\'utente.',
    cover_url: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?w=800&h=400&fit=crop',
    tags: ['Composizione', 'Design System'],
    profiles: { username: 'anna_web', avatar_url: null },
    likes: [{ count: 12 }],
    created_at: '2026-01-20T16:45:00Z',
    published: true,
  },
  {
    id: 'placeholder-5',
    title: 'Il colore come provocazione',
    excerpt: 'Analisi dell\'uso del colore nel brutalismo digitale: palette aggressive, contrasti estremi e l\'abbandono deliberato dell\'armonia cromatica tradizionale.',
    cover_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&h=400&fit=crop',
    tags: ['Estetica', 'Teoria e Tecnica'],
    profiles: { username: 'paolo_k', avatar_url: null },
    likes: [{ count: 27 }],
    created_at: '2026-01-15T11:00:00Z',
    published: true,
  },
  {
    id: 'placeholder-6',
    title: 'Interfacce oneste: etica del design brutale',
    excerpt: 'Il brutalismo digitale come risposta ai dark patterns: quando mostrare la struttura diventa un atto di trasparenza verso l\'utente.',
    cover_url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&h=400&fit=crop',
    tags: ['Design System', 'Ispirazione'],
    profiles: { username: 'elena_ux', avatar_url: null },
    likes: [{ count: 45 }],
    created_at: '2026-01-08T13:30:00Z',
    published: true,
  },
]

const route = useRoute()
const articlesStore = useArticlesStore()
const articles = ref([])
const selectedTags = ref([])
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
    articles.value = data && data.length > 0 ? data : getFilteredPlaceholders()
  } catch (err) {
    console.error('Fetch articles error:', err)
    articles.value = getFilteredPlaceholders()
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
