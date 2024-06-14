import {
  parseISO,
  getTime,
  getUnixTime,
  subDays,
  eachDayOfInterval,
  startOfDay,
  endOfDay,
} from 'date-fns'
import { format } from 'date-fns-tz'
import { computed } from 'vue'

const config = {
  timezone: 'Asia/Bangkok',
  defaultFormat: 'yyyy-MM-dd',
}

export default function () {
  const currentDateTime = (fmt?: string) => {
    return format(new Date(), fmt || config.defaultFormat)
  }
  const dateTimeToTimestamp = (date: Date | string) => {
    if (typeof date === 'string') {
      date = parseISO(date)
    }
    return getTime(date)
  }
  const dateTimeToTimestampUTC = (date: Date | string) => {
    if (typeof date === 'string') {
      date = parseISO(date)
    }
    return getUnixTime(date)
  }
  const dateTimeFormat = (date: Date | string | number, fmt?: string) => {
    if (typeof date === 'string') {
      date = parseISO(date)
    }
    return format(date, fmt || config.defaultFormat)
  }
  const fullDateTimeFormat = (date: Date | string) => {
    if (typeof date !== 'string') return date
    return dateTimeFormat(date, 'dd/MM/yyyy HH:mm:ss')
  }
  const subDate = (date: Date | string, duration: number) => {
    if (typeof date === 'string') {
      date = parseISO(date)
    }
    return subDays(date, duration)
  }
  const eachDayOfIntervalArray = (
    startDate: Date | string,
    endDate: Date | string
  ) => {
    if (typeof startDate === 'string') {
      startDate = parseISO(startDate)
    }
    if (typeof endDate === 'string') {
      endDate = parseISO(endDate)
    }
    return eachDayOfInterval({
      start: startDate,
      end: endDate,
    })
  }
  const startOfDate = (date: Date | string) => {
    if (typeof date === 'string') {
      date = parseISO(date)
    }
    return startOfDay(date)
  }
  const endOfDate = (date: Date | string) => {
    if (typeof date === 'string') {
      date = parseISO(date)
    }
    return endOfDay(date)
  }

  const startOfWeek = (date: Date | string) => {
    if (typeof date === 'string') {
      date = parseISO(date)
    }

    var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)

    return new Date(date.setDate(diff))
  }

  const last3month = computed(() => {
    var d = new Date()
    d.setMonth(d.getMonth() - 3)

    return new Date(d).toLocaleString()
  })

  const next3month = computed(() => {
    var d = new Date()
    d.setMonth(d.getMonth() + 3)

    return new Date(d).toLocaleString()
  })

  const endOfDateByTomorrow = () => {
    var date = new Date()
    var tomorrow = new Date(date.setDate(date.getDate() + 1))

    return startOfDay(tomorrow)
  }

  return {
    currentDateTime,
    dateTimeToTimestamp,
    dateTimeToTimestampUTC,
    dateTimeFormat,
    fullDateTimeFormat,
    subDate,
    eachDayOfIntervalArray,
    startOfDate,
    endOfDate,
    startOfWeek,
    last3month,
    next3month,
    endOfDateByTomorrow,
  }
}
