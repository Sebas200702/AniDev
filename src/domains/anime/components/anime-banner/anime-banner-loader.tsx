import { Loader } from '@shared/components/ui/loader'
interface BannerLoaderProps {
  animationNumber: number
}
export const BannerLoader = ({ animationNumber }: BannerLoaderProps) => {
  return (
    <div className="md:mx-20 md:my-4">
      <Loader
        className={`anime-banner-${animationNumber} aspect-[1080/500] h-full w-full bg-zinc-800 transition-all duration-200 ease-in-out md:aspect-[1080/300] md:rounded-2xl`}
      />
    </div>
  )
}
