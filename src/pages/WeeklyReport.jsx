import { useState, useEffect } from 'react'
import { format, startOfWeek, endOfWeek, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { getWeeklyStats, calculateStreak } from '../utils/stats'
import { Share2, ChevronLeft, ChevronRight, CheckCircle, XCircle, Star, Save } from 'lucide-react'

export default function WeeklyReport() {
  const { user } = useAuth()
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [entries, setEntries] = useState([])
  const [weeklyStats, setWeeklyStats] = useState(null)
  const [streak, setStreak] = useState(0)

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
    if (user) fetchEntries()
  }, [user])

  useEffect(() => {
    if (entries.length > 0) {
      setWeeklyStats(getWeeklyStats(entries, currentWeek))
      setStreak(calculateStreak(entries))
    }
    if (user) fetchReflection()
  }, [entries, currentWeek])

  const fetchEntries = async () => {
    const { data } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false })
    if (data) setEntries(data)
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
    const d = new Date(currentWeek)
    d.setDate(d.getDate() - 7)
    setCurrentWeek(d)
  }

  const goToNextWeek = () => {
    const d = new Date(currentWeek)
    d.setDate(d.getDate() + 7)
    setCurrentWeek(d)
  }

  const goToCurrentWeek = () => setCurrentWeek(new Date())

  const handleShare = async () => {
    if (!weeklyStats) return
    const avg = weeklyStats.avgMood > 0
      ? `\nPromedio del día: ${'★'.repeat(Math.round(weeklyStats.avgMood))}${'☆'.repeat(5 - Math.round(weeklyStats.avgMood))}`
      : ''

    const shareText = `Mi semana en Clarity:\n\n${weeklyStats.daysCompleted} de 7 días completados\n${weeklyStats.totalWords} palabras escritas${avg}\nRacha actual: ${streak} días\n\nViviendo más conscientemente con Clarity`

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mi Reporte Semanal - Clarity', text: shareText })
      } catch (e) {
        if (e.name !== 'AbortError') console.error('Error al compartir:', e)
      }
    } else {
      navigator.clipboard.writeText(shareText)
      alert('Texto copiado al portapapeles')
    }
  }

  if (!weeklyStats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-400">Cargando reporte...</p>
      </div>
    )
  }

  const isCurrentWeek =
    format(currentWeek, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ||
    (currentWeek >= startOfWeek(new Date(), { weekStartsOn: 1 }) &&
      currentWeek <= endOfWeek(new Date(), { weekStartsOn: 1 }))

  const moodEntries = weeklyStats.entries.filter((e) => e.mood_rating > 0)
  const avgMood = moodEntries.length > 0
    ? (moodEntries.reduce((sum, e) => sum + e.mood_rating, 0) / moodEntries.length).toFixed(1)
    : 0

  const hasReflectionContent = Object.values(reflection).some((v) => v.trim())

  const reflectionQuestions = [
    { key: 'what_went_well', label: '¿Qué salió bien esta semana?', placeholder: 'Logros, buenos momentos, cosas que funcionaron...' },
    { key: 'what_went_wrong', label: '¿Qué salió mal esta semana?', placeholder: 'Errores, frustraciones, cosas que no salieron como esperabas...' },
    { key: 'most_significant', label: '¿Cuál fue el momento más significativo?', placeholder: 'De todos tus momentos, ¿cuál destaca más?' },
    { key: 'pattern_noticed', label: '¿Qué patrón notas en tus entradas?', placeholder: '¿Hay algo que se repite? ¿Qué tipo de momentos registras más?' },
    { key: 'different_next_week', label: '¿Qué quieres hacer diferente la próxima semana?', placeholder: 'Una intención o cambio concreto para la semana que viene...' },
  ]

  return (
    <div className="bg-canvas-alt dark:bg-dark-base min-h-screen -mt-0">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">

        {/* Week navigation */}
        <div className="flex items-center justify-between mb-10">
          <button onClick={goToPreviousWeek} className="btn-secondary flex items-center gap-1.5">
            <ChevronLeft size={18} strokeWidth={1.5} />
            <span className="hidden sm:inline text-sm">Anterior</span>
          </button>

          <div className="text-center">
            <h1 className="font-serif text-2xl md:text-3xl font-medium text-charcoal dark:text-gray-100">
              Reporte Semanal
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {format(weeklyStats.weekStart, "d 'de' MMMM", { locale: es })} — {format(weeklyStats.weekEnd, "d 'de' MMMM, yyyy", { locale: es })}
            </p>
            {!isCurrentWeek && (
              <button onClick={goToCurrentWeek} className="text-xs text-indigo-500 dark:text-sage-400 hover:underline mt-1">
                Ir a semana actual
              </button>
            )}
          </div>

          <button
            onClick={goToNextWeek}
            disabled={isCurrentWeek}
            className="btn-secondary flex items-center gap-1.5 disabled:opacity-30"
          >
            <span className="hidden sm:inline text-sm">Siguiente</span>
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Días', value: `${weeklyStats.daysCompleted}/7`, sub: <div className="mt-2 bg-gray-100 dark:bg-dark-raised rounded-full h-1.5"><div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${weeklyStats.completionRate}%` }} /></div> },
            { label: 'Palabras', value: weeklyStats.totalWords, sub: <p className="text-xs text-gray-400 mt-1">~{Math.round(weeklyStats.totalWords / Math.max(weeklyStats.daysCompleted, 1))}/día</p> },
            { label: 'Promedio', value: avgMood > 0 ? avgMood : '—', sub: <p className="text-xs text-gray-400 mt-1">{moodEntries.length > 0 ? `${moodEntries.length} días evaluados` : 'Sin evaluación'}</p> },
            { label: 'Racha', value: streak, sub: <p className="text-xs text-gray-400 mt-1">días seguidos</p> },
          ].map((stat, idx) => (
            <div key={idx} className="card-floating !p-5 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-serif font-medium text-charcoal dark:text-gray-100">{stat.value}</p>
              {stat.sub}
            </div>
          ))}
        </div>

        {/* Weekly calendar */}
        <div className="card-floating mb-10">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-4">Vista semanal</p>
          <div className="grid grid-cols-7 gap-2">
            {weeklyStats.allDaysInWeek.map((day) => {
              const dayStr = format(day, 'yyyy-MM-dd')
              const entry = weeklyStats.entries.find((e) => e.entry_date === dayStr)
              const hasEntry = !!entry
              const isToday = dayStr === format(new Date(), 'yyyy-MM-dd')

              return (
                <div
                  key={dayStr}
                  className={`text-center py-3 px-2 rounded-2xl transition-all duration-200 ${
                    hasEntry
                      ? 'bg-sage-50 dark:bg-sage-400/10'
                      : 'bg-canvas dark:bg-dark-raised'
                  } ${isToday ? 'ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-dark-surface' : ''}`}
                >
                  <p className="text-[10px] font-medium text-gray-400 uppercase">
                    {format(day, 'EEE', { locale: es })}
                  </p>
                  <p className="text-lg font-serif font-medium mt-1 text-charcoal dark:text-gray-200">{format(day, 'd')}</p>
                  <div className="mt-1.5">
                    {hasEntry ? (
                      <CheckCircle size={16} className="mx-auto text-sage-400" strokeWidth={1.5} />
                    ) : (
                      <XCircle size={16} className="mx-auto text-gray-200 dark:text-gray-600" strokeWidth={1.5} />
                    )}
                  </div>
                  {entry?.mood_rating > 0 && (
                    <div className="flex justify-center gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={7} className={s <= entry.mood_rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-600'} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Moments + Reflection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Weekly moments */}
          <div className="card-floating">
            <h3 className="font-serif text-lg text-charcoal dark:text-gray-100 mb-5">
              Tus momentos de la semana
            </h3>
            {weeklyStats.entries.length > 0 ? (
              <div className="space-y-5">
                {weeklyStats.entries.map((entry) => (
                  <div key={entry.id} className="border-l-2 border-indigo-200 dark:border-indigo-800 pl-4 py-1">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs font-medium text-gray-400">
                        {format(new Date(entry.entry_date), "EEEE, d 'de' MMMM", { locale: es })}
                      </p>
                      {entry.mood_rating > 0 && (
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={10} className={s <= entry.mood_rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-600'} />
                          ))}
                        </div>
                      )}
                    </div>
                    {entry.morning_intention && (
                      <p className="text-xs text-clay-400 mb-1">
                        Intención: {entry.morning_intention}
                      </p>
                    )}
                    <p className="text-sm text-charcoal dark:text-gray-300 leading-relaxed">{entry.content}</p>
                    {(entry.gratitude_1 || entry.gratitude_2 || entry.gratitude_3) && (
                      <div className="mt-2 text-xs text-gray-400 space-y-0.5">
                        {entry.gratitude_1 && <p><span className="font-medium text-indigo-500">Agradecido por:</span> {entry.gratitude_1}</p>}
                        {entry.gratitude_2 && <p><span className="font-medium text-indigo-500">Agradecido por:</span> {entry.gratitude_2}</p>}
                        {entry.gratitude_3 && <p><span className="font-medium text-indigo-500">Agradecido por:</span> {entry.gratitude_3}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8 text-sm">No hay entradas esta semana.</p>
            )}
          </div>

          {/* Weekly reflection */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-charcoal dark:text-gray-100 mb-1">
              Reflexión semanal
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Puedes ir anotando durante la semana. El domingo, revisa todo y completa tu reflexión.
            </p>

            {reflectionQuestions.map((q) => (
              <div key={q.key} className="card-floating !p-5">
                <label className="block font-serif text-sm text-charcoal dark:text-gray-200 mb-3">
                  {q.label}
                </label>
                <textarea
                  value={reflection[q.key]}
                  onChange={(e) => setReflection({ ...reflection, [q.key]: e.target.value })}
                  placeholder={q.placeholder}
                  className="input-organic text-sm min-h-[72px] resize-y leading-relaxed"
                />
              </div>
            ))}

            <button
              onClick={handleSaveReflection}
              disabled={reflectionSaving || !hasReflectionContent}
              className={`w-full py-3.5 px-6 rounded-2xl font-medium text-white shadow-zen-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                reflectionSaved
                  ? 'bg-sage-400'
                  : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-sage-500 dark:hover:bg-sage-400 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <Save size={18} strokeWidth={1.5} />
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

        {/* Share */}
        <div className="flex justify-center mb-8">
          <button onClick={handleShare} className="btn-secondary flex items-center gap-2 text-sm">
            <Share2 size={16} strokeWidth={1.5} />
            Compartir reporte
          </button>
        </div>

        {weeklyStats.daysCompleted === 0 && (
          <p className="text-center text-gray-400 text-sm">
            No hay entradas esta semana. ¡Empieza a registrar tus momentos!
          </p>
        )}
      </div>
    </div>
  )
}
