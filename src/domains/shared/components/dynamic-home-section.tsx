import { AnimeBanner } from '@anime/components/anime-banner/anime-banner'
import { AnimeCarouselContainer } from '@anime/components/anime-carousel/anime-carousel-container'
import { AnimeColectionList } from '@anime/components/anime-collection/anime-colection-list'
import { AnimeSliderContainer } from '@anime/components/anime-slider/anime-slider-container'
import { AnimeTopContainer } from '@anime/components/anime-top/anime-top-container'
import type { HomeSection } from '@shared/types/home-types'

/**
 * DynamicHomeSection Component
 *
 * @description
 * Componente que renderiza dinámicamente diferentes tipos de secciones del home
 * basándose en la configuración de la sección.
 *
 * @param {HomeSection} section - Configuración de la sección a renderizar
 */

interface Props {
  section: HomeSection
}

export const DynamicHomeSection = ({ section }: Props) => {
  switch (section.type) {
    case 'carousel':
      return <AnimeCarouselContainer />

    case 'slider':
      return <AnimeSliderContainer url={section.url!} title={section.title!} />

    case 'top':
      return <AnimeTopContainer />

    case 'collection':
      return (
        <AnimeColectionList
          id={section.componentId!}
          url={section.url}
          urls={section.urls}
        />
      )

    case 'banner':
      return <AnimeBanner id={section.componentId!} url={section.url} />

    default:
      return null
  }
}
