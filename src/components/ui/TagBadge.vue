<template>
  <span
    class="inline-block px-3 py-1 rounded-full text-xs font-medium bg-tertiary/20 text-secondary border border-tertiary/40"
  >
    #{{ tag }}
  </span>
</template>

<script setup>
defineProps({
  tag: {
    type: String,
    required: true,
  },
})
</script>
