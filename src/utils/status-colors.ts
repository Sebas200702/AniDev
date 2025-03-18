export const statusColors = (status: string) => {
  enum COLORS {
    'Currently Airing' = 'text-green-400 md:group-hover:text-green-500',
    'Finished Airing' = 'text-blue-400 md:group-hover:text-blue-500',
    'Not Yet' = 'text-yellow-400 md:group-hover:text-yellow-500',
    'unknown' = 'text-gray-400 md:group-hover:text-gray-500',
  }

  return COLORS[status as keyof typeof COLORS]
}
