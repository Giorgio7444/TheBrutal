<template>
  <div class="min-h-screen w-full bg-secondary text-primary">
    <div v-if="loading" class="flex min-h-screen items-center justify-center">
      <div class="inline-flex flex-col items-center gap-4">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-tertiary" />
        <p class="text-primary/70">Caricamento profilo...</p>
      </div>
    </div>

    <div v-else-if="profile" class="w-full">
      <section class="relative h-[95svh] w-full overflow-hidden">
        <div class="absolute inset-0" :style="heroBackgroundStyle" />

        <label
          v-if="isOwnProfile"
          class="absolute right-5 top-[85svh] z-20 inline-flex bg-primary shadow-md shadow-black/10 px-4 py-2 text-xs uppercase text-secondary transition-colors hover:bg-tertiary hover:text-secondary hover:border-tertiary"
        >
          <input type="file" accept="image/*" class="hidden" @change="onCoverFileChange">
          {{ coverUploading ? 'Upload...' : 'Cambia cover' }}
        </label>

        <div class="relative z-10 flex h-full items-top justify-top pt-4">
          <h1 class="hero-title uppercase" :style="heroNameStyle" v-html="heroDisplayName">
          </h1>
        </div>
      </section>

      <section class="grid w-full grid-cols-1 gap-8 bg-secondary py-10 justify-between lg:grid-cols-[60vw_40vw] lg:gap-0 lg:px-0">
        <div class="bg-secondary lg:min-h-[60vh] pl-6 pr-6">
          <div class="mb-12 flex items-center justify-between gap-4">
            <h3 class="text-primary">YOUR BIOGRAPHY</h3>
            <button
              v-if="isOwnProfile"
              type="button"
              class="px-4 py-2 text-xs uppercase text-secondary bg-primary transition-colors hover:bg-tertiary hover:text-secondary hover:border-tertiary"
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
              class="w-full resize-none border border-primary bg-secondary px-4 py-3 text-primary leading-relaxed placeholder-primary/40 focus:border-tertiary"
              placeholder="Scrivi la tua biografia"
            />
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="bg-primary px-5 py-2 text-xs font-bold text-secondary transition-opacity hover:bg-tertiary"
                @click="saveProfile"
              >
                Salva bio
              </button>
              <p class="text-xs text-primary/50">Max 240 caratteri</p>
            </div>
          </div>

          <p v-else class="leading-[1.1] text-primary">
            {{ bioHeading }}
          </p>
        </div>

        <div class="relative bg-secondary lg:min-h-[60vh] ml-6 mr-6">
          <h3 class="text-center uppercase text-primary">Your Spotlights</h3>

          <button
            type="button"
            class="absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-primary p-2 text-primary transition-colors hover:bg-tertiary hover:text-secondary disabled:cursor-not-allowed disabled:text-secondary disabled:bg-primary/50"
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
            class="absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-primary p-2 text-primary transition-colors hover:bg-tertiary hover:text-secondary disabled:cursor-not-allowed disabled:text-secondary disabled:bg-primary/50"
            :disabled="!canNextSpotlights"
            aria-label="Spotlights successivi"
            @click="goNextSpotlights"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <Transition name="spotlight-page" mode="out-in">
            <div :key="spotlightPage" class="grid grid-cols-2 gap-4 px-9" style="min-height: 260px;">
              <router-link
                v-for="item in visibleSpotlights"
                :key="item.uid"
                :to="item.route"
                class="group block overflow-hidden border border-primary/25 bg-primary/5 transition-colors hover:border-tertiary"
              >
                <div class="aspect-[4/3] w-full overflow-hidden bg-primary/10">
                  <img :src="item.cover_url" :alt="item.title" class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]">
                </div>
                <p class="truncate px-3 py-2 text-xs font-semibold uppercase text-primary">
                  {{ item.title }}
                </p>
              </router-link>
            </div>
          </Transition>

          <p v-if="spotlights.length === 0" class="mt-6 text-center text-sm text-primary/60">
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
          class="mt-5 inline-block border border-primary/40 px-6 py-3 text-xs uppercase text-primary transition-colors hover:bg-tertiary hover:text-secondary"
        >
          Torna alla home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
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

const isMobile = ref(window.innerWidth < 768)
const heroFontSize = ref(10) // vw, will be computed

// Misura la larghezza di un testo a una data dimensione font usando canvas
const measureTextWidth = (text, fontSizeVw) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const fontSizePx = (fontSizeVw / 100) * window.innerWidth
  ctx.font = `500 ${fontSizePx}px "Suisse Int'l Mono", monospace`
  return ctx.measureText(text).width
}

// Calcola il fontSize vw affinché la stringa più larga occupi esattamente 100vw
const computeHeroFontSize = () => {
  const name = displayName.value
  if (!name) return

  // Su mobile ogni parola è su riga propria → la parola più lunga deve coprire 100vw
  // Su desktop il nome intero è su una riga → l'intera stringa deve coprire 100vw
  const tokens = isMobile.value ? name.split(' ') : [name]
  const longestToken = tokens.reduce((a, b) =>
    measureTextWidth(b, 10) > measureTextWidth(a, 10) ? b : a
  , tokens[0])

  // Larghezza in px della parola più lunga a 10vw
  const widthAt10vw = measureTextWidth(longestToken, 10)
  // Proporzione: vogliamo che occupi 100vw
  const targetPx = window.innerWidth
  const newSize = (targetPx / widthAt10vw) * 10

  // Clamp ragionevole
  heroFontSize.value = Math.max(3, Math.min(40, newSize))
}

const heroNameStyle = computed(() => ({
  fontSize: `${heroFontSize.value}vw`,
  lineHeight: '0.85',
  color: '#f1f1f1',
  textShadow: '1px 3px 20px rgba(0, 0, 0, 0.38)',
  width: '100vw',
}))

const heroDisplayName = computed(() => {
  if (isMobile.value) {
    return displayName.value.split(' ').join('<br>')
  }
  return displayName.value
})

const onResize = () => {
  const wasMobile = isMobile.value
  isMobile.value = window.innerWidth < 768
  // Ricalcola sempre al resize, ma se cambia breakpoint lo fa subito
  computeHeroFontSize()
}

// Ricalcola quando cambia il nome o il breakpoint
watch([displayName, isMobile], () => {
  computeHeroFontSize()
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
  computeHeroFontSize()
  window.addEventListener('resize', onResize)
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

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.hero-title {
  font-family: "Suisse Int'l Mono", monospace;
  font-weight: 500;
  letter-spacing: -0.03em;
  text-align: center;
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
