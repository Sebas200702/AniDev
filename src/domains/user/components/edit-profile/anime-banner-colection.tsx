import { useFetch } from '@hooks/useFetch'
import { useUpdateProfile } from '@store/update-profile'
import { useWindowWidth } from '@store/window-width'
import { NextPrevIcon } from 'domains/shared/components/icons/next-prev-icon'
import { Overlay } from 'domains/shared/components/layout/overlay'
import { Picture } from 'domains/shared/components/media/picture'
import { useEffect, useRef } from 'react'
import type { BannerImage } from 'types'
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
      <div className="py-4 flex flex-col gap-3">
        <div className="w-1/3 rounded-md  bg-Primary-700 h-[30px] animate-pulse md:mx-8 duration-300 transition-all"></div>
        <div className="flex flex-row w-full overflow-x-scroll gap-4 md:px-8  no-scrollbar ">
          <div className="md:aspect-[1080/300] aspect-[1080/500] w-full rounded  bg-zinc-700  animate-pulse duration-300" />
        </div>
      </div>
    )

  return (
    <section className="py-4 flex flex-col gap-3">
      <header>
        <h3 className="text-l line-clamp-1 px-8">{data[0].title}</h3>
      </header>

      <div className="relative overflow-hidden">
        <button
          className={`absolute prev-button -left-2 top-1/2 transform -translate-y-1/2    group  z-10 my-auto flex h-10 w-10 cursor-pointer items-center justify-center transition-all duration-300 ease-in-out focus:outline-none    `}
        >
          <NextPrevIcon className="h-3 w-3 md:h-5 md:w-5" />
        </button>
        <button
          className={`absolute next-button -right-2 top-1/2 transform -translate-y-1/2 rotate-180   group  z-10 my-auto flex h-10 w-10 cursor-pointer items-center justify-center transition-all duration-300 ease-in-out focus:outline-none    `}
        >
          <NextPrevIcon className="h-3 w-3 md:h-5 md:w-5" />
        </button>
        <div
          ref={listRef}
          className="flex flex-row w-full overflow-x-scroll md:px-8 gap-8 no-scrollbar  scroll-smooth"
        >
          {groups.map((group, groupIndex) => (
            <ul
              key={`group-${groupIndex + 1}`}
              className="flex w-full  flex-none gap-4 "
            >
              {group.map((banner) => (
                <button
                  key={banner.mal_id}
                  className={`w-full h-full relative border-3 ${banner.banner_image === bannerImage ? 'border-enfasisColor' : 'border-enfasisColor/0'} md:aspect-[1080/300] object-cover object-center aspect-[1080/500] transition-colors duration-300 rounded overflow-hidden ease-in-out    cursor-pointer group`}
                  onClick={() => setBannerImage(banner.banner_image)}
                >
                  <Picture
                    styles="w-full h-full object-cover object-center rounded  md:aspect-[1080/300] aspect-[1080/500] relative cursor-pointer "
                    image={banner.banner_image}
                    placeholder={banner.banner_image}
                    alt={`Banner of ${banner.title}`}
                    isBanner
                  />
                  <Overlay className="group-hover:opacity-100 opacity-0 h-full w-full bg-enfasisColor/40 transition-opacity duration-200" />
                </button>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
