import { AnimeBanner } from '@components/anime-info/anime-banner'
import { AnimeDetails } from '@components/anime-info/anime-details'
import { AnimeLoader } from '@components/anime-info/anime-loader'
import { AnimeShowBox } from '@components/anime-info/anime-show-box'
import { AnimeTag } from '@components/anime-info/anime-tag'
import { AddToListButton } from '@components/buttons/add-to-list-button'
import { ShareButton } from '@components/buttons/share-button'
import { WatchAnimeButton } from '@components/buttons/watch-anime'
import { Aside } from '@components/shared/Aside'
import { Header } from '@components/shared/Header'
import { InfoPageLayout } from '@components/shared/InfoPageLayout'
import { baseUrl } from '@utils/base-url'
import { getAnimeData } from '@utils/get-anime-data'
import { getAnimeType } from '@utils/getanime-type'
import { normalizeRating } from '@utils/normalize-rating'
import { normalizeString } from '@utils/normalize-string'
import { useEffect, useState } from 'react'
import type { Anime } from 'types'
import { SimilarToComponet } from './anime-similar-to'

interface Props {
  slug: string
}

export const AnimeInfo = ({ slug }: Props) => {
  const [animeData, setAnimeData] = useState<Anime>()

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAnimeData(slug)
      if (!data) return
      setAnimeData(data)
    }
    fetchData()
  }, [])

  if (!animeData) return <AnimeLoader />

  const url = `/anime/${normalizeString(animeData.title)}_${animeData.mal_id}`
  const watchNowUrl = `/watch/${normalizeString(animeData.title)}_${animeData.mal_id}`
  const shareText = `Watch ${animeData.title} on AniDev`

  return (
    <InfoPageLayout
      banner={
        <AnimeBanner
          banner_image={animeData.banner_image ?? ''}
          image_large_webp={
            animeData.image_large_webp ?? `${baseUrl}/placeholder.webp`
          }
          title={animeData.title}
        />
      }
    >
      <Aside
        title={animeData.title}
        posterImage={animeData.image_large_webp ?? ''}
        smallImage={animeData.image_small_webp ?? ''}
      >
        <WatchAnimeButton url={watchNowUrl} title={animeData.title} />
        <AddToListButton
          animeId={animeData.mal_id}
          anime_title={animeData.title}
          styles="button-secondary "
        />
        <ShareButton
          title={animeData.title}
          url={url}
          text={shareText}
          className="button-secondary"
        />
      </Aside>
      <Header title={animeData.title}>
        <AnimeTag
          tag={getAnimeType(animeData.type ?? '')}
          type={animeData.type ?? ''}
        />
        {animeData.genres?.map((genre) => (
          <AnimeTag key={genre} tag={genre} type={genre} style="w-auto" />
        ))}
        {animeData.rating && (
          <AnimeTag
            tag={normalizeRating(animeData.rating)}
            type={normalizeString(animeData.rating)}
          />
        )}
      </Header>
      <div className="xl:col-span-3 col-span-1 md:col-span-2 flex flex-col gap-6">
        <AnimeShowBox
          animeId={animeData.mal_id}
          trailer_url={animeData.trailer_url ?? ''}
          banner_image={animeData.banner_image ?? ''}
          image_large_webp={
            animeData.image_large_webp ?? `${baseUrl}/placeholder.webp`
          }
          image={animeData.image_webp ?? `${baseUrl}/placeholder.webp`}
          image_small_webp={
            animeData.image_small_webp ?? `${baseUrl}/placeholder.webp`
          }
          title={animeData.title}
          synopsis={animeData.synopsis ?? 'No synopsis available'}
        />
        <SimilarToComponet title={animeData.title} mal_id={animeData.mal_id} />
      </div>
      <AnimeDetails animeData={animeData} />
    </InfoPageLayout>
  )
}
