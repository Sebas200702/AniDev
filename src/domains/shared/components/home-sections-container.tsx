import { clientLogger } from '@libs/logger'
import { DynamicHomeSection } from '@shared/components/dynamic-home-section'
import { useHomeCacheStore } from '@shared/stores/home-cache-store'
import type { HomeSection } from '@shared/types/home-types'
import { useEffect, useState } from 'react'

const logger = clientLogger.create('HomeSectionsContainer')

interface Props {
  initialSections: HomeSection[]
  userId: string | null
  cacheMaxAgeHours?: number
}

export const HomeSectionsContainer = ({
  initialSections,
  userId,
  cacheMaxAgeHours = 1,
}: Props) => {
  const { getHomeSections, setHomeSections } = useHomeCacheStore()

  // Inicializar desde cache o usar SSR initial sections
  const maxAge = cacheMaxAgeHours * 60 * 60 * 1000
  const cached = getHomeSections(userId, maxAge)
  const [sections] = useState<HomeSection[]>(cached || initialSections)

  // Guardar initial sections en cache si no hay cache o expiró
  useEffect(() => {
    if (!cached) {
      setHomeSections(initialSections, userId)
      logger.info('💾 Saved SSR sections to sessionStorage cache')
    }
  }, [cached, initialSections, userId, setHomeSections])

  return (
    <section className="max-w-[100dvw] [grid-area:main] md:max-w-[calc(100dvw-80px)]">
      <article className="-mt-16 mb-10 flex flex-col gap-y-6 md:mb-20 md:gap-y-20">
        {sections.map((section) => (
          <DynamicHomeSection key={section.id} section={section} />
        ))}
      </article>
    </section>
  )
}
