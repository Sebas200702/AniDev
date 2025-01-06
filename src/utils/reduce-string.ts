export const reduceString = (synopsis?: string, size = 450) => {
  if (!synopsis) return 'No synopsis'
  if (synopsis.length <= size) return synopsis
  return synopsis.slice(0, size) + '...'
}
