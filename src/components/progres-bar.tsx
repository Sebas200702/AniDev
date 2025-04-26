import { useEffect, useRef, useState } from 'react'

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
      className={`fixed top-0 left-0 w-full z-50 transition-opacity duration-300 rounded-md ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="h-1 bg-Primary-900/30">
        <div
          className="h-full bg-enfasisColor transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
