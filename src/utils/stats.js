import { format, startOfWeek, endOfWeek, eachDayOfInterval, differenceInDays, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function calculateStreak(entries) {
  if (!entries || entries.length === 0) return 0

  // Ordenar entradas por fecha descendente
  const sortedEntries = [...entries].sort((a, b) =>
    new Date(b.entry_date) - new Date(a.entry_date)
  )

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = 0
  let currentDate = new Date(today)

  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.entry_date)
    entryDate.setHours(0, 0, 0, 0)

    const daysDiff = differenceInDays(currentDate, entryDate)

    if (daysDiff === 0) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else if (daysDiff === 1) {
      streak++
      currentDate = new Date(entryDate)
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

export function getWeeklyStats(entries, weekStart = new Date()) {
  const start = startOfWeek(weekStart, { weekStartsOn: 1 }) // Lunes
  const end = endOfWeek(weekStart, { weekStartsOn: 1 }) // Domingo

  const weekEntries = entries.filter(entry => {
    const entryDate = parseISO(entry.entry_date)
    return entryDate >= start && entryDate <= end
  })

  const totalWords = weekEntries.reduce((sum, entry) => {
    return sum + (entry.content?.split(/\s+/).length || 0)
  }, 0)

  const daysWithEntries = weekEntries.length
  const allDaysInWeek = eachDayOfInterval({ start, end })
  const completionRate = (daysWithEntries / 7) * 100

  return {
    weekStart: start,
    weekEnd: end,
    entries: weekEntries,
    daysCompleted: daysWithEntries,
    totalWords,
    completionRate: Math.round(completionRate),
    allDaysInWeek,
  }
}

export function getTotalStats(entries) {
  const totalEntries = entries.length
  const totalWords = entries.reduce((sum, entry) => {
    return sum + (entry.content?.split(/\s+/).length || 0)
  }, 0)

  const avgWords = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0

  return {
    totalEntries,
    totalWords,
    avgWords,
  }
}
