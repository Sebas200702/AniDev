import { PlayIcon } from '@components/icons/play-icon'
export const WatchAnimeButton = ({ url }: { url: string }) => {
  return (
    <a
      href={url}
      className="button-primary w-full items-center justify-center gap-2"
    >
      <PlayIcon className="h-4 w-4 md:h-6 md:w-6" />
      Watch Now
    </a>
  )
}
