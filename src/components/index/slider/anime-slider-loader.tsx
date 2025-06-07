import { LoadingCard } from '@components/search/results/loading-card'
import { useWindowWidth } from '@store/window-width'
import type { AnimeCardInfo } from 'types'
/**
 * AnimeSliderLoader component displays a loading state for anime sliders.
 *
 * @description This component provides visual feedback while anime slider content is being fetched.
 * It displays a series of pulsing placeholder elements that mimic the structure of the actual
 * anime slider. The component creates a responsive layout that maintains visual consistency
 * with the loaded content.
 *
 * The layout includes a placeholder for the section header with title and a horizontal scrollable
 * area with anime card placeholders. Each card contains a pulsing element that represents the
 * anime poster. These elements are styled with animation effects to signal to users that content
 * is loading.
 *
 * The component adapts to different screen sizes, displaying different numbers of visible items
 * based on the viewport width. On mobile devices, approximately 2 cards are visible, increasing
 * to 4 on medium screens and 6 on larger screens. It maintains consistent padding and spacing
 * to ensure a smooth transition when the actual content loads.
 *
 * The animations use a consistent pulse effect across all placeholder elements to provide
 * a cohesive loading experience that aligns with the application's visual language.
 *
 * @returns {JSX.Element} The rendered loading animation for the anime slider
 *
 * @example
 * <AnimeSliderLoader />
 */
export const AnimeSliderLoader = () => {
  const { width: windowWidth } = useWindowWidth()
  const animes = Array.from({ length: 7 }, (_, index) => index)

  const createGroups = (animes: number[]) => {
    let itemsPerGroup = 2

    return Array.from({ length: Math.ceil(animes.length / itemsPerGroup) }).map(
      (_, groupIndex) => {
        return animes.slice(
          groupIndex * itemsPerGroup,
          (groupIndex + 1) * itemsPerGroup
        )
      }
    )
  }

  const groups = createGroups(animes)

  return (
    <div className="relative flex flex-col">
      <header className="flex w-full flex-row items-center justify-center space-x-4 px-4 py-4 md:px-20">
        <span className="bg-enfasisColor h-8 w-2 rounded-lg xl:h-10"></span>
        <span className="inline-flex h-7.5 w-32 animate-pulse rounded-lg bg-zinc-800 xl:h-10.5"></span>
        <div className="flex-1"></div>
      </header>

      <div className="anime-list no-scrollbar flex w-full snap-x snap-mandatory gap-6 overflow-x-scroll scroll-smooth px-4 py-4 md:gap-10 md:px-20">
        {groups.map((group, groupIndex) => (
          <section
            key={groupIndex}
            className="grid w-[90%] flex-none grid-cols-2 gap-6 md:w-[calc(50%-20px)] md:gap-10 xl:w-[calc(33.33%-27px)]"
          >
            {group.map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
