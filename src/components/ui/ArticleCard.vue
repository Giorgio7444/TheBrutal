<template>
  <router-link
    :to="`${toBase}/${article.id}`"
    class="group relative block overflow-hidden rounded-none no-underline text-inherit"
    style="width: 25vw; height: 35vw;"
  >
    <div class="absolute inset-0 bg-secondary/20">
      <img
        v-if="article.cover_url"
        :src="article.cover_url"
        :alt="article.title"
        class="h-full w-full object-cover"
      />
    </div>

    <div class="absolute inset-0 bg-tertiary opacity-0 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-100" />

    <h3
      class="absolute inset-0 z-20 flex items-center justify-center px-[2vw] text-center font-sans text-[clamp(1.2rem,2vw,2.5rem)] font-bold text-primary leading-none"
      style="text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);"
    >
      {{ article.title }}
    </h3>
  </router-link>
</template>

<script setup>
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
</script>
