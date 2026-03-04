/**
 * Formatta una data ISO in formato leggibile italiano.
 * @param {string} dateString - Data in formato ISO
 * @param {object} options - Opzioni per toLocaleDateString
 * @returns {string}
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  })
}
