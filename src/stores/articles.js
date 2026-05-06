import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db, storage, isStorageEnabled } from '@/lib/firebase'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
  getCountFromServer,
} from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

export const useArticlesStore = defineStore('articles', () => {
  const articles = ref([])
  const loading = ref(false)
  const error = ref(null)
  const hasMore = ref(true)
  const currentPage = ref(0)
  const pageSize = 12
  const pageCursors = ref([])
  const lastQueryKey = ref('')
  const profileCache = ref({})

  const buildQueryKey = (tags) => tags.slice().sort().join('|')

  const normalizeDates = (data) => {
    const createdAt = data.created_at?.toDate ? data.created_at.toDate().toISOString() : data.created_at || null
    const updatedAt = data.updated_at?.toDate ? data.updated_at.toDate().toISOString() : data.updated_at || null
    return { ...data, created_at: createdAt, updated_at: updatedAt }
  }

  const fetchProfileById = async (userId) => {
    if (!userId) return null
    if (profileCache.value[userId]) return profileCache.value[userId]

    const snapshot = await getDoc(doc(db, 'profiles', userId))
    if (!snapshot.exists()) return null

    const data = { id: snapshot.id, ...snapshot.data() }
    profileCache.value[userId] = data
    return data
  }

  const fetchLikesCount = async (articleId) => {
    const likesRef = collection(db, 'articles', articleId, 'likes')
    const snapshot = await getCountFromServer(likesRef)
    return snapshot.data().count || 0
  }

  const hydrateArticle = async (docSnap) => {
    const raw = normalizeDates(docSnap.data())
    const profile = await fetchProfileById(raw.author_id)
    const likesCount = await fetchLikesCount(docSnap.id)

    return {
      id: docSnap.id,
      ...raw,
      profiles: profile,
      likes: [{ count: likesCount }],
    }
  }

  const fetchPublishedArticles = async (tags = [], page = 0) => {
    try {
      loading.value = true
      error.value = null

      const queryKey = buildQueryKey(tags)
      if (page === 0 || queryKey !== lastQueryKey.value) {
        lastQueryKey.value = queryKey
        pageCursors.value = []
        currentPage.value = 0
        hasMore.value = true
      }

      const constraints = [
        where('published', '==', true),
        orderBy('created_at', 'desc'),
        limit(pageSize),
      ]

      if (tags.length > 0) {
        constraints.push(where('tags', 'array-contains-any', tags))
      }

      if (page > 0 && pageCursors.value[page - 1]) {
        constraints.push(startAfter(pageCursors.value[page - 1]))
      }

      const snapshot = await getDocs(query(collection(db, 'articles'), ...constraints))
      const docs = snapshot.docs
      if (docs.length > 0) {
        pageCursors.value[page] = docs[docs.length - 1]
      }

      let data = await Promise.all(docs.map(hydrateArticle))
      if (tags.length > 0) {
        data = data.filter((article) => tags.every((tag) => article.tags?.includes(tag)))
      }

      if (page === 0) {
        articles.value = data
      } else {
        articles.value.push(...data)
      }

      hasMore.value = docs.length === pageSize
      currentPage.value = page

      return data
    } catch (err) {
      error.value = err.message
      console.error('Fetch articles error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchArticleById = async (id) => {
    try {
      loading.value = true
      error.value = null

      const snapshot = await getDoc(doc(db, 'articles', id))
      if (!snapshot.exists()) {
        throw new Error('Article not found')
      }

      return await hydrateArticle(snapshot)
    } catch (err) {
      error.value = err.message
      console.error('Fetch article error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUserArticles = async (userId) => {
    try {
      loading.value = true
      error.value = null

      const snapshot = await getDocs(
        query(collection(db, 'articles'), where('author_id', '==', userId), orderBy('created_at', 'desc'))
      )

      const data = await Promise.all(snapshot.docs.map(hydrateArticle))
      return data
    } catch (err) {
      error.value = err.message
      console.error('Fetch user articles error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createArticle = async (articleData) => {
    try {
      error.value = null

      const nowIso = new Date().toISOString()
      const docRef = await addDoc(collection(db, 'articles'), {
        ...articleData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      })

      return {
        id: docRef.id,
        ...articleData,
        created_at: nowIso,
        updated_at: nowIso,
      }
    } catch (err) {
      error.value = err.message
      console.error('Create article error:', err)
      throw err
    }
  }

  const updateArticle = async (id, updates) => {
    try {
      error.value = null

      const nowIso = new Date().toISOString()
      await updateDoc(doc(db, 'articles', id), {
        ...updates,
        updated_at: serverTimestamp(),
      })

      return {
        id,
        ...updates,
        updated_at: nowIso,
      }
    } catch (err) {
      error.value = err.message
      console.error('Update article error:', err)
      throw err
    }
  }

  const deleteArticle = async (id) => {
    try {
      error.value = null
      await deleteDoc(doc(db, 'articles', id))
    } catch (err) {
      error.value = err.message
      console.error('Delete article error:', err)
      throw err
    }
  }

  const uploadToStorage = async (bucket, file) => {
    try {
      error.value = null

      if (!isStorageEnabled || !storage) {
        throw new Error('Storage not configured')
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
      const fileRef = storageRef(storage, `${bucket}/${fileName}`)

      await uploadBytes(fileRef, file)
      return await getDownloadURL(fileRef)
    } catch (err) {
      error.value = err.message
      console.error(`Upload to ${bucket} error:`, err)
      throw err
    }
  }

  const uploadCoverImage = (file) => uploadToStorage('article-covers', file)
  const uploadImage = (file) => uploadToStorage('article-images', file)

  const toggleLike = async (articleId, userId) => {
    try {
      error.value = null

      const likeRef = doc(db, 'articles', articleId, 'likes', userId)
      const snapshot = await getDoc(likeRef)

      if (snapshot.exists()) {
        await deleteDoc(likeRef)
        return false
      }

      await setDoc(likeRef, {
        user_id: userId,
        article_id: articleId,
        created_at: serverTimestamp(),
      })

      return true
    } catch (err) {
      error.value = err.message
      console.error('Toggle like error:', err)
      throw err
    }
  }

  const checkIfLiked = async (articleId, userId) => {
    try {
      const snapshot = await getDoc(doc(db, 'articles', articleId, 'likes', userId))
      return snapshot.exists()
    } catch (err) {
      console.error('Check like error:', err)
      return false
    }
  }

  return {
    articles,
    loading,
    error,
    hasMore,
    currentPage,
    fetchPublishedArticles,
    fetchArticleById,
    fetchUserArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    uploadCoverImage,
    uploadImage,
    toggleLike,
    checkIfLiked,
  }
})
