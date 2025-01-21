import { PlayIcon } from '@components/icons/play-icon'
export const WatchAnimeButton = ({ url }: { url: string }) => {
  return (
    <a
      href={url}
      className="button-primary w-full items-center justify-center gap-2"
    >
      <PlayIcon width="24" height="24" />
      Watch Now
    </a>
  )
}
