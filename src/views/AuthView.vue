<template>
  <div class="max-h-[95vh] flex items-top justify-center px-4 py-20 bg-black">
    <div class="max-w-screen max-h-screen">
      <div>

        <img
          src="../../assets/switch.svg"
          alt="Spotlight Logo"
          class="w-60 h-60 mx-auto mb-10"
        />
      </div>
      <h1 class="text-center font-bold text-white uppercase tracking-wide mb-16">
        <span class="text-4xl">Turn on the</span><br>spotlight!
      </h1>

      <button
        @click="signInWithGoogle"
        :disabled="authStore.loading"
        class="w-full px-4 py-2 mb-4 bg-primary text-secondary transition-colors flex items-center justify-center gap-4 hover:bg-tertiary hover:text-black"
      >

      <div>

        <img class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" src="../../assets/googlelogo.svg" alt="Google Logo" />

      </div>

        <span class="font-medium text-inherit">
          Continua con Google
        </span>
      </button>

      <button
        @click="signInWithGithub"
        :disabled="authStore.loading"
        class="w-full px-4 py-2 mb-4 bg-primary text-secondary transition-colors flex items-center justify-center gap-4 hover:bg-tertiary hover:text-black"
      >
      <div>

        <img class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" src="../../assets/githubLogo.svg" alt="GitHub Logo" />

      </div>
              <span class="font-medium text-inherit">
          Continua con GitHub
        </span>
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
