import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const DIMENSIONS = [
  { key: 'physical', label: 'Físico', description: '¿Cómo te sentiste físicamente?' },
  { key: 'emotional', label: 'Emocional', description: '¿Cómo estuvo tu estado emocional?' },
  { key: 'productivity', label: 'Productividad', description: '¿Qué tan productivo fue tu día?' },
  { key: 'connections', label: 'Conexiones', description: '¿Cómo fueron tus relaciones hoy?' },
]

function RatingDots({ value, onChange, disabled }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange(n)}
          className={`w-8 h-8 rounded-full transition-all duration-200 ${
            n <= value
              ? 'bg-sage-400 dark:bg-sage-glow'
              : 'bg-gray-100 dark:bg-dark-muted hover:bg-gray-200 dark:hover:bg-dark-hover'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        />
      ))}
    </div>
  )
}

export default function MoodQuestionnaire({ rating, onRatingChange }) {
  const [expanded, setExpanded] = useState(false)
  const [dimensions, setDimensions] = useState({
    physical: 0,
    emotional: 0,
    productivity: 0,
    connections: 0,
  })

  // Calculate average when dimensions change
  useEffect(() => {
    const values = Object.values(dimensions).filter(v => v > 0)
    if (values.length > 0) {
      const avg = values.reduce((a, b) => a + b, 0) / values.length
      onRatingChange(Math.round(avg * 10) / 10) // Round to 1 decimal
    }
  }, [dimensions, onRatingChange])

  // If there's an existing rating but no dimensions, set it as overall
  useEffect(() => {
    if (rating > 0 && Object.values(dimensions).every(v => v === 0)) {
      // User had a previous rating, show it
    }
  }, [rating, dimensions])

  const handleDimensionChange = (key, value) => {
    setDimensions(prev => ({ ...prev, [key]: value }))
  }

  const filledDimensions = Object.values(dimensions).filter(v => v > 0).length
  const allFilled = filledDimensions === DIMENSIONS.length

  return (
    <div className="space-y-4">
      {/* Collapsed view - click to expand */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-4">
          {/* Average display */}
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-serif font-medium text-charcoal dark:text-gray-100">
              {rating > 0 ? rating.toFixed(1) : '—'}
            </span>
            <span className="text-sm text-gray-400 dark:text-gray-500">/5</span>
          </div>

          {/* Mini dots preview */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  n <= Math.round(rating)
                    ? 'bg-sage-400 dark:bg-sage-glow'
                    : 'bg-gray-200 dark:bg-dark-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
          <span className="text-xs">
            {expanded ? 'Ocultar detalle' : 'Ver detalle'}
          </span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Expanded view - dimensions */}
      {expanded && (
        <div className="space-y-5 pt-4 border-t border-gray-100 dark:border-dark-border animate-in slide-in-from-top-2 duration-200">
          {DIMENSIONS.map((dim) => (
            <div key={dim.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal dark:text-gray-200">
                    {dim.label}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {dim.description}
                  </p>
                </div>
                <span className="text-sm text-gray-400 dark:text-gray-500 tabular-nums w-8 text-right">
                  {dimensions[dim.key] > 0 ? dimensions[dim.key] : '—'}
                </span>
              </div>
              <RatingDots
                value={dimensions[dim.key]}
                onChange={(v) => handleDimensionChange(dim.key, v)}
              />
            </div>
          ))}

          {allFilled && (
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-2">
              Promedio calculado: {rating.toFixed(1)}/5
            </p>
          )}
        </div>
      )}

      {/* Quick rating if not expanded */}
      {!expanded && rating === 0 && (
        <div className="pt-2">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            Calificación rápida:
          </p>
          <RatingDots
            value={Math.round(rating)}
            onChange={(v) => onRatingChange(v)}
          />
        </div>
      )}
    </div>
  )
}
