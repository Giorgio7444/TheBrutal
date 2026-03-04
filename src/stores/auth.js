import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)

  const initializeAuth = async () => {
    try {
      loading.value = true
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        user.value = session.user
        await fetchProfile(session.user.id)
      }

      // Listen to auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session) {
            user.value = session.user
            await fetchProfile(session.user.id)
          } else {
            user.value = null
            profile.value = null
          }
        }
      )

      return () => subscription?.unsubscribe()
    } catch (err) {
      console.error('Auth init error:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchProfile = async (userId) => {
    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (err && err.code !== 'PGRST116') {
        throw err
      }

      profile.value = data || null
    } catch (err) {
      console.error('Fetch profile error:', err)
    }
  }

  const signInWithEmail = async (email, password) => {
    try {
      error.value = null
      // Prova il login; se l'utente non esiste, lo registra
      const { data, error: signInErr } = await supabase.auth.signInWithPassword({ email, password })
      if (signInErr) {
        if (signInErr.message?.toLowerCase().includes('invalid login')) {
          // Utente non trovato: registrazione
          const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({ email, password })
          if (signUpErr) throw signUpErr
          return { data: signUpData, error: null }
        }
        throw signInErr
      }
      return { data, error: null }
    } catch (err) {
      error.value = err.message
      console.error('Email sign in error:', err)
      return { data: null, error: err }
    }
  }

  const signInWithGoogle = async () => {
    try {
      error.value = null
      const { data, error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      })
      if (err) throw err
      return data
    } catch (err) {
      error.value = err.message
      console.error('Google sign in error:', err)
      throw err
    }
  }

  const signInWithGithub = async () => {
    try {
      error.value = null
      const { data, error: err } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      })
      if (err) throw err
      return data
    } catch (err) {
      error.value = err.message
      console.error('GitHub sign in error:', err)
      throw err
    }
  }

  const signOut = async () => {
    try {
      error.value = null
      const { error: err } = await supabase.auth.signOut()
      if (err) throw err
      user.value = null
      profile.value = null
    } catch (err) {
      error.value = err.message
      console.error('Sign out error:', err)
      throw err
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user.value) throw new Error('No user logged in')
      error.value = null

      const { data, error: err } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.value.id)
        .select()
        .single()

      if (err) throw err
      profile.value = data
      return data
    } catch (err) {
      error.value = err.message
      console.error('Update profile error:', err)
      throw err
    }
  }

  const uploadAvatar = async (file) => {
    try {
      if (!user.value) throw new Error('No user logged in')
      error.value = null

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.value.id}-${Date.now()}.${fileExt}`

      const { error: uploadErr } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadErr) throw uploadErr

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      await updateProfile({ avatar_url: data.publicUrl })
      return data.publicUrl
    } catch (err) {
      error.value = err.message
      console.error('Upload avatar error:', err)
      throw err
    }
  }

  return {
    user,
    profile,
    loading,
    error,
    isAuthenticated,
    initializeAuth,
    fetchProfile,
    signInWithEmail,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    updateProfile,
    uploadAvatar,
  }
})
