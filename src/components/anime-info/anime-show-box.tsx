import { CharacterSection } from '@components/anime-info/anime-characters'
import { AnimeDescription } from '@components/anime-info/anime-description'
import { AnimeRelated } from '@components/anime-info/anime-related'
import { AnimeTrailer } from '@components/anime-info/anime-trailer'
import { useAnimeListsStore } from '@store/anime-list-store'
import { AnimeMusic } from './anime-music'

/**
 * AnimeShowBox component displays content based on the selected tab for an anime.
 *
 * @description This component manages the display of different content sections for an anime
 * based on user selection. It dynamically renders the appropriate component according to the
 * currently selected tab (Synopsis, Trailer, or Characters). The component uses the anime list
 * store to track the active selection and conditionally renders the corresponding content.
 *
 * For the Synopsis tab, it displays the anime's description using the AnimeDescription component.
 * For the Trailer tab, it renders the AnimeTrailer component with all necessary media properties.
 * For the Characters tab, it shows a placeholder for character information.
 *
 * The component implements a clean, conditional rendering approach that ensures only the
 * relevant content is displayed at any given time, improving both performance and user experience
 * by reducing unnecessary DOM elements.
 *
 * @param {Props} props - The component props
 * @param {string} props.trailer_url - The URL of the anime trailer
 * @param {string} props.banner_image - The banner image of the anime
 * @param {string} props.image_large_webp - The large webp image of the anime
 * @param {string} props.title - The title of the anime
 * @param {string} props.synopsis - The synopsis of the anime
 * @returns {JSX.Element} The rendered content based on the selected tab
 *
 * @example
 * <AnimeShowBox
 *   trailer_url="https://youtube.com/watch?v=abc123"
 *   banner_image="https://example.com/banner.jpg"
 *   image_large_webp="https://example.com/image.webp"
 *   title="Anime Title"
 *   synopsis="This is the anime synopsis."
 * />
 */
interface Props {
  animeId: number
  trailer_url: string
  banner_image: string
  image_large_webp: string
  image_small_webp: string
  image: string
  title: string
  synopsis: string
}
export const AnimeShowBox = ({
  animeId,
  trailer_url,
  banner_image,
  image_large_webp,
  image_small_webp,
  image,
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
    return <CharacterSection animeId={animeId} />

  if (currentSelectedLabel === 'Music')
    return (
      <AnimeMusic
        animeId={animeId}
        image={image}
        placeholder={image_small_webp}
        banner_image={banner_image}
        anime_title={title}
      />
    )

  if (currentSelectedLabel === 'Synopsis')
    return <AnimeDescription synopsis={synopsis} />

  if (currentSelectedLabel === 'Related')
    return <AnimeRelated animeId={animeId} />
}
