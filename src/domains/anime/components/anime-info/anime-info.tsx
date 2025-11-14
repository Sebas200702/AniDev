import { AnimeBanner } from '@anime/components/anime-info/anime-info-banner'
import { AnimeDetails } from '@anime/components/anime-info/anime-info-details'
import { AnimeShowBoxContainer } from '@anime/components/anime-info/anime-info-show-box/anime-info-show-box-container'
import { AnimeSimilarToContainer } from '@anime/components/anime-info/anime-info-similar-to/anime-info-similar-to-container'
import { AnimeTag } from '@anime/components/shared/anime-tag'
import type { Anime } from '@anime/types'
import { AddToListButton } from '@shared/components/buttons/add-to-list-button'
import { ShareButton } from '@shared/components/buttons/share-button'
import { WatchAnimeButton } from '@shared/components/buttons/watch-anime'
import { baseUrl } from '@shared/utils/base-url'
import { getAnimeType } from '@utils/getanime-type'
import { normalizeRating } from '@utils/normalize-rating'
import { normalizeString } from '@utils/normalize-string'
import { Aside } from 'domains/shared/components/layout/base/Aside'
import { Header } from 'domains/shared/components/layout/base/Header'
import { InfoPageLayout } from 'domains/shared/components/layout/base/InfoPageLayout'

interface Props {
  animeData: Anime
}

export const AnimeInfo = ({ animeData }: Props) => {
  const url = `/anime/${normalizeString(animeData.title)}_${animeData.mal_id}`
  const watchNowUrl = `/watch/${normalizeString(animeData.title)}_${animeData.mal_id}`
  const shareText = `Watch ${animeData.title} on AniDev`

  return (
    <InfoPageLayout
      banner={
        <AnimeBanner
          banner_image={
            animeData.banner_image ??
            animeData.image_large_webp ??
            `${baseUrl}/placeholder.webp`
          }
          image_large_webp={
            animeData.image_large_webp ?? `${baseUrl}/placeholder.webp`
          }
          title={animeData.title}
        />
      }
    >
      <Aside
        title={animeData.title}
        posterImage={
          animeData.image_large_webp ?? `${baseUrl}/placeholder.webp`
        }
        smallImage={animeData.image_small_webp ?? `${baseUrl}/placeholder.webp`}
        bannerImage={animeData.banner_image ?? `${baseUrl}/placeholder.webp`}
      >
        <WatchAnimeButton url={watchNowUrl} title={animeData.title} />
        <AddToListButton
          animeId={animeData.mal_id}
          anime_title={animeData.title}
          styles="button-secondary"
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

      <div className="col-span-1 flex flex-col gap-6 md:col-span-2 xl:col-span-3">
        <AnimeShowBoxContainer
          animeId={animeData.mal_id}
          trailer_url={animeData.trailer_url ?? ''}
          banner_image={
            animeData.banner_image ??
            animeData.image_large_webp ??
            `${baseUrl}/placeholder.webp`
          }
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
        <AnimeSimilarToContainer
          title={animeData.title}
          mal_id={animeData.mal_id}
        />
      </div>

      <AnimeDetails animeData={animeData} />
    </InfoPageLayout>
  )
}
