import { CalendarItem } from '@components/schedule/schedule-item'
import { ScheduleLoader } from '@components/schedule/schedule-loader'
import { useCalendarListStore } from '@store/calendar-list-store'
import { useGlobalUserPreferences } from '@store/global-user'
import { useEffect, useState } from 'react'
import type { AnimeCardInfo } from 'types'

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

  const currentSelected = calendarList.find((item) => item.selected)
  const currentSelectedLabel = currentSelected?.label

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (!currentSelectedLabel) return

        const response = await fetch(
          `/api/animes?status_filter=currently airing&aired_day_filter=${currentSelectedLabel}&banners_filter=false&parental_control=${parentalControl}`
        )

        if (response.status === 404) {
          window.location.href = '/404'
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
      <section aria-label="Error message" className="text-center py-12">
        <h2 className="text-2xl font-bold text-Primary mb-4">Error</h2>
        <p role="alert" className="text-Primary/60">
          {error}
        </p>
      </section>
    )
  }

  if (!animeList.length) {
    return (
      <section aria-label="No content message" className="text-center py-12">
        <h2 className="text-2xl font-bold text-Primary mb-4">No Anime Found</h2>
        <p role="status" className="text-Primary/60">
          No scheduled anime for this day
        </p>
      </section>
    )
  }

  return (
    <section className="relative flex flex-col w-full max-w-7xl mx-auto px-6 py-12">
      <header className="text-center mb-12">
        <h2 className="text-3xl font-bold text-Primary mb-3">
          {currentSelectedLabel}'s Schedule
        </h2>
        <p className="text-Primary/60 text-lg">
          Upcoming anime releases for {currentSelectedLabel}
        </p>
      </header>

      <section
        aria-label="Anime schedule timeline"
        className="relative min-h-[400px]"
      >
        <div
          role="presentation"
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-r from-transparent via-Primary-950 to-transparent"
        >
          <div className="absolute inset-0 bg-Primary-50/90 backdrop-blur-sm" />
        </div>

        <ol className="space-y-16">
          {animeList.map((anime, index) => (
            <li key={anime.mal_id} className="relative">
              {/* Timeline point */}
              <div
                role="presentation"
                aria-hidden="true"
                className={`absolute ${index % 2 === 0 ? 'right-[calc(50%-0.5rem)]' : 'left-[calc(50%-0.5rem)]'}
                top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-Primary-50
                flex items-center justify-center transition-colors duration-300`}
              >
                <div className="w-2 h-2 rounded-full bg-Primary group-hover:bg-Primary/90 transition-colors duration-300" />
              </div>

              <CalendarItem anime={anime} isLeft={index % 2 === 0} />
            </li>
          ))}
        </ol>
      </section>
    </section>
  )
}
