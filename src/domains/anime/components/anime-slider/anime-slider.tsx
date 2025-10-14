import { AnimeCard } from '@anime/components/anime-card/anime-card'
import { NexPrevBtnSlideList } from '@anime/components/anime-slider/next-prev-btn-slider-list'
import { SliderHeader } from '@anime/components/anime-slider/slider-header'
import type { AnimeCardInfo } from '@anime/types'

interface Props {
  title: string
  showPrev: boolean
  showNext: boolean
  scrollPrev: () => void
  scrollNext: () => void
  listRef: React.RefObject<HTMLDivElement | HTMLUListElement | null>
  groups: AnimeCardInfo[][]
  context?: string
}
export const AnimeSlider = ({
  title,
  showPrev,
  showNext,
  scrollPrev,
  scrollNext,
  listRef,
  groups,
  context,
}: Props) => {
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
