import { useState, useMemo, useCallback } from 'react'

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
  const [birthDate, setBirthDate] = useState(() => {
    const saved = localStorage.getItem('clarity-birth-date')
    return saved ? new Date(saved) : null
  })
  const [showInput, setShowInput] = useState(!birthDate)
  const [inputValue, setInputValue] = useState('')

  const weeksLived = useMemo(
    () => (birthDate ? getWeeksLived(birthDate) : 0),
    [birthDate]
  )
  const weeksRemaining = TOTAL_WEEKS - weeksLived
  const currentWeekOfYear = getCurrentWeekOfYear()

  const handleSaveBirthDate = useCallback(() => {
    if (!inputValue) return
    const date = new Date(inputValue)
    if (isNaN(date.getTime())) return
    localStorage.setItem('clarity-birth-date', date.toISOString())
    setBirthDate(date)
    setShowInput(false)
  }, [inputValue])

  const dots = useMemo(() => {
    if (!birthDate) return null
    const elements = []
    for (let i = 0; i < TOTAL_WEEKS; i++) {
      let dotClass = 'life-dot '
      if (i < weeksLived) {
        dotClass += 'life-dot-past'
      } else if (i === weeksLived) {
        dotClass += 'life-dot-current'
      } else {
        dotClass += 'life-dot-future'
      }
      elements.push(<div key={i} className={dotClass} />)
    }
    return elements
  }, [birthDate, weeksLived])

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] font-medium">Memento Mori</p>
      {showInput || !birthDate ? (
        <div className="space-y-3">
          <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
            Cada punto representa una semana de tu vida. Ingresa tu fecha de nacimiento para visualizar tu vida en semanas.
          </p>
          <input
            type="date"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="input-field text-sm w-full"
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
          <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
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
            className="grid gap-[2px] max-h-[260px] overflow-y-auto scrollbar-thin py-1"
            style={{ gridTemplateColumns: 'repeat(52, 3px)' }}
          >
            {dots}
          </div>

          <button
            onClick={() => {
              setShowInput(true)
              setInputValue(birthDate.toISOString().split('T')[0])
            }}
            className="text-[10px] text-gray-500 hover:text-gray-400 underline-offset-2 hover:underline transition-colors"
          >
            Cambiar fecha de nacimiento
          </button>
        </>
      )}
    </div>
  )
}
