import { AnimeFilters, AnimeGenres, AnimeTypes } from 'types'

const getRandomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min

interface FilterResult {
  url: string
  title: string
}

const unpopularGenres = [AnimeGenres.EROTICA, AnimeGenres.BOYS_LOVE]

const getPopularGenres = (): AnimeGenres[] => {
  return Object.values(AnimeGenres).filter(
    (genre) => !unpopularGenres.includes(genre)
  )
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
 *
 * @description This function generates a URL with query parameters and a corresponding title
 * based on randomly selected anime filters. It supports various filter types including genre,
 * type (TV/Movie), year, and status. The function uses weighted randomization to prioritize
 * certain filter combinations for better user experience. The generated title is formatted
 * using templates that make the collections more engaging and descriptive.
 *
 * The function employs several helper methods to:
 * - Select random filters from available options
 * - Choose anime types with weighted preferences
 * - Generate appealing title templates
 * - Apply filters and create corresponding URL parameters
 *
 * @param {number} [limit=6] - The maximum number of anime items to fetch
 * @returns {FilterResult} An object containing the generated URL query string and formatted title
 *
 * @example
 * createDynamicUrl(10)
 * // Might return: { url: "limit_count=10&genre_filter=action&type_filter=movie", title: "Top 10 Action Movies" }
 */
export const createDynamicUrl = (limit = 6): FilterResult => {
  const genres = getPopularGenres()

  const getRandomFilters = (count: number): AnimeFilters[] => {
    const validFilters = [
      AnimeFilters.Status,
      AnimeFilters.Year,
      AnimeFilters.Type,
      AnimeFilters.Genre,
    ]
    const selectedFilters = new Set<AnimeFilters>()
    while (selectedFilters.size < count) {
      const randomFilter =
        validFilters[getRandomNumber(0, validFilters.length - 1)]
      selectedFilters.add(randomFilter)
    }
    return Array.from(selectedFilters)
  }

  const getRandomType = (): AnimeTypes => {
    const weightedTypes = [
      { type: AnimeTypes.MOVIE, weight: 0.7 },
      { type: AnimeTypes.TV, weight: 0.3 },
    ]
    const random = Math.random()
    let accumulatedWeight = 0
    for (const { type, weight } of weightedTypes) {
      accumulatedWeight += weight
      if (random < accumulatedWeight) return type
    }
    return AnimeTypes.TV
  }

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
      'Find the Top {filters} Anime',
      'Step Into the World of {filters}',
    ]
    return templates[getRandomNumber(0, templates.length - 1)]
  }

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
        case AnimeFilters.Year: {
          const currentYear = new Date().getFullYear()
          const minYear = currentYear - 40
          const year = getRandomNumber(minYear, currentYear)
          filterParams.push({ year_filter: year.toString() })
          titleParts.push(`from ${year}`)
          break
        }
        case AnimeFilters.Status: {
          const currentYear = new Date().getFullYear()
          const minClassicYear = currentYear - 10
          const status =
            getRandomNumber(0, 1) === 0 ? 'Finished Airing' : 'Currently Airing'
          if (status === 'Currently Airing') {
            const yearFilterIndex = filterParams.findIndex((param) =>
              param.hasOwnProperty('year_filter')
            )
            if (yearFilterIndex !== -1) {
              filterParams.splice(yearFilterIndex, 1)
              titleParts.splice(
                titleParts.findIndex((part) => part.startsWith('from')),
                1
              )
            }
            titleParts.push('Airing Now')
          } else {
            const yearFilter = filterParams.find((param) =>
              param.hasOwnProperty('year_filter')
            )
            const isClassic = yearFilter
              ? parseInt(yearFilter.year_filter) <= minClassicYear
              : false
            titleParts.push(isClassic ? 'Classic' : 'Finished Airing')
          }
          filterParams.push({ status_filter: status })
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

    return {
      url: `limit_count=${limit}&${queryParams}`,
      title,
    }
  }

  const appliedFilters = getRandomFilters(getRandomNumber(1, 2))
  return generateUrlAndTitle(appliedFilters)
}
