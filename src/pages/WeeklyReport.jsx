import { useState, useEffect } from 'react'
import { format, startOfWeek, endOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { getWeeklyStats, calculateStreak } from '../utils/stats'
import { Share2, ChevronLeft, ChevronRight, CheckCircle, XCircle, Star, PenLine, Save } from 'lucide-react'

export default function WeeklyReport() {
  const { user } = useAuth()
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [entries, setEntries] = useState([])
  const [weeklyStats, setWeeklyStats] = useState(null)
  const [streak, setStreak] = useState(0)

  // Reflexión semanal
  const [reflection, setReflection] = useState({
    most_significant: '',
    pattern_noticed: '',
    different_next_week: '',
    what_went_well: '',
    what_went_wrong: '',
  })
  const [existingReflection, setExistingReflection] = useState(null)
  const [reflectionSaving, setReflectionSaving] = useState(false)
  const [reflectionSaved, setReflectionSaved] = useState(false)

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
    if (user) {
      fetchReflection()
    }
  }, [entries, currentWeek])

  const fetchEntries = async () => {
    const { data } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false })

    if (data) {
      setEntries(data)
    }
  }

  const fetchReflection = async () => {
    const weekStart = format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd')
    const { data } = await supabase
      .from('weekly_reflections')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_start', weekStart)
      .single()

    if (data) {
      setExistingReflection(data)
      setReflection({
        most_significant: data.most_significant || '',
        pattern_noticed: data.pattern_noticed || '',
        different_next_week: data.different_next_week || '',
        what_went_well: data.what_went_well || '',
        what_went_wrong: data.what_went_wrong || '',
      })
    } else {
      setExistingReflection(null)
      setReflection({
        most_significant: '',
        pattern_noticed: '',
        different_next_week: '',
        what_went_well: '',
        what_went_wrong: '',
      })
    }
  }

  const handleSaveReflection = async () => {
    setReflectionSaving(true)
    setReflectionSaved(false)
    const weekStart = format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd')

    try {
      if (existingReflection) {
        const { error } = await supabase
          .from('weekly_reflections')
          .update({ ...reflection, updated_at: new Date().toISOString() })
          .eq('id', existingReflection.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('weekly_reflections').insert({
          user_id: user.id,
          week_start: weekStart,
          ...reflection,
        })
        if (error) throw error
      }
      await fetchReflection()
      setReflectionSaved(true)
      setTimeout(() => setReflectionSaved(false), 3000)
    } catch (error) {
      console.error('Error al guardar reflexión:', error)
      alert('Error al guardar. Intenta de nuevo.')
    } finally {
      setReflectionSaving(false)
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

    const avgMood = weeklyStats.avgMood > 0 ? `\nPromedio del día: ${'★'.repeat(Math.round(weeklyStats.avgMood))}${'☆'.repeat(5 - Math.round(weeklyStats.avgMood))}` : ''

    const shareText = `Mi semana en Clarity:

${weeklyStats.daysCompleted} de 7 días completados
${weeklyStats.totalWords} palabras escritas${avgMood}
Racha actual: ${streak} días

Viviendo más conscientemente con Clarity`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi Reporte Semanal - Clarity',
          text: shareText,
        })
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error al compartir:', error)
        }
      }
    } else {
      navigator.clipboard.writeText(shareText)
      alert('Texto copiado al portapapeles')
    }
  }

  if (!weeklyStats) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-warm-400">Cargando reporte...</p>
        </div>
      </div>
    )
  }

  const isCurrentWeek =
    format(currentWeek, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ||
    (currentWeek >= startOfWeek(new Date(), { weekStartsOn: 1 }) &&
      currentWeek <= endOfWeek(new Date(), { weekStartsOn: 1 }))

  // Calcular promedio de mood
  const moodEntries = weeklyStats.entries.filter((e) => e.mood_rating > 0)
  const avgMood = moodEntries.length > 0
    ? (moodEntries.reduce((sum, e) => sum + e.mood_rating, 0) / moodEntries.length).toFixed(1)
    : 0

  const hasReflectionContent = Object.values(reflection).some((v) => v.trim())

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Navegación de semanas */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={goToPreviousWeek} className="btn-secondary flex items-center gap-2">
          <ChevronLeft size={20} />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Reporte Semanal</h2>
          <p className="text-warm-500 mt-1">
            {format(weeklyStats.weekStart, "d 'de' MMMM", { locale: es })} -{' '}
            {format(weeklyStats.weekEnd, "d 'de' MMMM, yyyy", { locale: es })}
          </p>
          {!isCurrentWeek && (
            <button onClick={goToCurrentWeek} className="text-sm text-primary-600 dark:text-primary-400 hover:underline mt-1">
              Ir a semana actual
            </button>
          )}
        </div>

        <button
          onClick={goToNextWeek}
          disabled={isCurrentWeek}
          className="btn-secondary flex items-center gap-2 disabled:opacity-30"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <h3 className="text-sm font-medium text-warm-500 dark:text-warm-400 mb-1">Días</h3>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            {weeklyStats.daysCompleted}/7
          </p>
          <div className="mt-2 bg-surface-200 dark:bg-dark-elevated rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${weeklyStats.completionRate}%` }}
            />
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-warm-500 dark:text-warm-400 mb-1">Palabras</h3>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            {weeklyStats.totalWords}
          </p>
          <p className="text-sm text-warm-400 mt-1">
            ~{Math.round(weeklyStats.totalWords / Math.max(weeklyStats.daysCompleted, 1))}/día
          </p>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-warm-500 dark:text-warm-400 mb-1">Promedio</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-amber-500">{avgMood > 0 ? avgMood : '-'}</p>
            {avgMood > 0 && <Star size={20} className="fill-amber-400 text-amber-400" />}
          </div>
          <p className="text-sm text-warm-400 mt-1">
            {moodEntries.length > 0 ? `${moodEntries.length} días evaluados` : 'Sin evaluación'}
          </p>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-warm-500 dark:text-warm-400 mb-1">Racha</h3>
          <p className="text-3xl font-bold text-coral-500 dark:text-coral-400">{streak}</p>
          <p className="text-sm text-warm-400 mt-1">días seguidos</p>
        </div>
      </div>

      {/* Calendario semanal */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-4">Vista semanal</h3>
        <div className="grid grid-cols-7 gap-2">
          {weeklyStats.allDaysInWeek.map((day) => {
            const dayStr = format(day, 'yyyy-MM-dd')
            const entry = weeklyStats.entries.find((e) => e.entry_date === dayStr)
            const hasEntry = !!entry
            const isToday = dayStr === format(new Date(), 'yyyy-MM-dd')

            return (
              <div
                key={dayStr}
                className={`text-center p-3 rounded-xl border-2 transition-all duration-200 ${
                  hasEntry
                    ? 'border-sage-500 bg-sage-500/10 dark:bg-sage-500/10'
                    : 'border-surface-200 dark:border-dark-border bg-surface-50 dark:bg-dark-elevated'
                } ${isToday ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-dark-surface' : ''}`}
              >
                <p className="text-xs font-medium text-warm-500 dark:text-warm-400">
                  {format(day, 'EEE', { locale: es })}
                </p>
                <p className="text-lg font-bold mt-1">{format(day, 'd')}</p>
                <div className="mt-2">
                  {hasEntry ? (
                    <CheckCircle size={20} className="mx-auto text-sage-500" />
                  ) : (
                    <XCircle size={20} className="mx-auto text-warm-300 dark:text-warm-600" />
                  )}
                </div>
                {entry?.mood_rating > 0 && (
                  <div className="flex justify-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={8}
                        className={s <= entry.mood_rating ? 'fill-amber-400 text-amber-400' : 'text-warm-300 dark:text-warm-600'}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Momentos + Reflexión en paralelo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Columna izquierda: Entradas de la semana */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Tus momentos de la semana</h3>
          {weeklyStats.entries.length > 0 ? (
            <div className="space-y-4">
              {weeklyStats.entries.map((entry) => (
                <div key={entry.id} className="border-l-4 border-primary-500 pl-4 py-2">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-warm-500 dark:text-warm-400">
                      {format(new Date(entry.entry_date), "EEEE, d 'de' MMMM", { locale: es })}
                    </p>
                    {entry.mood_rating > 0 && (
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={12}
                            className={s <= entry.mood_rating ? 'fill-amber-400 text-amber-400' : 'text-warm-300 dark:text-warm-600'}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {entry.morning_intention && (
                    <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">
                      Intención: {entry.morning_intention}
                    </p>
                  )}
                  <p className="text-warm-700 dark:text-warm-300">{entry.content}</p>
                  {(entry.gratitude_1 || entry.gratitude_2 || entry.gratitude_3) && (
                    <div className="mt-2 text-sm text-warm-500 dark:text-warm-400">
                      {entry.gratitude_1 && <p>— {entry.gratitude_1}</p>}
                      {entry.gratitude_2 && <p>— {entry.gratitude_2}</p>}
                      {entry.gratitude_3 && <p>— {entry.gratitude_3}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-warm-400 text-center py-8">No hay entradas esta semana.</p>
          )}
        </div>

        {/* Columna derecha: Reflexión semanal */}
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <PenLine size={22} className="text-primary-500" />
            <h3 className="text-lg font-semibold">Reflexión semanal</h3>
          </div>
          <p className="text-sm text-warm-400 mb-5">
            Puedes ir anotando durante la semana. El domingo, revisa todo y completa tu reflexión.
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-warm-700 dark:text-warm-300">
                ¿Qué salió bien esta semana?
              </label>
              <textarea
                value={reflection.what_went_well}
                onChange={(e) => setReflection({ ...reflection, what_went_well: e.target.value })}
                placeholder="Logros, buenos momentos, cosas que funcionaron..."
                className="input-field min-h-[80px] resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-warm-700 dark:text-warm-300">
                ¿Qué salió mal esta semana?
              </label>
              <textarea
                value={reflection.what_went_wrong}
                onChange={(e) => setReflection({ ...reflection, what_went_wrong: e.target.value })}
                placeholder="Errores, frustraciones, cosas que no salieron como esperabas..."
                className="input-field min-h-[80px] resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-warm-700 dark:text-warm-300">
                ¿Cuál fue el momento más significativo?
              </label>
              <textarea
                value={reflection.most_significant}
                onChange={(e) => setReflection({ ...reflection, most_significant: e.target.value })}
                placeholder="De todos tus momentos, ¿cuál destaca más?"
                className="input-field min-h-[80px] resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-warm-700 dark:text-warm-300">
                ¿Qué patrón notas en tus entradas?
              </label>
              <textarea
                value={reflection.pattern_noticed}
                onChange={(e) => setReflection({ ...reflection, pattern_noticed: e.target.value })}
                placeholder="¿Hay algo que se repite? ¿Qué tipo de momentos registras más?"
                className="input-field min-h-[80px] resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-warm-700 dark:text-warm-300">
                ¿Qué quieres hacer diferente la próxima semana?
              </label>
              <textarea
                value={reflection.different_next_week}
                onChange={(e) => setReflection({ ...reflection, different_next_week: e.target.value })}
                placeholder="Una intención o cambio concreto para la semana que viene..."
                className="input-field min-h-[80px] resize-y"
              />
            </div>

            <button
              onClick={handleSaveReflection}
              disabled={reflectionSaving || !hasReflectionContent}
              className={`w-full py-3.5 px-6 rounded-2xl font-semibold text-white shadow-soft-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                reflectionSaved
                  ? 'bg-sage-500'
                  : 'bg-primary-600 hover:bg-primary-700 hover:shadow-soft-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <Save size={20} />
              {reflectionSaving
                ? 'Guardando...'
                : reflectionSaved
                ? '¡Reflexión guardada!'
                : existingReflection
                ? 'Actualizar reflexión'
                : 'Guardar reflexión'}
            </button>
          </div>
        </div>
      </div>

      {/* Botón de compartir */}
      <div className="flex justify-center gap-4 mb-8">
        <button onClick={handleShare} className="btn-primary flex items-center gap-2">
          <Share2 size={20} />
          Compartir reporte
        </button>
      </div>

      {weeklyStats.daysCompleted === 0 && (
        <div className="mt-8 text-center">
          <p className="text-warm-400">No hay entradas esta semana. ¡Empieza a registrar tus momentos!</p>
        </div>
      )}
    </div>
  )
}
