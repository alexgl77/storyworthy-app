const philosophicalQuotes = [
  {
    text: 'No es la muerte lo que un hombre debe temer, sino que debe temer no empezar nunca a vivir.',
    author: 'Marco Aurelio',
  },
  {
    text: 'La riqueza no consiste en tener grandes posesiones, sino en tener pocas necesidades.',
    author: 'Epicteto',
  },
  {
    text: 'Mientras somos aplazados, la vida transcurre.',
    author: 'Séneca',
  },
  {
    text: 'Primero di a ti mismo lo que quieres ser; y entonces haz lo que tengas que hacer.',
    author: 'Epicteto',
  },
  {
    text: 'Pierdes el tiempo preocupándote por lo que no puedes cambiar.',
    author: 'Marco Aurelio',
  },
  {
    text: 'La dificultad es lo que da valor a las cosas.',
    author: 'Montaigne',
  },
  {
    text: 'Conócete a ti mismo es el principio de toda sabiduría.',
    author: 'Aristóteles',
  },
  {
    text: 'No es que tengamos poco tiempo, sino que perdemos mucho.',
    author: 'Séneca',
  },
  {
    text: 'Tienes poder sobre tu mente, no sobre los eventos externos. Entiende esto y encontrarás fuerza.',
    author: 'Marco Aurelio',
  },
  {
    text: 'El hombre que se ha anticipado al día de mañana tiene cada día una ventaja sobre el que no.',
    author: 'Séneca',
  },
  {
    text: 'Solo hay un camino a la felicidad y es dejar de preocuparse por cosas que están más allá de nuestro poder.',
    author: 'Epicteto',
  },
  {
    text: 'Vive cada día como si fuera el último. Algún día tendrás razón.',
    author: 'Marco Aurelio',
  },
  {
    text: 'El que no es dueño de sí mismo no es libre.',
    author: 'Epicteto',
  },
  {
    text: 'A veces incluso vivir es un acto de valentía.',
    author: 'Séneca',
  },
  {
    text: 'La mejor venganza es ser diferente a quien causó el daño.',
    author: 'Marco Aurelio',
  },
]

export function getDailyQuote(date = new Date()) {
  const dayOfYear = Math.floor(
    (date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  )
  // Offset para no coincidir con el prompt diario
  const index = (dayOfYear + 17) % philosophicalQuotes.length
  return philosophicalQuotes[index]
}

export default philosophicalQuotes
