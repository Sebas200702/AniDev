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
 * @param {Object} props - The props for the component.
 * @param {string} props.slug - The slug of the anime to fetch and display.
 */
interface Props {
  slug: string
}

/**
 * AnimeInfo component represents an anime entity.
 *
 * This component fetches and displays anime data based on the provided slug.
 */
export const AnimeInfo = ({ slug }: Props) => {
  const [animeData, setAnimeData] = useState<Anime>()

  const getAnimeData = async (slug: string) => {
    try {
      const animeData = await fetch(`/api/getAnime?slug=${slug}`, {
        cache: 'force-cache',
      })
        .then((res) => res.json())
        .then((data) => data.anime)
      setAnimeData(animeData)
    } catch (error) {
      console.error('Error al obtener los datos del anime:', error)
      return null
    }
  }

  useEffect(() => {
    getAnimeData(slug)
  }, [])

  if (!animeData) return <AnimeLoader />

  const url = `/${normalizeString(animeData.title)}_${animeData.mal_id}`

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

      <article className="z-10 -mt-96 grid grid-cols-1 gap-4 px-4 md:-mt-54 md:grid-cols-3 md:gap-15 md:px-20 xl:grid-cols-5">
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
