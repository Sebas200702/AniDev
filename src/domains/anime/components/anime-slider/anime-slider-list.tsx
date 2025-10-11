
import { AnimeCard } from '@anime/components/anime-card/anime-card'
import { AnimeSliderLoader } from '@anime/components/anime-slider/anime-slider-loader'
import { NexPrevBtnSlideList } from '@anime/components/anime-slider/next-prev-btn-slider-list'
import { SliderHeader } from '@anime/components/anime-slider/slider-header'
import type { AnimeCardInfo } from '@anime/types'
import { createGroups } from '@anime/utils/create-groups'
import { useFetch } from '@shared/hooks/useFetch'
import { useHorizontalScroll } from '@shared/hooks/useHorizontalScroll'
import { useGlobalUserPreferences } from '@user/stores/user-store'

interface Props {
  url: string
  title: string
  context?: string
}

/**
 * AnimeSlider component displays a horizontally scrollable list of anime cards with navigation controls.
 *
 * @description This component manages the loading state, fetches anime data, and provides horizontal scrolling functionality.
 * It uses session storage to cache the fetched data for faster access. The component implements responsive
 * behavior by adjusting the navigation controls and scroll behavior based on the window width.
 *
 * The component maintains an internal state for anime data, loading status, and window dimensions.
 * It implements an efficient caching mechanism using sessionStorage to improve performance on
 * subsequent visits. When no cached data is available, it dynamically fetches anime based on the
 * provided query parameter.
 *
 * The UI displays a title header, left and right navigation buttons, and a horizontally scrollable
 * list of anime cards. During loading, a skeleton loader is displayed to improve user experience.
 * The navigation buttons automatically hide when scrolling reaches the beginning or end of the list.
 *
 * @param {Props} props - The component props
 * @param {string} props.url - The full API url to fetch anime data from
 * @param {string} props.title - The title displayed at the top of the slider
 * @returns {JSX.Element} The rendered anime slider with title, navigation buttons, and scrollable anime cards
 *
 * @example
 * <AnimeSlider url="/api/animes?limit_count=24&genre_filter=action&banners_filter=false" title="Action Anime" />
 */
export const AnimeSlider = ({ url, title, context }: Props) => {
  const { parentalControl } = useGlobalUserPreferences()

  const { listRef, showPrev, showNext, scrollNext, scrollPrev, windowWidth } =
    useHorizontalScroll({
      mobileBreakpoint: 768,
      scrollPadding: 120,
    })

  const { data: animes, loading } = useFetch<AnimeCardInfo[]>({
    url: url + `&parental_control=${parentalControl}`,
  })
  if (loading || !animes) {
    return <AnimeSliderLoader context={context} />
  }

  const groups = createGroups(animes, windowWidth, context)

  return (
    <section className="anime-slider fade-out relative mx-auto w-full">
      <SliderHeader title={title} />

      <div className="relative overflow-hidden">
        {showPrev && (
          <NexPrevBtnSlideList
            onClick={scrollPrev}
            label="prev-button"
            styles="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
          />
        )}
        {showNext && (
          <NexPrevBtnSlideList
            onClick={scrollNext}
            label="next-button"
            styles="absolute right-0 top-1/2 transform -translate-y-1/2 rotate-180 z-10"
          />
        )}

        <section
          ref={listRef}
          className={`anime-list no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-scroll scroll-smooth px-4 py-4 md:gap-10 md:px-20`}
        >
          {groups.map((group, groupIndex) => (
            <ul
              key={groupIndex}
              className={`grid w-[90%] flex-none grid-cols-2 gap-6 md:w-full md:gap-10 ${
                context === 'anime-info'
                  ? 'md:grid-cols-3 xl:grid-cols-4'
                  : 'md:grid-cols-4 xl:grid-cols-6'
              }`}
            >
              {group.map((anime: AnimeCardInfo) => (
                <AnimeCard anime={anime} key={anime.mal_id} />
              ))}
            </ul>
          ))}
        </section>
      </div>
    </section>
  )
}
