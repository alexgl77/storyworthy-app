export const dailyPrompts = [
  "¿Qué momento te sorprendió hoy?",
  "¿Tuviste una conversación inesperada?",
  "¿Qué fue diferente hoy comparado con un día típico?",
  "¿Aprendiste algo nuevo sobre ti o sobre alguien más?",
  "¿Hubo un momento en el que sentiste una emoción fuerte?",
  "¿Qué pequeño detalle notaste que normalmente pasarías por alto?",
  "¿Alguien hizo algo inesperado?",
  "¿Tuviste que tomar una decisión difícil?",
  "¿Hubo un momento incómodo o gracioso?",
  "¿Qué te hizo pensar de forma diferente?",
  "¿Viste algo hermoso o interesante?",
  "¿Ayudaste a alguien o alguien te ayudó a ti?",
  "¿Rompiste alguna rutina hoy?",
  "¿Qué momento querrías recordar de aquí a 10 años?",
  "¿Hubo un contraste interesante entre lo que esperabas y lo que pasó?",
  "¿Tuviste un momento de conexión genuina con alguien?",
  "¿Qué te hizo reír o sonreír hoy?",
  "¿Hubo algo que te frustró y cómo lo manejaste?",
  "¿Observaste algo sobre la naturaleza humana?",
  "¿Qué haría que hoy valiera la pena contar?",
]

export function getRandomPrompt() {
  return dailyPrompts[Math.floor(Math.random() * dailyPrompts.length)]
}

export function getPromptsForToday(date = new Date()) {
  // Usar la fecha para tener prompts consistentes por día
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)
  const shuffled = [...dailyPrompts]

  // Shuffle simple basado en el día
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (dayOfYear + i) % shuffled.length
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, 3) // Retornar 3 prompts para el día
}
