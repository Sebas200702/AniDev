import { SectionList } from '@components/section-list'
import { useCalendarListStore } from '@store/calendar-list-store'

export const CalendarList = () => {
  const { calendarList, setCalendarList } = useCalendarListStore()

  return (
    <ul className="text-lx flex flex-row gap-4">
      {calendarList.map((section) => (
        <SectionList
          key={section.label}
          context="calendar"
          section={section}
          sections={{
            list: calendarList,
            set: setCalendarList,
          }}
        />
      ))}
    </ul>
  )
}
