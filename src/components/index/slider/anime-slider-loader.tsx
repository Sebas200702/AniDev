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
  return (
    <div className="relative flex w-[100dvw] flex-col">
      <header className="flex w-full flex-row items-center justify-center space-x-4 px-4 py-4 md:px-20">
        <span className="bg-enfasisColor h-8 w-2 rounded-lg xl:h-10"></span>
        <span className="inline-flex h-7.5 w-32 animate-pulse rounded-lg bg-zinc-800 xl:h-10.5"></span>
        <div className="flex-1"></div>
      </header>
      <div className="relative overflow-hidden py-4 pl-4 md:pl-20">
        <div className="anime-list flex w-full flex-row gap-5 overflow-x-auto md:gap-10">
          {Array(24)
            .fill(0)
            .map((_, i) => (
              <div
                key={i + 1}
                className="flex h-auto w-full min-w-[calc((100dvw-32px)/2.4)] flex-col items-center duration-200 md:min-w-[calc((100dvw-280px)/4)] xl:min-w-[calc((100dvw-360px)/6)]"
              >
                <div className="aspect-[225/330] h-auto w-full animate-pulse rounded-lg bg-zinc-800 md:aspect-[225/330]"></div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
