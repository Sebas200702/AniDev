import '@vidstack/react/player/styles/default/theme.css'
import '@styles/video.css'
import '@styles/player.css'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react'
import { CustomLayout } from 'domains/music/components/music-player/custom-layout'
import { Picture } from 'domains/shared/components/media/picture'

/**
 * Props for the AnimeTrailer component.
 *
 * @typedef {Object} Props
 * @property {string} trailer_url - The URL of the anime trailer.
 * @property {string} banner_image - The URL of the anime banner image.
 * @property {string} image_large_webp - The URL of the large anime image in WebP format.
 * @property {string} title - The title of the anime.
 */
interface Props {
  trailer_url: string
  banner_image: string
  title: string
}

/**
 * AnimeTrailer component renders a trailer for an anime.
 *
 * @description This component displays either a YouTube video trailer or a fallback image for an anime.
 * It dynamically loads the lite-youtube web component for efficient video embedding when a trailer URL
 * is available. The component handles the loading state of the YouTube component and displays a loading
 * placeholder while the video is being prepared.
 *
 * The component extracts the video ID from the YouTube URL and passes it to the lite-youtube component
 * when ready. If no trailer URL is provided, the component falls back to displaying either the banner
 * image or the large webp image of the anime with proper optimization for performance.
 *
 * The UI adapts based on the availability of the trailer, providing a consistent viewing experience
 * regardless of whether video content is available. During the loading of the YouTube component,
 * an animated placeholder maintains layout stability and provides visual feedback to the user.
 *
 * @param {Props} props - The component props
 * @param {string} props.trailer_url - The YouTube URL of the anime trailer
 * @param {string} props.banner_image - The URL of the anime banner image used as fallback
 * @param {string} props.image_large_webp - The URL of the large anime image in WebP format used as secondary fallback
 * @param {string} props.title - The title of the anime used for accessibility and alt text
 * @returns {JSX.Element} The rendered trailer video or fallback image
 *
 * @example
 * <AnimeTrailer
 *   trailer_url="https://www.youtube.com/watch?v=abcdefgh"
 *   banner_image="/images/anime-banner.jpg"
 *   image_large_webp="/images/anime-large.webp"
 *   title="My Anime Title"
 * />
 */
export const AnimeTrailer = ({ trailer_url, banner_image, title }: Props) => {
  return (
    <>
      {trailer_url ? (
        <MediaPlayer
          src={trailer_url}
          aspectRatio="16/9"
          viewType="video"
          streamType="on-demand"
          logLevel="error"
          playsInline
          title={`${title} Trailer`}
        >
          <MediaProvider>
            <Poster className="vds-poster" />
          </MediaProvider>
          <CustomLayout />
        </MediaPlayer>
      ) : (
        <div className="flex w-full flex-col rounded-md md:max-w-5xl">
          <div className="aspect-video h-full relative w-full rounded-sm overflow-hidden">
            <Picture
              image={banner_image}
              placeholder={banner_image}
              alt={`${title} banner`}
              isBanner
              styles="aspect-video h-full  w-full rounded-sm overflow-hidden"
            />
            <span className="bg-Complementary/90 text-Primary-200 text-l absolute inset-0 flex h-full w-full items-center justify-center text-center">
              Video not available
            </span>
          </div>
        </div>
      )}
    </>
  )
}
