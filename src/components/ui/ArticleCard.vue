<template>
  <router-link
    :to="`${toBase}/${article.id}`"
    class="group relative block overflow-hidden rounded-none no-underline text-inherit transition-transform duration-150 ease-out hover:-translate-y-0.5"
    style="width: 25vw; height: 35vw;"
  >
    <div class="absolute inset-0 bg-secondary/20">
      <img
        v-if="article.cover_url"
        :src="article.cover_url"
        :alt="article.title"
        class="h-full w-full object-cover transition-transform duration-200 ease-out will-change-transform group-hover:scale-[1.02]"
      />
    </div>

    <div class="absolute inset-0 bg-tertiary opacity-0 mix-blend-multiply transition-opacity duration-150 ease-out group-hover:opacity-100" />

    <h3
      class="absolute uppercase inset-0 z-20 flex items-start justify-center px-[2vw] pt-[3%] text-center font-bold text-secondary leading-none"
    >
      {{ article.title }}
    </h3>

    <button
      type="button"
      :class="[
        'absolute bottom-3 left-1/2 z-30 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border text-secondary transition-colors duration-150 disabled:opacity-60',
        isFavorite
          ? 'border-tertiary bg-tertiary hover:bg-tertiary/90'
          : 'border-primary/70 bg-primary hover:bg-primary/90'
      ]"
      :aria-label="isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'"
      @click.stop.prevent="toggleFavorite"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 17.3l-6.18 3.73 1.64-7.03L2 9.27l7.19-.62L12 2l2.81 6.65 7.19.62-5.46 4.73 1.64 7.03z" />
      </svg>
    </button>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
  toBase: {
    type: String,
    default: '/details',
  },
})

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const isFavorite = computed(() => {
  return authStore.isAuthenticated && authStore.isFavoritePost(props.article?.id)
})

const toggleFavorite = async () => {
  if (!authStore.isAuthenticated) {
    toast.info('Accedi per salvare i preferiti')
    router.push('/auth')
    return
  }

  try {
    const nextState = await authStore.toggleFavoritePost(props.article?.id)
    toast.success(nextState ? 'Aggiunto ai preferiti' : 'Rimosso dai preferiti')
  } catch (err) {
    console.error('Toggle favorite from card error:', err)
    toast.error('Impossibile aggiornare i preferiti')
  }
}
</script>
