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
    <div className="">
      <div className="relative aspect-[1080/600] h-[60dvh] w-full animate-pulse bg-zinc-800 duration-300">
        <div className="to-Primary-950/100 absolute right-0 bottom-0 left-0 h-full w-full bg-gradient-to-b from-transparent transition-all duration-300 ease-in-out" />
      </div>
      <div className="z-10 -mt-96 grid grid-cols-1 gap-4 px-4 md:-mt-54 md:grid-cols-3 md:gap-15 md:px-20 xl:grid-cols-5">
        <div className="row-span-2 p-8 md:p-0">
          <div className="aspect-[225/330] h-auto w-full animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out"></div>
        </div>
        <div className="flex h-full w-full flex-col justify-end gap-4 md:col-span-2 xl:col-span-4">
          <div className="h-20 w-full animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out md:w-[80%]"></div>

          <div className="h-20 w-60 animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out md:h-15 md:w-90"></div>
        </div>

        <div className="row-span-2 h-100 w-full animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out md:col-span-2 xl:col-span-3"></div>
        <div className="h-200 w-full animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out"></div>
      </div>
    </div>
  )
}
