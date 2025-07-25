import { navigate } from 'astro:transitions/client'
import { AnimeDetailCard } from '@components/anime-info/anime-detail-card'
import { AnimeCharacterCard } from '@components/characters/detail-character-card'
import { SearchIcon } from '@components/icons/search-icon'
import { AnimeMusicItem } from '@components/music/anime-music-item'
import { FilterDropdown } from '@components/search/filters/filter-dropdown'
import { useDebounce } from '@hooks/useDebounce'
import { useFetch } from '@hooks/useFetch'
import { useModal } from '@hooks/useModal'
import { useShortcuts } from '@hooks/useShortCuts'
import { toast } from '@pheralb/toast'
import { useGlobalUserPreferences } from '@store/global-user'
import { useSearchStoreResults } from '@store/search-results-store'
import { deleteSearchHistory } from '@utils/delete-search-history'
import { createFiltersToApply } from '@utils/filters-to-apply'
import { loadSearchHistory } from '@utils/load-search-history'
import { normalizeString } from '@utils/normalize-string'
import { saveSearchHistory } from '@utils/save-search-history'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  type AnimeSongWithImage,
  type Character,
  SearchType,
  ToastType,
  shortCuts,
} from 'types'
import { type AnimeCardInfo, type AnimeDetail, typeSearchOptions } from 'types'

export const SearchBar = ({ visible = true }: { visible?: boolean }) => {
  const { closeModal, openModal } = useModal()
  const {
    query,
    setQuery,
    setLoading,
    appliedFilters,
    results,
    setResults,
    setUrl,
    setTotalResults,
    addSearchHistory,
    setSearchHistoryIsOpen,
    setCurrentType,
    searchHistory,
    currentType,
    clearSearchHistory,
    setSearchHistory,
    setAppliedFilters,
  } = useSearchStoreResults()
  const { parentalControl, userInfo, trackSearchHistory } =
    useGlobalUserPreferences()
  const debouncedQuery = useDebounce(query, 900)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtersToApply = useMemo(
    () => createFiltersToApply(appliedFilters),
    [appliedFilters]
  )

  const defaultFiltersAnimes = `limit_count=30&banners_filter=false&format=search&parental_control=${parentalControl}`
  const defaultFiltersMusic = 'limit_count=30'
  const defaultFiltersCharacters = 'limit_count=30&language_filter=japanese'

  const url = useMemo(() => {
    const defautlFilters =
      currentType === SearchType.ANIMES
        ? defaultFiltersAnimes
        : currentType === SearchType.MUSIC
          ? defaultFiltersMusic
          : defaultFiltersCharacters

    const baseQuery = `/api/${currentType}?${defautlFilters}`
    const searchQuery = debouncedQuery ? `&search_query=${debouncedQuery}` : ''
    const filterQuery = filtersToApply ? `&${filtersToApply}` : ''
    return `${baseQuery}${searchQuery}${filterQuery}`
  }, [debouncedQuery, filtersToApply, parentalControl, currentType])

  const actionMap = {
    'close-search': () => closeModal(),
    'open-search': () => openModal(SearchBar),

    'navigate-profile': () => navigate('/profile'),
    'navigate-home': () => navigate('/'),
    'navigate-settings': () => navigate('/profile/settings'),
    'random-anime': () => {
      const handleClick = async () => {
        const result = await fetch('/api/animes/random').then((res) =>
          res.json()
        )

        navigate(`/anime/${normalizeString(result.title)}_${result.mal_id}`)
      }
      handleClick()
    },
    'open-search-history': async () => {
      if (window.location.pathname !== '/search') {
        await navigate('/search')
      }
      setSearchHistoryIsOpen(true)
    },
    'clear-search-history': () => {
      clearSearchHistory()

      toast[ToastType.Success]({
        text: 'Search history cleared successfully',
      })
      if (!trackSearchHistory) return
      deleteSearchHistory(userInfo)
    },
  }
  useShortcuts(shortCuts, actionMap)

  const {
    data,
    loading: isLoading,
    total,
    error: fetchError,
  } = useFetch<AnimeCardInfo[] | AnimeSongWithImage[] | Character[]>({
    url,
    skip: !url || (!filtersToApply && !debouncedQuery),
  })
  const {
    data: animesFull,
    loading: isLoadingFull,
    error: fetchErrorFull,
  } = useFetch<AnimeDetail[] | AnimeSongWithImage[] | Character[]>({
    url: `${url.replace('format=search', 'format=anime-detail').replace('30', '7')}`,
    skip: !url || (!filtersToApply && !debouncedQuery),
  })

  useEffect(() => {
    setUrl(url)
  }, [url])

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      }
    },
    [query]
  )

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
      setLoading(true)
    },
    [setQuery, setLoading]
  )
  useEffect(() => {
    if (data?.length === 0 && (query || appliedFilters) && !isLoading) {
      toast[ToastType.Warning]({
        text: `No results found for "${query}" with the selected filters.`,
      })
    }
  }, [data, appliedFilters, isLoading])

  useEffect(() => {
    if (!query) {
      setLoading(false)
    }
  }, [query])

  useEffect(() => {
    setLoading(isLoading)
    if (isLoading || (!query && !appliedFilters) || !data) return
    setResults(data, false, fetchError)

    setTotalResults(total)
    const newHistory = {
      query,
      appliedFilters,
      totalResults: total,
    }
    addSearchHistory(newHistory)
  }, [
    data,
    isLoading,
    fetchError,
    setResults,
    setLoading,
    setTotalResults,
    addSearchHistory,
  ])
  useEffect(() => {
    setAppliedFilters({})
  }, [currentType])

  useEffect(() => {
    if (
      !searchHistory ||
      searchHistory.length === 0 ||
      !trackSearchHistory ||
      (!query && !appliedFilters)
    )
      return
    saveSearchHistory(searchHistory, userInfo)
  }, [searchHistory, trackSearchHistory, query, appliedFilters])

  useEffect(() => {
    if (!trackSearchHistory || (!query && !appliedFilters)) return
    loadSearchHistory(userInfo).then((history) => {
      setSearchHistory(history)
    })
  }, [trackSearchHistory, query, appliedFilters])

  const isAnimeData = (data: any[]): data is AnimeDetail[] => {
    return data.length > 0 && 'mal_id' in data[0] && 'title' in data[0]
  }

  const isCharacterData = (data: any[]): data is Character[] => {
    return data.length > 0 && 'mal_id' in data[0] && 'character_name' in data[0]
  }

  const isMusicData = (data: any[]): data is AnimeSongWithImage[] => {
    return data.length > 0 && 'song_id' in data[0]
  }

  if (!visible) return null

  return (
    <>
      <form
        id="search-bar"
        role="search"
        onSubmit={handleSubmit}
        className="relative mt-24 flex w-full max-w-xl flex-col gap-6 shadow-lg"
      >
        <header className="flex items-center justify-between">
          <div className="hidden gap-4 text-gray-300 select-none md:flex">
            For quick access:{' '}
            <kbd className="kbd bg-Primary-950 rounded-xs px-3">Ctrl</kbd> +{' '}
            <kbd className="kbd bg-Primary-950 rounded-xs px-3">K</kbd>
          </div>

          {Object.keys(appliedFilters).length > 0 && (
            <strong className="text-gray-300">
              {Object.keys(appliedFilters).length}{' '}
              {Object.keys(appliedFilters).length === 1 ? 'filter' : 'filters'}{' '}
              applied
            </strong>
          )}

          <FilterDropdown
            options={typeSearchOptions}
            label="Type"
            values={[currentType]}
            onChange={(values) => {
              setCurrentType(values[0] as SearchType)
            }}
            onClear={() => {}}
            styles="max-w-40 w-full"
            singleSelect={true}
            InputText={false}
          />
        </header>

        <div className="bg-Primary-950 flex items-center rounded-md px-4 py-2">
          <input
            ref={inputRef}
            type="search"
            id="default-search"
            className="h-full min-h-9 w-full text-sm text-white placeholder-gray-400 focus:outline-none"
            placeholder={`Search ${currentType}...`}
            value={query}
            autoComplete="off"
            onChange={handleInput}
          />
          <button
            type="submit"
            aria-label="Search"
            className="flex h-8 w-8 transform items-center justify-center"
          >
            <SearchIcon className="h-5 w-5 text-white" />
          </button>
        </div>
      </form>
      <div
        className={`no-scrollbar no-scrollbar bg-Primary-950 relative flex h-full max-h-96 w-full max-w-xl flex-col gap-4 overflow-x-hidden overflow-y-scroll rounded-md p-4 shadow-lg ${(isLoading || results) && query ? 'h-full opacity-100' : 'h-0 opacity-0'} mt-4 transition-all duration-300`}
      >
        {isLoadingFull &&
          Array.from({ length: 7 }, (_, i) => (
            <div
              key={i + 1}
              className="bg-Complementary mx-auto flex aspect-[100/30] h-full max-h-36 w-full animate-pulse flex-row rounded-lg"
            >
              <div className="aspect-[225/330] h-full animate-pulse rounded-l-lg bg-zinc-800 object-cover object-center transition-all ease-in-out"></div>
            </div>
          ))}

        {!isLoading && results?.length === 0 && (
          <div className="flex h-96 w-full items-center justify-center gap-4 p-2">
            No results found
          </div>
        )}

        {!isLoading &&
        !isLoadingFull &&
        animesFull &&
        currentType === SearchType.ANIMES &&
        isAnimeData(animesFull)
          ? animesFull.map((result) => (
              <AnimeDetailCard key={result.mal_id} anime={result} />
            ))
          : !isLoading &&
              !isLoadingFull &&
              animesFull &&
              currentType === SearchType.MUSIC &&
              isMusicData(animesFull)
            ? animesFull.map((result) => (
                <AnimeMusicItem
                  key={result.song_id}
                  song={result}
                  image={result.image}
                  placeholder={result.placeholder}
                  banner_image={result.banner_image}
                  anime_title={result.anime_title}
                />
              ))
            : !isLoading &&
                !isLoadingFull &&
                animesFull &&
                currentType === SearchType.CHARACTERS &&
                isCharacterData(animesFull)
              ? animesFull.map((result) => (
                  <AnimeCharacterCard
                    key={`${result.character_id}_${result.voice_actor_id}`}
                    character={result}
                  />
                ))
              : null}

        {results &&
          results?.length > 7 &&
          !isLoading &&
          !isLoadingFull &&
          query && (
            <a
              href={`/search?q=${encodeURIComponent(query)}`}
              className="button-primary flex items-center justify-center"
            >
              <h3 className="text-lg font-semibold">See all results</h3>
            </a>
          )}
      </div>
    </>
  )
}
