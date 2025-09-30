import type { BannerImage } from '@anime/types'
import { NextPrevIcon } from '@shared/components/icons/watch/next-prev-icon'
import { Picture } from '@shared/components/media/picture'
import { useFetch } from '@shared/hooks/useFetch'
import { useWindowWidth } from '@shared/hooks/window-width'
import { useUpdateProfile } from '@user/stores/update-profile'
import { Overlay } from 'domains/shared/components/layout/overlay'
import { useEffect, useRef } from 'react'
interface Props {
  id: number
}
export const AnimeBannerColection = ({ id }: Props) => {
  const { setBannerImage, bannerImage } = useUpdateProfile()
  const { width: windowWidth } = useWindowWidth()
  const listRef = useRef<HTMLDivElement>(null)

  const { data, loading } = useFetch<BannerImage[]>({
    url: `/api/getBanner?anime_id=${id}&limit_count=8`,
  })

  const createGroups = (banners: BannerImage[]) => {
    let itemsPerGroup = 1

    return Array.from({
      length: Math.ceil(banners.length / itemsPerGroup),
    }).map((_, groupIndex) =>
      banners.slice(
        groupIndex * itemsPerGroup,
        (groupIndex + 1) * itemsPerGroup
      )
    )
  }

  const groups = data ? createGroups(data) : []

  useEffect(() => {
    const container = listRef.current
    if (!container) return

    const prevBtn = container.parentElement?.querySelector(
      '.prev-button'
    ) as HTMLButtonElement
    const nextBtn = container.parentElement?.querySelector(
      '.next-button'
    ) as HTMLButtonElement

    if (!prevBtn || !nextBtn) return

    const clientWidth = container.clientWidth
    const groupWidth = clientWidth - 32

    const handleClick = (direction: 'next' | 'prev') => {
      if (!container) return
      const scrollAmount = direction === 'next' ? groupWidth : -groupWidth
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }

    const updateButtonsVisibility = () => {
      if (windowWidth && windowWidth < 768) {
        prevBtn.style.display = 'none'
        nextBtn.style.display = 'none'
        return
      }
      const { scrollLeft, scrollWidth, clientWidth } = container
      prevBtn.style.display = scrollLeft <= 0 ? 'none' : 'flex'
      nextBtn.style.display =
        scrollLeft >= scrollWidth - clientWidth - 10 ? 'none' : 'flex'
    }

    prevBtn.addEventListener('click', () => handleClick('prev'))
    nextBtn.addEventListener('click', () => handleClick('next'))
    container.addEventListener('scroll', updateButtonsVisibility)

    updateButtonsVisibility()

    return () => {
      prevBtn.removeEventListener('click', () => handleClick('prev'))
      nextBtn.removeEventListener('click', () => handleClick('next'))
      container.removeEventListener('scroll', updateButtonsVisibility)
    }
  }, [windowWidth, groups.length])
  if (!data || loading)
    return (
      <div className="flex flex-col gap-3 py-4">
        <div className="bg-Primary-700 h-[30px] w-1/3 animate-pulse rounded-md transition-all duration-300 md:mx-8"></div>
        <div className="no-scrollbar flex w-full flex-row gap-4 overflow-x-scroll md:px-8">
          <div className="aspect-[1080/500] w-full animate-pulse rounded bg-zinc-700 duration-300 md:aspect-[1080/300]" />
        </div>
      </div>
    )

  return (
    <section className="flex flex-col gap-3 py-4">
      <header>
        <h3 className="text-l line-clamp-1 px-8">{data[0].title}</h3>
      </header>

      <div className="relative overflow-hidden">
        <button
          className={`prev-button group absolute top-1/2 -left-2 z-10 my-auto flex h-10 w-10 -translate-y-1/2 transform cursor-pointer items-center justify-center transition-all duration-300 ease-in-out focus:outline-none`}
        >
          <NextPrevIcon className="h-3 w-3 md:h-5 md:w-5" />
        </button>
        <button
          className={`next-button group absolute top-1/2 -right-2 z-10 my-auto flex h-10 w-10 -translate-y-1/2 rotate-180 transform cursor-pointer items-center justify-center transition-all duration-300 ease-in-out focus:outline-none`}
        >
          <NextPrevIcon className="h-3 w-3 md:h-5 md:w-5" />
        </button>
        <div
          ref={listRef}
          className="no-scrollbar flex w-full flex-row gap-8 overflow-x-scroll scroll-smooth md:px-8"
        >
          {groups.map((group, groupIndex) => (
            <ul
              key={`group-${groupIndex + 1}`}
              className="flex w-full flex-none gap-4"
            >
              {group.map((banner) => (
                <button
                  key={banner.mal_id}
                  className={`relative h-full w-full border-3 ${banner.banner_image === bannerImage ? 'border-enfasisColor' : 'border-enfasisColor/0'} group aspect-[1080/500] cursor-pointer overflow-hidden rounded object-cover object-center transition-colors duration-300 ease-in-out md:aspect-[1080/300]`}
                  onClick={() => setBannerImage(banner.banner_image)}
                >
                  <Picture
                    styles="w-full h-full object-cover object-center rounded  md:aspect-[1080/300] aspect-[1080/500] relative cursor-pointer "
                    image={banner.banner_image}
                    placeholder={banner.banner_image}
                    alt={`Banner of ${banner.title}`}
                    isBanner
                  />
                  <Overlay className="bg-enfasisColor/40 h-full w-full opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                </button>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
