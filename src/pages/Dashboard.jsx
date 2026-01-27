import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { getPromptsForToday } from '../utils/prompts'
import { calculateStreak } from '../utils/stats'
import StarRating from '../components/StarRating'
import { Sparkles, Calendar, TrendingUp, Sun, Moon, Save, Star } from 'lucide-react'

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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header con estadísticas */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
        </h2>
        <div className="flex gap-4 mt-4">
          <div className="card flex-1 !p-4">
            <div className="flex items-center gap-2 text-coral-500 dark:text-coral-400">
              <TrendingUp size={20} />
              <span className="font-semibold">Racha</span>
            </div>
            <p className="text-2xl font-bold mt-1">{streak} días</p>
          </div>
          <div className="card flex-1 !p-4">
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
              <Calendar size={20} />
              <span className="font-semibold">Total</span>
            </div>
            <p className="text-2xl font-bold mt-1">{allEntries.length}</p>
          </div>
        </div>
      </div>

      {/* Check-in matutino */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sun size={22} className="text-amber-500" />
          <h3 className="text-xl font-semibold">Intención del día</h3>
        </div>
        <input
          type="text"
          value={morningIntention}
          onChange={(e) => setMorningIntention(e.target.value)}
          placeholder="¿A qué voy a prestar atención hoy? ¿Qué quiero que sea diferente?"
          className="input-field"
        />
        {isMorning && !morningIntention && !todayEntry?.morning_intention && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
            Establece tu intención para hoy
          </p>
        )}
      </div>

      {/* Momento del día */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Moon size={22} className="text-primary-500" />
            <h3 className="text-xl font-semibold">Momento del día</h3>
          </div>
          <button
            onClick={() => setShowPrompts(!showPrompts)}
            className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
          >
            <Sparkles size={18} />
            <span className="text-sm">Ideas</span>
          </button>
        </div>

        {showPrompts && (
          <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200/60 dark:border-primary-800/40">
            <p className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-2">
              Si no sabes qué escribir, prueba con estas preguntas:
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
          className="input-field min-h-[160px] resize-y"
        />

        <div className="flex justify-between items-center mt-3">
          <span className="text-sm text-warm-400">
            {wordCount} {wordCount === 1 ? 'palabra' : 'palabras'}
          </span>
        </div>
      </div>

      {/* Rating del día */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">¿Cómo fue tu día?</h3>
        </div>
        <StarRating
          rating={moodRating}
          onRatingChange={setMoodRating}
          size={32}
        />
      </div>

      {/* Gratitud */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🙏</span>
          <h3 className="text-xl font-semibold">Agradecimiento</h3>
        </div>
        <p className="text-sm text-warm-400 mb-4">
          3 cosas por las que estás agradecido hoy
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-primary-500 w-6">1</span>
            <input
              type="text"
              value={gratitude1}
              onChange={(e) => setGratitude1(e.target.value)}
              placeholder="Estoy agradecido por..."
              className="input-field"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-primary-500 w-6">2</span>
            <input
              type="text"
              value={gratitude2}
              onChange={(e) => setGratitude2(e.target.value)}
              placeholder="Estoy agradecido por..."
              className="input-field"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-primary-500 w-6">3</span>
            <input
              type="text"
              value={gratitude3}
              onChange={(e) => setGratitude3(e.target.value)}
              placeholder="Estoy agradecido por..."
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Botón guardar */}
      <div className="sticky bottom-4 z-10">
        <button
          onClick={handleSave}
          disabled={loading || !hasAnyContent}
          className={`w-full py-3.5 px-6 rounded-2xl font-semibold text-white shadow-soft-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            saved
              ? 'bg-sage-500'
              : 'bg-primary-600 hover:bg-primary-700 hover:shadow-soft-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          <Save size={20} />
          {loading ? 'Guardando...' : saved ? '¡Guardado!' : todayEntry ? 'Actualizar todo' : 'Guardar todo'}
        </button>
      </div>

      {todayEntry && (
        <p className="text-xs text-center text-warm-400 mt-2">
          Última actualización: {format(new Date(todayEntry.updated_at), "HH:mm")}
        </p>
      )}

      {/* Entradas recientes */}
      {allEntries.length > 1 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Entradas recientes</h3>
          <div className="space-y-3">
            {allEntries.slice(0, 5).map((entry) => {
              if (entry.entry_date === today) return null
              return (
                <div key={entry.id} className="card !p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-warm-500 dark:text-warm-400">
                      {format(new Date(entry.entry_date), "EEEE, d 'de' MMMM", { locale: es })}
                    </p>
                    {entry.mood_rating > 0 && (
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            className={s <= entry.mood_rating ? 'fill-amber-400 text-amber-400' : 'text-warm-300 dark:text-warm-600'}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-warm-700 dark:text-warm-300 line-clamp-2">{entry.content}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
