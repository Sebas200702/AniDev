/**
 * BannerLoader component displays a loading state for the banner.
 *
 * @description This component renders a placeholder with an animated pulse effect while
 * banner content is loading. It creates a visually consistent loading experience that
 * maintains the layout dimensions of the actual banner to prevent layout shifts when
 * content loads. The component supports different animation styles based on the provided
 * animation number.
 *
 * The component uses responsive design principles to adjust its dimensions based on screen
 * size, with a different aspect ratio for mobile and desktop viewports. The animated pulse
 * effect provides visual feedback to users that content is being loaded, enhancing the
 * perceived performance of the application.
 *
 * @param {BannerLoaderProps} props - The component props
 * @param {number} props.animationNumber - The animation number to customize the animation style
 * @returns {JSX.Element} The rendered banner loader with appropriate styling and animation
 *
 * @example
 * <BannerLoader animationNumber={1} />
 */
interface BannerLoaderProps {
  /**
   * The animation number to customize the animation style.
   */
  animationNumber: number
}
export const BannerLoader = ({ animationNumber }: BannerLoaderProps) => {
  return (
    <div className="py-4">
      <div
        className={`anime-banner-${animationNumber} mx-4 flex aspect-[1080/500] w-full h-full animate-pulse items-center justify-center rounded-2xl bg-zinc-800  transition-all duration-200 ease-in-out md:mx-20 md:aspect-[1080/350]`}
      ></div>
    </div>
  )
}
