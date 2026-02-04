import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { calculateStreak } from '../utils/stats'
import { generateInsights, getWordFrequency } from '../utils/insights'
import { Lightbulb, TrendingUp, TrendingDown, Minus, Flame, Calendar, MessageSquare, Target } from 'lucide-react'

export default function Insights() {
  const { user } = useAuth()
  const [allEntries, setAllEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchAllEntries()
    }
  }, [user])

  const fetchAllEntries = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false })

    if (data) {
      setAllEntries(data)
    }
    setLoading(false)
  }

  const streak = useMemo(() => calculateStreak(allEntries), [allEntries])
  const insights = useMemo(() => generateInsights(allEntries, streak), [allEntries, streak])
  const topWords = useMemo(() => getWordFrequency(allEntries, 10), [allEntries])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-400"></div>
      </div>
    )
  }

  if (!insights.hasData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center py-16">
          <Lightbulb size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h2 className="font-serif text-2xl text-charcoal dark:text-gray-200 mb-2">
            Aún no hay insights
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Escribe tu primera entrada para comenzar a recibir insights personalizados.
          </p>
        </div>
      </div>
    )
  }

  const needsMoreData = allEntries.length < 7

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] font-medium mb-2">
          Análisis personal
        </p>
        <h1 className="font-serif text-3xl text-charcoal dark:text-gray-100">
          Tus Insights
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Basado en {allEntries.length} {allEntries.length === 1 ? 'entrada' : 'entradas'}
        </p>
      </div>

      {needsMoreData && (
        <div className="mb-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <strong>Tip:</strong> Con 7+ entradas tendrás análisis más completos de temas y patrones.
          </p>
        </div>
      )}

      {/* Streak celebrations */}
      {insights.streakInsights && insights.streakInsights.length > 0 && (
        <div className="mb-8 space-y-3">
          {insights.streakInsights.map((insight, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-gradient-to-r from-gold/10 to-sage-100/50 dark:from-gold/20 dark:to-sage-500/10"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{insight.icon}</span>
                <p className="text-charcoal dark:text-gray-200 font-medium">
                  {insight.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-white dark:bg-dark-surface border border-gray-100/60 dark:border-dark-border text-center">
          <Flame size={20} className="mx-auto mb-2 text-coral-500" />
          <p className="text-2xl font-serif font-bold text-charcoal dark:text-gray-100">{streak}</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Racha actual</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-dark-surface border border-gray-100/60 dark:border-dark-border text-center">
          <Calendar size={20} className="mx-auto mb-2 text-sage-500" />
          <p className="text-2xl font-serif font-bold text-charcoal dark:text-gray-100">{allEntries.length}</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total entradas</p>
        </div>
        {insights.moodStats && (
          <>
            <div className="p-4 rounded-xl bg-white dark:bg-dark-surface border border-gray-100/60 dark:border-dark-border text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                {insights.moodStats.trend === 'up' && <TrendingUp size={20} className="text-sage-500" />}
                {insights.moodStats.trend === 'down' && <TrendingDown size={20} className="text-coral-500" />}
                {insights.moodStats.trend === 'stable' && <Minus size={20} className="text-gray-400" />}
              </div>
              <p className="text-2xl font-serif font-bold text-charcoal dark:text-gray-100">{insights.moodStats.average}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Mood promedio</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-dark-surface border border-gray-100/60 dark:border-dark-border text-center">
              <Target size={20} className="mx-auto mb-2 text-indigo-500" />
              <p className="text-2xl font-serif font-bold text-charcoal dark:text-gray-100">{insights.moodStats.max}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Mejor mood</p>
            </div>
          </>
        )}
      </div>

      {/* Suggestions */}
      {insights.suggestions && insights.suggestions.length > 0 && (
        <div className="mb-8">
          <h2 className="font-serif text-xl text-charcoal dark:text-gray-200 mb-4 flex items-center gap-2">
            <Lightbulb size={20} className="text-gold" />
            Sugerencias
          </h2>
          <div className="space-y-3">
            {insights.suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-canvas-warm dark:bg-dark-hover"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{suggestion.icon}</span>
                  <p className="text-sm text-charcoal dark:text-gray-300 leading-relaxed">
                    {suggestion.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Themes */}
      {insights.themes && insights.themes.length > 0 && (
        <div className="mb-8">
          <h2 className="font-serif text-xl text-charcoal dark:text-gray-200 mb-4">
            Temas frecuentes
          </h2>
          <div className="flex flex-wrap gap-3">
            {insights.themes.map(({ theme, score }) => {
              const themeLabels = {
                trabajo: { label: 'Trabajo', emoji: '💼' },
                familia: { label: 'Familia', emoji: '👨‍👩‍👧‍👦' },
                salud: { label: 'Salud', emoji: '🏃' },
                relaciones: { label: 'Relaciones', emoji: '💝' },
                crecimiento: { label: 'Crecimiento', emoji: '🌱' },
                ocio: { label: 'Ocio', emoji: '🎮' },
                emociones: { label: 'Emociones', emoji: '💭' }
              }
              const info = themeLabels[theme] || { label: theme, emoji: '📌' }
              return (
                <div
                  key={theme}
                  className="px-4 py-2 rounded-xl bg-sage-50 dark:bg-sage-500/10 border border-sage-200 dark:border-sage-500/20"
                >
                  <span className="mr-2">{info.emoji}</span>
                  <span className="text-sage-700 dark:text-sage-300 font-medium">{info.label}</span>
                  <span className="ml-2 text-sage-500 dark:text-sage-400 text-sm">({score})</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Top words */}
      {topWords && topWords.length > 0 && !needsMoreData && (
        <div className="mb-8">
          <h2 className="font-serif text-xl text-charcoal dark:text-gray-200 mb-4 flex items-center gap-2">
            <MessageSquare size={20} className="text-indigo-500" />
            Palabras más usadas
          </h2>
          <div className="flex flex-wrap gap-2">
            {topWords.map(({ word, count }, idx) => {
              const sizes = ['text-xl', 'text-lg', 'text-base', 'text-sm', 'text-sm']
              const size = sizes[Math.min(idx, sizes.length - 1)]
              return (
                <span
                  key={word}
                  className={`px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-dark-border text-charcoal dark:text-gray-300 ${size}`}
                >
                  {word}
                  <span className="ml-1 text-gray-400 dark:text-gray-500 text-xs">({count})</span>
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Best day */}
      {insights.dayStats && (
        <div className="mb-8">
          <h2 className="font-serif text-xl text-charcoal dark:text-gray-200 mb-4">
            Patrones semanales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.dayStats.mostActive && (
              <div className="p-4 rounded-xl bg-white dark:bg-dark-surface border border-gray-100/60 dark:border-dark-border">
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                  Día más activo
                </p>
                <p className="text-lg font-serif text-charcoal dark:text-gray-200 capitalize">
                  {insights.dayStats.mostActive.day}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {insights.dayStats.mostActive.count} entradas
                </p>
              </div>
            )}
            {insights.dayStats.bestMood && (
              <div className="p-4 rounded-xl bg-white dark:bg-dark-surface border border-gray-100/60 dark:border-dark-border">
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                  Mejor mood promedio
                </p>
                <p className="text-lg font-serif text-charcoal dark:text-gray-200 capitalize">
                  {insights.dayStats.bestMood.day}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {insights.dayStats.bestMood.average}/5 estrellas
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer tip */}
      <div className="text-center pt-8 border-t border-gray-100 dark:border-dark-border">
        <p className="text-xs text-gray-400 dark:text-gray-500 italic">
          Los insights se actualizan cada vez que escribes una entrada.
        </p>
      </div>
    </div>
  )
}
