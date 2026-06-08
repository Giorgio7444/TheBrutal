<template>
  <div class=" w-full pt-8">
    <div class="pb-8">
        <h1 class="flex items-center justify-center text-center text-primary uppercase">Designers</h1>
        <p class="flex items-center justify-center text-center text-s uppercase text-primary/50">Quei designer che hanno reso l'Italia la patria del graphic design</p>

    </div>
  </div>
  <div class="bg-secondary text-primary flex flex-col items-center">
    <div class="w-full py-8 overflow-hidden">
      <div class="max-w-4xl mx-auto mb-16">
        <input
          v-model="search"
          type="search"
          placeholder="Cerca per titolo o contenuto..."
          class="w-full px-4 py-2 bg-secondary border border-primary/30 text-primary placeholder-primary/60 focus:outline-none focus:ring-2 focus:ring-tertiary"
        />
      </div>

      <div v-if="loading && posts.length === 0" class="flex h-[30vw] items-center justify-center">
        <div class="inline-flex flex-col items-center gap-4">
          <div class="w-12 h-12 border-4 border-primary/20 border-t-tertiary rounded-full animate-spin" />
          <p class="text-primary/70">Caricamento contenuti...</p>
        </div>
      </div>

      <div v-else-if="!loading && filteredPosts.length === 0" class="flex min-h-[35vw] items-center justify-center">
        <p class="text-primary/70 text-lg">
          Nessun contenuto trovato.
        </p>
      </div>

      <div
      v-else
      class="grid gap-0 w-full mb-[5vh]"
      :style="gridStyle"
    >
        <div v-for="post in filteredPosts" :key="post.id" :style="cardStyle">
          <ArticleCard :article="post" to-base="/blog" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import ArticleCard from '@/components/ui/ArticleCard.vue'

const posts = ref([])
const loading = ref(true)
const error = ref(null)
const search = ref('')

const isMobile = ref(window.innerWidth < 768)

const gridStyle = computed(() => ({
  gridTemplateColumns: isMobile.value ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
}))

const filteredPosts = computed(() => {
  const q = String(search.value || '').trim().toLowerCase()
  if (!q) return posts.value
  return posts.value.filter((p) => {
    const title = String(p.title || p.display_name || '').toLowerCase()
    const body = String(p.content || p.excerpt || '').toLowerCase()
    return title.includes(q) || body.includes(q)
  })
})

const fetchPosts = async () => {
  try {
    loading.value = true
    error.value = null

    const snapshot = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc')))
    posts.value = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }))
  } catch (err) {
    console.error('Fetch posts error:', err)
    error.value = err
    posts.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPosts()
  const onResize = () => { isMobile.value = window.innerWidth < 768 }
  window.addEventListener('resize', onResize)
})
</script>
