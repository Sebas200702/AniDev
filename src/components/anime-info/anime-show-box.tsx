import { AnimeDescription } from './anime-description'
import { AnimeTrailer } from '@components/anime-info/anime-trailer'
import { useAnimeListsStore } from '@store/anime-list-store'

interface Props {
  trailer_url: string
  banner_image: string
  image_large_webp: string
  title: string
  synopsis: string
}
export const AnimeShowBox = ({
  trailer_url,
  banner_image,
  image_large_webp,
  title,
  synopsis,
}: Props) => {
  const { animeList } = useAnimeListsStore()
  const currentSelected = animeList.find((section) => section.selected)
  const currentSelectedLabel = currentSelected?.label

  if (currentSelectedLabel === 'Trailer')
    return (
      <AnimeTrailer
        trailer_url={trailer_url}
        banner_image={banner_image}
        image_large_webp={image_large_webp}
        title={title}
      />
    )

  if (currentSelectedLabel === 'Characters')
    return <div className="col-span-2">Characters</div>

  if (currentSelectedLabel === 'Synopsis')
    return <AnimeDescription synopsis={synopsis} />
}
