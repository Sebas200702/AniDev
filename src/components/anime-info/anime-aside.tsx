import type { Anime } from 'types'
import { ShareButton } from '@components/buttons/share-button'
import { WatchAnimeButton } from '@components/buttons/watch-anime'

interface Props {
  animeData: Anime
  watchNowUrl: string
  shareText: string
  url: string
}
export const AnimeAside = ({
  animeData,
  watchNowUrl,
  shareText,
  url,
}: Props) => {
  return (
    <aside className="top-28 z-10 anime-aside  p-4 md:p-0 flex h-min w-full flex-col gap-8 md:items-start xl:sticky">
      <figure className="aspect-[225/330] w-auto rounded-lg">
        <img
          src={animeData.image_large_webp}
          alt={`Portada oficial de ${animeData.title}`}
          className="aspect-[225/330] h-auto rounded-lg transition-all ease-in-out w-full"
          loading="lazy"
        />
      </figure>
      <div className="flex h-full w-full flex-row justify-end gap-2">
        <WatchAnimeButton url={watchNowUrl} />
        <ShareButton title={animeData.title} url={url} text={shareText} />
      </div>
    </aside>
  )
}
