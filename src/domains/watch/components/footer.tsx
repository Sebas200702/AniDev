interface FooterProps {
  episodeTitle?: string
  episodeDescription?: string
  title: string
  episode: number
}

export const Footer = ({
  episodeTitle,
  title,
  episode,
  episodeDescription,
}: FooterProps) => {
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
