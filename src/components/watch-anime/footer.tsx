interface FooterProps {
  episodeTitle?: string
  episodeDescription?: string
  title: string
  episode: number
}
const FooterLoader = () => {
  return (
    <footer className="flex h-full w-full animate-pulse flex-col gap-8 rounded-lg p-4 transition-all duration-300 ease-in-out ">
      <div className="xl:h-8 h-16 md:w-120 w-full animate-pulse rounded-md bg-zinc-800 transition-all  duration-200 ease-in-out"></div>
      <div className="xl:h-20 h-32 w-full animate-pulse rounded-md bg-zinc-800 transition-all duration-200 ease-in-out"></div>
    </footer>
  )
}
export const Footer = ({
  episodeTitle,
  title,
  episode,
  episodeDescription,
}: FooterProps) => {
  if (!title || !episode) return <FooterLoader />
  return (
    <footer>
      <h3 className="h-auto p-4 text-xl font-bold text-white">
        {episodeTitle ?? '(Untitled)'} - {title} - Episode {episode}
      </h3>
      <p className="font-size-sm p-4 text-gray-400">
        {episodeDescription ?? 'No description'}
      </p>
    </footer>
  )
}
