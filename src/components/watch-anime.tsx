import { PlayIcon } from '@components/icons/play-icon'
export const WatchAnimeButton = ({ url }: { url: string }) => {
  return (
    <a href={url} className="button-primary items-center justify-center w-full gap-2">
      <PlayIcon width="24" height="24" />
      Watch Now
    </a>
  )
}
