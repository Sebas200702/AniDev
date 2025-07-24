export const getTypeMusicColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'opening':
    case 'op':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    case 'ending':
    case 'ed':
      return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    case 'insert':
      return 'bg-green-500/20 text-green-300 border-green-500/30'
    default:
      return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  }
}
