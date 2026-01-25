import { useState, useEffect, useRef } from 'react'
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import { es } from 'date-fns/locale'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { getWeeklyStats, calculateStreak } from '../utils/stats'
import { Share2, Download, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react'

export default function WeeklyReport() {
  const { user } = useAuth()
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [entries, setEntries] = useState([])
  const [weeklyStats, setWeeklyStats] = useState(null)
  const [streak, setStreak] = useState(0)
  const reportRef = useRef(null)

  useEffect(() => {
    if (user) {
      fetchEntries()
    }
  }, [user])

  useEffect(() => {
    if (entries.length > 0) {
      setWeeklyStats(getWeeklyStats(entries, currentWeek))
      setStreak(calculateStreak(entries))
    }
  }, [entries, currentWeek])

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false })

    if (data) {
      setEntries(data)
    }
  }

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeek)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentWeek(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentWeek)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentWeek(newDate)
  }

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date())
  }

  const handleShare = async () => {
    if (!weeklyStats) return

    const shareText = `Esta semana registré ${weeklyStats.daysCompleted} de 7 días en mi Homework for Life.

Mi racha actual: ${streak} días

Viviendo más conscientemente con StoryWorthy 🌟`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi Reporte Semanal - StoryWorthy',
          text: shareText,
        })
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error al compartir:', error)
        }
      }
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(shareText)
      alert('Texto copiado al portapapeles')
    }
  }

  if (!weeklyStats) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Cargando reporte...</p>
        </div>
      </div>
    )
  }

  const isCurrentWeek =
    format(currentWeek, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ||
    (currentWeek >= startOfWeek(new Date(), { weekStartsOn: 1 }) &&
      currentWeek <= endOfWeek(new Date(), { weekStartsOn: 1 }))

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Navegación de semanas */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={goToPreviousWeek} className="btn-secondary flex items-center gap-2">
          <ChevronLeft size={20} />
          Anterior
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold">Reporte Semanal</h2>
          <p className="text-gray-500 mt-1">
            {format(weeklyStats.weekStart, "d 'de' MMMM", { locale: es })} -{' '}
            {format(weeklyStats.weekEnd, "d 'de' MMMM, yyyy", { locale: es })}
          </p>
          {!isCurrentWeek && (
            <button onClick={goToCurrentWeek} className="text-sm text-primary-600 hover:underline mt-1">
              Ir a semana actual
            </button>
          )}
        </div>

        <button
          onClick={goToNextWeek}
          disabled={isCurrentWeek}
          className="btn-secondary flex items-center gap-2 disabled:opacity-30"
        >
          Siguiente
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Días completados</h3>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            {weeklyStats.daysCompleted}/7
          </p>
          <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${weeklyStats.completionRate}%` }}
            />
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total de palabras</h3>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            {weeklyStats.totalWords}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            ~{Math.round(weeklyStats.totalWords / Math.max(weeklyStats.daysCompleted, 1))} por día
          </p>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Racha actual</h3>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{streak} días</p>
          <p className="text-sm text-gray-500 mt-1">¡Sigue así!</p>
        </div>
      </div>

      {/* Calendario semanal */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-4">Vista semanal</h3>
        <div className="grid grid-cols-7 gap-2">
          {weeklyStats.allDaysInWeek.map((day) => {
            const dayStr = format(day, 'yyyy-MM-dd')
            const hasEntry = weeklyStats.entries.some((e) => e.entry_date === dayStr)
            const isToday = dayStr === format(new Date(), 'yyyy-MM-dd')

            return (
              <div
                key={dayStr}
                className={`text-center p-3 rounded-lg border-2 ${
                  hasEntry
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                } ${isToday ? 'ring-2 ring-primary-500' : ''}`}
              >
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {format(day, 'EEE', { locale: es })}
                </p>
                <p className="text-lg font-bold mt-1">{format(day, 'd')}</p>
                <div className="mt-2">
                  {hasEntry ? (
                    <CheckCircle size={20} className="mx-auto text-green-600" />
                  ) : (
                    <XCircle size={20} className="mx-auto text-gray-300 dark:text-gray-600" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Entradas de la semana */}
      {weeklyStats.entries.length > 0 && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">Tus momentos de la semana</h3>
          <div className="space-y-4">
            {weeklyStats.entries.map((entry) => (
              <div key={entry.id} className="border-l-4 border-primary-500 pl-4 py-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {format(new Date(entry.entry_date), "EEEE, d 'de' MMMM", { locale: es })}
                </p>
                <p className="text-gray-700 dark:text-gray-300">{entry.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón de compartir */}
      <div className="flex justify-center gap-4">
        <button onClick={handleShare} className="btn-primary flex items-center gap-2">
          <Share2 size={20} />
          Compartir reporte
        </button>
      </div>

      {weeklyStats.daysCompleted === 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-500">No hay entradas esta semana. ¡Empieza a registrar tus momentos!</p>
        </div>
      )}
    </div>
  )
}
