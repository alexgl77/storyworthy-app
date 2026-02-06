import { useState, useMemo, useCallback, useEffect } from 'react'
import { X, Maximize2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const TOTAL_YEARS = 80
const WEEKS_PER_YEAR = 52
const TOTAL_WEEKS = TOTAL_YEARS * WEEKS_PER_YEAR

function getWeeksLived(birthDate) {
  const now = new Date()
  const diffMs = now - birthDate
  const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7))
  return Math.max(0, Math.min(diffWeeks, TOTAL_WEEKS))
}

function getCurrentWeekOfYear() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = now - start
  return Math.ceil(diff / (1000 * 60 * 60 * 24 * 7))
}

export default function LifeCalendar() {
  const { user } = useAuth()
  const [birthDate, setBirthDate] = useState(() => {
    // Load from localStorage as initial cache
    const saved = localStorage.getItem('clarity-birth-date')
    return saved ? new Date(saved) : null
  })
  const [showInput, setShowInput] = useState(!birthDate)
  const [inputValue, setInputValue] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [hoveredWeek, setHoveredWeek] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch birth_date from Supabase on mount
  useEffect(() => {
    async function fetchBirthDate() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('birth_date')
          .eq('user_id', user.id)
          .single()

        if (data?.birth_date) {
          const date = new Date(data.birth_date)
          setBirthDate(date)
          setShowInput(false)
          // Update localStorage cache
          localStorage.setItem('clarity-birth-date', date.toISOString())
        } else if (!birthDate) {
          setShowInput(true)
        }
      } catch (err) {
        // If no settings exist yet, that's ok
        console.log('No birth date found in settings')
      } finally {
        setLoading(false)
      }
    }

    fetchBirthDate()
  }, [user])

  const weeksLived = useMemo(
    () => (birthDate ? getWeeksLived(birthDate) : 0),
    [birthDate]
  )
  const weeksRemaining = TOTAL_WEEKS - weeksLived
  const currentWeekOfYear = getCurrentWeekOfYear()

  const handleSaveBirthDate = useCallback(async () => {
    if (!inputValue || !user) return
    const date = new Date(inputValue)
    if (isNaN(date.getTime())) return

    try {
      // Save to Supabase using upsert
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          birth_date: inputValue,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      if (error) throw error

      // Update localStorage cache
      localStorage.setItem('clarity-birth-date', date.toISOString())
      setBirthDate(date)
      setShowInput(false)
    } catch (err) {
      console.error('Error saving birth date:', err)
      alert('Error al guardar. Intenta de nuevo.')
    }
  }, [inputValue, user])

  const getWeekInfo = useCallback((weekIndex) => {
    const year = Math.floor(weekIndex / WEEKS_PER_YEAR) + 1
    const weekOfYear = (weekIndex % WEEKS_PER_YEAR) + 1
    return { year, weekOfYear, totalWeek: weekIndex + 1 }
  }, [])

  const createDots = useCallback((isModal = false) => {
    if (!birthDate) return null
    const elements = []
    for (let i = 0; i < TOTAL_WEEKS; i++) {
      let dotClass = isModal ? 'life-dot-modal ' : 'life-dot '
      if (i < weeksLived) {
        dotClass += 'life-dot-past'
      } else if (i === weeksLived) {
        dotClass += 'life-dot-current'
      } else {
        dotClass += 'life-dot-future'
      }
      elements.push(
        <div
          key={i}
          className={`${dotClass} ${isModal ? 'cursor-pointer hover:scale-150 transition-transform' : ''}`}
          onMouseEnter={isModal ? () => setHoveredWeek(getWeekInfo(i)) : undefined}
          onMouseLeave={isModal ? () => setHoveredWeek(null) : undefined}
        />
      )
    }
    return elements
  }, [birthDate, weeksLived, getWeekInfo])

  const dots = useMemo(() => createDots(false), [createDots])

  const percentageLived = ((weeksLived / TOTAL_WEEKS) * 100).toFixed(1)
  const yearsLived = Math.floor(weeksLived / WEEKS_PER_YEAR)
  const yearsRemaining = TOTAL_YEARS - yearsLived

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] font-medium">Memento Mori</p>
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sage-400"></div>
        </div>
      ) : showInput || !birthDate ? (
        <div className="space-y-3 overflow-hidden">
          <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
            Visualiza tu vida y haz que cada semana cuente. Ingresa tu fecha de nacimiento.
          </p>
          <input
            type="date"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="input-field text-sm w-full max-w-full box-border"
          />
          <button
            onClick={handleSaveBirthDate}
            className="btn-primary text-xs w-full py-2"
          >
            Guardar
          </button>
        </div>
      ) : (
        <>
          {/* Mobile: Visual progress view */}
          <div className="md:hidden space-y-4">
            {/* Main stat */}
            <div className="text-center">
              <p className="text-4xl font-serif font-bold text-charcoal dark:text-white">
                {percentageLived}%
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">de tu vida</p>
            </div>

            {/* Progress bar */}
            <div className="relative h-3 bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-sage-400 to-sage-500 dark:from-sage-500 dark:to-sage-400 rounded-full transition-all duration-500"
                style={{ width: `${percentageLived}%` }}
              />
              <div
                className="absolute inset-y-0 w-1 bg-gold dark:bg-sage-glow rounded-full animate-pulse"
                style={{ left: `calc(${percentageLived}% - 2px)` }}
              />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-dark-border/50 rounded-xl p-3 text-center">
                <p className="text-xl font-serif font-bold text-charcoal dark:text-white">{yearsLived}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">años vividos</p>
              </div>
              <div className="bg-gray-50 dark:bg-dark-border/50 rounded-xl p-3 text-center">
                <p className="text-xl font-serif font-bold text-sage-500 dark:text-sage-glow">{yearsRemaining}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">años restantes</p>
              </div>
              <div className="bg-gray-50 dark:bg-dark-border/50 rounded-xl p-3 text-center">
                <p className="text-xl font-serif font-bold text-charcoal dark:text-white">{weeksLived.toLocaleString('es-ES')}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">semanas vividas</p>
              </div>
              <div className="bg-gray-50 dark:bg-dark-border/50 rounded-xl p-3 text-center">
                <p className="text-xl font-serif font-bold text-charcoal dark:text-white">Sem. {currentWeekOfYear}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">del año actual</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setShowInput(true)
                  setInputValue(birthDate.toISOString().split('T')[0])
                }}
                className="text-[10px] text-gray-500 hover:text-gray-400 underline-offset-2 hover:underline transition-colors"
              >
                Cambiar fecha
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-400 transition-colors"
              >
                <Maximize2 size={12} />
                Ver todas las semanas
              </button>
            </div>
          </div>

          {/* Desktop: Dot grid view */}
          <div className="hidden md:block">
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed mb-4">
              Cada punto representa una semana de tu vida. El punto <span className="font-medium text-sage-400 dark:text-sage-glow">brillante</span> es el presente.
            </p>

            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-serif font-bold text-charcoal dark:text-white tabular-nums">
                  {weeksRemaining.toLocaleString('es-ES')}
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-medium">
                  Semanas restantes
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-serif font-medium text-charcoal dark:text-white">
                  Semana {currentWeekOfYear}
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-medium">
                  Actual
                </p>
              </div>
            </div>

            <div
              className="grid gap-[2px] py-2 w-full cursor-pointer group"
              style={{ gridTemplateColumns: 'repeat(52, 1fr)' }}
              onClick={() => setShowModal(true)}
            >
              {dots}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setShowInput(true)
                  setInputValue(birthDate.toISOString().split('T')[0])
                }}
                className="text-[10px] text-gray-500 hover:text-gray-400 underline-offset-2 hover:underline transition-colors"
              >
                Cambiar fecha
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-400 transition-colors"
              >
                <Maximize2 size={12} />
                Expandir
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal expandido */}
      {showModal && birthDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white dark:bg-dark-surface rounded-2xl shadow-zen-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-8">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-6">
              <h2 className="font-serif text-2xl font-medium text-charcoal dark:text-gray-100 mb-2">
                Tu vida en semanas
              </h2>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {TOTAL_YEARS} años × {WEEKS_PER_YEAR} semanas = {TOTAL_WEEKS.toLocaleString('es-ES')} semanas
              </p>
            </div>

            {/* Hover info */}
            <div className="h-8 mb-4">
              {hoveredWeek ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-charcoal dark:text-gray-200">Año {hoveredWeek.year}</span>
                  {' · '}Semana {hoveredWeek.weekOfYear} del año
                  {' · '}Semana {hoveredWeek.totalWeek.toLocaleString('es-ES')} de tu vida
                  {hoveredWeek.totalWeek <= weeksLived && ' (vivida)'}
                  {hoveredWeek.totalWeek === weeksLived + 1 && ' (actual)'}
                </p>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-600 italic">
                  Pasa el cursor sobre una semana para ver detalles
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-8 mb-6">
              <div>
                <p className="text-3xl font-serif font-bold text-charcoal dark:text-white">
                  {weeksLived.toLocaleString('es-ES')}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Semanas vividas
                </p>
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-charcoal dark:text-white">
                  {weeksRemaining.toLocaleString('es-ES')}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Semanas restantes
                </p>
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-sage-500 dark:text-sage-glow">
                  {((weeksLived / TOTAL_WEEKS) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  De tu vida
                </p>
              </div>
            </div>

            {/* Year labels + Grid */}
            <div className="flex gap-2">
              {/* Year labels */}
              <div className="flex flex-col justify-between text-[9px] text-gray-400 dark:text-gray-600 py-1">
                <span>1</span>
                <span>20</span>
                <span>40</span>
                <span>60</span>
                <span>80</span>
              </div>

              {/* Grid expandido */}
              <div
                className="grid gap-[3px] flex-1"
                style={{ gridTemplateColumns: 'repeat(52, 1fr)' }}
              >
                {createDots(true)}
              </div>
            </div>

            <p className="mt-6 text-xs text-gray-400 dark:text-gray-500 text-center italic">
              "No es que tengamos poco tiempo, sino que perdemos mucho." — Séneca
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
