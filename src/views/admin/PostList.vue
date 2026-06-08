<template>
  <div class="min-h-screen bg-secondary px-4 py-10 sm:px-6 lg:px-8">
    <div class="mx-auto w-full max-w-[90vw]">
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-s uppercase text-primary/50">Admin/Post</p>
          <h1 class="text-primary uppercase">Tutti i post</h1>
        </div>
        <router-link
          to="/admin/new-post"
          class="inline-flex items-center justify-center bg-primary px-4 py-2 font-xs text-secondary transition-colors hover:bg-tertiary"
        >
          Nuovo post
        </router-link>
      </div>

      <div v-if="loading" class="p-8 text-primary">
        Caricamento post...
      </div>

      <div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {{ errorMessage }}
      </div>

      <div v-else class="min-w-full overflow-hidden border border-secondary/20 bg-secondary mt-20">
        <!-- Desktop table -->
        <table class="hidden md:table min-w-full divide-y divide-primary">
          <thead class="bg-secondary">
            <tr>
              <th class="px-4 py-2 text-left text-s font-bold text-primary">Title</th>
              <th class="px-4 py-2 text-left text-s font-bold text-primary">Status</th>
              <th class="px-4 py-2 text-left text-s font-bold text-primary">Date</th>
              <th class="px-4 py-2 text-right text-s font-bold text-primary">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-primary/20">
            <tr v-for="post in posts" :key="post.id">
              <td class="min-w-[10vw] px-4 py-2 text-sm text-primary">
                <div class="text-primary font-bold uppercase">{{ post.title }}</div>
              </td>
              <td class="px-4 py-2 text-sm text-primary">
                <span
                  class="inline-flex px-2 py-1 text-xs font-bold uppercase"
                  :class="post.status === 'published' ? 'bg-tertiary w-full justify-center text-secondary' : 'bg-primary w-full justify-center text-secondary'"
                >
                  {{ post.status }}
                </span>
              </td>
              <td class="px-4 py-2 text-sm text-primary">
                {{ formatDate(post.createdAt) }}
              </td>
              <td class="px-4 py-2">
                <div class="flex justify-end gap-3">
                  <router-link
                    :to="`/admin/edit-post/${post.id}`"
                    class="border border-primary px-4 py-2 text-sm text-primary transition-colors hover:bg-tertiary hover:text-secondary hover:border-tertiary"
                  >
                    Modifica
                  </router-link>
                  <button
                    type="button"
                    class="bg-red-600 px-4 py-2 text-sm text-primary transition-colors hover:bg-red-700"
                    @click="deletePost(post.id)"
                  >
                    Elimina
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="posts.length === 0">
              <td colspan="4" class="px-6 py-10 text-center text-primary">
                Nessun post trovato.
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Mobile list -->
        <div class="md:hidden divide-y divide-primary/20">
          <div v-for="post in posts" :key="post.id" class="px-4 py-3">
            <div class="mb-2">
              <div class="text-primary font-bold uppercase text-sm">{{ post.title }}</div>
              <div class="flex items-center gap-3 mt-1">
                <span
                  class="inline-flex px-2 py-1 text-xs font-bold uppercase"
                  :class="post.status === 'published' ? 'bg-tertiary text-secondary' : 'bg-primary text-secondary'"
                >
                  {{ post.status }}
                </span>
                <span class="text-xs text-primary/60">{{ formatDate(post.createdAt) }}</span>
              </div>
            </div>
            <div class="flex gap-2 w-full">
              <router-link
                :to="`/admin/edit-post/${post.id}`"
                class="flex-1 text-center border border-primary px-4 py-2 text-sm text-primary transition-colors hover:bg-tertiary hover:text-secondary hover:border-tertiary"
              >
                Modifica
              </router-link>
              <button
                type="button"
                class="flex-1 bg-red-600 px-4 py-2 text-sm text-primary transition-colors hover:bg-red-700"
                @click="deletePost(post.id)"
              >
                Elimina
              </button>
            </div>
          </div>
          <div v-if="posts.length === 0" class="px-6 py-10 text-center text-primary">
            Nessun post trovato.
          </div>
        </div>
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