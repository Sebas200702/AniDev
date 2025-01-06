import { useEffect, useState } from 'react'
import { createImageUrlProxy } from '@utils/craete-imageurl-proxy'
import { createDynamicBannersUrl } from '@utils/create-dynamic-banners-url'
import { reduceString } from '@utils/reduce-string'
import { useIndexStore } from '@store/index-store'
import { normalizeString } from '@utils/normalize-string'
import '@styles/anime-banner.css'
import '@styles/buttons.css'

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

  const getBannerUrl = async () => {
    const bannerUrl = createDynamicBannersUrl(1)
    const response = await fetch(`${bannerUrl}`).then((res) => res.json())
    const anime = response.data[0]

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
      }, 700)
    }

    fetchBannerData()
  }, [])

  if (loading || !bannerData) {
    return (
      <div
        className={`anime-banner-${animationNumber} flex aspect-[1080/500] h-auto w-full animate-pulse items-center justify-center bg-zinc-700 transition-all duration-200 ease-in-out md:aspect-[1080/300]`}
      ></div>
    )
  }

  const { imageUrl, title, synopsis, mal_id } = bannerData
  const slug = normalizeString(title)

  return (
    <section
      className={`anime-banner-${animationNumber} relative mx-auto flex flex-row items-center`}
    >
      <a
        href={`/${slug}_${mal_id}`}
        className="group h-full w-full transition-all duration-200 ease-in-out md:hover:opacity-95"
        aria-label={`View details for ${title}`}
      >
        <img
          src={createImageUrlProxy(imageUrl, '1920', '50', 'webp')}
          alt="Anime Banner"
          loading="lazy"
          className="aspect-[1080/500] h-full w-full object-cover object-center md:aspect-[1080/300]"
          width={720}
          height={300}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-base opacity-0 transition-all duration-200 ease-in-out md:group-hover:opacity-100" />
      </a>
      <div className="absolute bottom-0 right-0 z-10 mx-auto flex h-full w-full flex-col justify-between gap-4 bg-black/30 p-2 md:m-4 md:h-auto md:max-w-80 md:rounded-lg">
        <a
          href={`/${slug}_${mal_id}`}
          className="transition-all duration-200 ease-in-out md:hover:opacity-95"
        >
          <h2 className="max-h-16 overflow-hidden text-center text-xl font-bold text-white md:text-2xl">
            {title}
          </h2>
        </a>

        <p className="max-h-32 overflow-hidden text-center text-sm text-white md:text-start">
          {reduceString(synopsis, 70)}
        </p>
        <a href={`/watch/${slug}_${mal_id}`} className="button-primary">
          Watch Now
        </a>
      </div>
    </section>
  )
}
