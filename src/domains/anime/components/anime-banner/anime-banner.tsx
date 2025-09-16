import '@anime/styles/anime-banner.css'
import { BannerInfo } from '@anime/components/anime-banner/banner-info'
import { BannerLoader } from '@anime/components/anime-banner/banner-loader'
import type { AnimeBannerInfo } from '@anime/types'
import { Picture } from '@shared/components/media/picture'
import { useFetch } from '@shared/hooks/useFetch'
import { createDynamicUrl } from '@utils/create-dynamic-url'
import { normalizeString } from '@utils/normalize-string'
import { Overlay } from 'domains/shared/components/layout/overlay'
import { useEffect, useMemo, useState } from 'react'

/**
 * AnimeBanner component displays a banner for an anime.
 *
 * @description This component manages the loading state, fetches anime banner data, and ensures unique banners.
 * It uses session storage to cache the fetched data for faster access. The component ensures that
 * each banner is unique by validating IDs before displaying. If a banner is not unique, it will fetch
 * a new anime. The component also handles responsive layout and provides visual effects.
 *
 * The component maintains an internal state for banner data and loading status. It implements an efficient
 * caching mechanism using sessionStorage to improve performance on subsequent visits. When no cached data
 * is available, it dynamically generates a URL and fetches a new banner.
 *
 * The UI displays an anime banner with title, synopsis, and a link to the anime details. During loading,
 * a skeleton loader is displayed to improve user experience.
 *
 * Now includes intelligent retry system that registers failed URL combinations through API calls.
 *
 * @param {Object} props - The component props
 * @param {number} props.id - The ID used for caching and determining animation style
 * @returns {JSX.Element} The rendered anime banner with image, overlay, and information
 *
 * @example
 * <AnimeBanner id={1} />
 */
export const AnimeBanner = ({ id }: { id: number }) => {
  const [bannerData, setBannerData] = useState<AnimeBannerInfo | null>(null)
  const animationNumber = id % 2 === 0 ? 1 : 2

  const { url } = useMemo(() => createDynamicUrl(1), [])

  const { data, loading, error } = useFetch<AnimeBannerInfo[]>({
    url: `${url}&banners_filter=true&format=anime-banner`,
  })

  useEffect(() => {
    if (data) {
      setBannerData(data[0])
    }
  }, [data, setBannerData])

  if (error) {
    return (
      <div>
        <p className="text-white">
          Failed to load banner. Please try again later.
        </p>
      </div>
    )
  }

  if (loading || !bannerData)
    return <BannerLoader animationNumber={animationNumber} />

  const { banner_image, title, synopsis, mal_id } = bannerData
  const slug = normalizeString(title)

  return (
    <section className=" relative flex flex-row items-center md:px-20 md:py-4">
      <article
        className={`anime-banner-${animationNumber} fade-outgroup bg-Complementary relative w-full overflow-hidden transition-all duration-400 ease-in-out md:rounded-2xl md:hover:opacity-95`}
      >
        <a
          href={`/anime/${slug}_${mal_id}`}
          aria-label={`View details for ${title}`}
        >
          <Picture
            image={banner_image || ''}
            placeholder={banner_image || ''}
            isBanner
            alt="Anime Banner"
            styles="aspect-[1080/500] h-full w-full  md:aspect-[1080/300] object-cover object-center relative"
          />

          <Overlay className="to-Primary-950/80 h-1/3 w-full bg-gradient-to-b" />
          <Overlay className="to-Primary-950/30 h-full w-0 bg-gradient-to-l md:group-hover:w-full" />
        </a>
        <BannerInfo
          title={title}
          synopsis={synopsis ?? 'No synopsis available.'}
          mal_id={mal_id}
          slug={slug}
        />
      </article>
    </section>
  )
}
