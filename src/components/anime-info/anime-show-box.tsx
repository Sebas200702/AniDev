import { AnimeDescription } from './anime-description'
import { AnimeTrailer } from '@components/anime-info/anime-trailer'
import { useAnimeListsStore } from '@store/anime-list-store'

/**
 * AnimeShowBox component displays a box containing information about an anime like synopsis, characters, and trailer.
 *
 * @param {Object} props - The props for the component.
 * @param {string} props.trailer_url - The URL of the anime trailer.
 * @param {string} props.banner_image - The banner image of the anime.
 * @param {string} props.image_large_webp - The large webp image of the anime.
 * @param {string} props.title - The title of the anime.
 * @param {string} props.synopsis - The synopsis of the anime.
 */
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
