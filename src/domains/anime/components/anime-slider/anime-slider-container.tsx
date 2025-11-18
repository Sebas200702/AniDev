import { AnimeSlider } from '@anime/components/anime-slider/anime-slider'
import { AnimeSliderLoader } from '@anime/components/anime-slider/anime-slider-loader'
import type { AnimeCardInfo } from '@anime/types'
import { createGroups } from '@anime/utils/create-groups'
import { DataWrapper } from '@shared/components/data-wrapper'
import { useFetch } from '@shared/hooks/useFetch'
import { useHorizontalScroll } from '@shared/hooks/useHorizontalScroll'
import { useGlobalUserPreferences } from '@user/stores/user-store'

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

  const { data, loading, error, refetch } = useFetch<AnimeCardInfo[]>({
    url: url + `&parental_control=${parentalControl}`,
    skip: parentalControl == null,
  })

  const groups = createGroups(data, windowWidth, context)

  return (
    <DataWrapper
      data={data}
      loading={loading}
      error={error}
      onRetry={refetch}
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
