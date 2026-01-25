import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { getPromptsForToday } from '../utils/prompts'
import { calculateStreak } from '../utils/stats'
import { Sparkles, Calendar, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [todayEntry, setTodayEntry] = useState(null)
  const [allEntries, setAllEntries] = useState([])
  const [streak, setStreak] = useState(0)
  const [showPrompts, setShowPrompts] = useState(false)
  const [prompts] = useState(getPromptsForToday())

  const today = format(new Date(), 'yyyy-MM-dd')

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
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('entry_date', today)
      .single()

    if (data) {
      setTodayEntry(data)
      setContent(data.content)
    }
  }

  const fetchAllEntries = async () => {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false })

    if (data) {
      setAllEntries(data)
    }
  }

  const handleSave = async () => {
    if (!content.trim()) return

    setLoading(true)
    try {
      if (todayEntry) {
        // Actualizar entrada existente
        const { error } = await supabase
          .from('entries')
          .update({ content, updated_at: new Date().toISOString() })
          .eq('id', todayEntry.id)

        if (error) throw error
      } else {
        // Crear nueva entrada
        const { error } = await supabase.from('entries').insert({
          user_id: user.id,
          content,
          entry_date: today,
        })

        if (error) throw error
      }

      await fetchTodayEntry()
      await fetchAllEntries()
    } catch (error) {
      console.error('Error al guardar:', error)
      alert('Error al guardar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header con estadísticas */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
        </h2>
        <div className="flex gap-4 mt-4">
          <div className="card flex-1 !p-4">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <TrendingUp size={20} />
              <span className="font-semibold">Racha actual</span>
            </div>
            <p className="text-2xl font-bold mt-1">{streak} días</p>
          </div>
          <div className="card flex-1 !p-4">
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
              <Calendar size={20} />
              <span className="font-semibold">Total de entradas</span>
            </div>
            <p className="text-2xl font-bold mt-1">{allEntries.length}</p>
          </div>
        </div>
      </div>

      {/* Área de escritura */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {todayEntry ? 'Tu momento del día' : '¿Qué momento valió la pena hoy?'}
          </h3>
          <button
            onClick={() => setShowPrompts(!showPrompts)}
            className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
          >
            <Sparkles size={18} />
            <span className="text-sm">Ideas</span>
          </button>
        </div>

        {showPrompts && (
          <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
            <p className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-2">
              Si no sabes qué escribir, estas preguntas pueden ayudar:
            </p>
            <ul className="space-y-1 text-sm text-primary-700 dark:text-primary-300">
              {prompts.map((prompt, idx) => (
                <li key={idx}>• {prompt}</li>
              ))}
            </ul>
          </div>
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Describe el momento más significativo de tu día. No tiene que ser extraordinario, solo algo que te sacó del piloto automático..."
          className="input-field min-h-[200px] resize-y"
        />

        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">
            {wordCount} {wordCount === 1 ? 'palabra' : 'palabras'}
          </span>
          <button onClick={handleSave} disabled={loading || !content.trim()} className="btn-primary">
            {loading ? 'Guardando...' : todayEntry ? 'Actualizar' : 'Guardar'}
          </button>
        </div>

        {todayEntry && (
          <p className="text-xs text-gray-500 mt-2">
            Última actualización: {format(new Date(todayEntry.updated_at), "HH:mm")}
          </p>
        )}
      </div>

      {/* Entradas recientes */}
      {allEntries.length > 1 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Entradas recientes</h3>
          <div className="space-y-3">
            {allEntries.slice(0, 5).map((entry) => {
              if (entry.entry_date === today) return null
              return (
                <div key={entry.id} className="card !p-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {format(new Date(entry.entry_date), "EEEE, d 'de' MMMM", { locale: es })}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-2">{entry.content}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
