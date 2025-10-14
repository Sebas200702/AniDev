import type { AnimeCardInfo } from '@anime/types'
import { AnimeSlider } from '@anime/components/anime-slider/anime-slider'
import { AnimeSliderLoader } from '@anime/components/anime-slider/anime-slider-loader'
import { DataWrapper } from '@shared/components/data-wrapper'
import { createGroups } from '@anime/utils/create-groups'
import { useFetch } from '@shared/hooks/useFetch'
import { useGlobalUserPreferences } from '@user/stores/user-store'
import { useHorizontalScroll } from '@shared/hooks/useHorizontalScroll'

interface Props {
  url: string
  title: string
  context?: string
}

export const AnimeSliderContainer = ({ url, title, context }: Props) => {
  const { parentalControl } = useGlobalUserPreferences()

  const { listRef, showPrev, showNext, scrollNext, scrollPrev, windowWidth } =
    useHorizontalScroll({
      mobileBreakpoint: 768,
      scrollPadding: 120,
    })

  const { data, loading, error } = useFetch<AnimeCardInfo[]>({
    url: url + `&parental_control=${parentalControl}`,
  })

  const groups = createGroups(data, windowWidth, context)

  return (
    <DataWrapper
      data={data}
      loading={loading}
      error={error}
      loadingFallback={<AnimeSliderLoader context={context} />}
      noDataFallback={<AnimeSliderLoader context={context} />}
    >
      {() => (
        <AnimeSlider
          title={title}
          showPrev={showPrev}
          showNext={showNext}
          scrollPrev={scrollPrev}
          scrollNext={scrollNext}
          listRef={listRef}
          groups={groups}
          context={context}
        />
      )}
    </DataWrapper>
  )
}
