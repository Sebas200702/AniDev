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

// Capitaliza correctamente las palabras en los títulos
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

export const createDynamicUrl = (limit = 6): FilterResult => {
  const filters = Object.values(AnimeFilters)
  const types = Object.values(AnimeTypes)
  const genres = getPopularGenres()

  // Selecciona filtros aleatorios
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

  // Aumentar probabilidad de seleccionar películas
  const getRandomType = (): AnimeTypes => {
    const weightedTypes = [
      { type: AnimeTypes.MOVIE, weight: 0.7 }, // 70% probabilidad de películas
      { type: AnimeTypes.TV, weight: 0.3 }, // 30% probabilidad de series de TV
    ]
    const random = Math.random()
    let accumulatedWeight = 0
    for (const { type, weight } of weightedTypes) {
      accumulatedWeight += weight
      if (random < accumulatedWeight) return type
    }
    return AnimeTypes.TV // Valor predeterminado
  }

  // Variaciones de títulos
  const getRandomTitleTemplate = (): string => {
    const templates = [
      'Top {limit} {filters}',
      'The Best of {filters}',
      'Explore the World of {filters}',
      'Uncover the Best {filters}',
      '{limit} Must-Watch {filters}',
      'Your Guide to {filters}',
      '{filters} You Can’t Miss',
      'The Ultimate {filters} List',
      'Discover {filters}',
      'Find the Top {filters} Anime',
      'Step Into the World of {filters}',
    ]
    return templates[getRandomNumber(0, templates.length - 1)]
  }

  // Genera el título y la URL basado en los filtros aplicados
  const generateUrlAndTitle = (
    appliedFilters: AnimeFilters[]
  ): FilterResult => {
    const filterParams: Record<string, string>[] = []
    const titleParts: string[] = []

    appliedFilters.forEach((filter) => {
      switch (filter) {
        case AnimeFilters.Type: {
          const type = getRandomType() // Usar el método con mayor probabilidad para películas
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
          const year = getRandomNumber(minYear, currentYear) // Rango ajustado a los últimos 40 años
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
            // Evita años inconsistentes para "Currently Airing"
            const yearFilterIndex = filterParams.findIndex((param) =>
              param.hasOwnProperty('year_filter')
            )
            if (yearFilterIndex !== -1) {
              filterParams.splice(yearFilterIndex, 1) // Elimina el filtro de año si es inconsistente
              titleParts.splice(
                titleParts.findIndex((part) => part.startsWith('from')),
                1
              )
            }
            titleParts.push('Airing Now')
          } else {
            // Si el anime es "Finished Airing", revisa si es "Classic"
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

    // Aseguramos que el título siempre sea válido
    if (titleParts.length === 0) {
      titleParts.push('Anime') // Si no hay filtros aplicados, usamos un título genérico
    }

    const queryParams = filterParams
      .map((filter) =>
        Object.entries(filter)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&')
      )
      .join('&')

    // Generar título usando una plantilla dinámica
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
