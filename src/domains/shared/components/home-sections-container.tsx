import { clientLogger } from '@libs/logger'
import { DynamicHomeSection } from '@shared/components/dynamic-home-section'
import { useHomeCacheStore } from '@shared/stores/home-cache-store'
import type { HomeSection } from '@shared/types/home-types'
import { useGlobalUserPreferences } from '@user/stores/user-store'
import { useEffect } from 'react'

const logger = clientLogger.create('HomeSectionsContainer')

interface Props {
  initialSections: HomeSection[]
  cacheMaxAgeHours?: number
}

export const HomeSectionsContainer = ({
  initialSections,
  cacheMaxAgeHours = 1,
}: Props) => {
  const { getHomeSections, setHomeSections } = useHomeCacheStore()
  const { userInfo } = useGlobalUserPreferences()
  const userId = userInfo?.id ?? null

  const maxAge = cacheMaxAgeHours * 60 * 60 * 1000
  const cached = getHomeSections(userId, maxAge)


  const sections = cached || initialSections

  useEffect(() => {
    if (!cached && initialSections.length > 0) {
      setHomeSections(initialSections, userId)
      logger.info('💾 Saved SSR sections to sessionStorage cache', { userId })
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
