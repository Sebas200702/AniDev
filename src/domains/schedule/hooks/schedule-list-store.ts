import type { Section } from 'types'
import { create } from 'zustand'

interface CalendarListStore {
  calendarList: Section[]
  setCalendarList: (calendarList: Section[]) => void
}

export const useCalendarListStore = create<CalendarListStore>((set) => ({
  calendarList: [
    {
      label: 'Sunday',
      selected: true,
    },
    {
      label: 'Monday',
      selected: false,
    },
    {
      label: 'Tuesday',
      selected: false,
    },
    {
      label: 'Wednesday',
      selected: false,
    },
    {
      label: 'Thursday',
      selected: false,
    },
    {
      label: 'Friday',
      selected: false,
    },
    {
      label: 'Saturday',
      selected: false,
    },
  ],
  setCalendarList: (calendarList) => set({ calendarList }),
}))
