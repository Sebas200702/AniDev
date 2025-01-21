export const normalizeRating = (rating: string) => {
  const match = rating.match(/\d+/)

  if (match) {
    return `${match[0]}+`
  }

  return 'E'
}
