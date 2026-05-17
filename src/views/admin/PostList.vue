<template>
  <div class="min-h-screen bg-primary px-4 py-10 sm:px-6 lg:px-8">
    <div class="mx-auto w-full max-w-6xl">
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.3em] text-secondary">Admin / Post</p>
          <h1 class="font-sans text-4xl font-bold text-secondary">Tutti i post</h1>
        </div>
        <router-link
          to="/admin/new-post"
          class="inline-flex items-center justify-center rounded-lg bg-tertiary px-5 py-3 font-medium text-secondary transition-colors hover:bg-tertiary/90"
        >
          Nuovo post
        </router-link>
      </div>

      <div v-if="loading" class="rounded-2xl border border-secondary/20 bg-primary p-8 text-secondary/70">
        Caricamento post...
      </div>

      <div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {{ errorMessage }}
      </div>

      <div v-else class="overflow-hidden rounded-2xl border border-secondary/20 bg-primary">
        <table class="min-w-full divide-y divide-secondary/20">
          <thead class="bg-secondary/5">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-secondary/70">Titolo</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-secondary/70">Stato</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-secondary/70">Data</th>
              <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-secondary/70">Azioni</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-secondary/20">
            <tr v-for="post in posts" :key="post.id" class="align-top">
              <td class="px-6 py-5">
                <div class="font-medium text-secondary">{{ post.title }}</div>
              </td>
              <td class="px-6 py-5">
                <span
                  class="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
                  :class="post.status === 'published' ? 'bg-tertiary/20 text-secondary' : 'bg-secondary/20 text-secondary'"
                >
                  {{ post.status }}
                </span>
              </td>
              <td class="px-6 py-5 text-sm text-secondary/70">
                {{ formatDate(post.createdAt) }}
              </td>
              <td class="px-6 py-5">
                <div class="flex justify-end gap-3">
                  <router-link
                    :to="`/admin/edit-post/${post.id}`"
                    class="rounded-lg border border-secondary/20 px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-secondary/5"
                  >
                    Modifica
                  </router-link>
                  <button
                    type="button"
                    class="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                    @click="deletePost(post.id)"
                  >
                    Elimina
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="posts.length === 0">
              <td colspan="4" class="px-6 py-10 text-center text-secondary/70">
                Nessun post trovato.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { formatDate, normalizeFirestoreDate } from '@/lib/utils'

const posts = ref([])
const loading = ref(true)
const errorMessage = ref('')


const fetchPosts = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const snapshot = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc')))
    posts.value = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: normalizeFirestoreDate(docSnap.data().createdAt),
    }))
  } catch (err) {
    console.error('Fetch posts error:', err)
    errorMessage.value = 'Impossibile caricare i post.'
  } finally {
    loading.value = false
  }
}

const deletePost = async (postId) => {
  const confirmed = window.confirm('Eliminare definitivamente questo post?')
  if (!confirmed) return

  try {
    await deleteDoc(doc(db, 'posts', postId))
    posts.value = posts.value.filter((post) => post.id !== postId)
  } catch (err) {
    console.error('Delete post error:', err)
    errorMessage.value = 'Impossibile eliminare il post.'
  }
}

onMounted(fetchPosts)
</script>