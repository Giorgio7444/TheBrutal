<template>
  <router-link
    :to="`/article/${article.id}`"
    class="group block overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
  >
    <!-- Cover Image -->
    <div v-if="article.cover_url" class="relative h-48 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
      <img
        :src="article.cover_url"
        :alt="article.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div v-else class="h-48 bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-950 dark:to-neutral-950" />

    <!-- Content -->
    <div class="p-5">
      <!-- Tags -->
      <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
        <TagBadge
          v-for="tag in article.tags.slice(0, 2)"
          :key="tag"
          :tag="tag"
        />
      </div>

      <!-- Title -->
      <h3 class="font-serif text-lg font-bold text-neutral-950 dark:text-white mb-2 line-clamp-2">
        {{ article.title }}
      </h3>

      <!-- Excerpt -->
      <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
        {{ article.excerpt || 'Nessuna descrizione disponibile' }}
      </p>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-900">
        <!-- Author -->
        <div class="flex items-center gap-2">
          <UserAvatar
            :avatar-url="article.profiles?.avatar_url"
            :username="article.profiles?.username"
            size="sm"
          />
          <div>
            <p class="text-xs font-medium text-neutral-950 dark:text-white">
              {{ article.profiles?.username || 'Anonimo' }}
            </p>
            <p class="text-xs text-neutral-500 dark:text-neutral-500">
              {{ formatDate(article.created_at) }}
            </p>
          </div>
        </div>

        <!-- Like Count -->
        <div class="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {{ likeCount }}
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import UserAvatar from './UserAvatar.vue'
import TagBadge from './TagBadge.vue'

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
})

const likeCount = computed(() => {
  return props.article.likes?.[0]?.count || 0
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>
