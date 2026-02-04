// Benefits organized by practice type
// Sources: Research on gratitude, journaling, intention-setting, and self-reflection

export const PRACTICE_TYPES = {
  GRATITUDE: 'gratitude',
  JOURNALING: 'journaling',
  INTENTION: 'intention',
  MOOD: 'mood'
}

export const practiceInfo = {
  [PRACTICE_TYPES.GRATITUDE]: {
    title: 'Gratitud',
    icon: '🙏',
    color: 'gold',
    shortBenefits: [
      "Agradecer activa las mismas áreas cerebrales que recibir un regalo.",
      "3 gratitudes diarias pueden aumentar tu felicidad en un 25% en 6 meses.",
      "La gratitud reduce el cortisol (hormona del estrés) hasta en un 23%.",
      "Personas agradecidas duermen mejor y se despiertan más renovadas.",
      "Agradecer fortalece el sistema inmunológico según estudios de UCLA.",
      "La gratitud aumenta la resiliencia ante adversidades.",
      "Escribir gratitudes rewirea tu cerebro para notar más lo positivo.",
    ],
    fullDescription: `
La gratitud es una de las prácticas más estudiadas en psicología positiva. El Dr. Robert Emmons, investigador líder en este campo, ha demostrado que las personas que practican gratitud regularmente experimentan:

• Mayor bienestar emocional y satisfacción con la vida
• Mejor calidad de sueño
• Menores niveles de estrés y ansiedad
• Relaciones más fuertes y significativas
• Mayor resiliencia ante dificultades

La neurociencia muestra que cuando agradecemos, activamos la corteza prefrontal y liberamos dopamina y serotonina, los neurotransmisores del bienestar.
    `,
    tips: [
      "Sé específico: en vez de 'mi familia', escribe 'la llamada de mamá esta mañana'",
      "Incluye el porqué: '...porque me hizo sentir apoyado'",
      "Varía tus gratitudes para mantener la práctica fresca",
      "Busca gratitudes en momentos difíciles - ahí es donde más impacto tienen"
    ]
  },

  [PRACTICE_TYPES.JOURNALING]: {
    title: 'Capturar momentos',
    icon: '✨',
    color: 'sage',
    shortBenefits: [
      "Sin registro, el 95% de tus días se vuelven indistinguibles en la memoria.",
      "Los momentos pequeños suelen convertirse en las mejores historias años después.",
      "Elegir 'el momento del día' te entrena para notar más mientras vives.",
      "Tu yo de 10 años recordará este día solo si lo escribes hoy.",
      "Escribir un momento lo graba en tu memoria de forma permanente.",
      "Un año son solo 365 momentos. ¿Cuántos recordarás?",
      "Lo que no se registra, se olvida. Lo que se olvida, nunca existió.",
    ],
    fullDescription: `
"Homework for Life" es un concepto de Matthew Dicks: cada día, identificar y escribir el momento más significativo, no importa cuán pequeño parezca.

La ciencia del journaling muestra que:

• Escribir sobre experiencias mejora la memoria a largo plazo hasta un 70%
• El acto de reflexionar activa el hipocampo, consolidando recuerdos
• Personas que escriben regularmente tienen mejor autoconocimiento
• Capturar momentos combate la "ceguera temporal" donde los días se fusionan

El psicólogo Dan Gilbert encontró que sobreestimamos los grandes eventos y subestimamos los pequeños momentos. Sin embargo, son los pequeños los que definen nuestra experiencia diaria.
    `,
    tips: [
      "No busques lo extraordinario - los momentos ordinarios son los más valiosos",
      "Escribe el momento, no el día entero",
      "Incluye detalles sensoriales: ¿qué olías, escuchabas, sentías?",
      "Si 'no pasó nada', ese pensamiento ya es tu momento del día"
    ]
  },

  [PRACTICE_TYPES.INTENTION]: {
    title: 'Intenciones',
    icon: '🎯',
    color: 'indigo',
    shortBenefits: [
      "Las personas con intenciones claras son 42% más propensas a lograr sus metas.",
      "Establecer una intención activa el Sistema de Activación Reticular del cerebro.",
      "Tu cerebro filtra información basándose en tus intenciones conscientes.",
      "Una intención matutina puede aumentar la productividad hasta en un 30%.",
      "Intenciones escritas tienen 1.4x más probabilidad de cumplirse que las pensadas.",
      "La claridad de intención reduce la ansiedad por decisiones durante el día.",
    ],
    fullDescription: `
Las intenciones funcionan como un GPS mental. Cuando estableces una intención, activas el Sistema de Activación Reticular (SAR), un filtro en tu cerebro que determina qué información notas y qué ignoras.

Investigaciones de la psicóloga Gail Matthews muestran que:

• Escribir metas aumenta la probabilidad de lograrlas en un 42%
• Las intenciones específicas superan a las vagas ("hacer ejercicio" vs "caminar 20 min")
• Revisitar intenciones activa la motivación intrínseca

La diferencia entre una meta y una intención: las metas son destinos, las intenciones son brújulas que guían tu día momento a momento.
    `,
    tips: [
      "Hazla específica pero flexible: 'Responder con calma' vs 'No enojarme'",
      "Conecta la intención con tus valores más profundos",
      "Una sola intención es más poderosa que muchas",
      "Revísala al final del día: ¿cómo te fue?"
    ]
  },

  [PRACTICE_TYPES.MOOD]: {
    title: 'Evaluar tu día',
    icon: '📊',
    color: 'coral',
    shortBenefits: [
      "El seguimiento emocional aumenta la inteligencia emocional en un 36%.",
      "Personas que monitorean su estado reportan 25% menos episodios de estrés.",
      "Evaluar tu día crea distancia psicológica, reduciendo la reactividad.",
      "El automonitoreo es el primer paso para el cambio de comportamiento.",
      "Detectar patrones emocionales previene el burnout antes de que ocurra.",
      "La reflexión nocturna mejora la calidad del sueño según estudios de Harvard.",
    ],
    fullDescription: `
El automonitoreo emocional es una herramienta fundamental en terapia cognitivo-conductual y psicología positiva.

La investigación del Dr. James Pennebaker de la Universidad de Texas muestra que:

• La reflexión emocional reduce visitas al médico en un 50%
• Nombrar emociones (affect labeling) reduce su intensidad
• El seguimiento consistente revela patrones invisibles a simple vista
• La evaluación nocturna cierra ciclos emocionales del día

El concepto de "distancia psicológica" explica por qué funciona: al evaluar tu día, te conviertes en observador, no solo participante, lo que reduce la carga emocional y aumenta la claridad.
    `,
    tips: [
      "No juzgues tu rating - solo observa",
      "Busca patrones: ¿qué días tiendes a puntuar más alto?",
      "Considera factores: sueño, ejercicio, interacciones sociales",
      "Un día 'malo' registrado es mejor que uno no reflexionado"
    ]
  }
}

/**
 * Get a random benefit from a specific practice type
 */
export function getRandomBenefitByType(type) {
  const practice = practiceInfo[type]
  if (!practice) return null
  const benefits = practice.shortBenefits
  return {
    text: benefits[Math.floor(Math.random() * benefits.length)],
    type,
    title: practice.title,
    icon: practice.icon
  }
}

/**
 * Get a random benefit from any practice
 */
export function getRandomBenefit() {
  const types = Object.keys(practiceInfo)
  const randomType = types[Math.floor(Math.random() * types.length)]
  return getRandomBenefitByType(randomType)
}

/**
 * Get benefit based on what the user filled in their entry
 */
export function getBenefitForEntry({ hasGratitude, hasContent, hasIntention, hasMood }) {
  const eligibleTypes = []

  if (hasGratitude) eligibleTypes.push(PRACTICE_TYPES.GRATITUDE)
  if (hasContent) eligibleTypes.push(PRACTICE_TYPES.JOURNALING)
  if (hasIntention) eligibleTypes.push(PRACTICE_TYPES.INTENTION)
  if (hasMood) eligibleTypes.push(PRACTICE_TYPES.MOOD)

  if (eligibleTypes.length === 0) {
    return getRandomBenefit()
  }

  const randomType = eligibleTypes[Math.floor(Math.random() * eligibleTypes.length)]
  return getRandomBenefitByType(randomType)
}

/**
 * Get all practice info for the Benefits page
 */
export function getAllPractices() {
  return Object.entries(practiceInfo).map(([key, value]) => ({
    id: key,
    ...value
  }))
}

export default practiceInfo
