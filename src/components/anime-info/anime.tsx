import { useEffect, useState } from 'react'

import type { Anime } from 'types'
import { AnimeAside } from '@components/anime-info/anime-aside'
import { AnimeBanner } from '@components/anime-info/anime-banner'
import { AnimeDetails } from '@components/anime-info/anime-details'
import { AnimeHeader } from '@components/anime-info/anime-header'
import { AnimeLoader } from '@components/anime-info/anime-loader'
import { AnimeShowBox } from '@components/anime-info/anime-show-box'
import { CreateMetaDatas } from '@components/create-meta-datas'
import { baseTitle } from '@utils/base-url'
import { normalizeString } from '@utils/normalize-string'

/**
 * AnimeInfo component serves as the main container for all anime-related information and displays it.
 *
 * @description This component fetches and displays comprehensive anime data based on the provided slug.
 * It manages loading states and handles the API request to retrieve anime details. Upon successful data
 * retrieval, it organizes the information into a structured layout with various specialized components.
 *
 * The component creates a visually appealing presentation with a banner at the top, followed by a grid
 * layout containing the anime's image, metadata, trailer, and detailed information. During the loading
 * phase, a skeleton loader is displayed to improve user experience.
 *
 * The component also prepares metadata for SEO optimization and generates URLs for watching and sharing
 * the anime. The responsive layout adjusts based on screen size, providing an optimal viewing experience
 * across devices.
 *
 * @param {Props} props - The component props
 * @param {string} props.slug - The slug of the anime to fetch and display
 * @returns {JSX.Element} The rendered anime information page with all components
 *
 * @example
 * <AnimeInfo slug="my-hero-academia_31964" />
 */
interface Props {
  slug: string
}

export const AnimeInfo = ({ slug }: Props) => {
  const [animeData, setAnimeData] = useState<Anime>()

  const getAnimeData = async (slug: string) => {
    try {
      const response = await fetch(`/api/getAnime?slug=${slug}`, {
        cache: 'force-cache',
      })

      if (response.status === 404) {
        window.location.href = '/404'
      }

      const animeData = await response.json().then((data) => data.anime)

      setAnimeData(animeData)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAnimeData(slug)
  }, [])

  if (!animeData) return <AnimeLoader />

  const url = `/anime/${normalizeString(animeData.title)}_${animeData.mal_id}`

  const watchNowUrl = `/watch/${normalizeString(animeData.title)}_${animeData.mal_id}`
  const shareText = `Watch ${animeData.title} on AniDev`
  const seoTitle = `${animeData.title} -  ${baseTitle}`

  return (
    <>
      <CreateMetaDatas
        title={seoTitle}
        description={animeData.synopsis ?? 'No description available'}
        image={animeData.image_large_webp}
      />
      <AnimeBanner
        banner_image={animeData.banner_image}
        image_large_webp={animeData.image_large_webp}
        title={animeData.title}
      />

      <article className="z-10 -mt-[60dvh] grid grid-cols-1 gap-8 px-4 md:-mt-54 md:grid-cols-3 md:gap-15 md:px-20 xl:grid-cols-5">
        <AnimeAside
          animeData={animeData}
          watchNowUrl={watchNowUrl}
          shareText={shareText}
          url={url}
        />

        <AnimeHeader animeData={animeData} />

        <div className="row-span-2 md:col-span-2 xl:col-span-3">
          <AnimeShowBox
            trailer_url={animeData.trailer_url}
            banner_image={animeData.banner_image}
            image_large_webp={animeData.image_large_webp}
            title={animeData.title}
            synopsis={animeData.synopsis}
          />
        </div>

        <AnimeDetails animeData={animeData} />
      </article>
    </>
  )
}
