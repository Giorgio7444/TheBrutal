<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="inline-flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-neutral-200 dark:border-neutral-800 border-t-teal-600 dark:border-t-teal-600 rounded-full animate-spin" />
        <p class="text-neutral-600 dark:text-neutral-400">Caricamento profilo...</p>
      </div>
    </div>

    <!-- Profile Content -->
    <div v-else-if="profile" class="py-16 px-4">
      <div class="mx-auto max-w-4xl">
        <!-- Profile Header -->
        <div class="text-center mb-12">
          <UserAvatar
            :avatar-url="profile.avatar_url"
            :username="profile.username"
            size="xl"
            class="mx-auto mb-6"
          />

          <div v-if="isOwnProfile && isEditing" class="space-y-4 max-w-md mx-auto mb-6">
            <input
              v-model="editData.username"
              type="text"
              class="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
            <textarea
              v-model="editData.bio"
              placeholder="Scrivi una biografia..."
              class="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-950 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none"
              rows="3"
            />
            <div class="flex gap-2">
              <button
                @click="saveProfile"
                class="flex-1 px-4 py-2 rounded-lg bg-teal-600 dark:bg-teal-600 text-white hover:bg-teal-700 dark:hover:bg-teal-700 transition-colors font-medium"
              >
                Salva
              </button>
              <button
                @click="cancelEdit"
                class="flex-1 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium"
              >
                Annulla
              </button>
            </div>
          </div>

          <div v-else>
            <h1 class="font-sans text-4xl font-bold text-neutral-950 dark:text-white mb-3">
              {{ profile.username }}
            </h1>
            <p class="text-neutral-600 dark:text-neutral-400 text-lg mb-6">
              {{ profile.bio || 'Nessuna biografia disponibile' }}
            </p>

            <button
              v-if="isOwnProfile"
              @click="startEdit"
              class="px-6 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium text-neutral-950 dark:text-white"
            >
              Modifica profilo
            </button>
          </div>
        </div>

        <!-- Articles Section -->
        <div>
          <h2 class="font-sans text-3xl font-bold text-neutral-950 dark:text-white mb-8">
            Articoli
          </h2>

          <div v-if="userArticles.length === 0" class="text-center py-12">
            <p class="text-neutral-600 dark:text-neutral-400">
              {{ isOwnProfile ? 'Non hai ancora scritto articoli' : 'Questo utente non ha ancora scritto articoli' }}
            </p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ArticleCard
              v-for="article in userArticles"
              :key="article.id"
              :article="article"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h2 class="font-sans text-3xl font-bold text-neutral-950 dark:text-white mb-4">
          Profilo non trovato
        </h2>
        <router-link
          to="/"
          class="px-4 py-2 rounded-lg bg-teal-600 dark:bg-teal-600 text-white hover:bg-teal-700 dark:hover:bg-teal-700 transition-colors inline-block"
        >
          Torna alla home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useArticlesStore } from '@/stores/articles'
import { useToast } from '@/composables/useToast'
import { supabase } from '@/lib/supabase'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import ArticleCard from '@/components/ui/ArticleCard.vue'

const route = useRoute()
const authStore = useAuthStore()
const articlesStore = useArticlesStore()
const toast = useToast()

const profile = ref(null)
const userArticles = ref([])
const loading = ref(true)
const isEditing = ref(false)
const editData = ref({
  username: '',
  bio: '',
})

const isOwnProfile = computed(() => {
  return authStore.isAuthenticated && authStore.profile?.username === route.params.username
})

onMounted(async () => {
  document.title = 'Profilo — The Brutal'
  await loadProfile()
})

const loadProfile = async () => {
  try {
    loading.value = true
    // In a real app, we'd fetch the profile by username
    // For now, we'll use the current user's profile if viewing own profile
    if (isOwnProfile.value) {
      profile.value = authStore.profile
      editData.value = {
        username: authStore.profile.username,
        bio: authStore.profile.bio || '',
      }
    } else {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', route.params.username)
        .single()
      if (err && err.code !== 'PGRST116') {
        console.error('Load profile by username error:', err)
      }
      profile.value = data || null
    }

    if (profile.value) {
      userArticles.value = await articlesStore.fetchUserArticles(profile.value.id)
    }
  } catch (err) {
    console.error('Load profile error:', err)
  } finally {
    loading.value = false
  }
}

const startEdit = () => {
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  editData.value = {
    username: profile.value.username,
    bio: profile.value.bio || '',
  }
}

const saveProfile = async () => {
  try {
    await authStore.updateProfile(editData.value)
    profile.value = authStore.profile
    isEditing.value = false
  } catch (err) {
    console.error('Save profile error:', err)
    toast.error('Errore nel salvataggio del profilo')
  }
}
</script>
