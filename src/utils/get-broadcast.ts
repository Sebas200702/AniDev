type DayMap = { [key: string]: number }

interface ConvertedDateInfo {
  originalDate: Date
  convertedDate: Date
  original: {
    timezone: string
    formatted: string
    timeOnly: string
    date: string
    iso: string
  }
  converted: {
    timezone: string
    formatted: string
    timeOnly: string
    date: string
    iso: string
  }
  isSameTimezone: boolean
  timeDifference: string
  userBrowserTimezone: string
}

const dayMap: DayMap = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sundays: 0,
  mondays: 1,
  tuesdays: 2,
  wednesdays: 3,
  thursdays: 4,
  fridays: 5,
  saturdays: 6,
}

export function createBroadcastDate(
  dayName: string,
  time: string,
  timezone: string
): Date {
  const targetDay = dayMap[dayName.toLowerCase()]
  if (targetDay === undefined) {
    throw new Error(`Día no válido: ${dayName}`)
  }

  const [hours, minutes] = time.split(':').map((num) => Number.parseInt(num, 10))
  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    throw new Error(`Hora no válida: ${time}`)
  }

  const today = new Date()
  const currentDay = today.getDay()
  const daysUntilTarget = (targetDay - currentDay + 7) % 7 || 7

  const targetDate = new Date(today)
  targetDate.setDate(today.getDate() + daysUntilTarget)
  targetDate.setHours(hours, minutes, 0, 0)

  Reflect.set(targetDate, Symbol.for('originalTimezone'), timezone)

  return targetDate
}

export function convertTimezone(
  date: Date,
  targetTimezone: string | null = null
): ConvertedDateInfo {
  if (!(date instanceof Date)) {
    throw new TypeError('El primer parámetro debe ser un objeto Date')
  }

  const userTimezone =
    targetTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  const originalTimezone: string =
    Reflect.get(date, Symbol.for('originalTimezone')) || 'Local'

  const formatInTimezone = (d: Date, tz: string): string => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
        hour12: false,
      }).format(d)
    } catch {
      return d.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    }
  }

  const getTimeOnly = (d: Date, tz: string): string => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(d)
    } catch {
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    }
  }

  return {
    originalDate: new Date(date),
    convertedDate: new Date(date),
    original: {
      timezone: originalTimezone,
      formatted:
        originalTimezone === 'Local'
          ? date.toLocaleString()
          : formatInTimezone(date, originalTimezone),
      timeOnly:
        originalTimezone === 'Local'
          ? date.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })
          : getTimeOnly(date, originalTimezone),
      date: date.toLocaleDateString(),
      iso: date.toISOString(),
    },
    converted: {
      timezone: userTimezone,
      formatted: formatInTimezone(date, userTimezone),
      timeOnly: getTimeOnly(date, userTimezone),
      date: new Intl.DateTimeFormat('en-US', {
        timeZone: userTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date),
      iso: date.toISOString(),
    },
    isSameTimezone: originalTimezone === userTimezone,
    timeDifference: getTimeDifference(date, originalTimezone, userTimezone),
    userBrowserTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }
}

function getTimeDifference(
  date: Date,
  fromTimezone: string,
  toTimezone: string
): string {
  if (fromTimezone === 'Local' || toTimezone === 'Local') {
    return 'No calculable con zona horaria local'
  }

  try {
    const timeInFrom = new Intl.DateTimeFormat('en', {
      timeZone: fromTimezone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).format(date)

    const timeInTo = new Intl.DateTimeFormat('en', {
      timeZone: toTimezone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).format(date)

    if (timeInFrom === timeInTo) return 'Misma hora'

    return `${timeInFrom} (${fromTimezone}) = ${timeInTo} (${toTimezone})`
  } catch {
    return 'No calculable'
  }
}

export const TimezoneUtils = {
  getBrowserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  },

  isValidTimezone(timezone: string): boolean {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone })
      return true
    } catch {
      return false
    }
  },

  getCommonTimezones(): string[] {
    return [
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'America/Mexico_City',
      'Europe/London',
      'Europe/Paris',
      'Europe/Berlin',
      'Europe/Madrid',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Asia/Kolkata',
      'Australia/Sydney',
      'Pacific/Auckland',
    ]
  },
}
