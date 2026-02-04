import { useMemo } from 'react'
import { Lightbulb, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react'
import { getHighlightInsight, generateInsights } from '../utils/insights'

export default function InsightsCard({ entries, streak, onViewMore }) {
  const highlight = useMemo(
    () => getHighlightInsight(entries, streak),
    [entries, streak]
  )

  const fullInsights = useMemo(
    () => generateInsights(entries, streak),
    [entries, streak]
  )

  const bgColors = {
    celebration: 'bg-gradient-to-r from-gold/10 to-sage-100/50 dark:from-gold/20 dark:to-sage-500/10',
    milestone: 'bg-gradient-to-r from-indigo-50 to-sage-50 dark:from-indigo-500/10 dark:to-sage-500/10',
    encouragement: 'bg-sage-50 dark:bg-sage-500/10',
    suggestion: 'bg-canvas-warm dark:bg-dark-hover',
    insight: 'bg-gray-50 dark:bg-dark-hover',
    welcome: 'bg-canvas-warm dark:bg-dark-hover',
    default: 'bg-gray-50 dark:bg-dark-hover'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] font-medium flex items-center gap-2">
          <Lightbulb size={14} />
          Insight
        </p>
      </div>

      {/* Highlight card */}
      <div className={`p-4 rounded-xl ${bgColors[highlight.type] || bgColors.default}`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">{highlight.icon}</span>
          <p className="text-sm text-charcoal dark:text-gray-200 leading-relaxed">
            {highlight.message}
          </p>
        </div>
      </div>

      {/* Mood trend indicator */}
      {fullInsights.moodStats && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400 dark:text-gray-500">Mood promedio</span>
          <div className="flex items-center gap-2">
            <span className="font-medium text-charcoal dark:text-gray-200">
              {fullInsights.moodStats.average}/5
            </span>
            {fullInsights.moodStats.trend === 'up' && (
              <TrendingUp size={14} className="text-sage-500" />
            )}
            {fullInsights.moodStats.trend === 'down' && (
              <TrendingDown size={14} className="text-coral-500" />
            )}
            {fullInsights.moodStats.trend === 'stable' && (
              <Minus size={14} className="text-gray-400" />
            )}
          </div>
        </div>
      )}

      {/* Top themes */}
      {fullInsights.themes && fullInsights.themes.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Temas frecuentes
          </p>
          <div className="flex flex-wrap gap-2">
            {fullInsights.themes.map(({ theme }) => (
              <span
                key={theme}
                className="px-2 py-1 text-[10px] rounded-full bg-sage-100 dark:bg-sage-500/20 text-sage-700 dark:text-sage-300 capitalize"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Top words */}
      {fullInsights.topWords && fullInsights.topWords.length > 0 && entries.length >= 7 && (
        <div className="space-y-2">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Palabras más usadas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {fullInsights.topWords.slice(0, 4).map(({ word, count }) => (
              <span
                key={word}
                className="px-2 py-0.5 text-[10px] rounded bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-400"
              >
                {word} <span className="text-gray-400 dark:text-gray-500">({count})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* View more link */}
      {entries.length >= 7 && onViewMore && (
        <button
          onClick={onViewMore}
          className="flex items-center gap-1 text-[10px] text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          Ver reporte semanal
          <ChevronRight size={12} />
        </button>
      )}
    </div>
  )
}
