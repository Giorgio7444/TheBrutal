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

export const getEditorImageBlocks = (value) => {
  const content = normalizeEditorContent(value)
  return (Array.isArray(content.blocks) ? content.blocks : []).filter((block) => block?.type === 'image')
}

export const getEditorTextBlocks = (value) => {
  const content = normalizeEditorContent(value)
  return (Array.isArray(content.blocks) ? content.blocks : []).filter((block) => block?.type !== 'image')
}

export const extractImageItem = (block, index = 0) => {
  const data = block?.data || {}
  const src = data.file?.url || data.url || ''
  const fileName = data.file?.name || data.caption || src.split('/').pop() || `immagine-${index + 1}`

  return {
    id: `${src || fileName}-${index}`,
    url: src,
    name: fileName,
    alt: data.alt || data.caption || fileName,
    caption: data.caption || '',
  }
}

export const normalizePostImages = (value) => {
  return getEditorImageBlocks(value)
    .map((block, index) => extractImageItem(block, index))
    .filter((image) => image.url)
}

export const createImageBlock = (image, index = 0) => {
  const name = image?.name || image?.caption || image?.url?.split('/').pop() || `immagine-${index + 1}`

  return {
    type: 'image',
    data: {
      file: {
        url: image?.url || '',
      },
      url: image?.url || '',
      caption: image?.caption || name,
      alt: image?.alt || name,
    },
  }
}

export const mergeEditorContentWithImages = (content, images = []) => {
  const normalized = normalizeEditorContent(content)
  const textBlocks = getEditorTextBlocks(normalized)
  const imageBlocks = images.map((image, index) => createImageBlock(image, index)).filter((block) => block.data.file.url)

  return {
    ...normalized,
    blocks: [...textBlocks, ...imageBlocks],
    cover: images[0]?.url || normalized.cover || '',
  }
}

export const normalizeFirestoreDate = (value) => {
  if (!value) return ''
  if (typeof value?.toDate === 'function') return value.toDate().toISOString()
  if (typeof value === 'string') return value
  return ''
}
