import '@styles/anime-banner.css'

import { useEffect, useState } from 'react'

import { WatchAnimeButton } from '@components/watch-anime'
import { useIndexStore } from '@store/index-store'
import { createImageUrlProxy } from '@utils/craete-imageurl-proxy'
import { createDynamicUrl } from '@utils/create-dynamic-url'
import { normalizeString } from '@utils/normalize-string'
import { reduceString } from '@utils/reduce-string'

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

  const getBannerUrl = async (url: string) => {
    const response = await fetch(`/api/animes?${url}&banners_filter=true`).then(
      (res) => res.json()
    )
    const anime = response.data[0]

    if (!anime || animeBanners.includes(anime.mal_id)) {
      const { url: newUrl } = createDynamicUrl(1)
      return await getBannerUrl(newUrl)
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
      const data = await getBannerUrl(url)
      if (!data) return
      setBannerData(data)
      setAnimeBanners([...animeBanners, data.mal_id])
      sessionStorage.setItem(`animeBanner_${id}`, JSON.stringify(data))

      setTimeout(() => {
        setLoading(false)
      }, 100)
    }

    fetchBannerData()
  }, [])

  if (loading || !bannerData) {
    return (
      <div className="py-4">
        <div
          className={`py-4 anime-banner-${animationNumber} flex aspect-[1080/500] h-auto w-full animate-pulse items-center justify-center bg-zinc-800 transition-all duration-200 ease-in-out md:aspect-[1080/300]`}
        ></div>
      </div>
    )
  }

  const { imageUrl, title, synopsis, mal_id } = bannerData
  const slug = normalizeString(title)

  return (
    <section
      className={`anime-banner-${animationNumber} relative flex flex-row items-center px-4 py-4 md:px-20`}
    >
      <a
        href={`/${slug}_${mal_id}`}
        className="group h-full w-full transition-all duration-200 ease-in-out md:hover:opacity-95"
        aria-label={`View details for ${title}`}
      >
        <picture
          className="aspect-[1080/550] h-full w-full object-cover object-center md:aspect-[1080/350]"
          style={{
            backgroundImage: `url(${createImageUrlProxy(imageUrl, '100', '0', 'webp')})`,
          }}
        >
          <img
            src={createImageUrlProxy(imageUrl, '1920', '50', 'webp')}
            alt="Anime Banner"
            loading="lazy"
            className="aspect-[1080/550] h-full w-full rounded-2xl object-cover object-center md:aspect-[1080/350]"
            width={720}
            height={300}
          />
        </picture>
        <div className="to-Primary-950 absolute inset-0 bg-gradient-to-b from-transparent opacity-0 transition-all duration-500 ease-in-out md:group-hover:opacity-70" />
      </a>
      <div className="bg-Primary-950/50 absolute right-0 z-10 flex h-full w-full flex-col items-center justify-between p-8 md:right-20 md:bottom-10 md:max-h-44 md:max-w-96 md:rounded-l-2xl md:p-4 md:pr-10 xl:max-h-60">
        <a
          href={`/${slug}_${mal_id}`}
          className="transition-all duration-200 ease-in-out md:hover:opacity-95"
        >
          <h3 className="text-lx max-h-44 w-full overflow-hidden text-center font-bold text-white">
            {reduceString(title, 40)}
          </h3>
        </a>

        <p className="text-sx md:text-s max-h-32 w-full overflow-hidden text-center text-white md:text-start">
          {reduceString(synopsis, 80)}
        </p>
        <WatchAnimeButton url={`/watch/${slug}_${mal_id}`} />
      </div>
    </section>
  )
}
