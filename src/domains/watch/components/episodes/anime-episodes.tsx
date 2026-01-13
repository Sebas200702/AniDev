import { Picture } from '@shared/components/media/picture'
import { Pagination } from '@watch/components/episodes/pagination'
import type { AnimeEpisode } from '@watch/types'

interface Props {
  episodes: AnimeEpisode[]
  slug: string
  image_webp: string
  duration: string
  currentEpisode: number
  page?: number
  totalPages: number
  handlePageChange: (page: number) => void
}

export const AnimeEpisodes = ({
  slug,
  image_webp,
  currentEpisode,
  duration,
  episodes,
  totalPages,
  handlePageChange,
  page,
}: Props) => {
  return (
    <section className="z-10 w-full p-2">
      <ul className="anime-list custom-scrollbar relative grid max-h-[500px] w-full grid-cols-1 gap-4 overflow-y-auto p-2 md:grid-cols-3 md:overflow-y-auto xl:mt-0 xl:max-h-[90%] xl:grid-cols-1 xl:overflow-y-auto">
        {episodes.map(({ episode_id, title, image_url, anime_mal_id }) => (
          <a
            href={`/watch/${slug}_${anime_mal_id}?ep=${episode_id}`}
            className={`group relative flex h-auto w-full flex-col gap-4 rounded-lg p-2 transition-all duration-300 ease-in-out hover:saturate-[.7] md:max-w-[400px] md:hover:scale-[1.01] ${
              currentEpisode === episode_id
                ? 'bg-enfasisColor'
                : 'md:hover:bg-zinc-600'
            }`}
            key={episode_id}
          >
            <Picture
              styles="relative aspect-video h-full w-full object-cover object-center rounded-md overflow-hidden"
              image={image_url || image_webp || '/placeholder.webp'}
              placeholder={image_url || image_webp || '/placeholder.webp'}
              alt={title ?? `Episodio ${episode_id}`}
            />

            <div className="bg-blur-sm absolute bottom-3 left-3 z-10 flex items-center justify-center rounded-sm bg-black/50 px-2.5 py-1.25 text-xs font-bold text-white transition-all duration-300 ease-in-out">
              <span className="text-sm text-white">
                {duration.replace(/\s*per\s*ep/i, '')}
              </span>
            </div>
            <h3 className="text-xl font-bold text-pretty text-white transition-all duration-300 ease-in-out">
              {title ?? `${slug} Episodio ${episode_id}`}
            </h3>
            <span className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-lg font-bold text-white">
              {episode_id}
            </span>
          </a>
        ))}
      </ul>
      <footer
        className={`w-full ${totalPages < 1 || episodes.length === 0 ? 'hidden' : ''}`}
      >
        <Pagination
          totalPages={totalPages}
          initialPage={page ?? 1}
          onPageChange={handlePageChange}
        />
      </footer>
    </section>
  )
}
