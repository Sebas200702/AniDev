import { useEffect, useState } from 'react'
import { createImageUrlProxy } from '@utils/craete-imageurl-proxy'
import { createDynamicBannersUrl } from '@utils/create-dynamic-banners-url'
import { reduceSynopsis } from '@utils/reduce-synopsis'
import { useIndexStore } from '@store/index-store'
import { normalizeString } from '@utils/normalize-string'
import { baseUrl } from '@utils/base-url'

export const AnimeBanner = () => {
  const [bannerData, setBannerData] = useState<{
    imageUrl: string
    title: string
    synopsis: string
    mal_id: number
  } | null>(null)
  const { setAnimeBanners, animeBanners } = useIndexStore()

  const [loading, setLoading] = useState(true)

  const getBannerUrl = async () => {
    const bannerUrl = createDynamicBannersUrl(1)
    const response = await fetch(`${baseUrl}${bannerUrl}`).then((res) =>
      res.json()
    )
    const anime = response.anime[0]

    if (!anime || animeBanners.includes(anime.mal_id)) {
      return await getBannerUrl()
    }
    animeBanners.push(anime.mal_id)
    return {
      imageUrl: anime.banner_image,
      title: anime.title,
      synopsis: anime.synopsis,
      mal_id: anime.mal_id,
    }
  }

  useEffect(() => {
    const fetchBannerData = async () => {
      const data = await getBannerUrl()
      if (data) {
        setBannerData(data)
        setAnimeBanners([...animeBanners, data.mal_id])
      }
      setTimeout(() => {
        setLoading(false)
      }, 400)
    }

    fetchBannerData()
  }, [])

  if (loading || !bannerData) {
    return (
      <div className="flex aspect-[1080/500] h-auto w-full animate-pulse items-center justify-center bg-gray-400 transition-all duration-200 ease-in-out md:aspect-[1080/300]"></div>
    )
  }

  const { imageUrl, title, synopsis, mal_id } = bannerData
  const slug = normalizeString(title)

  return (
    <section className="relative mx-auto flex flex-row items-center">
      <a
        href={`/${slug}_${mal_id}`}
        className="group h-full w-full transition-all duration-200 ease-in-out hover:opacity-95"
        aria-label={`View details for ${title}`}
      >
        <img
          src={createImageUrlProxy(imageUrl, '0', '50', 'webp')}
          alt="Anime Banner"
          loading="lazy"
          className="aspect-[1080/500] h-full w-full object-cover object-center md:aspect-[1080/300]"
          width={720}
          height={300}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100" />
      </a>
      <div className="absolute bottom-0 right-0 z-10 mx-auto flex h-full w-full flex-col justify-between gap-4 rounded-lg bg-black/30 p-2 md:m-4 md:h-auto md:max-w-80">
        <a href={`/${slug}_${mal_id}`}>
          <h2 className="text-center text-xl font-bold text-white md:text-2xl">
            {title}
          </h2>
        </a>

        <p className="text-xs text-white md:text-sm">
          {reduceSynopsis(synopsis, 100)}
        </p>
        <a
          href={`/watch/${slug}_${mal_id}`}
          className="flex w-full items-center justify-center rounded-lg bg-blue-400 px-4 py-2 text-sm text-white hover:bg-blue-500 md:text-base"
        >
          View Now
        </a>
      </div>
    </section>
  )
}
