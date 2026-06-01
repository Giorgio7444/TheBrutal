<template>
  <img
    v-if="showImage && avatarUrl"
    :src="avatarUrl"
    :alt="username"
    referrerpolicy="strict-origin-when-cross-origin"
    class="rounded-full object-cover"
    :class="sizeClasses"
    @error="handleImageError"
  />
  <div
    v-else
    :class="[sizeClasses, 'rounded-full bg-tertiary flex items-center justify-center text-secondary font-bold']"
  >
    {{ (username || 'U')[0].toUpperCase() }}
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  avatarUrl: String,
  username: String,
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v),
  },
})

const showImage = ref(true)

const handleImageError = () => {
  showImage.value = false
}

watch(
  () => props.avatarUrl,
  () => {
    showImage.value = true
  }
)

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
  }
  return sizes[props.size]
})
</script>
