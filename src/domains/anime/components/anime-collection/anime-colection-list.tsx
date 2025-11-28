import { AnimeCollectionContainer } from '@anime/components/anime-collection/anime-collection-container'
import { useWindowWidth } from '@shared/hooks/window-width'

interface Props {
  id: number
  url?: string
  urls?: string[]
  titles?: string[]
}

export const AnimeColectionList = ({ id, url, urls, titles }: Props) => {
  const { width: windowWidth } = useWindowWidth()
  let collectionLength

  if (windowWidth && windowWidth >= 1920) collectionLength = 4
  else if (windowWidth && windowWidth >= 1280) collectionLength = 3
  else if (windowWidth && windowWidth >= 768) collectionLength = 2
  else collectionLength = 1

  return (
    <ul className="fade-out flex flex-row gap-8 p-4 md:px-20">
      {Array.from({ length: collectionLength }).map((_, index) => {
        const collectionUrl = urls?.[index] || url
        const collectionTitle = titles?.[index]
        return (
          <AnimeCollectionContainer
            key={`collection-${id}-${index}`}
            id={id + index}
            url={collectionUrl}
            title={collectionTitle}
          />
        )
      })}
    </ul>
  )
}
