import { PlayIcon } from '@components/icons/play-icon'

export const WatchAnimeButton = ({ url }: { url: string }) => {
  return (
    <a
      href={url}
      className="button-primary text-s flex w-full items-center justify-center gap-4"
    >
      <PlayIcon className="h-4 w-4" />
      Watch Now
    </a>
  )
}
