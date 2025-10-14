import '@anime/styles/anime-banner.css'
import { BannerInfo } from '@anime/components/anime-banner/anime-banner-info'
import { BannerLoader } from '@anime/components/anime-banner/anime-banner-loader'
import type { AnimeBannerInfo } from '@anime/types'
import { DataWrapper } from '@shared/components/data-wrapper'
import { useFetch } from '@shared/hooks/useFetch'
import { createDynamicUrl } from '@utils/create-dynamic-url'
import { useMemo } from 'react'

export const AnimeBanner = ({ id }: { id: number }) => {
  const animationNumber = id % 2 === 0 ? 1 : 2
  const { url } = useMemo(() => createDynamicUrl(1), [])

  const { data, loading, error } = useFetch<AnimeBannerInfo[]>({
    url: `${url}&banners_filter=true&format=anime-banner`,
  })

  return (
    <DataWrapper
      data={data}
      loading={loading}
      error={error}
      loadingFallback={<BannerLoader animationNumber={animationNumber} />}
      noDataFallback={<BannerLoader animationNumber={animationNumber} />}
    >
      {(data) => (
        <BannerInfo banner={data![0]} animationNumber={animationNumber} />
      )}
    </DataWrapper>
  )
}
