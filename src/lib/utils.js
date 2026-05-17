export const formatDate = (dateString, options = {}) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  })
}

export const normalizeEditorContent = (value) => {
  if (!value) {
    return { time: Date.now(), blocks: [], version: '2.31.0', cover: '' }
  }

  if (typeof value === 'object' && Array.isArray(value.blocks)) {
    return { cover: '', ...value }
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (parsed && Array.isArray(parsed.blocks)) {
        return { cover: '', ...parsed }
      }
    } catch {
      const text = value
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

      if (text) {
        return {
          time: Date.now(),
          blocks: [
            {
              type: 'paragraph',
              data: { text },
            },
          ],
          version: '2.31.0',
          cover: '',
        }
      }
    }
  }

  return { time: Date.now(), blocks: [], version: '2.31.0', cover: '' }
}

export const normalizeFirestoreDate = (value) => {
  if (!value) return ''
  if (typeof value?.toDate === 'function') return value.toDate().toISOString()
  if (typeof value === 'string') return value
  return ''
}
