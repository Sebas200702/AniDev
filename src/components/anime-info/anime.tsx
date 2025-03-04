import { baseTitle, baseUrl } from '@utils/base-url'
import { useEffect, useState } from 'react'

import type { Anime } from 'types'
import { AnimeAside } from '@components/anime-info/anime-aside.tsx'
import { AnimeBanner } from '@components/anime-info/anime-banner'
import { AnimeDetails } from '@components/anime-info/anime-details'
import { AnimeHeader } from '@components/anime-info/anime-header'
import { AnimeLoader } from '@components/anime-info/anime-loader'
import { AnimeShowBox } from '@components/anime-info/anime-show-box'
import { CreateMetaDatas } from '@components/create-meta-datas'
import { normalizeString } from '@utils/normalize-string'

interface Props {
  slug: string
}

export const AnimeInfo = ({ slug }: Props) => {
  const [animeData, setAnimeData] = useState<Anime>()

  const getAnimeData = async (slug: string) => {
    try {
      const animeData = await fetch(`${baseUrl}/api/getAnime?slug=${slug}`, {
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

  const url = `${baseUrl}/${normalizeString(animeData.title)}_${animeData.mal_id}`

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

      <article className="anime-page z-10 md:-mt-56 -mt-96 grid gap-4 md:gap-10 xl:gap-15 px-4 md:px-20  ">
        <AnimeAside
          animeData={animeData}
          watchNowUrl={watchNowUrl}
          shareText={shareText}
          url={url}
        />

        <AnimeHeader animeData={animeData} />

        <div className='row-span-2 col-span-3  md:col-span-2'>
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
