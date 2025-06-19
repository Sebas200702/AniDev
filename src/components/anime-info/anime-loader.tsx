/**
 * AnimeLoader component displays a loading state for anime detail pages.
 *
 * @description This component provides visual feedback while anime content is being fetched.
 * It displays a series of pulsing elements to indicate that loading is in progress.
 * The component creates a responsive layout that mimics the structure of the actual anime detail page.
 *
 * The layout includes placeholder elements for the banner image, anime poster, title, metadata,
 * and content sections. These elements are styled with animation effects to signal to users
 * that content is loading.
 *
 * The layout adjusts based on screen size, with different arrangements for mobile and desktop views.
 * On mobile devices, elements are stacked vertically with appropriate spacing, while on desktop,
 * they are arranged in a grid layout with more complex positioning.
 *
 * Background and foreground colors use a consistent dark theme with varying shades to create
 * visual hierarchy. All animated elements use the same pulse animation to provide a cohesive
 * loading experience.
 *
 * @returns {JSX.Element} The rendered loading animation for the anime detail page
 *
 * @example
 * <AnimeLoader />
 */
export const AnimeLoader = () => {
  return (
    <div className="min-w-full">
      <div className="fixed aspect-[1080/600] h-[60dvh] w-full animate-pulse bg-zinc-800 duration-300">
        <div className="to-Primary-950/100 absolute right-0 bottom-0 left-0 h-full w-full bg-gradient-to-b from-transparent transition-all duration-300 ease-in-out" />
      </div>
      <div className="z-10 mb-10 grid w-[calc(100dvw-80px)] grid-cols-1 gap-10 px-4 pt-[35dvh] md:mb-20 md:grid-cols-3 md:gap-15 md:px-20 xl:grid-cols-5">
        <div className="row-span-2 row-start-2 -mt-4 flex flex-col gap-6 md:row-start-1 md:mt-0 md:gap-8 md:p-0">
          <div className="aspect-[225/330] h-0 w-full animate-pulse rounded-lg bg-zinc-800 px-8 duration-300 ease-in-out md:h-auto"></div>
          <div className="h-10 w-full animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out xl:h-12"></div>
        </div>
        <div className="flex h-full w-full flex-col justify-end gap-6 md:col-span-2 md:gap-8 xl:col-span-4">
          <div className="mx-auto h-8 w-[80%] animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out md:mx-0 md:h-12 xl:h-20"></div>

          <div className="mx-auto h-8 w-90 animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out md:mx-0 md:h-10"></div>
        </div>

        <div className="row-span-2 flex w-full flex-col gap-4 md:col-span-2 xl:col-span-3">
          <div className="h-9 w-60 animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out"></div>
          <div className="h-100 w-full animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out"></div>
        </div>
        <div className="w-full animate-pulse px-10 md:px-0">
          <div className="mx-auto h-8 w-[80%] rounded-t-lg bg-zinc-700 xl:h-10"></div>
          <div className="h-200 animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out"></div>
        </div>
      </div>
    </div>
  )
}
