import { WatchAnimeButton } from '@components/buttons/watch-anime'
import { useEffect } from 'react'
import { useWindowWidth } from '@store/window-width'

interface BannerInfoProps {
  title: string
  synopsis: string
  mal_id: number
  slug: string
}

export const BannerInfo = ({
  title,
  synopsis,
  mal_id,
  slug,
}: BannerInfoProps) => {
  const { width, setWidth } = useWindowWidth()
  const isMobile = width && width < 768

  useEffect(() => {
    window.addEventListener('resize', () => setWidth(window.innerWidth))
    return () =>
      window.removeEventListener('resize', () => setWidth(window.innerWidth))
  }, [])

  return (
    <div
      className={`bg-Primary-950/50 absolute z-10 flex h-full w-full ${isMobile ? 'inset-0' : ''} flex-col items-center justify-between p-4 md:right-0 md:bottom-10 md:max-h-44 md:max-w-96 md:rounded-l-2xl md:pr-10 xl:max-h-60`}
    >
      <a
        href={`/${slug}_${mal_id}`}
        className="transition-all duration-200 ease-in-out md:hover:opacity-95"
      >
        <h3 className="text-lx line-clamp-2 max-h-44 w-full overflow-hidden text-center font-bold text-white">
          {title}
        </h3>
      </a>

      <p className="text-s line-clamp-2 max-h-32 w-full overflow-hidden text-center text-white">
        {synopsis}
      </p>
      <WatchAnimeButton url={`/watch/${slug}_${mal_id}`} />
    </div>
  )
}
