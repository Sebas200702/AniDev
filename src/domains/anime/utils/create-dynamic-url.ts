import { AnimeFilters, AnimeGenres, AnimeTypes } from '@anime/types'

/**
 * Generates a random number within a specified range.
 *
 * @param {number} min - The minimum value (inclusive)
 * @param {number} max - The maximum value (inclusive)
 * @returns {number} A random integer between min and max
 */
const getRandomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min

interface FilterResult {
  url: string
  title: string
}

// Géneros más populares y con más probabilidad de tener contenido
const popularGenres = [
  AnimeGenres.ACTION,
  AnimeGenres.ADVENTURE,
  AnimeGenres.COMEDY,
  AnimeGenres.DRAMA,
  AnimeGenres.ROMANCE,
  AnimeGenres.FANTASY,
  AnimeGenres.SUPERNATURAL,
  AnimeGenres.SLICE_OF_LIFE,
  AnimeGenres.SCI_FI,
  AnimeGenres.GIRLS_LOVE,
]

// Géneros menos populares que pueden generar menos resultados
const lessPopularGenres = [
  AnimeGenres.GOURMET,
  AnimeGenres.HORROR,
  AnimeGenres.MYSTERY,
  AnimeGenres.SUSPENSE,
  AnimeGenres.AVANT_GARDE,
  AnimeGenres.AWARD_WINNING,
  AnimeGenres.ECCHI,
]

/**
 * Retrieves a list of popular anime genres with weighted selection.
 *
 * @returns {AnimeGenres[]} Array of popular anime genres
 */
const getWeightedGenres = (): AnimeGenres[] => {
  // 80% probabilidad de géneros populares, 20% de géneros menos populares
  const usePopular = Math.random() < 0.8
  return usePopular ? popularGenres : lessPopularGenres
}

/**
 * Capitalizes words in a title following standard title case rules.
 *
 * @description This function transforms a string into proper title case by capitalizing
 * the first letter of each word, except for specific articles, conjunctions, and prepositions
 * (like 'from', 'of', 'the', etc.) that appear in the middle of the title. The first word
 * is always capitalized regardless of what word it is.
 *
 * @param {string} text - The text to be formatted in title case
 * @returns {string} The formatted text in proper title case
 *
 * @example
 * capitalizeTitle("the world of anime") // Returns "The World of Anime"
 * capitalizeTitle("journey to the east") // Returns "Journey to the East"
 */
const capitalizeTitle = (text: string): string => {
  return text
    .split(' ')
    .map((word, index) => {
      const lowerCaseWords = ['from', 'of', 'the', 'and', 'in', 'to']
      if (lowerCaseWords.includes(word.toLowerCase()) && index > 0) {
        return word.toLowerCase()
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

/**
 * Creates a dynamic URL and title for fetching anime data based on randomly selected filters.
 * This is the main function for frontend components - optimized for better success rates.
 *
 * @description This function generates a URL with query parameters and a corresponding title
 * based on randomly selected anime filters. It has been optimized to generate combinations
 * more likely to have results by:
 * - Using fewer simultaneous filters to reduce restriction
 * - Prioritizing popular genres with more content
 * - Avoiding overly restrictive combinations
 *
 * @param {number} [limit=6] - The maximum number of anime items to fetch
 * @param {boolean} [parentalControl=true] - Whether to apply parental control filters
 * @returns {FilterResult} An object containing the generated URL query string and formatted title
 *
 * @example
 * const result = createDynamicUrl(10)
 * // Returns: { url: "limit_count=10&genre_filter=action", title: "Top 10 Action Anime" }
 */
export const createDynamicUrl = (
  limit = 6,
  parentalControl?: boolean | null
): FilterResult => {
  const genres = getWeightedGenres()

  /**
   * Selects a random set of filters with reduced restrictiveness.
   *
   * @returns {AnimeFilters[]} Array of randomly selected filters (max 1)
   */
  const getRandomFilters = (): AnimeFilters[] => {
    const validFilters = [
      AnimeFilters.Status,
      AnimeFilters.Genre,
      AnimeFilters.Type,
    ]

    // 60% probabilidad de solo 1 filtro, 40% de ningún filtro específico
    const useFilter = Math.random() < 0.6
    if (!useFilter) return []

    const randomFilter =
      validFilters[getRandomNumber(0, validFilters.length - 1)]
    return [randomFilter]
  }

  /**
   * Selects a random anime type with adjusted preferences.
   *
   * @returns {AnimeTypes} The selected anime type
   */
  const getRandomType = (): AnimeTypes => {
    const weightedTypes = [
      { type: AnimeTypes.TV, weight: 0.6 },
      { type: AnimeTypes.MOVIE, weight: 0.4 },
    ]
    const random = Math.random()
    let accumulatedWeight = 0
    for (const { type, weight } of weightedTypes) {
      accumulatedWeight += weight
      if (random < accumulatedWeight) return type
    }
    return AnimeTypes.TV
  }

  /**
   * Selects a random title template from predefined options.
   *
   * @returns {string} A randomly selected title template
   */
  const getRandomTitleTemplate = (): string => {
    const templates = [
      'Top {limit} {filters}',
      'The Best of {filters}',
      'Explore the World of {filters}',
      'Uncover the Best {filters}',
      '{limit} Must-Watch {filters}',
      'Your Guide to {filters}',
      "{filters} You Can't Miss",
      'The Ultimate {filters} List',
      'Discover {filters}',
      'Featured {filters}',
      'Best {filters} Selection',
      'Amazing {filters}',
    ]
    return templates[getRandomNumber(0, templates.length - 1)]
  }

  /**
   * Generates URL parameters and title based on applied filters.
   *
   * @param {AnimeFilters[]} appliedFilters - Array of filters to apply
   * @returns {FilterResult} Object containing URL parameters and formatted title
   */
  const generateUrlAndTitle = (
    appliedFilters: AnimeFilters[]
  ): FilterResult => {
    const filterParams: Record<string, string>[] = []
    const titleParts: string[] = []

    appliedFilters.forEach((filter) => {
      switch (filter) {
        case AnimeFilters.Type: {
          const type = getRandomType()
          filterParams.push({ type_filter: type })
          titleParts.push(type === AnimeTypes.TV ? 'TV Shows' : 'Movies')
          break
        }
        case AnimeFilters.Genre: {
          const genre = genres[getRandomNumber(0, genres.length - 1)]
          filterParams.push({ genre_filter: genre })
          titleParts.push(`${genre} Anime`)
          break
        }
        case AnimeFilters.Status: {
          const status =
            getRandomNumber(0, 1) === 0 ? 'Finished Airing' : 'Currently Airing'
          filterParams.push({ status_filter: status })
          titleParts.push(
            status === 'Currently Airing' ? 'Airing Now' : 'Complete Series'
          )
          break
        }
        default:
          console.warn(`Unhandled filter: ${filter}`)
      }
    })

    if (titleParts.length === 0) {
      titleParts.push('Anime')
    }

    const queryParams = filterParams
      .map((filter) =>
        Object.entries(filter)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&')
      )
      .join('&')

    const template = getRandomTitleTemplate()
    const filtersText = titleParts.join(' ')
    const title = capitalizeTitle(
      template
        .replace('{limit}', limit.toString())
        .replace('{filters}', filtersText)
    )

    const baseUrl = `/animes?limit_count=${limit}&parental_control=${parentalControl}`
    const finalUrl = queryParams ? `${baseUrl}&${queryParams}` : baseUrl

    return {
      url: finalUrl,
      title,
    }
  }

  const appliedFilters = getRandomFilters()
  return generateUrlAndTitle(appliedFilters)
}
