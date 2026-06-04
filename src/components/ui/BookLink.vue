<template>
  <div class="book-link-wrapper">
    <a
      :href="url"
      target="_blank"
      rel="noopener noreferrer"
      class="book-link group block"
    >
    <div class="book-frame">
      <img v-if="cover" :src="cover" :alt="title" class="book-cover-img" />
      <div v-else class="book-cover-placeholder">
        <span class="book-index">{{ String(index + 1).padStart(2, '0') }}</span>
      </div>
      <div class="book-hover-overlay" />
    </div>
    </a>

    <p class="book-title">{{ title }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  url:   { type: String, required: true },
  index: { type: Number, required: true },
  cover: { type: String, default: '' },
})
</script>

<style scoped>
.book-link-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.book-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

/* Frame ratio 1 : 1.4 */
.book-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1.4;
  overflow: hidden;
  border: 1px solid #f1f1f1;
  background-color: #111111;
  transition: transform 0.15s ease-out;
}

.book-link:hover .book-frame {
  transform: translateY(-2px);
}

/* Immagine copertina */
.book-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Placeholder numerico */
.book-cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #111111;
}

.book-index {
  font-family: 'Suisse Int\'l Mono', monospace;
  font-size: clamp(1rem, 1.2vw, 1.4rem);
  color: #f1f1f1;
  opacity: 0.2;
  user-select: none;
}

/* Overlay giallo tertiary */
.book-hover-overlay {
  position: absolute;
  inset: 0;
  background-color: #ffdc00;
  mix-blend-mode: multiply;
  opacity: 0;
  transition: opacity 0.15s ease-out;
  pointer-events: none;
}

.book-link:hover .book-hover-overlay {
  opacity: 1;
}

/* Titolo */
.book-title {
  font-family: 'Suisse Int\'l Mono', monospace;
  font-size: clamp(0.6rem, 0.75vw, 0.85rem);
  color: #f1f1f1;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  line-height: 1.3;
  margin: 0;
  padding: 0;
}
</style>
