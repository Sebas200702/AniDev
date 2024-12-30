export const getTagColor = (type: string) => {
  enum AnimeTags {
    'Anime' = 'bg-blue-500 md:hover:bg-blue-400 text-white',
    'Special' = 'bg-yellow-500 md:hover:bg-yellow-400 text-white',
    'OVA' = 'bg-green-500 md:hover:bg-green-400 text-white',
    'ONA' = 'bg-red-500 md:hover:bg-red-400 text-white',
    'Movie' = 'bg-purple-500 md:hover:bg-purple-400 text-white',
    'Music' = 'bg-pink-500 md:hover:bg-pink-400 text-white',
    'Unknown' = 'bg-gray-300 md:hover:bg-gray-400 text-gray-900',
    'PV' = 'bg-orange-500 md:hover:bg-orange-400 text-white',
    'CM' = 'bg-indigo-600 md:hover:bg-indigo-500 text-white',
  }

  const tagColor =
    AnimeTags[type as keyof typeof AnimeTags] ||
    'bg-gray-300 md:hover:bg-gray-400 text-gray-900'

  return tagColor
}
