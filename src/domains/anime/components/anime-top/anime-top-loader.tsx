/**
 * AnimeTopLoader component displays a loading state for the top anime list.
 *
 * @description This component provides visual feedback while the top anime data is being fetched.
 * It displays a series of pulsing placeholder elements that mimic the structure of the actual
 * top anime list. The component creates a responsive layout that maintains visual consistency
 * with the loaded content.
 *
 * The layout includes placeholder elements for the section header with title, and a grid of
 * anime items. Each item contains placeholders for the rank number, anime poster, and metadata.
 * These elements are styled with animation effects to signal to users that content is loading.
 *
 * The component adapts to different screen sizes, displaying a single column on mobile devices
 * and two columns on larger screens. It maintains consistent padding and spacing to ensure
 * a smooth transition when the actual content loads.
 *
 * The animations use a consistent pulse effect across all placeholder elements to provide
 * a cohesive loading experience that aligns with the application's visual language.
 *
 * @returns {JSX.Element} The rendered loading animation for the top anime section
 *
 * @example
 * <AnimeTopLoader />
 */
export const AnimeTopLoader = () => {
  return (
    <div className="relative">
      <header className="flex w-full flex-row items-center space-x-4 px-4 py-4 md:px-20">
        <span className="bg-enfasisColor h-8 w-2 rounded-lg xl:h-10"></span>
        <span className="inline-flex h-7.5 w-32 animate-pulse rounded-lg bg-zinc-800 xl:h-10.5"></span>
      </header>
      <div className="mx-auto grid grid-cols-1 items-center justify-around gap-4 px-4 py-4 md:px-20 xl:grid-cols-2 xl:gap-x-12">
        {new Array(10)
          .fill(0)
          .map((_, i) => (
            <div
              key={i + 1}
              className="flex w-full flex-row items-center gap-2"
            >
              <div className="h-full w-full max-w-12 md:max-w-18"></div>
              <div className="bg-Complementary w-full animate-pulse rounded-lg duration-300">
                <div className="aspect-[225/330] h-auto w-full max-w-20 animate-pulse rounded-lg bg-zinc-800 md:max-w-32"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
