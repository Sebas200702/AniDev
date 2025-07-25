import { Picture } from '@components/media/picture'
import { baseUrl } from '@utils/base-url'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { useEffect, useState } from 'react'

interface Props {
  banners: string[]
}

export const DinamicBanner = ({ banners }: Props) => {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showFirstLayer, setShowFirstLayer] = useState(true)
  const [firstLayerIndex, setFirstLayerIndex] = useState(0)
  const [secondLayerIndex, setSecondLayerIndex] = useState(0)
  useEffect(() => {
    if (!banners || banners.length <= 1) return

    const evenBannerIndices = banners
      .map((_, index) => index)
      .filter((index) => index % 2 === 0)

    const oddBannerIndices = banners
      .map((_, index) => index)
      .filter((index) => index % 2 === 1)

    const toggleVisibility = () => {
      setIsTransitioning(true)

      setTimeout(() => {
        if (showFirstLayer) {
          setFirstLayerIndex(
            (currentIndex) => (currentIndex + 1) % evenBannerIndices.length
          )
        } else {
          setSecondLayerIndex(
            (currentIndex) => (currentIndex + 1) % oddBannerIndices.length
          )
        }

        setShowFirstLayer(!showFirstLayer)
        setIsTransitioning(false)
      }, 500)
    }

    const interval = setInterval(toggleVisibility, 25000)

    return () => clearInterval(interval)
  }, [banners, showFirstLayer])

  const evenBannerIndices = banners
    .map((_, index) => index)
    .filter((index) => index % 2 === 0)

  const oddBannerIndices = banners
    .map((_, index) => index)
    .filter((index) => index % 2 === 1)

  const firstImageIndex = evenBannerIndices[firstLayerIndex] || 0
  const secondImageIndex = oddBannerIndices[secondLayerIndex] || 1

  const firstImage = banners[firstImageIndex]
  const secondImage = banners[secondImageIndex]

  return (
    <div className="fixed aspect-[1080/600] h-[40vh] w-full overflow-hidden md:h-[60vh]">
      <div
        className={`h-full w-full transition-opacity duration-1000 ease-out ${
          showFirstLayer && !isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Picture
          image={createImageUrlProxy(
            firstImage ?? `${baseUrl}/placeholder.webp`,
            '100',
            '0',
            'webp'
          )}
          styles="w-full object-cover object-center h-full relative "
        >
          <img
            src={createImageUrlProxy(
              firstImage ?? `${baseUrl}/placeholder.webp`,
              '1920',
              '50',
              'webp'
            )}
            alt=""
            className="relative h-full w-full object-cover object-center"
          />
        </Picture>
      </div>
      <div
        className={`absolute top-0 left-0 h-full w-full transition-opacity duration-1000 ease-out ${
          !showFirstLayer && !isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Picture
          image={createImageUrlProxy(
            secondImage ?? `${baseUrl}/placeholder.webp`,
            '100',
            '0',
            'webp'
          )}
          styles="w-full object-cover object-center h-full relative "
        >
          <img
            src={createImageUrlProxy(
              secondImage ?? `${baseUrl}/placeholder.webp`,
              '1920',
              '50',
              'webp'
            )}
            alt=""
            className="relative h-full w-full object-cover object-center"
          />
        </Picture>
      </div>
    </div>
  )
}
