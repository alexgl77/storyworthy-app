import { useState, useEffect, useMemo } from 'react'
import { format, startOfWeek, addDays, subDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { getPromptsForToday } from '../utils/prompts'
import { calculateStreak } from '../utils/stats'
import MoodQuestionnaire from '../components/MoodQuestionnaire'
import LifeCalendar from '../components/LifeCalendar'
import SaveSuccessModal from '../components/SaveSuccessModal'
import { getDailyQuote } from '../utils/quotes'
import { Sparkles, Flame, Save, Zap, Clock } from 'lucide-react'

function getWeeksLived() {
  const saved = localStorage.getItem('clarity-birth-date')
  if (!saved) return null
  const birthDate = new Date(saved)
  const now = new Date()
  const diffMs = now - birthDate
  const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7))
  return Math.max(0, diffWeeks)
}

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
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [todayEntry, setTodayEntry] = useState(null)
  const [yesterdayEntry, setYesterdayEntry] = useState(null)
  const [intentionFulfilled, setIntentionFulfilled] = useState(null)
  const [allEntries, setAllEntries] = useState([])
  const [streak, setStreak] = useState(0)
  const [showPrompts, setShowPrompts] = useState(false)
  const [prompts] = useState(getPromptsForToday())
  const [quickMode, setQuickMode] = useState(() => {
    return localStorage.getItem('clarity-quick-mode') === 'true'
  })
  const dailyQuote = getDailyQuote()

  const toggleQuickMode = () => {
    const newValue = !quickMode
    setQuickMode(newValue)
    localStorage.setItem('clarity-quick-mode', newValue.toString())
  }

  const today = format(new Date(), 'yyyy-MM-dd')
  const currentHour = new Date().getHours()
  const isMorning = currentHour < 14
  const weeksLived = useMemo(() => getWeeksLived(), [])

  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')

  useEffect(() => {
    if (user) {
      fetchTodayEntry()
      fetchYesterdayEntry()
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
      setIntentionFulfilled(data.intention_fulfilled || null)
    }
  }

  const fetchYesterdayEntry = async () => {
    const { data } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('entry_date', yesterday)
      .single()

    if (data) {
      setYesterdayEntry(data)
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
        intention_fulfilled: intentionFulfilled,
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
      setShowSuccessModal(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error al guardar:', error)
      alert('Error al guardar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const hasAnyContent = quickMode
    ? content.trim()
    : content.trim() || morningIntention.trim() || gratitude1.trim() || gratitude2.trim() || gratitude3.trim() || moodRating > 0

  // Weekly progress
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => format(addDays(weekStart, i), 'yyyy-MM-dd'))
  const entryDates = new Set(allEntries.map((e) => e.entry_date))

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="flex gap-12">
        {/* ─── Main content ─── */}
        <div className="flex-1 min-w-0">
          {/* App hero title */}
          <section className="mb-12 md:mb-16">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-serif text-lg text-gray-400 dark:text-gray-500 mb-3 tracking-wide">
                  Clarity
                </p>
                <h1 className="text-hero-prompt text-charcoal dark:text-gray-100">
                  {quickMode ? (
                    <>Tu <span className="text-gold dark:text-sage-glow italic">momento</span> del día</>
                  ) : (
                    <>Captura tus <span className="text-gold dark:text-sage-glow italic">momentos</span>, un día a la vez.</>
                  )}
                </h1>
                <p className="mt-4 text-sm font-sans text-gray-400 dark:text-gray-500 tracking-wide">
                  {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}
                </p>
              </div>

              {/* Quick Mode Toggle */}
              <button
                onClick={toggleQuickMode}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  quickMode
                    ? 'bg-gold/10 text-gold border border-gold/30'
                    : 'bg-gray-100 dark:bg-dark-muted text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-hover'
                }`}
                title={quickMode ? 'Cambiar a modo completo' : 'Cambiar a modo rápido (1 min)'}
              >
                {quickMode ? (
                  <>
                    <Zap size={14} className="fill-current" />
                    <span className="hidden sm:inline">1 min</span>
                  </>
                ) : (
                  <>
                    <Clock size={14} />
                    <span className="hidden sm:inline">Completo</span>
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Morning Intention */}
          {!quickMode && (
          <section className="mb-10 pb-10 border-b border-gray-100 dark:border-dark-border">
            <label className="block font-serif text-xl text-charcoal dark:text-gray-200 mb-4">
              Intención del día:
            </label>
            <input
              type="text"
              value={morningIntention}
              onChange={(e) => setMorningIntention(e.target.value)}
              placeholder="Enfócate en el presente. Escribe tu intención..."
              className="input-organic text-lg"
            />
            {isMorning && !morningIntention && !todayEntry?.morning_intention && (
              <p className="text-xs text-gray-400 mt-3">
                Establece tu intención para hoy
              </p>
            )}

            {/* Yesterday's intention follow-up (morning) */}
            {isMorning && yesterdayEntry?.morning_intention && !yesterdayEntry?.intention_fulfilled && (
              <div className="mt-6 p-4 rounded-2xl bg-canvas-alt dark:bg-dark-raised border border-gray-100/60 dark:border-dark-border">
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                  Tu intención de ayer
                </p>
                <p className="text-sm text-charcoal dark:text-gray-200 italic mb-4">
                  "{yesterdayEntry.morning_intention}"
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  ¿La cumpliste?
                </p>
                <div className="flex gap-2">
                  {[
                    { value: 'yes', label: 'Sí', color: 'bg-sage-400 dark:bg-sage-glow text-white dark:text-dark-base' },
                    { value: 'partial', label: 'Parcial', color: 'bg-amber-400 text-white' },
                    { value: 'no', label: 'No', color: 'bg-gray-300 dark:bg-dark-muted text-charcoal dark:text-gray-300' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={async () => {
                        await supabase
                          .from('entries')
                          .update({ intention_fulfilled: option.value })
                          .eq('id', yesterdayEntry.id)
                        setYesterdayEntry({ ...yesterdayEntry, intention_fulfilled: option.value })
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${option.color} hover:opacity-80`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Today's intention follow-up (evening) */}
            {!isMorning && morningIntention && !intentionFulfilled && (
              <div className="mt-6 p-4 rounded-2xl bg-canvas-alt dark:bg-dark-raised border border-gray-100/60 dark:border-dark-border">
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                  Tu intención de hoy
                </p>
                <p className="text-sm text-charcoal dark:text-gray-200 italic mb-4">
                  "{morningIntention}"
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  ¿La cumpliste?
                </p>
                <div className="flex gap-2">
                  {[
                    { value: 'yes', label: 'Sí', color: 'bg-sage-400 dark:bg-sage-glow text-white dark:text-dark-base' },
                    { value: 'partial', label: 'Parcial', color: 'bg-amber-400 text-white' },
                    { value: 'no', label: 'No', color: 'bg-gray-300 dark:bg-dark-muted text-charcoal dark:text-gray-300' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setIntentionFulfilled(option.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        intentionFulfilled === option.value
                          ? option.color
                          : 'bg-gray-100 dark:bg-dark-muted text-gray-500 dark:text-gray-400'
                      } hover:opacity-80`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Show fulfilled status */}
            {intentionFulfilled && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                Intención marcada como: {intentionFulfilled === 'yes' ? 'Cumplida' : intentionFulfilled === 'partial' ? 'Parcialmente cumplida' : 'No cumplida'}
              </p>
            )}
          </section>
          )}

          {/* Moment of the Day */}
          <section className="mb-10 pb-10 border-b border-gray-100 dark:border-dark-border">
            <div className="flex justify-between items-baseline mb-4">
              <label className="font-serif text-xl text-charcoal dark:text-gray-200">
                Momento del día:
              </label>
              <button
                onClick={() => setShowPrompts(!showPrompts)}
                className="flex items-center gap-1.5 text-gray-300 dark:text-gray-600 hover:text-indigo-500 dark:hover:text-sage-glow transition-colors"
              >
                <Sparkles size={14} />
                <span className="text-xs">Ideas</span>
              </button>
            </div>

            {showPrompts && (
              <div className="mb-4 p-5 rounded-2xl bg-canvas-alt dark:bg-dark-raised border border-gray-100/60 dark:border-dark-border">
                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wider">
                  Si no sabes qué escribir:
                </p>
                <ul className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
                  {prompts.map((prompt, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-gray-300 dark:text-gray-600">·</span>
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
          {!quickMode && (
          <section className="mb-10 pb-10 border-b border-gray-100 dark:border-dark-border">
            <label className="block font-serif text-xl text-charcoal dark:text-gray-200 mb-4">
              ¿Cómo fue tu día?
            </label>
            <MoodQuestionnaire
              rating={moodRating}
              onRatingChange={setMoodRating}
            />
          </section>
          )}

          {/* Gratitude */}
          {!quickMode && (
          <section className="mb-12">
            <label className="block font-serif text-xl text-charcoal dark:text-gray-200 mb-2">
              Agradecimiento:
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
          )}

          {/* Save button */}
          <div className="sticky bottom-20 md:bottom-8 z-10">
            <button
              onClick={handleSave}
              disabled={loading || !hasAnyContent}
              className={`w-full py-3.5 px-6 rounded-2xl font-medium shadow-zen-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                saved
                  ? 'bg-sage-400 text-white dark:bg-sage-glow dark:text-dark-base'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-sage-glow dark:hover:bg-sage-glow/80 dark:text-dark-base active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed'
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
        <aside className="hidden lg:block w-64 shrink-0">
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
                            ? 'bg-sage-400 dark:bg-sage-glow'
                            : isToday
                            ? 'bg-indigo-100 dark:bg-dark-hover ring-2 ring-indigo-400 dark:ring-sage-glow ring-offset-1 dark:ring-offset-dark-surface'
                            : 'bg-gray-100 dark:bg-dark-muted'
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

            {/* Life Calendar */}
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100/60 dark:border-dark-border">
              <LifeCalendar />
            </div>

            {/* Daily Quote */}
            <div className="quote-card">
              <p className="mb-2">"{dailyQuote.text}"</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 not-italic">— {dailyQuote.author}</p>
            </div>

          </div>
        </aside>
      </div>

      {/* Mobile stats — compact */}
      <div className="lg:hidden flex gap-3 mt-8 mb-4">
        <div className="flex-1 text-center p-4 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100/60 dark:border-dark-border">
          <Flame size={18} className="mx-auto mb-1 text-coral-500" strokeWidth={1.5} />
          <p className="text-xl font-serif font-medium text-charcoal dark:text-gray-100">{streak}</p>
          <p className="text-[10px] text-gray-400">racha</p>
        </div>
        <div className="flex-1 text-center p-4 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100/60 dark:border-dark-border">
          <p className="text-xl font-serif font-medium text-charcoal dark:text-gray-100">{allEntries.length}</p>
          <p className="text-[10px] text-gray-400">entradas</p>
        </div>
        <div className="flex-1 p-4 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100/60 dark:border-dark-border">
          <p className="text-[10px] text-gray-400 mb-2 text-center">semana</p>
          <div className="flex justify-center gap-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className={`w-3 h-3 rounded-full ${
                  entryDates.has(day) ? 'bg-sage-400 dark:bg-sage-glow' : day === today ? 'ring-1 ring-sage-400 dark:ring-sage-glow bg-sage-50 dark:bg-dark-hover' : 'bg-gray-100 dark:bg-dark-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Memento Mori */}
      <div className="lg:hidden p-6 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100/60 dark:border-dark-border mb-4">
        <LifeCalendar />
      </div>

      {/* Success Modal */}
      <SaveSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        streak={streak}
        weeksLived={weeksLived}
        entryData={{
          hasGratitude: !!(gratitude1 || gratitude2 || gratitude3),
          hasContent: !!content,
          hasIntention: !!morningIntention,
          hasMood: moodRating > 0
        }}
      />
    </div>
  )
}
