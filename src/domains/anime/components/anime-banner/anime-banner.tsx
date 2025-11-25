import '@anime/styles/anime-banner.css'
import { BannerInfo } from '@anime/components/anime-banner/anime-banner-info'
import { BannerLoader } from '@anime/components/anime-banner/anime-banner-loader'
import type { AnimeBannerInfo } from '@anime/types'
import { createDynamicUrl } from '@anime/utils/create-dynamic-url'
import { useFetchWithCache } from '@cache/hooks/useFetchWithCache'
import { DataWrapper } from '@shared/components/data-wrapper'
import { useMemo } from 'react'

export const AnimeBanner = ({
  id,
  url: customUrl,
}: { id: number; url?: string }) => {
  const animationNumber = id % 2 === 0 ? 1 : 2
  const { url: fallbackUrl } = useMemo(() => createDynamicUrl(1), [])

  const { data, loading, error, retryCount, maxRetries, refetch } =
    useFetchWithCache<AnimeBannerInfo[]>({
      url: `${customUrl || fallbackUrl}&banners_filter=true&format=anime-banner`,
      sectionId: `banner-${id}`,
      limit: 1,
    })

  return (
    <DataWrapper
      data={data}
      loading={loading}
      error={error}
      loadingFallback={<BannerLoader animationNumber={animationNumber} />}
      noDataFallback={<BannerLoader animationNumber={animationNumber} />}
      onRetry={refetch}
      retryCount={maxRetries - retryCount}
    >
      {(data) => (
        <BannerInfo banner={data![0]} animationNumber={animationNumber} />
      )}
    </DataWrapper>
  )
}
