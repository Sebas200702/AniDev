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
      <div className="z-10 -mt-[60vh] grid grid-cols-1 gap-10 px-4 md:-mt-54 md:grid-cols-3 md:gap-15 md:px-20 xl:grid-cols-5 md:mb-20 mb-10">
        <div className="row-span-2 flex flex-col px-8 md:gap-8 gap-6 md:p-0 mt-26 md:mt-0">
          <div className="aspect-[225/330] h-auto w-full animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out"></div>
          <div className="animate-pulse rounded-lg xl:h-12 h-8 w-full bg-zinc-800 duration-300 ease-in-out"></div>
        </div>
        <div className="flex h-full w-full flex-col justify-end md:col-span-2 xl:col-span-4 gap-6 md:gap-8">
          <div className="xl:h-20 md:h-12 md:mx-0 mx-auto animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out w-[80%]"></div>

          <div className="h-10 w-90 md:mx-0 mx-auto animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out"></div>
        </div>

        <div className="row-span-2  w-full  md:col-span-2 xl:col-span-3 flex flex-col gap-4">
          <div className="animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out h-12 w-60"></div>
          <div className="animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out h-100 w-full"></div>
        </div>
        <div className=" w-full px-10 md:px-0 animate-pulse ">
          <div className="w-[80%] mx-auto xl:h-10 h-8  rounded-t-lg bg-zinc-700 "></div>
          <div className="  h-200 animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out"></div>
        </div>
      </div>
    </div>
  )
}
