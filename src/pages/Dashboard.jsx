import { useState, useEffect } from 'react'
import { format, startOfWeek, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { getPromptsForToday } from '../utils/prompts'
import { calculateStreak } from '../utils/stats'
import StarRating from '../components/StarRating'
import { Sparkles, Flame, Save, X } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [morningIntention, setMorningIntention] = useState('')
  const [gratitude1, setGratitude1] = useState('')
  const [gratitude2, setGratitude2] = useState('')
  const [gratitude3, setGratitude3] = useState('')
  const [moodRating, setMoodRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [todayEntry, setTodayEntry] = useState(null)
  const [allEntries, setAllEntries] = useState([])
  const [streak, setStreak] = useState(0)
  const [showPrompts, setShowPrompts] = useState(false)
  const [prompts] = useState(getPromptsForToday())
  const [showIntro, setShowIntro] = useState(() => {
    return localStorage.getItem('clarity_intro_dismissed') !== 'true'
  })

  const dismissIntro = () => {
    setShowIntro(false)
    localStorage.setItem('clarity_intro_dismissed', 'true')
  }

  const today = format(new Date(), 'yyyy-MM-dd')
  const currentHour = new Date().getHours()
  const isMorning = currentHour < 14

  useEffect(() => {
    if (user) {
      fetchTodayEntry()
      fetchAllEntries()
    }
  }, [user])

  useEffect(() => {
    if (allEntries.length > 0) {
      setStreak(calculateStreak(allEntries))
    }
  }, [allEntries])

  const fetchTodayEntry = async () => {
    const { data } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('entry_date', today)
      .single()

    if (data) {
      setTodayEntry(data)
      setContent(data.content || '')
      setMorningIntention(data.morning_intention || '')
      setGratitude1(data.gratitude_1 || '')
      setGratitude2(data.gratitude_2 || '')
      setGratitude3(data.gratitude_3 || '')
      setMoodRating(data.mood_rating || 0)
    }
  }

  const fetchAllEntries = async () => {
    const { data } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false })

    if (data) {
      setAllEntries(data)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)
    try {
      const entryData = {
        content,
        morning_intention: morningIntention,
        gratitude_1: gratitude1,
        gratitude_2: gratitude2,
        gratitude_3: gratitude3,
        mood_rating: moodRating,
        updated_at: new Date().toISOString(),
      }

      if (todayEntry) {
        const { error } = await supabase
          .from('entries')
          .update(entryData)
          .eq('id', todayEntry.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('entries').insert({
          user_id: user.id,
          entry_date: today,
          ...entryData,
        })
        if (error) throw error
      }

      await fetchTodayEntry()
      await fetchAllEntries()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error al guardar:', error)
      alert('Error al guardar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const hasAnyContent = content.trim() || morningIntention.trim() || gratitude1.trim() || gratitude2.trim() || gratitude3.trim() || moodRating > 0

  // Weekly progress: which days of this week have entries
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => format(addDays(weekStart, i), 'yyyy-MM-dd'))
  const entryDates = new Set(allEntries.map((e) => e.entry_date))

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Intro dismissible */}
      {showIntro && (
        <div className="relative mb-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-canvas dark:from-indigo-900/10 dark:to-dark-surface border border-indigo-100/40 dark:border-indigo-800/20">
          <button
            onClick={dismissIntro}
            className="absolute top-4 right-4 p-1 rounded-lg text-gray-300 hover:text-gray-500 transition-colors"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
          <h3 className="font-serif text-lg text-charcoal dark:text-gray-100 mb-1">
            Vive con intención, no en piloto automático.
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed pr-6">
            Cada día: establece una intención, captura tu momento más significativo, evalúa cómo te fue y agradece. Cada semana: reflexiona sobre tus patrones.
          </p>
        </div>
      )}

      <div className="flex gap-12">
        {/* ─── Main content ─── */}
        <div className="flex-1 min-w-0">
          {/* Date */}
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider font-medium">
            {format(new Date(), "EEEE", { locale: es })}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-charcoal dark:text-gray-100 mb-12">
            {format(new Date(), "d 'de' MMMM", { locale: es })}
          </h1>

          {/* Morning Intention */}
          <section className="mb-12">
            <label className="block font-serif text-xl text-charcoal dark:text-gray-200 mb-4">
              Intención del día
            </label>
            <input
              type="text"
              value={morningIntention}
              onChange={(e) => setMorningIntention(e.target.value)}
              placeholder="Hoy mi intención es..."
              className="input-organic text-lg"
            />
            {isMorning && !morningIntention && !todayEntry?.morning_intention && (
              <p className="text-xs text-clay-400 mt-3">
                Establece tu intención para hoy
              </p>
            )}
          </section>

          {/* Moment of the Day */}
          <section className="mb-12">
            <div className="flex justify-between items-baseline mb-4">
              <label className="font-serif text-xl text-charcoal dark:text-gray-200">
                Momento del día
              </label>
              <button
                onClick={() => setShowPrompts(!showPrompts)}
                className="flex items-center gap-1.5 text-gray-300 hover:text-indigo-500 transition-colors"
              >
                <Sparkles size={14} />
                <span className="text-xs">Ideas</span>
              </button>
            </div>

            {showPrompts && (
              <div className="mb-4 p-5 rounded-2xl bg-canvas-alt dark:bg-dark-elevated border border-gray-100/60 dark:border-dark-border">
                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wider">
                  Si no sabes qué escribir:
                </p>
                <ul className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
                  {prompts.map((prompt, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-gray-300">·</span>
                      {prompt}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe el momento más significativo de tu día..."
              className="input-organic text-base min-h-[180px] resize-y leading-relaxed"
            />
            <p className="text-xs text-gray-300 dark:text-gray-600 mt-2">
              {wordCount} {wordCount === 1 ? 'palabra' : 'palabras'}
            </p>
          </section>

          {/* How was your day */}
          <section className="mb-12">
            <label className="block font-serif text-xl text-charcoal dark:text-gray-200 mb-4">
              ¿Cómo fue tu día?
            </label>
            <StarRating
              rating={moodRating}
              onRatingChange={setMoodRating}
              size={28}
            />
          </section>

          {/* Gratitude */}
          <section className="mb-12">
            <label className="block font-serif text-xl text-charcoal dark:text-gray-200 mb-2">
              Agradecimiento
            </label>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
              3 cosas por las que estás agradecido hoy
            </p>
            <div className="space-y-4">
              {[
                { value: gratitude1, setter: setGratitude1 },
                { value: gratitude2, setter: setGratitude2 },
                { value: gratitude3, setter: setGratitude3 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-300 dark:text-gray-600 w-5 text-right">{idx + 1}</span>
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => item.setter(e.target.value)}
                    placeholder="Estoy agradecido por..."
                    className="input-organic"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Save button */}
          <div className="sticky bottom-20 md:bottom-8 z-10">
            <button
              onClick={handleSave}
              disabled={loading || !hasAnyContent}
              className={`w-full py-3.5 px-6 rounded-2xl font-medium text-white shadow-zen-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                saved
                  ? 'bg-sage-400'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <Save size={18} strokeWidth={1.5} />
              {loading ? 'Guardando...' : saved ? '¡Guardado!' : todayEntry ? 'Actualizar' : 'Guardar'}
            </button>
          </div>

          {todayEntry && (
            <p className="text-[11px] text-center text-gray-300 dark:text-gray-600 mt-3">
              Última actualización: {format(new Date(todayEntry.updated_at), "HH:mm")}
            </p>
          )}
        </div>

        {/* ─── Right sidebar — Insights ─── */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-12 space-y-6">
            {/* Streak */}
            <div className="text-center p-6 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100/60 dark:border-dark-border">
              <Flame size={24} className="mx-auto mb-2 text-coral-500" strokeWidth={1.5} />
              <p className="text-3xl font-serif font-medium text-charcoal dark:text-gray-100">{streak}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">días seguidos</p>
            </div>

            {/* Weekly progress */}
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100/60 dark:border-dark-border">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wider font-medium">Esta semana</p>
              <div className="flex justify-between">
                {weekDays.map((day, idx) => {
                  const hasEntry = entryDates.has(day)
                  const isToday = day === today
                  const dayLabel = format(addDays(weekStart, idx), 'EEEEE', { locale: es })
                  return (
                    <div key={day} className="flex flex-col items-center gap-1.5">
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase">{dayLabel}</span>
                      <div
                        className={`w-5 h-5 rounded-full transition-all duration-300 ${
                          hasEntry
                            ? 'bg-sage-400'
                            : isToday
                            ? 'bg-indigo-100 dark:bg-indigo-900/30 ring-2 ring-indigo-400 ring-offset-1 dark:ring-offset-dark-surface'
                            : 'bg-gray-100 dark:bg-dark-elevated'
                        }`}
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Total entries */}
            <div className="text-center p-6 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100/60 dark:border-dark-border">
              <p className="text-3xl font-serif font-medium text-charcoal dark:text-gray-100">{allEntries.length}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">entradas totales</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile stats — compact */}
      <div className="lg:hidden flex gap-3 mt-8 mb-4">
        <div className="flex-1 text-center p-4 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100/60 dark:border-dark-border">
          <Flame size={18} className="mx-auto mb-1 text-coral-500" strokeWidth={1.5} />
          <p className="text-xl font-serif font-medium">{streak}</p>
          <p className="text-[10px] text-gray-400">racha</p>
        </div>
        <div className="flex-1 text-center p-4 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100/60 dark:border-dark-border">
          <p className="text-xl font-serif font-medium">{allEntries.length}</p>
          <p className="text-[10px] text-gray-400">entradas</p>
        </div>
        <div className="flex-1 p-4 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100/60 dark:border-dark-border">
          <p className="text-[10px] text-gray-400 mb-2 text-center">semana</p>
          <div className="flex justify-center gap-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className={`w-3 h-3 rounded-full ${
                  entryDates.has(day) ? 'bg-sage-400' : day === today ? 'ring-1 ring-indigo-400 bg-indigo-50 dark:bg-dark-elevated' : 'bg-gray-100 dark:bg-dark-elevated'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
