import { useCalendarListStore } from '@store/calendar-list-store'
import { useGlobalUserPreferences } from '@store/global-user'
import { useEffect, useState } from 'react'
import type { AnimeCardInfo } from 'types'
export const CalendarShowBox = () => {
  const { calendarList } = useCalendarListStore()
  const { parentalControl } = useGlobalUserPreferences()
  const [animeList, setAnimeList] = useState<AnimeCardInfo[]>([])
  const currentSelected = calendarList.find((item) => item.selected)
  const currentSelectedLabel = currentSelected?.label

  useEffect(() => {
    const fecthData = async () => {
      calendarList.forEach(async (item) => {
        if (item.label === currentSelectedLabel) {
          const response = await fetch(
            `/api/animes?status_filter=currently airing&aired_day_filter=${item.label}&banners_filter=false&parental_control=${parentalControl}`
          )

          if (response.status === 404) {
            window.location.href = '/404'
          }
          const data = await response.json()
          const animeData = data.data
          setAnimeList(animeData)
        }
      })
    }
    fecthData()
  }, [calendarList, currentSelectedLabel])
}
