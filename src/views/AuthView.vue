<template>
  <div class="flex flex-col items-center justify-center bg-black" style="min-height: 100dvh; padding: 2vh 1rem;">
    <div class="flex flex-col items-center w-full">
      <div class="flex items-center justify-center" style="height: 40dvh;">
        <img
          src="/switch.svg"
          alt="Spotlight Logo"
          class="mx-auto object-contain"
          style="height: 100%; width: auto; max-width: 90vw;"
        />
      </div>
      <h1 class="text-center font-bold text-white uppercase tracking-wide mt-4 mb-8"
          style="width: 90vw; font-size: clamp(22px, 7vw, 48px); line-height: 1.1;">
        <span>Turn on the</span><br>spotlight!
      </h1>
      <button
        @click="signInWithGoogle"
        :disabled="authStore.loading"
        class="px-4 py-3 mb-4 bg-primary text-secondary transition-colors flex items-center justify-center gap-4 hover:bg-tertiary hover:text-black"
        style="width: 70vw; max-width: 400px;"
      >
        <div>
          <img class="w-5 h-5" src="/googlelogo.svg" alt="Google Logo" />
        </div>
        <span class="font-medium text-inherit">Continua con Google</span>
      </button>
      <button
        @click="signInWithGithub"
        :disabled="authStore.loading"
        class="px-4 py-3 mb-4 bg-primary text-secondary transition-colors flex items-center justify-center gap-4 hover:bg-tertiary hover:text-black"
        style="width: 70vw; max-width: 400px;"
      >
        <div>
          <img class="w-5 h-5" src="/githubLogo.svg" alt="GitHub Logo" />
        </div>
        <span class="font-medium text-inherit">Continua con GitHub</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const signInWithGoogle = async () => {
  try {
    await authStore.signInWithGoogle()
    router.push('/')
  } catch (err) {
    console.error('Google sign in failed:', err)
  }
}

const signInWithGithub = async () => {
  try {
    await authStore.signInWithGithub()
    router.push('/')
  } catch (err) {
    console.error('GitHub sign in failed:', err)
  }
}
</script>