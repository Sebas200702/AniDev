import '@styles/anime-banner.css'

import { useEffect, useState } from 'react'

import { BannerInfo } from '@components/index/banners/banner-info'
import { BannerLoader } from '@components/index/banners/banner-loader'
import { Overlay } from '@components/overlay'
import { createDynamicUrl } from '@utils/create-dynamic-url'
import { createImageUrlProxy } from '@utils/craete-imageurl-proxy'
import { normalizeString } from '@utils/normalize-string'
import { useIndexStore } from '@store/index-store'

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

  if (loading || !bannerData)
    return <BannerLoader animationNumber={animationNumber} />

  const { imageUrl, title, synopsis, mal_id } = bannerData
  const slug = normalizeString(title)

  return (
    <section
      className={`anime-banner-${animationNumber} relative flex flex-row items-center px-4 py-4 md:px-20`}
    >
      <article className="group relative transition-all duration-400 ease-in-out md:hover:opacity-95">
        <a
          href={`/${slug}_${mal_id}`}
          className="h-full w-full"
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
          <Overlay
            heigth="1/3"
            color="Primary-950/100"
            width="full"
            gradient="b"
            rounded="lg"
            hover="h-full"
            zIndex={10}
          />
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
