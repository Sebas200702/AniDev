import { Overlay } from '@components/overlay'

/**
 * LoadingCarousel component displays a loading animation for the carousel.
 *
 * @description This component provides visual feedback while content is being fetched for the carousel.
 * It shows a series of pulsing elements to indicate that loading is in progress. The component
 * creates a responsive layout that mimics the structure of the actual carousel content.
 * It includes placeholder elements for the title, description, action buttons, and navigation indicators.
 * These elements are styled with animation effects to signal to users that content is loading.
 *
 * The component implements a responsive design that adapts to different screen sizes. On mobile devices,
 * elements are stacked vertically with appropriate spacing, while on desktop, they are arranged
 * horizontally with more generous spacing and additional elements. This ensures a consistent
 * user experience across various devices.
 *
 * Background and foreground colors use a consistent dark theme with varying shades to create
 * visual hierarchy. All animated elements use the same pulse animation to provide a cohesive
 * loading experience. The layout maintains proper z-index values to ensure correct layering
 * of UI elements.
 *
 * @returns {JSX.Element} The rendered loading animation for the carousel with pulsing placeholder elements
 *
 * @example
 * <LoadingCarousel />
 */
export const LoadingCarousel = () => (
  <div className="carousel-anime-banner relative animate-pulse bg-zinc-900 h-[70vh] md:h-[650px] xl:h-[90vh]">
    <div className="relative flex h-[70vh]  w-full flex-shrink-0 flex-col items-center md:h-[650px] md:flex-row xl:h-[90vh]">
      <div className="z-10 mx-auto  flex h-full w-full max-w-2xl items-center flex-col justify-center gap-4 p-6 pt-36 md:-mt-4 md:pt-0 text-white md:mr-16 md:ml-8 md:h-auto md:items-start md:justify-normal">
        <div className="z-30 h-12 w-[80%] animate-pulse rounded-lg bg-zinc-800  md:mb-4"></div>
        <div className="z-30 h-12 mt-2  w-full animate-pulse rounded-lg bg-zinc-800 md:flex"></div>

        <div className="flex w-full flex-row items-center justify-center gap-4 mt-5 md:mt-2 md:justify-normal">
          <div className=" md:max-w-44 w-full h-10 animate-pulse rounded-lg bg-zinc-800 md:flex"></div>
          <div className=" md:max-w-44 w-full h-10 animate-pulse rounded-lg bg-zinc-800"></div>
        </div>
      </div>
    </div>
    <div className="absolute bottom-21 left-1/2 z-30 flex h-4 w-44 -translate-x-1/2 animate-pulse rounded-lg bg-zinc-800 md:bottom-16"></div>
    <Overlay className="to-Primary-950 mt-16 h-full w-full bg-gradient-to-b" />
  </div>
)
