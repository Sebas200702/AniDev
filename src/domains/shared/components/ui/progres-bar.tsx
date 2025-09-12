import { useEffect, useRef, useState } from 'react'

/**
 * ProgressBar component displays a loading progress bar at the top of the screen.
 *
 * @description This component renders a progress bar that visually indicates the loading state
 * of the application during navigation events. It listens for custom events (`astro:before-preparation`
 * and `astro:page-load`) to start and stop the progress bar animation. The progress bar smoothly
 * transitions its width to simulate loading progress and disappears once the loading is complete.
 *
 * The progress bar's width increases incrementally up to 90% during loading and jumps to 100% when
 * the loading is finished. It uses a timeout to delay the hiding of the progress bar for a smoother
 * user experience.
 *
 * The component is styled to appear fixed at the top of the viewport and uses opacity transitions
 * to fade in and out based on the loading state.
 *
 * @returns {JSX.Element} The rendered progress bar component.
 *
 * @example
 * <ProgressBar />
 */
export const ProgressBar = () => {
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleNavigationStart = () => {
      setIsLoading(true)
      setProgress(0)

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }

      progressIntervalRef.current = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + Math.random() * 10
          return newProgress < 90 ? newProgress : 90
        })
      }, 100)
    }

    const handleNavigationEnd = () => {
      setProgress(100)

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }

      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }

    document.addEventListener('astro:before-preparation', handleNavigationStart)
    document.addEventListener('astro:page-load', handleNavigationEnd)

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
      document.removeEventListener(
        'astro:before-preparation',
        handleNavigationStart
      )
      document.removeEventListener('astro:page-load', handleNavigationEnd)
    }
  }, [])

  return (
    <div
      className={`fixed top-0 left-0 z-[99999] w-full rounded-md transition-opacity duration-300 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="bg-Primary-900/30 h-1">
        <div
          className="bg-enfasisColor h-full transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
