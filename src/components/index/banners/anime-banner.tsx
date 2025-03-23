import '@styles/anime-banner.css'

import { useEffect, useState } from 'react'

import { BannerInfo } from '@components/index/banners/banner-info'
import { BannerLoader } from '@components/index/banners/banner-loader'
import { Overlay } from '@components/overlay'
import { createDynamicUrl } from '@utils/create-dynamic-url'
import { createImageUrlProxy } from '@utils/craete-imageurl-proxy'
import { normalizeString } from '@utils/normalize-string'
import { useIndexStore } from '@store/index-store'

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
 * @param {Object} props - The component props
 * @param {number} props.id - The ID used for caching and determining animation style
 * @returns {JSX.Element} The rendered anime banner with image, overlay, and information
 *
 * @example
 * <AnimeBanner id={1} />
 */
export const AnimeBanner = ({ id }: { id: number }): JSX.Element => {
  const [bannerData, setBannerData] = useState<{
    imageUrl: string
    title: string
    synopsis: string
    mal_id: number
  } | null>(null)
  const animationNumber = id % 2 === 0 ? 1 : 2
  const { setAnimeBanners, animeBanners } = useIndexStore()
  const [loading, setLoading] = useState(true)

  const getBannerData = async (url: string) => {
    const response = await fetch(
      `/api/animes?${url}&banners_filter=true&limit_count=1`
    ).then((res) => res.json())

    const [anime] = response.data

    if (!anime || animeBanners.includes(anime.mal_id)) {
      const { url: newUrl } = createDynamicUrl(1)
      return await getBannerData(newUrl)
    }
    return {
      imageUrl: anime.banner_image,
      title: anime.title,
      synopsis: anime.synopsis,
      mal_id: anime.mal_id,
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
      const { url } = createDynamicUrl(1)
      const data = await getBannerData(url)

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
      <article className="group relative w-full transition-all duration-400 ease-in-out md:hover:opacity-95">
        <a
          href={`/anime/${slug}_${mal_id}`}
          aria-label={`View details for ${title}`}
        >
          <div
            className="aspect-[1080/600] h-full w-full rounded-2xl md:aspect-[1080/350]"
            style={{
              backgroundImage: `url(${createImageUrlProxy(imageUrl, '100', '0', 'webp')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <img
              src={createImageUrlProxy(imageUrl, '1920', '50', 'webp')}
              alt="Anime Banner"
              loading="lazy"
              className="aspect-[1080/550] h-full w-full rounded-2xl object-cover object-center md:aspect-[1080/350]"
            />
          </div>
          <Overlay className="to-Primary-950/80 h-1/2 w-full bg-gradient-to-b" />
          <Overlay className="to-Primary-950/30 h-full w-0 bg-gradient-to-l md:group-hover:w-full" />
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
