/**
 * Composable for managing meta tags dynamically
 * Used for Open Graph and Twitter Card meta tags on article pages
 */
export const useMetaTags = () => {
  const setMetaTags = (config) => {
    const {
      title = 'The Brutal — Post Brutalismo Digitale',
      description = 'La piattaforma editoriale dedicata al Post Brutalismo Digitale.',
      image = 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&h=630&fit=crop',
      url = 'https://the-brutal.web.app',
      type = 'website',
    } = config

    // Update OG tags
    setMetaTag('og:title', title)
    setMetaTag('og:description', description)
    setMetaTag('og:image', image)
    setMetaTag('og:url', url)
    setMetaTag('og:type', type)

    // Update Twitter Card tags
    setMetaTag('twitter:title', title)
    setMetaTag('twitter:description', description)
    setMetaTag('twitter:image', image)

    // Update standard meta tags
    setMetaTag('description', description)
  }

  const setMetaTag = (name, content) => {
    let element = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`)
    if (!element) {
      element = document.createElement('meta')
      const isProperty = name.startsWith('og:') || name.startsWith('twitter:')
      if (isProperty && name.startsWith('og:')) {
        element.setAttribute('property', name)
      } else if (isProperty && name.startsWith('twitter:')) {
        element.setAttribute('name', name)
      } else {
        element.setAttribute('name', name)
      }
      document.head.appendChild(element)
    }
    element.setAttribute('content', content)
  }

  return { setMetaTags }
}
