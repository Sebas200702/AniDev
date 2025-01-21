import { PlayIcon } from '@components/icons/play-icon'
export const WatchAnimeButton = ({ url }: { url: string }) => {
  return (
    <a
      href={url}
      className="button-primary w-full items-center justify-center gap-2"
    >
      <PlayIcon className='md:h-6 md:w-6 w-4 h-4' />
      Watch Now
    </a>
  )
}
