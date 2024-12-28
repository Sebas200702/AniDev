import { AnimeFilters, AnimeGenres, AnimeTypes } from 'types'
const getRandomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min

export const createDynamicBannersUrl = (limit = 6): string => {
  const filters = Object.values(AnimeFilters) // Usamos los valores de la enum AnimeFilters.
  const types = Object.values(AnimeTypes)
  const genres = Object.values(AnimeGenres)

  const getRandomFilters = (count: number): AnimeFilters[] => {
    const selectedFilters = new Set<AnimeFilters>()
    while (selectedFilters.size < count) {
      const randomFilter = filters[
        getRandomNumber(0, filters.length - 1)
      ] as AnimeFilters
      if (
        randomFilter === AnimeFilters.Status ||
        randomFilter === AnimeFilters.Year ||
        randomFilter === AnimeFilters.Type ||
        randomFilter === AnimeFilters.Genre
      ) {
        selectedFilters.add(randomFilter)
      }
    }
    return Array.from(selectedFilters)
  }

  const generateUrl = (appliedFilters: AnimeFilters[]): string => {
    const filterObjects: Record<string, string>[] = []

    appliedFilters.forEach((filter) => {
      switch (filter) {
        case AnimeFilters.Type: {
          const type = types[getRandomNumber(0, types.length - 1)]
          if (type === AnimeTypes.TV || type === AnimeTypes.MOVIE) {
            filterObjects.push({ type_filter: type })
          }
          break
        }
        case AnimeFilters.Genre: {
          const genre = genres[getRandomNumber(0, genres.length - 1)]
          filterObjects.push({ genre_filter: genre })
          break
        }
        case AnimeFilters.Year: {
          const year = getRandomNumber(1990, 2022).toString()
          filterObjects.push({ year_filter: year })
          break
        }
        case AnimeFilters.Status: {
          const status =
            getRandomNumber(0, 1) === 0 ? 'Currently Airing' : 'Finished Airing'
          filterObjects.push({ status_filter: status })
          break
        }
        default:
          console.warn(`Unhandled filter: ${filter}`)
      }
    })

    const queryParams = filterObjects
      .map((filter) =>
        Object.entries(filter)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&')
      )
      .join('&')

    return `/api/animes?limit_count=${limit}&${queryParams}&banners_filter=true`
  }

  const appliedFilters = getRandomFilters(getRandomNumber(1, 2))
  return generateUrl(appliedFilters)
}
