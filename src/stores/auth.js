import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth, db, storage } from '@/lib/firebase'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  limit,
} from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)

  const normalizeUsernameBase = (value) => {
    const base = (value || '')
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '')
      .slice(0, 24)
    return base || 'user'
  }

  const generateUniqueUsername = async (firebaseUser) => {
    const emailBase = firebaseUser.email?.split('@')[0]
    const displayBase = firebaseUser.displayName?.split(' ')[0]
    const base = normalizeUsernameBase(emailBase || displayBase || 'user')

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const suffix = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
      const candidate = `${base}_${suffix}`
      const existing = await getDocs(
        query(collection(db, 'profiles'), where('username', '==', candidate), limit(1))
      )
      if (existing.empty) return candidate
    }

    return `${base}_${firebaseUser.uid.slice(0, 6)}`
  }

  const ensureProfile = async (firebaseUser) => {
    const profileRef = doc(db, 'profiles', firebaseUser.uid)
    const snapshot = await getDoc(profileRef)

    if (snapshot.exists()) {
      profile.value = { id: snapshot.id, ...snapshot.data() }
      return
    }

    const username = await generateUniqueUsername(firebaseUser)
    const nowIso = new Date().toISOString()
    const data = {
      id: firebaseUser.uid,
      username,
      display_name: firebaseUser.displayName || null,
      bio: null,
      avatar_url: firebaseUser.photoURL || null,
      created_at: serverTimestamp(),
    }

    await setDoc(profileRef, data, { merge: true })
    profile.value = { ...data, created_at: nowIso }
  }

  const initializeAuth = async () => {
    try {
      loading.value = true
      let initialized = false

      const unsubscribe = onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          if (firebaseUser) {
            user.value = {
              id: firebaseUser.uid,
              email: firebaseUser.email || null,
              displayName: firebaseUser.displayName || null,
              photoURL: firebaseUser.photoURL || null,
            }
            await ensureProfile(firebaseUser)
          } else {
            user.value = null
            profile.value = null
          }

          if (!initialized) {
            loading.value = false
            initialized = true
          }
        },
        (err) => {
          console.error('Auth init error:', err)
          error.value = err.message
          if (!initialized) {
            loading.value = false
            initialized = true
          }
        }
      )

      return () => unsubscribe()
    } catch (err) {
      console.error('Auth init error:', err)
      error.value = err.message
      loading.value = false
      return null
    }
  }

  const fetchProfile = async (userId) => {
    try {
      const snapshot = await getDoc(doc(db, 'profiles', userId))
      profile.value = snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
    } catch (err) {
      console.error('Fetch profile error:', err)
    }
  }

  const signInWithEmail = async (email, password) => {
    try {
      error.value = null
      const data = await signInWithEmailAndPassword(auth, email, password)
      return { data, error: null }
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        try {
          const signUpData = await createUserWithEmailAndPassword(auth, email, password)
          await ensureProfile(signUpData.user)
          return { data: signUpData, error: null }
        } catch (signUpErr) {
          error.value = signUpErr.message
          console.error('Email sign up error:', signUpErr)
          return { data: null, error: signUpErr }
        }
      }

      error.value = err.message
      console.error('Email sign in error:', err)
      return { data: null, error: err }
    }
  }

  const signInWithGoogle = async () => {
    try {
      error.value = null
      const provider = new GoogleAuthProvider()
      const data = await signInWithPopup(auth, provider)
      await ensureProfile(data.user)
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
      const provider = new GithubAuthProvider()
      const data = await signInWithPopup(auth, provider)
      await ensureProfile(data.user)
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
      await firebaseSignOut(auth)
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

      const profileRef = doc(db, 'profiles', user.value.id)
      await updateDoc(profileRef, { ...updates })

      const snapshot = await getDoc(profileRef)
      if (snapshot.exists()) {
        profile.value = { id: snapshot.id, ...snapshot.data() }
      }

      return profile.value
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
      const avatarRef = storageRef(storage, `avatars/${fileName}`)

      await uploadBytes(avatarRef, file)
      const url = await getDownloadURL(avatarRef)

      await updateProfile({ avatar_url: url })
      return url
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
