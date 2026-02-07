import { useState, useEffect, useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Search, Calendar, Star, ChevronDown, ChevronUp, BookOpen } from 'lucide-react'

export default function Library() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [expandedEntry, setExpandedEntry] = useState(null)

  useEffect(() => {
    if (user) {
      fetchEntries()
    }
  }, [user])

  const fetchEntries = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false })

    if (data) {
      setEntries(data)
    }
    setLoading(false)
  }

  // Get unique months for filter
  const availableMonths = useMemo(() => {
    const months = new Set()
    entries.forEach(entry => {
      const date = parseISO(entry.entry_date)
      months.add(format(date, 'yyyy-MM'))
    })
    return Array.from(months).sort().reverse()
  }, [entries])

  // Filter entries based on search and month
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // Month filter
      if (selectedMonth) {
        const entryMonth = format(parseISO(entry.entry_date), 'yyyy-MM')
        if (entryMonth !== selectedMonth) return false
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const searchableText = [
          entry.content,
          entry.morning_intention,
          entry.gratitude_1,
          entry.gratitude_2,
          entry.gratitude_3
        ].filter(Boolean).join(' ').toLowerCase()

        if (!searchableText.includes(query)) return false
      }

      return true
    })
  }, [entries, searchQuery, selectedMonth])

  // Group entries by month for display
  const groupedEntries = useMemo(() => {
    const groups = {}
    filteredEntries.forEach(entry => {
      const monthKey = format(parseISO(entry.entry_date), 'MMMM yyyy', { locale: es })
      if (!groups[monthKey]) {
        groups[monthKey] = []
      }
      groups[monthKey].push(entry)
    })
    return groups
  }, [filteredEntries])

  const toggleEntry = (id) => {
    setExpandedEntry(expandedEntry === id ? null : id)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-400"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={20} className="text-sage-500" />
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] font-medium">
            Tu colección
          </p>
        </div>
        <h1 className="font-serif text-3xl text-charcoal dark:text-gray-100 mb-2">
          Biblioteca
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {entries.length} {entries.length === 1 ? 'momento capturado' : 'momentos capturados'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en tus momentos..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border text-charcoal dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sage-400/50 dark:focus:ring-sage-glow/50"
          />
        </div>

        {/* Month filter */}
        <div className="relative">
          <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border text-charcoal dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-400/50 dark:focus:ring-sage-glow/50 appearance-none cursor-pointer"
          >
            <option value="">Todos los meses</option>
            {availableMonths.map(month => (
              <option key={month} value={month}>
                {format(parseISO(month + '-01'), 'MMMM yyyy', { locale: es })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      {(searchQuery || selectedMonth) && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {filteredEntries.length} {filteredEntries.length === 1 ? 'resultado' : 'resultados'}
          {searchQuery && ` para "${searchQuery}"`}
        </p>
      )}

      {/* Empty state */}
      {entries.length === 0 && (
        <div className="text-center py-16">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h2 className="font-serif text-xl text-charcoal dark:text-gray-200 mb-2">
            Tu biblioteca está vacía
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Escribe tu primera entrada para comenzar a llenarla.
          </p>
        </div>
      )}

      {/* No results */}
      {entries.length > 0 && filteredEntries.length === 0 && (
        <div className="text-center py-12">
          <Search size={40} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h2 className="font-serif text-xl text-charcoal dark:text-gray-200 mb-2">
            Sin resultados
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Intenta con otra búsqueda o quita los filtros.
          </p>
        </div>
      )}

      {/* Entries grouped by month */}
      <div className="space-y-8">
        {Object.entries(groupedEntries).map(([month, monthEntries]) => (
          <div key={month}>
            {/* Month header */}
            <h2 className="font-serif text-lg text-charcoal dark:text-gray-200 mb-4 capitalize sticky top-0 bg-canvas dark:bg-dark-base py-2 z-10">
              {month}
            </h2>

            {/* Entries list */}
            <div className="space-y-3">
              {monthEntries.map(entry => {
                const isExpanded = expandedEntry === entry.id
                const hasGratitudes = entry.gratitude_1 || entry.gratitude_2 || entry.gratitude_3

                return (
                  <div
                    key={entry.id}
                    className="bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border overflow-hidden transition-all duration-200"
                  >
                    {/* Entry header - always visible */}
                    <button
                      onClick={() => toggleEntry(entry.id)}
                      className="w-full p-4 text-left flex items-start gap-4"
                    >
                      {/* Date */}
                      <div className="text-center shrink-0">
                        <p className="text-2xl font-serif font-medium text-charcoal dark:text-gray-100">
                          {format(parseISO(entry.entry_date), 'd')}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase">
                          {format(parseISO(entry.entry_date), 'EEE', { locale: es })}
                        </p>
                      </div>

                      {/* Content preview */}
                      <div className="flex-1 min-w-0">
                        {entry.morning_intention && (
                          <p className="text-xs text-indigo-500 dark:text-indigo-400 mb-1 truncate">
                            🎯 {entry.morning_intention}
                          </p>
                        )}
                        <p className={`text-sm text-charcoal dark:text-gray-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
                          {entry.content || <span className="text-gray-400 italic">Sin momento registrado</span>}
                        </p>
                      </div>

                      {/* Mood + expand */}
                      <div className="flex items-center gap-2 shrink-0">
                        {entry.mood_rating > 0 && (
                          <div className="flex items-center gap-0.5">
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            <span className="text-xs text-gray-500">{entry.mood_rating}</span>
                          </div>
                        )}
                        {isExpanded ? (
                          <ChevronUp size={18} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={18} className="text-gray-400" />
                        )}
                      </div>
                    </button>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0 border-t border-gray-100 dark:border-dark-border animate-in slide-in-from-top-2 duration-200">
                        {/* Full content */}
                        {entry.content && (
                          <div className="mt-4">
                            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                              Momento del día
                            </p>
                            <p className="text-sm text-charcoal dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                              {entry.content}
                            </p>
                          </div>
                        )}

                        {/* Gratitudes */}
                        {hasGratitudes && (
                          <div className="mt-4">
                            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                              Agradecimientos
                            </p>
                            <ul className="space-y-1">
                              {[entry.gratitude_1, entry.gratitude_2, entry.gratitude_3]
                                .filter(Boolean)
                                .map((g, idx) => (
                                  <li key={idx} className="text-sm text-charcoal dark:text-gray-300 flex items-start gap-2">
                                    <span className="text-gold">•</span>
                                    {g}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}

                        {/* Intention fulfilled status */}
                        {entry.intention_fulfilled && (
                          <div className="mt-4">
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              Intención: {entry.intention_fulfilled === 'yes' ? '✅ Cumplida' : entry.intention_fulfilled === 'partial' ? '🔶 Parcial' : '❌ No cumplida'}
                            </p>
                          </div>
                        )}

                        {/* Mood detail */}
                        {entry.mood_rating > 0 && (
                          <div className="mt-4 flex items-center gap-2">
                            <p className="text-xs text-gray-400 dark:text-gray-500">Día:</p>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map(n => (
                                <Star
                                  key={n}
                                  size={14}
                                  className={n <= entry.mood_rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-600'}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
