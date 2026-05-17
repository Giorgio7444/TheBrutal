<template>
  <div class="min-h-screen bg-primary px-4 py-10 sm:px-6 lg:px-8">
    <div class="mx-auto w-full max-w-6xl">
      <div class="mb-8 space-y-3">
        <p class="text-sm uppercase tracking-[0.3em] text-secondary">Blog</p>
        <h1 class="font-sans text-4xl font-bold text-secondary">Post pubblicati</h1>
      </div>

      <div v-if="loading" class="rounded-2xl border border-secondary/20 bg-primary p-8 text-secondary/70">
        Caricamento post...
      </div>

      <div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {{ errorMessage }}
      </div>

      <div v-else class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <router-link
          v-for="post in posts"
          :key="post.id"
          :to="`/blog/${post.id}`"
          class="group rounded-2xl border border-secondary/20 bg-primary p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-tertiary/50"
        >
          <p class="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-secondary/60">
            {{ formatDate(post.createdAt) }}
          </p>
          <h2 class="font-sans text-2xl font-bold text-secondary transition-colors group-hover:text-tertiary">
            {{ post.title }}
          </h2>
          <p class="mt-4 line-clamp-4 text-sm leading-6 text-secondary/70">
            {{ post.excerpt || 'Nessun estratto disponibile.' }}
          </p>
        </router-link>

        <div v-if="posts.length === 0" class="rounded-2xl border border-secondary/20 bg-primary p-8 text-secondary/70 md:col-span-2 xl:col-span-3">
          Nessun post pubblicato.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { formatDate, normalizeFirestoreDate } from '@/lib/utils'

const posts = ref([])
const loading = ref(true)
const errorMessage = ref('')


const fetchPosts = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const snapshot = await getDocs(
      query(collection(db, 'posts'), where('status', '==', 'published'), orderBy('createdAt', 'desc'))
    )

    posts.value = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: normalizeFirestoreDate(docSnap.data().createdAt),
    }))
  } catch (err) {
    console.error('Fetch blog posts error:', err)
    errorMessage.value = 'Impossibile caricare i post pubblicati.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchPosts)
</script>