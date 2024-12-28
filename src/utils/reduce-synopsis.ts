export const reduceSynopsis = (synopsis?: string, size = 450) => {
  if (!synopsis) return 'No synopsis'
  return synopsis.slice(0, size) + '...'
}
