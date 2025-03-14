import { PlayIcon } from '@components/icons/play-icon'

export const WatchAnimeButton = ({ url }: { url: string }) => {
  return (
    <a
      href={url}
      className="button-primary text-s flex w-full items-center justify-center gap-2"
    >
      <PlayIcon className="xl:h-4 h-3 w-3 xl:w-4" />
      Watch Now
    </a>
  )
}
