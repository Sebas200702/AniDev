import { AnimeShowBox } from '@anime/components/anime-info/anime-info-show-box/anime-info-show-box'
import { useAnimeListsStore } from '@anime/stores/anime-list-store'
import { useEffect, useState } from 'react'

interface Props {
  animeId: number
  trailer_url: string
  banner_image: string
  image_large_webp: string
  image_small_webp: string
  image: string
  title: string
  synopsis: string
}

/**
 * Container que maneja la lógica de selección, transiciones y carga de contenido
 * del componente AnimeShowBox.
 */
export const AnimeShowBoxContainer = (props: Props) => {
  const { animeList } = useAnimeListsStore()
  const currentSelected = animeList.find((section) => section.selected)
  const currentSelectedLabel = currentSelected?.label

  const [isContentLoading, setIsContentLoading] = useState(false)
  const [contentKey, setContentKey] = useState(0)

  useEffect(() => {
    setIsContentLoading(true)
    const timer = setTimeout(() => {
      setIsContentLoading(false)
      setContentKey((prev) => prev + 1)
    }, 150)

    return () => clearTimeout(timer)
  }, [currentSelectedLabel])

  return (
    <AnimeShowBox
      {...props}
      currentSelectedLabel={currentSelectedLabel}
      isContentLoading={isContentLoading}
      contentKey={contentKey}
    />
  )
}
