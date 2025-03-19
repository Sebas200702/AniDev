interface BannerLoaderProps {
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
