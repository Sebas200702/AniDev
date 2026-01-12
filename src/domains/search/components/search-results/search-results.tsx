import { AnimeCard } from '@anime/components/anime-card/anime-card'
import type { AnimeCardInfo } from '@anime/types'
import { CharacterCard } from '@character/components/character-card/character-card'
import type { Character } from '@character/types'
import { MusicCard } from '@music/components/music-card/music-card'
import type { AnimeSong } from '@music/types'
import { toast } from '@pheralb/toast'
import { LoadingCard } from '@search/components/search-results/loading-card'
import { NotResultsFound } from '@search/components/search-results/not-results-found'
import { SearchResultsLoader } from '@search/components/search-results/serch-results-loader'
import { useSearchStoreResults } from '@search/stores/search-results-store'
import { SearchType } from '@search/types'
import { ToastType } from '@shared/types'
import { useEffect } from 'react'

/**
 * SearchResults component displays search results for anime, music, and characters based on user queries and filters.
 *
 * @description
 * This component manages the display state of search results, including loading animations and transitions.
 * It shows appropriate UI elements based on the current search state - loading indicators while fetching,
 * "not found" messages when no results match, and a responsive grid of cards when results are available.
 *
 * The component supports three types of search results:
 * - Anime: Displays AnimeCard components in a responsive grid
 * - Music: Displays MusicCard components for anime songs
 * - Characters: Displays CharacterCard components for anime characters
 *
 * The component implements a fade-in animation to smoothly transition results into view once they're loaded.
 * It tracks completion state to ensure loading indicators remain visible until the search process is fully
 * complete, providing a better user experience during search operations.
 *
 * The UI adapts to different screen sizes with a responsive grid layout that displays more columns on
 * larger screens. During search operations, a skeleton loader is shown to maintain UI consistency and
 * indicate activity to the user.
 *
 * @returns {JSX.Element} The rendered search results component showing either loading state, no results message, or result cards
 *
 * @example
 * <SearchResults />
 */
export const SearchResults = () => {
  const {
    results,
    isLoadingMore,
    loading,
    query,
    appliedFilters,
    totalResults,
    currentType,
  } = useSearchStoreResults()

  const renderLoadingCards = () => {
    if (!isLoadingMore) return null

    const remainingResults = totalResults - (results?.length || 0)
    const loadingCardsCount = Math.min(remainingResults, 10)

    return Array(loadingCardsCount)
      .fill(0)
      .map((_, index) => <LoadingCard key={`loading-card-${index + 1}`} />)
  }

  useEffect(() => {
    if (results?.length === 0 && (query || appliedFilters) && !loading) {
      toast[ToastType.Warning]({
        text: `No results found for "${query}" with the selected filters.`,
      })
    }
  }, [results, query, appliedFilters, loading])

  useEffect(() => {
    if (results?.length || (!results?.length && !loading)) {
      const $searchCards = document.querySelectorAll(
        '.anime-card, .character-card, .music-card'
      )
      $searchCards.forEach((card) => {
        card.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 500,
          easing: 'ease-in-out',
          fill: 'forwards',
        })

        setTimeout(() => {
          card.classList.remove('anime-card', 'character-card', 'music-card')
        }, 700)
      })
    }
  }, [results, loading])

  if ((!results && loading) || loading) {
    return <SearchResultsLoader />
  }

  if (results?.length === 0 && (query || appliedFilters) && !loading)
    return <NotResultsFound />

  const isAnimeData = (data: any[]): data is AnimeCardInfo[] => {
    return data.length > 0 && 'mal_id' in data[0] && 'title' in data[0]
  }

  const isMusicData = (data: any[]): data is AnimeSong[] => {
    return data.length > 0 && 'theme_id' in data[0]
  }

  const isCharacterData = (data: any[]): data is Character[] => {
    return (
      data.length > 0 &&
      'character_id' in data[0] &&
      'character_name' in data[0]
    )
  }

  const renderSearchResults = () => {
    if (!results) return null

    if (currentType === SearchType.MUSIC && isMusicData(results)) {
      return results.map((song) => (
        <MusicCard key={song.theme_id} song={song} />
      ))
    }

    if (currentType === SearchType.CHARACTERS && isCharacterData(results)) {
      return results.map((character) => (
        <CharacterCard
          key={`${character.character_id}_${character.voice_actor_id}`}
          character={character}
        />
      ))
    }

    if (currentType === SearchType.ANIMES && isAnimeData(results)) {
      return results.map((anime) => (
        <AnimeCard key={anime.mal_id} anime={anime} />
      ))
    }

    return null
  }

  return (
    <ul
      className={`grid w-full grid-cols-2 gap-6 p-4 transition-opacity duration-500 md:grid-cols-4 md:gap-8 md:px-20 xl:grid-cols-6 xl:px-30`}
    >
      {renderSearchResults()}
      {isLoadingMore && renderLoadingCards()}
    </ul>
  )
}
