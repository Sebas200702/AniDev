import type { AnimeEpisode } from '@watch/types'
import { AnimeEpisodes } from 'domains/watch/components/episodes/anime-episodes'
import { NextPrevEpisodeBtn } from 'domains/watch/components/episodes/next-prev-episode-btn'

interface EpisodesListProps {
  episodes: AnimeEpisode[]
  episodesLength: number
  currentEpisode: number
  duration: string
  slug: string
  image_webp: string
  title: string
  image_large_webp: string
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

/**
 * Episodes List View Component (Presentational)
 * 
 * Displays navigation buttons and episodes grid
 */
export const EpisodesList = ({
  episodes,
  episodesLength,
  currentEpisode,
  duration,
  slug,
  image_webp,
  title,
  image_large_webp,
  currentPage,
  totalPages,
  onPageChange,
}: EpisodesListProps) => {
  return (
    <div className="mb-10 rounded-lg bg-[#1c1c1c] p-4 xl:mt-0">
      <div
        className={`flex justify-between ${
          currentEpisode === 1 ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <NextPrevEpisodeBtn
          episodesLength={episodesLength}
          currentEpisode={currentEpisode}
          action="Previous"
          slug={slug ?? ''}
        />
        <NextPrevEpisodeBtn
          episodesLength={episodesLength}
          currentEpisode={currentEpisode}
          action="Next"
          slug={slug ?? ''}
        />
      </div>
      <div className="relative mx-auto flex h-full xl:w-96">
        <AnimeEpisodes
          episodes={episodes}
          slug={title}
          image_webp={image_large_webp ?? image_webp}
          currentEpisode={currentEpisode}
          duration={duration}
          page={currentPage}
          totalPages={totalPages}
          handlePageChange={onPageChange}
        />
      </div>
    </div>
  )
}
