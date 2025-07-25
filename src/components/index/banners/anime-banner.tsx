import { BannerInfo } from '@components/index/banners/banner-info'
import { BannerLoader } from '@components/index/banners/banner-loader'
import { Overlay } from '@components/layout/overlay'
import { Picture } from '@components/media/picture'
import { useGlobalUserPreferences } from '@store/global-user'
import { useIndexStore } from '@store/index-store'
import { useWindowWidth } from '@store/window-width'
import { baseUrl } from '@utils/base-url'
import { createDynamicUrl } from '@utils/create-dynamic-url'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { addFailedUrlClient } from '@utils/failed-urls-client'
import { normalizeString } from '@utils/normalize-string'
import { useEffect, useState } from 'react'

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
  const [bannerData, setBannerData] = useState<{
    imageUrl: string
    title: string
    synopsis: string
    mal_id: number
  } | null>(null)
  const animationNumber = id % 2 === 0 ? 1 : 2
  const { setAnimeBanners, animeBanners } = useIndexStore()
  const [loading, setLoading] = useState(true)
  const { parentalControl } = useGlobalUserPreferences()
  const { width: windowWidth } = useWindowWidth()
  const isMobile = windowWidth && windowWidth < 768

  const getBannerData = async (
    url: string,
    retryCount = 0
  ): Promise<{
    imageUrl: string
    title: string
    synopsis: string
    mal_id: number
  } | null> => {
    const maxRetries = 10

    if (retryCount >= maxRetries) {
      return null
    }

    try {
      const fullUrl = `/api/animes?${url}&banners_filter=true&limit_count=1&format=anime-banner`
      const response = await fetch(fullUrl)

      if (!response.ok) {
        // Register the URL as failed through API call
        await addFailedUrlClient(url)

        if (retryCount < maxRetries - 1) {
          const { url: newUrl } = createDynamicUrl(1, parentalControl)
          return await getBannerData(newUrl, retryCount + 1)
        }
        return null
      }

      const responseData = await response.json()

      if (
        !responseData ||
        !responseData.data ||
        !Array.isArray(responseData.data)
      ) {
        // Register the URL as failed through API call
        await addFailedUrlClient(url)

        if (retryCount < maxRetries - 1) {
          const { url: newUrl } = createDynamicUrl(1, parentalControl)
          return await getBannerData(newUrl, retryCount + 1)
        }
        return null
      }

      const [anime] = responseData.data

      if (!anime || animeBanners.includes(anime.mal_id)) {
        if (retryCount < maxRetries - 1) {
          const { url: newUrl } = createDynamicUrl(1, parentalControl)
          return await getBannerData(newUrl, retryCount + 1)
        }
        return null
      }

      return {
        imageUrl: anime.banner_image,
        title: anime.title,
        synopsis: anime.synopsis,
        mal_id: anime.mal_id,
      }
    } catch (error) {
      // Register the URL as failed through API call for network errors too
      await addFailedUrlClient(url)

      if (retryCount < maxRetries - 1) {
        const { url: newUrl } = createDynamicUrl(1, parentalControl)
        return await getBannerData(newUrl, retryCount + 1)
      }
      return null
    }
  }

  useEffect(() => {
    const fetchBannerData = async () => {
      const storedData = sessionStorage.getItem(`animeBanner_${id}`)
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        setBannerData(parsedData)
        setTimeout(() => {
          setLoading(false)
        }, 100)
        return
      }

      const { url } = createDynamicUrl(1, parentalControl)
      const data = await getBannerData(url)

      if (!data) {
        setLoading(false)
        return
      }

      setBannerData(data)
      animeBanners.push(data.mal_id)
      setAnimeBanners(animeBanners)
      sessionStorage.setItem(`animeBanner_${id}`, JSON.stringify(data))

      setTimeout(() => {
        setLoading(false)
      }, 200)
    }

    fetchBannerData()
  }, [])

  if (loading || !bannerData)
    return <BannerLoader animationNumber={animationNumber} />

  const { imageUrl, title, synopsis, mal_id } = bannerData
  const slug = normalizeString(title)

  return (
    <section
      className={`anime-banner-${animationNumber} fade-out relative flex flex-row items-center px-4 py-4 md:px-20`}
    >
      <article className="group bg-Complementary relative w-full overflow-hidden rounded-2xl transition-all duration-400 ease-in-out md:hover:opacity-95">
        <a
          href={`/anime/${slug}_${mal_id}`}
          aria-label={`View details for ${title}`}
        >
          <Picture
            image={createImageUrlProxy(
              imageUrl ?? `${baseUrl}/placeholder.webp`,
              '0',
              '0',
              'webp'
            )}
            styles="aspect-[1080/500] h-full w-full  md:aspect-[1080/300] object-cover object-center relative"
          >
            <img
              src={
                isMobile
                  ? createImageUrlProxy(
                      imageUrl ?? `${baseUrl}/placeholder.webp`,
                      '720',
                      '50',
                      'webp'
                    )
                  : createImageUrlProxy(
                      imageUrl ?? `${baseUrl}/placeholder.webp`,
                      '1920',
                      '50',
                      'webp'
                    )
              }
              alt="Anime Banner"
              loading="lazy"
              className="relative aspect-[1080/500] h-full w-full object-cover object-center md:aspect-[1080/300]"
            />
            <Overlay className="to-Primary-950/80 h-1/3 w-full bg-gradient-to-b" />
            <Overlay className="to-Primary-950/30 h-full w-0 bg-gradient-to-l md:group-hover:w-full" />
          </Picture>
        </a>
        <BannerInfo
          title={title}
          synopsis={synopsis}
          mal_id={mal_id}
          slug={slug}
        />
      </article>
    </section>
  )
}
