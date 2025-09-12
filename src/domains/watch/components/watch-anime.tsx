import { EpisodesList } from 'domains/watch/components/episodes-list'
import { Footer } from 'domains/watch/components/footer'
import { Player } from 'domains/watch/components/player'
import { useState } from 'react'
import type { Anime, AnimeEpisode } from 'types'

interface Props {
  slug: string
  currentEpisode: number
}

export const WatchAnime = ({ slug, currentEpisode }: Props) => {
  const [animeData] = useState<Anime>()
  const [episodeData] = useState<AnimeEpisode>()

  return (
    <section className="mx-auto mt-20 flex h-min w-full flex-col justify-center gap-20 overflow-hidden p-4 md:px-20 xl:max-h-[calc(100dvh-80px)] xl:w-full xl:flex-row">
      <div className="mb-10 flex aspect-[16/9] w-full flex-col gap-5 md:relative md:mb-44 md:max-w-full xl:max-h-[calc(100dvh-80px)]">
        <Player />

        <Footer
          title={animeData?.title ?? ''}
          episode={currentEpisode}
          episodeTitle={episodeData?.title}
          episodeDescription={episodeData?.description}
        />
      </div>

      <EpisodesList
        episodesLength={animeData?.episodes ?? 0}
        currentEpisode={currentEpisode}
        duration={animeData?.duration ?? ''}
        slug={slug}
        mal_id={animeData?.mal_id ?? 0}
        image_webp={animeData?.image_webp ?? ''}
        title={animeData?.title ?? ''}
        image_large_webp={animeData?.image_large_webp ?? ''}
      />
    </section>
  )
}
