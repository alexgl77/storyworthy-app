// Palabras comunes a ignorar en el análisis
const STOP_WORDS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al',
  'a', 'en', 'con', 'por', 'para', 'que', 'se', 'es', 'son', 'fue', 'y', 'o',
  'pero', 'si', 'no', 'como', 'más', 'muy', 'mi', 'me', 'te', 'tu', 'su',
  'este', 'esta', 'esto', 'ese', 'esa', 'eso', 'lo', 'le', 'les', 'nos',
  'hoy', 'ayer', 'mañana', 'día', 'dias', 'semana', 'mes', 'año', 'vez',
  'hacer', 'hice', 'hecho', 'puede', 'puedo', 'tengo', 'tiene', 'tener',
  'ser', 'estar', 'estoy', 'está', 'sido', 'todo', 'toda', 'todos', 'todas',
  'algo', 'alguien', 'nada', 'nadie', 'mucho', 'poco', 'bien', 'mal',
  'cuando', 'donde', 'porque', 'aunque', 'sin', 'sobre', 'entre', 'desde',
  'hasta', 'cada', 'otra', 'otro', 'otros', 'otras', 'mismo', 'misma',
  'ya', 'también', 'solo', 'sólo', 'tan', 'así', 'ahora', 'siempre', 'nunca',
  'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be',
  'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
  'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
  'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who',
  'this', 'that', 'these', 'those', 'am', 'been', 'being', 'my', 'your',
])

// Categorías de palabras para detectar temas
const THEME_CATEGORIES = {
  trabajo: ['trabajo', 'oficina', 'reunión', 'reuniones', 'proyecto', 'jefe', 'compañeros', 'deadline', 'cliente', 'clientes', 'equipo', 'presentación'],
  familia: ['familia', 'mamá', 'papá', 'hermano', 'hermana', 'hijo', 'hija', 'esposo', 'esposa', 'padres', 'abuelo', 'abuela', 'tío', 'tía', 'primo', 'prima'],
  salud: ['ejercicio', 'gimnasio', 'correr', 'yoga', 'meditar', 'dormir', 'descanso', 'enfermo', 'doctor', 'salud', 'dieta', 'caminar', 'deporte'],
  relaciones: ['amigo', 'amigos', 'amiga', 'amigas', 'pareja', 'novio', 'novia', 'amor', 'cita', 'conocer', 'personas', 'gente'],
  crecimiento: ['aprender', 'leer', 'libro', 'curso', 'estudiar', 'mejorar', 'meta', 'objetivo', 'logro', 'éxito', 'crecer', 'desarrollo'],
  ocio: ['película', 'serie', 'música', 'juego', 'paseo', 'viaje', 'vacaciones', 'fiesta', 'celebrar', 'diversión', 'hobby'],
  emociones: ['feliz', 'triste', 'ansioso', 'ansiedad', 'estrés', 'estresado', 'tranquilo', 'paz', 'preocupado', 'emocionado', 'motivado', 'cansado', 'frustrado', 'agradecido']
}

/**
 * Extrae palabras significativas de un texto
 */
function extractWords(text) {
  if (!text) return []
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos para comparación
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word))
}

/**
 * Cuenta la frecuencia de palabras en las entradas
 */
export function getWordFrequency(entries, limit = 10) {
  const wordCount = {}

  entries.forEach(entry => {
    const allText = [
      entry.content,
      entry.gratitude_1,
      entry.gratitude_2,
      entry.gratitude_3,
      entry.morning_intention
    ].join(' ')

    const words = extractWords(allText)
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })
  })

  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }))
}

/**
 * Detecta temas principales basados en categorías
 */
export function detectThemes(entries) {
  const themeScores = {}

  Object.keys(THEME_CATEGORIES).forEach(theme => {
    themeScores[theme] = 0
  })

  entries.forEach(entry => {
    const allText = [
      entry.content,
      entry.gratitude_1,
      entry.gratitude_2,
      entry.gratitude_3
    ].join(' ').toLowerCase()

    Object.entries(THEME_CATEGORIES).forEach(([theme, keywords]) => {
      keywords.forEach(keyword => {
        if (allText.includes(keyword)) {
          themeScores[theme]++
        }
      })
    })
  })

  return Object.entries(themeScores)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([theme, score]) => ({ theme, score }))
}

/**
 * Calcula estadísticas de mood
 */
export function getMoodStats(entries) {
  const entriesWithMood = entries.filter(e => e.mood_rating > 0)

  if (entriesWithMood.length === 0) {
    return null
  }

  const moods = entriesWithMood.map(e => e.mood_rating)
  const average = moods.reduce((a, b) => a + b, 0) / moods.length
  const max = Math.max(...moods)
  const min = Math.min(...moods)

  // Tendencia (últimos 7 días vs anteriores)
  const recent = entriesWithMood.slice(0, 7)
  const older = entriesWithMood.slice(7, 14)

  let trend = 'stable'
  if (recent.length >= 3 && older.length >= 3) {
    const recentAvg = recent.reduce((a, e) => a + e.mood_rating, 0) / recent.length
    const olderAvg = older.reduce((a, e) => a + e.mood_rating, 0) / older.length
    if (recentAvg - olderAvg > 0.5) trend = 'up'
    else if (olderAvg - recentAvg > 0.5) trend = 'down'
  }

  return {
    average: average.toFixed(1),
    max,
    min,
    trend,
    totalRated: entriesWithMood.length
  }
}

/**
 * Encuentra el mejor día de la semana para escribir
 */
export function getBestDayOfWeek(entries) {
  const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
  const dayCounts = [0, 0, 0, 0, 0, 0, 0]
  const dayMoods = [[], [], [], [], [], [], []]

  entries.forEach(entry => {
    const date = new Date(entry.entry_date)
    const day = date.getDay()
    dayCounts[day]++
    if (entry.mood_rating > 0) {
      dayMoods[day].push(entry.mood_rating)
    }
  })

  // Día con más entradas
  const maxCount = Math.max(...dayCounts)
  const mostActiveDay = dayCounts.indexOf(maxCount)

  // Día con mejor mood promedio
  let bestMoodDay = -1
  let bestMoodAvg = 0
  dayMoods.forEach((moods, index) => {
    if (moods.length >= 2) {
      const avg = moods.reduce((a, b) => a + b, 0) / moods.length
      if (avg > bestMoodAvg) {
        bestMoodAvg = avg
        bestMoodDay = index
      }
    }
  })

  return {
    mostActive: maxCount > 0 ? { day: dayNames[mostActiveDay], count: maxCount } : null,
    bestMood: bestMoodDay >= 0 ? { day: dayNames[bestMoodDay], average: bestMoodAvg.toFixed(1) } : null
  }
}

/**
 * Genera insights basados en la racha actual
 */
export function getStreakInsights(streak, totalEntries) {
  const insights = []

  // Milestones de racha
  if (streak >= 30) {
    insights.push({ type: 'celebration', icon: '🏆', message: `¡Increíble! ${streak} días de racha. Eres imparable.` })
  } else if (streak >= 14) {
    insights.push({ type: 'celebration', icon: '🔥', message: `¡${streak} días seguidos! Has creado un hábito sólido.` })
  } else if (streak >= 7) {
    insights.push({ type: 'celebration', icon: '⭐', message: `¡Una semana completa! ${streak} días de racha.` })
  } else if (streak >= 3) {
    insights.push({ type: 'encouragement', icon: '💪', message: `${streak} días de racha. ¡Sigue así!` })
  }

  // Milestones de entradas totales
  if (totalEntries === 1) {
    insights.push({ type: 'welcome', icon: '🎉', message: '¡Primera entrada! El viaje de mil millas comienza con un paso.' })
  } else if (totalEntries === 7) {
    insights.push({ type: 'milestone', icon: '📅', message: '¡7 entradas! Una semana de reflexión completada.' })
  } else if (totalEntries === 30) {
    insights.push({ type: 'milestone', icon: '📚', message: '¡30 entradas! Un mes de momentos capturados.' })
  } else if (totalEntries === 100) {
    insights.push({ type: 'milestone', icon: '💯', message: '¡100 entradas! Tu diario está floreciendo.' })
  }

  return insights
}

/**
 * Genera todos los insights para mostrar al usuario
 */
export function generateInsights(entries, streak) {
  if (!entries || entries.length === 0) {
    return {
      hasData: false,
      message: 'Escribe tu primera entrada para comenzar a recibir insights personalizados.'
    }
  }

  const insights = {
    hasData: true,
    totalEntries: entries.length,
    streakInsights: getStreakInsights(streak, entries.length),
    themes: [],
    topWords: [],
    moodStats: null,
    dayStats: null,
    suggestions: []
  }

  // Necesitamos al menos 3 entradas para análisis significativo
  if (entries.length >= 3) {
    insights.topWords = getWordFrequency(entries, 5)
    insights.themes = detectThemes(entries)
    insights.dayStats = getBestDayOfWeek(entries)
  }

  // Necesitamos al menos 5 entradas con mood para estadísticas
  if (entries.length >= 5) {
    insights.moodStats = getMoodStats(entries)

    // Generar sugerencias basadas en datos
    if (insights.moodStats) {
      if (insights.moodStats.trend === 'down') {
        insights.suggestions.push({
          icon: '💡',
          message: 'Tu mood ha bajado últimamente. ¿Qué pequeña cosa podrías hacer hoy para mejorar tu día?'
        })
      } else if (insights.moodStats.trend === 'up') {
        insights.suggestions.push({
          icon: '✨',
          message: '¡Tu mood va en ascenso! Sigue haciendo lo que te funciona.'
        })
      }
    }

    // Sugerencia basada en temas
    if (insights.themes.length > 0) {
      const topTheme = insights.themes[0].theme
      const themeMessages = {
        trabajo: 'Escribes mucho sobre trabajo. Recuerda balancear con tiempo personal.',
        familia: 'La familia es importante para ti. ¿Cuándo fue la última vez que les dijiste lo que significan?',
        salud: '¡Genial enfoque en salud! La constancia es la clave.',
        relaciones: 'Valoras tus relaciones. ¿Hay alguien a quien no has contactado en un tiempo?',
        crecimiento: 'Tienes mentalidad de crecimiento. ¿Cuál es tu siguiente meta?',
        ocio: 'El descanso también es productivo. Disfruta sin culpa.',
        emociones: 'Estás muy conectado con tus emociones. Eso es inteligencia emocional.'
      }
      if (themeMessages[topTheme]) {
        insights.suggestions.push({
          icon: '🎯',
          message: themeMessages[topTheme]
        })
      }
    }
  }

  return insights
}

/**
 * Obtiene un insight destacado para mostrar en el dashboard
 */
export function getHighlightInsight(entries, streak) {
  const insights = generateInsights(entries, streak)

  if (!insights.hasData) {
    return { icon: '✍️', message: insights.message, type: 'welcome' }
  }

  // Prioridad: celebración de racha > sugerencia > tema > default
  if (insights.streakInsights.length > 0) {
    const streakInsight = insights.streakInsights[0]
    return { icon: streakInsight.icon, message: streakInsight.message, type: streakInsight.type }
  }

  if (insights.suggestions.length > 0) {
    return { ...insights.suggestions[0], type: 'suggestion' }
  }

  if (insights.themes.length > 0 && insights.totalEntries >= 7) {
    const themeLabels = {
      trabajo: 'trabajo',
      familia: 'familia',
      salud: 'salud y bienestar',
      relaciones: 'relaciones',
      crecimiento: 'crecimiento personal',
      ocio: 'ocio y diversión',
      emociones: 'emociones'
    }
    const topTheme = insights.themes[0].theme
    return {
      icon: '📊',
      message: `Tu tema principal esta semana: ${themeLabels[topTheme] || topTheme}`,
      type: 'insight'
    }
  }

  if (insights.topWords.length > 0 && insights.totalEntries >= 5) {
    return {
      icon: '💬',
      message: `Palabra más usada: "${insights.topWords[0].word}" (${insights.topWords[0].count} veces)`,
      type: 'insight'
    }
  }

  return {
    icon: '📝',
    message: `${insights.totalEntries} momentos capturados. Sigue escribiendo.`,
    type: 'default'
  }
}
