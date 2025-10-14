export const createGroups = (
  items: any[] | null,
  windowWidth: number,
  context?: string
) => {
  if (!items) return []
  let itemsPerGroup = 2

  if (windowWidth >= 1280) {
    itemsPerGroup = context === 'anime-info' ? 4 : 6
  } else if (windowWidth >= 768) {
    itemsPerGroup = context === 'anime-info' ? 3 : 4
  }

  return Array.from({ length: Math.ceil(items.length / itemsPerGroup) }).map(
    (_, groupIndex) => {
      return items.slice(
        groupIndex * itemsPerGroup,
        (groupIndex + 1) * itemsPerGroup
      )
    }
  )
}
