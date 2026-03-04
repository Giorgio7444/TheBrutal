import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useArticlesStore = defineStore('articles', () => {
  const articles = ref([])
  const loading = ref(false)
  const error = ref(null)
  const hasMore = ref(true)
  const currentPage = ref(0)
  const pageSize = 12

  const fetchPublishedArticles = async (tags = [], page = 0) => {
    try {
      loading.value = true
      error.value = null
      
      let query = supabase
        .from('articles')
        .select(
          `
          *,
          profiles:author_id(id, username, avatar_url),
          likes(count)
          `,
          { count: 'exact' }
        )
        .eq('published', true)
        .order('created_at', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1)

      if (tags.length > 0) {
        query = query.contains('tags', tags)
      }

      const { data, error: err, count } = await query

      if (err) throw err

      if (page === 0) {
        articles.value = data || []
      } else {
        articles.value.push(...(data || []))
      }

      hasMore.value = articles.value.length < (count || 0)
      currentPage.value = page
      
      return data || []
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

      const { data, error: err } = await supabase
        .from('articles')
        .select(
          `
          *,
          profiles:author_id(id, username, avatar_url, bio),
          likes(count)
          `
        )
        .eq('id', id)
        .single()

      if (err) throw err
      return data
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

      const { data, error: err } = await supabase
        .from('articles')
        .select(
          `
          *,
          profiles:author_id(id, username, avatar_url),
          likes(count)
          `
        )
        .eq('author_id', userId)
        .order('created_at', { ascending: false })

      if (err) throw err
      return data || []
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

      const { data, error: err } = await supabase
        .from('articles')
        .insert([articleData])
        .select()
        .single()

      if (err) throw err
      return data
    } catch (err) {
      error.value = err.message
      console.error('Create article error:', err)
      throw err
    }
  }

  const updateArticle = async (id, updates) => {
    try {
      error.value = null

      const { data, error: err } = await supabase
        .from('articles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (err) throw err
      return data
    } catch (err) {
      error.value = err.message
      console.error('Update article error:', err)
      throw err
    }
  }

  const deleteArticle = async (id) => {
    try {
      error.value = null

      const { error: err } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)

      if (err) throw err
    } catch (err) {
      error.value = err.message
      console.error('Delete article error:', err)
      throw err
    }
  }

  const uploadToStorage = async (bucket, file) => {
    try {
      error.value = null

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

      const { error: uploadErr } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)

      if (uploadErr) throw uploadErr

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      return data.publicUrl
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

      // Check if already liked
      const { data: existingLike, error: fetchErr } = await supabase
        .from('likes')
        .select('*')
        .eq('article_id', articleId)
        .eq('user_id', userId)
        .single()

      if (fetchErr && fetchErr.code !== 'PGRST116') {
        throw fetchErr
      }

      if (existingLike) {
        // Unlike
        const { error: deleteErr } = await supabase
          .from('likes')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', userId)

        if (deleteErr) throw deleteErr
        return false
      } else {
        // Like
        const { error: insertErr } = await supabase
          .from('likes')
          .insert([{ article_id: articleId, user_id: userId }])

        if (insertErr) throw insertErr
        return true
      }
    } catch (err) {
      error.value = err.message
      console.error('Toggle like error:', err)
      throw err
    }
  }

  const checkIfLiked = async (articleId, userId) => {
    try {
      const { data, error: err } = await supabase
        .from('likes')
        .select('*')
        .eq('article_id', articleId)
        .eq('user_id', userId)
        .single()

      if (err && err.code !== 'PGRST116') {
        throw err
      }

      return !!data
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
