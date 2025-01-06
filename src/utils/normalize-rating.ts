export const normalizeRating = (rating: string) => {
  // Busca cualquier número seguido de "+" o una palabra seguida de un número
  const match = rating.match(/\d+/)

  if (match) {
    // Devuelve el número seguido de un espacio y un "+"
    return `${match[0]}+`
  }

  return ''
}
