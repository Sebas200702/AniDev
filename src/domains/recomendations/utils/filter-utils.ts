export const sanitizeIds = (ids: string[]): number[] => {
  return ids.filter((id) => id && !isNaN(Number(id))).map(Number)
}

export const excludeCurrent = (results: any[], currentId?: number) => {
  if (!currentId) return results
  const id = Number(currentId)
  return results.filter((a) => a.mal_id !== id)
}
