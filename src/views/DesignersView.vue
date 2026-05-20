<template>
  <div class="bg-secondary text-primary flex flex-col items-center">

    <div class="w-screen">
      <div v-if="loading && posts.length === 0" class="flex h-[30vw] items-center justify-center">
        <div class="inline-flex flex-col items-center gap-4">
          <div class="w-12 h-12 border-4 border-primary/20 border-t-tertiary rounded-full animate-spin" />
          <p class="text-primary/70">Caricamento contenuti...</p>
        </div>
      </div>

      <div v-else-if="posts.length === 0" class="flex min-h-[35vw] items-center justify-center">
        <p class="text-primary/70 text-lg">
          Nessun contenuto trovato.
        </p>
      </div>

      <div v-else class="grid grid-cols-4 gap-0 w-full mb-[5vh]">
        <ArticleCard
          v-for="post in posts"
          :key="post.id"
          :article="post"
          to-base="/blog"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import ArticleCard from '@/components/ui/ArticleCard.vue'

const posts = ref([])
const loading = ref(true)
const error = ref(null)

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

onMounted(fetchPosts)
</script>
