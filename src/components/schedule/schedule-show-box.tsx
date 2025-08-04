import { CalendarItem } from '@components/schedule/schedule-item'
import { ScheduleLoader } from '@components/schedule/schedule-loader'
import { toast } from '@pheralb/toast'
import { useCalendarListStore } from '@store/calendar-list-store'
import { useGlobalUserPreferences } from '@store/global-user'
import { useWindowWidth } from '@store/window-width'
import { useEffect, useState } from 'react'
import type { AnimeCardInfo } from 'types'

import { ToastType } from 'types'

/**
 * CalendarShowBox component displays a timeline of scheduled anime releases.
 *
 * @description This component manages the loading state and fetches anime data based on the selected day.
 * It uses the global user preferences for parental control settings and displays anime in a visually
 * appealing timeline layout. The component implements error handling and loading states to provide
 * a smooth user experience.
 *
 * The component maintains state for the anime list and selected day, fetching new data when the
 * selection changes. During loading and data fetching, it displays a skeleton loader that matches
 * the layout of the actual content. Error states are handled by redirecting to a 404 page when
 * appropriate.
 *
 * The UI features a responsive design with a centered timeline and alternating left/right positioned
 * anime cards. Visual elements like decorative caps and a central line enhance the timeline appearance.
 *
 * @returns {JSX.Element} The rendered calendar show box with timeline and anime cards
 *
 * @example
 * <CalendarShowBox />
 */
export const CalendarShowBox = () => {
  const { calendarList } = useCalendarListStore()
  const { parentalControl } = useGlobalUserPreferences()
  const [animeList, setAnimeList] = useState<AnimeCardInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { width } = useWindowWidth()
  const isMobile = width < 768

  const currentSelected = calendarList.find((item) => item.selected)
  const currentSelectedLabel = currentSelected?.label
  useEffect(() => {
    if (error) {
      toast[ToastType.Error]({
        text: error,
      })
    }
  }, [error])
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (!currentSelectedLabel) return

        const response = await fetch(
          `/api/animes?status_filter=currently airing&aired_day_filter=${currentSelectedLabel}&banners_filter=false&parental_control=${parentalControl}&format=schedule`
        )

        if (response.status === 404) {
          return
        }

        if (!response.ok) {
          throw new Error('Failed to fetch anime data')
        }

        const data = await response.json()
        setAnimeList(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [calendarList, currentSelectedLabel, parentalControl])

  if (isLoading) {
    return <ScheduleLoader />
  }

  if (error) {
    return (
      <section aria-label="Error message" className="py-12 text-center">
        <h2 className="text-Primary mb-4 text-2xl font-bold">Error</h2>
        <p role="alert" className="text-Primary/60">
          {error}
        </p>
      </section>
    )
  }

  if (!animeList.length) {
    return (
      <section aria-label="No content message" className="py-12 text-center">
        <h2 className="text-Primary mb-4 text-2xl font-bold">No Anime Found</h2>
        <p role="status" className="text-Primary/60">
          No scheduled anime for this day
        </p>
      </section>
    )
  }

  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-col px-6 py-12">
      <section
        aria-label="Anime schedule timeline"
        className="relative min-h-[400px]"
      >
        <div
          role="presentation"
          className="via-Primary-950 absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-r from-transparent to-transparent md:left-1/2 md:-translate-x-1/2"
        >
          <div className="bg-Primary-50/90 absolute inset-0 backdrop-blur-sm" />
        </div>

        <ol className="space-y-16 pl-8 md:pl-0">
          {animeList.map((anime, index) => (
            <li key={anime.mal_id} className="relative">
              {/* Timeline point */}
              <div
                role="presentation"
                aria-hidden="true"
                className="bg-Primary-50 absolute top-1/2 -left-10 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full md:left-1/2 md:-translate-x-1/2"
              >
                <div className="bg-Primary group-hover:bg-Primary/90 h-2 w-2 rounded-full transition-colors duration-300" />
              </div>

              <CalendarItem
                anime={anime}
                isLeft={index % 2 === 0}
                isMobile={isMobile}
              />
            </li>
          ))}
        </ol>
      </section>
    </section>
  )
}
