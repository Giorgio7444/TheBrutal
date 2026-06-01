<template>
  <div class="min-h-screen w-full bg-secondary text-primary">
    <div v-if="loading" class="flex min-h-screen items-center justify-center">
      <div class="inline-flex flex-col items-center gap-4">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-tertiary" />
        <p class="text-primary/70">Caricamento profilo...</p>
      </div>
    </div>

    <div v-else-if="profile" class="w-full">
      <section class="relative h-screen w-full overflow-hidden">
        <div class="absolute inset-0" :style="heroBackgroundStyle" />
        <div class="absolute inset-0 bg-secondary/40" />

        <label
          v-if="isOwnProfile"
          class="absolute right-5 top-24 z-20 inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary/40 bg-secondary/80 px-4 py-2 text-xs uppercase tracking-[0.25em] text-primary transition-colors hover:bg-tertiary hover:text-secondary"
        >
          <input type="file" accept="image/*" class="hidden" @change="onCoverFileChange">
          {{ coverUploading ? 'Upload...' : 'Cambia cover' }}
        </label>

        <div class="relative z-10 flex h-full items-center justify-center px-4">
          <h1 class="hero-title uppercase" :style="heroNameStyle">
            {{ displayName }}
          </h1>
        </div>
      </section>

      <section class="grid w-full grid-cols-1 gap-8 bg-secondary px-4 py-10 lg:grid-cols-[70vw_30vw] lg:gap-0 lg:px-0">
        <div class="border border-primary/20 bg-secondary p-6 lg:min-h-[60vh] lg:border-l-0 lg:border-y-0 lg:border-r lg:px-10">
          <div class="mb-6 flex items-center justify-between gap-4">
            <h2 class="font-sans text-3xl font-bold uppercase tracking-[0.15em] text-primary">Your Bio</h2>
            <button
              v-if="isOwnProfile"
              type="button"
              class="rounded-full border border-primary/30 px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary transition-colors hover:bg-tertiary hover:text-secondary"
              @click="toggleBioEdit"
            >
              {{ isEditingBio ? 'Annulla' : 'Modifica' }}
            </button>
          </div>

          <div v-if="isOwnProfile && isEditingBio" class="space-y-4">
            <textarea
              v-model="editData.bio_heading"
              rows="4"
              maxlength="240"
              class="w-full resize-none border border-primary/30 bg-secondary px-4 py-3 text-lg uppercase leading-relaxed text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-tertiary"
              placeholder="Scrivi la tua biografia in uppercase"
            />
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="rounded-full bg-tertiary px-5 py-2 text-sm font-bold uppercase tracking-[0.2em] text-secondary transition-opacity hover:opacity-90"
                @click="saveProfile"
              >
                Salva bio
              </button>
              <p class="text-xs uppercase tracking-[0.2em] text-primary/50">Max 240 caratteri</p>
            </div>
          </div>

          <p v-else class="text-[clamp(1.2rem,2.4vw,2.6rem)] uppercase leading-[1.1] text-primary">
            {{ bioHeading }}
          </p>
        </div>

        <div class="relative border border-primary/20 bg-secondary p-6 lg:min-h-[60vh] lg:border-r-0 lg:border-y-0 lg:border-l">
          <h2 class="mb-6 text-center font-sans text-3xl font-bold uppercase tracking-[0.15em] text-primary">Your Spotlights</h2>

          <button
            type="button"
            class="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-primary/30 bg-secondary/90 p-2 text-primary transition-colors hover:bg-tertiary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-35"
            :disabled="!canPrevSpotlights"
            aria-label="Spotlights precedenti"
            @click="goPrevSpotlights"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            class="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-primary/30 bg-secondary/90 p-2 text-primary transition-colors hover:bg-tertiary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-35"
            :disabled="!canNextSpotlights"
            aria-label="Spotlights successivi"
            @click="goNextSpotlights"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <Transition name="spotlight-page" mode="out-in">
            <div :key="spotlightPage" class="grid grid-cols-2 gap-4 px-9">
              <router-link
                v-for="item in visibleSpotlights"
                :key="item.uid"
                :to="item.route"
                class="group block overflow-hidden border border-primary/25 bg-primary/5 transition-colors hover:border-tertiary"
              >
                <div class="aspect-[4/3] w-full overflow-hidden bg-primary/10">
                  <img :src="item.cover_url" :alt="item.title" class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]">
                </div>
                <p class="truncate border-t border-primary/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  {{ item.title }}
                </p>
              </router-link>
            </div>
          </Transition>

          <p v-if="spotlights.length === 0" class="mt-6 text-center text-sm uppercase tracking-[0.18em] text-primary/60">
            Nessun designer preferito ancora.
          </p>
        </div>
      </section>
    </div>

    <div v-else class="flex min-h-screen items-center justify-center px-4">
      <div class="text-center">
        <h2 class="font-sans text-3xl font-bold text-primary">Profilo non trovato</h2>
        <router-link
          to="/"
          class="mt-5 inline-block border border-primary/40 px-6 py-3 text-xs uppercase tracking-[0.2em] text-primary transition-colors hover:bg-tertiary hover:text-secondary"
        >
          Torna alla home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { collection, doc, getDoc } from 'firebase/firestore'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { db } from '@/lib/firebase'

const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const profile = ref(null)
const loading = ref(true)
const coverUploading = ref(false)
const isEditingBio = ref(false)
const spotlights = ref([])
const spotlightPage = ref(0)

const editData = ref({
  username: '',
  bio: '',
  bio_heading: '',
})

const isOwnProfile = computed(() => {
  return authStore.isAuthenticated && authStore.profile?.username === route.params.username
})

const displayName = computed(() => {
  const name = profile.value?.display_name || profile.value?.username || 'Profile'
  return String(name).trim()
})

const bioHeading = computed(() => {
  return profile.value?.bio_heading || profile.value?.bio || 'Scrivi qui la tua biografia.'
})

const heroBackgroundStyle = computed(() => {
  const cover = profile.value?.cover_image_url || '/assets/bg.gif'
  return {
    backgroundImage: `url(${cover})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  }
})

const heroNameStyle = computed(() => {
  const len = Math.max(displayName.value.length, 6)
  const fontSize = Math.max(3.2, Math.min(16, 100 / (len * 0.58)))

  return {
    fontSize: `${fontSize}vw`,
    lineHeight: '0.85',
    color: '#f1f1f1',
    textShadow: '0 6px 0 rgba(0, 0, 0, 0.98), 0 0 28px rgba(0, 0, 0, 0.9)',
    width: '100vw',
  }
})

const spotlightPages = computed(() => {
  const chunks = []
  for (let i = 0; i < spotlights.value.length; i += 4) {
    chunks.push(spotlights.value.slice(i, i + 4))
  }
  return chunks
})

const visibleSpotlights = computed(() => {
  const current = spotlightPages.value[spotlightPage.value] || []
  return current.map((item, idx) => ({ ...item, uid: `${item.id}-${spotlightPage.value}-${idx}` }))
})

const canPrevSpotlights = computed(() => spotlightPage.value > 0)
const canNextSpotlights = computed(() => spotlightPage.value < spotlightPages.value.length - 1)

const goPrevSpotlights = () => {
  if (!canPrevSpotlights.value) return
  spotlightPage.value -= 1
}

const goNextSpotlights = () => {
  if (!canNextSpotlights.value) return
  spotlightPage.value += 1
}

const toggleBioEdit = () => {
  isEditingBio.value = !isEditingBio.value
  if (isEditingBio.value) {
    editData.value = {
      username: profile.value?.username || '',
      bio: profile.value?.bio || '',
      bio_heading: profile.value?.bio_heading || profile.value?.bio || '',
    }
  }
}

const saveProfile = async () => {
  if (!isOwnProfile.value) return

  try {
    await authStore.updateProfile({
      bio_heading: editData.value.bio_heading.trim(),
      bio: editData.value.bio_heading.trim(),
    })

    profile.value = authStore.profile
    isEditingBio.value = false
    toast.success('Bio aggiornata')
  } catch (err) {
    console.error('Save profile bio error:', err)
    toast.error('Impossibile aggiornare la bio')
  }
}

const onCoverFileChange = async (event) => {
  const file = event.target.files?.[0]
  if (!file || !isOwnProfile.value) return

  try {
    coverUploading.value = true
    await authStore.uploadProfileCover(file)
    profile.value = authStore.profile
    toast.success('Cover aggiornata')
  } catch (err) {
    console.error('Upload profile cover error:', err)
    toast.error(authStore.error || 'Impossibile caricare la cover')
  } finally {
    coverUploading.value = false
    event.target.value = ''
  }
}

const fetchSpotlightById = async (id) => {
  const postSnap = await getDoc(doc(collection(db, 'posts'), id))
  if (postSnap.exists()) {
    const data = postSnap.data()
    return {
      id,
      title: data.title || data.display_name || 'Designer',
      cover_url: data.cover_url || '/assets/bg.gif',
      route: `/blog/${id}`,
    }
  }

  const articleSnap = await getDoc(doc(collection(db, 'articles'), id))
  if (articleSnap.exists()) {
    const data = articleSnap.data()
    return {
      id,
      title: data.title || data.display_name || 'Designer',
      cover_url: data.cover_url || '/assets/bg.gif',
      route: `/details/${id}`,
    }
  }

  return null
}

const loadSpotlights = async () => {
  const ids = Array.isArray(profile.value?.favorite_post_ids) ? profile.value.favorite_post_ids : []
  spotlightPage.value = 0

  if (!ids.length) {
    spotlights.value = []
    return
  }

  const results = await Promise.all(ids.map((id) => fetchSpotlightById(id).catch(() => null)))
  spotlights.value = results.filter(Boolean)
}

const loadProfile = async () => {
  try {
    loading.value = true

    if (isOwnProfile.value) {
      profile.value = authStore.profile
    } else {
      profile.value = await authStore.fetchProfileByUsername(route.params.username)
    }

    if (profile.value) {
      await loadSpotlights()
    }
  } catch (err) {
    console.error('Load profile error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadProfile()
})

watch(() => route.params.username, async () => {
  isEditingBio.value = false
  await loadProfile()
})

watch(() => authStore.profile, async (newProfile) => {
  if (!newProfile) return
  if (!isOwnProfile.value) return

  profile.value = newProfile
  await loadSpotlights()
})
</script>

<style scoped>
.hero-title {
  font-family: "Suisse Int'l Mono", monospace;
  font-weight: 700;
  letter-spacing: -0.03em;
  text-align: center;
  white-space: nowrap;
}

.spotlight-page-enter-active,
.spotlight-page-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.spotlight-page-enter-from {
  opacity: 0;
  transform: translateX(16px);
}

.spotlight-page-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
</style>
