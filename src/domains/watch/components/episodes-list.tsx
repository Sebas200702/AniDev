import { AnimeEpisodes } from 'domains/watch/components/episodes/anime-episodes'
import { NextPrevEpisodeBtn } from 'domains/watch/components/episodes/next-prev-episode-btn'

interface Props {
  episodesLength: number
  currentEpisode: number
  duration: string
  mal_id: number
  slug: string
  image_webp: string
  title: string

  image_large_webp: string
}

export const EpisodesList = ({
  episodesLength,
  currentEpisode,
  duration,
  mal_id,
  slug,
  image_webp,
  title,
  image_large_webp,
}: Props) => {
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
          totalEpisodes={episodesLength}
          mal_id={mal_id}
          slug={title}
          image_webp={image_large_webp ?? image_webp}
          currentEpisode={currentEpisode}
          duration={duration}
        />
      </div>
    </div>
  )
}
