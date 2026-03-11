export const formatDate = (dateString, options = {}) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  })
}
