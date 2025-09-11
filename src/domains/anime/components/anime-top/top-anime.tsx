import { AnimeTopItem } from 'domains/anime/components/anime-top/anime-top-item'
import { AnimeTopHeader } from 'domains/anime/components/anime-top/header'
import { AnimeTopLoader } from 'domains/anime/components/anime-top/top-anime-loader'
import { useFetch } from '@hooks/useFetch'
import type { AnimeTopInfo } from 'types'

/**
 * AnimeTop component displays the list of top anime.
 *
 * @description This component fetches and displays a ranked list of top anime based on score.
 * It manages the loading state and handles the API request to retrieve anime data.
 * The component uses the useFetch hook to efficiently retrieve anime data from the API
 * with specific parameters for ordering, limiting, and filtering the results.
 *
 * The component displays a loading skeleton during the data fetching process to improve
 * user experience. Once data is loaded, it renders a responsive grid layout containing
 * ranked anime items, each displaying details such as title, image, score, and genres.
 *
 * The UI adapts to different screen sizes with appropriate grid layouts - single column
 * on mobile devices and dual columns on larger screens. Each anime entry is displayed
 * using the AnimeTopItem component which provides a consistent and visually appealing
 * presentation of anime information.
 *
 * @returns {JSX.Element} The rendered top anime section with header and list of ranked anime items
 *
 * @example
 * <AnimeTop />
 */
export const AnimeTop = () => {
  const { data: anime, loading } = useFetch<AnimeTopInfo[]>({
    url: '/api/animes?order_by=score&limit_count=10&type_filter=tv&banner_filter=false&format=top-anime',
  })

  if (loading || !anime) return <AnimeTopLoader />

  return (
    <section className="fade-out relative mx-auto w-full justify-center">
      <AnimeTopHeader />
      <ul className="mx-auto grid grid-cols-1 justify-around gap-y-4 px-4 py-4 md:px-20 xl:grid-cols-2 xl:gap-x-12">
        {anime.map((anime, index) => (
          <AnimeTopItem key={anime.mal_id} anime={anime} index={index} />
        ))}
      </ul>
    </section>
  )
}
