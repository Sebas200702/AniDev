import { AnimeFilters, AnimeGenres, AnimeTypes } from 'types'
import { isFailedUrl } from '@utils/failed-urls-cache'

/**
 * Server-side utility for creating dynamic URLs with intelligent cache checking.
 * This version uses Redis to avoid generating known failed URL combinations.
 */

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
]

// Géneros menos populares que pueden generar menos resultados
const lessPopularGenres = [
  AnimeGenres.GOURMET,
  AnimeGenres.HORROR,
  AnimeGenres.MYSTERY,
  AnimeGenres.SCI_FI,
  AnimeGenres.SUSPENSE,
  AnimeGenres.AVANT_GARDE,
  AnimeGenres.AWARD_WINNING,
  AnimeGenres.ECCHI
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
 * @param {string} text - The text to be formatted in title case
 * @returns {string} The formatted text in proper title case
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
 * Creates a dynamic URL with Redis cache checking for server-side use.
 *
 * @description This function generates URLs that are checked against a Redis cache
 * of known failed combinations. It attempts multiple times to generate a URL that
 * is not in the failed cache.
 *
 * @param {number} [limit=6] - The maximum number of anime items to fetch
 * @param {boolean} [parentalControl=true] - Whether to apply parental control filters
 * @param {number} [maxAttempts=5] - Maximum attempts to generate a non-failed URL
 * @returns {Promise<FilterResult>} An object containing the generated URL query string and formatted title
 */
export const createDynamicUrlServer = async (
  limit = 6,
  parentalControl = true,
  maxAttempts = 5
): Promise<FilterResult> => {
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

    const randomFilter = validFilters[getRandomNumber(0, validFilters.length - 1)]
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
          const status = getRandomNumber(0, 1) === 0 ? 'Finished Airing' : 'Currently Airing'
          filterParams.push({ status_filter: status })
          titleParts.push(status === 'Currently Airing' ? 'Airing Now' : 'Complete Series')
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

    const baseUrl = `limit_count=${limit}&parental_control=${parentalControl}`
    const finalUrl = queryParams ? `${baseUrl}&${queryParams}` : baseUrl

    return {
      url: finalUrl,
      title,
    }
  }

  // Intenta generar una URL que no esté en la cache de fallidas
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const appliedFilters = getRandomFilters()
    const result = generateUrlAndTitle(appliedFilters)

    // Verifica si esta URL ya está marcada como fallida
    const isFailed = await isFailedUrl(result.url)

    if (!isFailed) {
      return result
    }

    // Si es el último intento, devuelve la URL sin importar si está en cache
    if (attempt === maxAttempts) {
      return result
    }
  }

  // Fallback (no debería llegar aquí, pero por seguridad)
  const fallbackFilters: AnimeFilters[] = []
  return generateUrlAndTitle(fallbackFilters)
}
