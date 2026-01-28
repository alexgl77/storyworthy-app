const stoicPrompts = [
  {
    text: '¿Qué está dentro de tu control hoy?',
    keyword: 'control',
    attribution: 'Epicteto',
  },
  {
    text: 'La felicidad de tu vida depende de la calidad de tus pensamientos',
    keyword: 'pensamientos',
    attribution: 'Marco Aurelio',
  },
  {
    text: 'No es lo que te sucede, sino cómo reaccionas lo que importa',
    keyword: 'reaccionas',
    attribution: 'Epicteto',
  },
  {
    text: 'La vida es muy corta para desperdiciarla en cosas sin sentido',
    keyword: 'corta',
    attribution: 'Séneca',
  },
  {
    text: 'Sufre más quien teme al sufrimiento que quien lo enfrenta',
    keyword: 'sufrimiento',
    attribution: 'Séneca',
  },
  {
    text: 'Pon orden en tu interior y nada exterior podrá perturbarte',
    keyword: 'interior',
    attribution: 'Marco Aurelio',
  },
  {
    text: 'Recuerda que muy pronto no serás nadie en ninguna parte',
    keyword: 'nadie',
    attribution: 'Marco Aurelio',
  },
  {
    text: 'No busques que los eventos sucedan como quieres, sino quiere que sucedan como suceden',
    keyword: 'quiere',
    attribution: 'Epicteto',
  },
  {
    text: 'El destino guía a quien lo acepta y arrastra a quien lo rechaza',
    keyword: 'destino',
    attribution: 'Séneca',
  },
  {
    text: 'Cada noche debemos examinar nuestra alma',
    keyword: 'alma',
    attribution: 'Séneca',
  },
  {
    text: 'La mejor venganza es no ser como tu enemigo',
    keyword: 'venganza',
    attribution: 'Marco Aurelio',
  },
  {
    text: 'No es que tengamos poco tiempo sino que perdemos mucho',
    keyword: 'tiempo',
    attribution: 'Séneca',
  },
  {
    text: 'Memento mori: recuerda que vas a morir',
    keyword: 'morir',
    attribution: 'Tradición Estoica',
  },
  {
    text: '¿Estás viviendo o simplemente existiendo?',
    keyword: 'viviendo',
    attribution: 'Séneca',
  },
  {
    text: 'El obstáculo es el camino',
    keyword: 'obstáculo',
    attribution: 'Marco Aurelio',
  },
  {
    text: 'Haz hoy lo que otros no harán para tener mañana lo que otros no tendrán',
    keyword: 'hoy',
    attribution: 'Séneca',
  },
  {
    text: 'La virtud es el único bien verdadero',
    keyword: 'virtud',
    attribution: 'Zenón de Citio',
  },
  {
    text: 'Tienes poder sobre tu mente, no sobre los eventos externos',
    keyword: 'mente',
    attribution: 'Marco Aurelio',
  },
  {
    text: 'Nada grande se creó de repente',
    keyword: 'grande',
    attribution: 'Epicteto',
  },
  {
    text: '¿Qué harías si este fuera tu último día?',
    keyword: 'último',
    attribution: 'Marco Aurelio',
  },
  {
    text: 'La riqueza no consiste en tener grandes posesiones sino en tener pocas necesidades',
    keyword: 'necesidades',
    attribution: 'Epicteto',
  },
  {
    text: 'Primero di a ti mismo lo que quieres ser, y entonces haz lo que tengas que hacer',
    keyword: 'quieres ser',
    attribution: 'Epicteto',
  },
  {
    text: 'El que teme a la muerte nunca hará nada digno de un hombre vivo',
    keyword: 'muerte',
    attribution: 'Séneca',
  },
  {
    text: 'No pierdas más tiempo discutiendo sobre lo que debe ser un buen hombre. Sé uno',
    keyword: 'Sé uno',
    attribution: 'Marco Aurelio',
  },
  {
    text: 'La dificultad es lo que despierta el genio',
    keyword: 'dificultad',
    attribution: 'Séneca',
  },
  {
    text: 'Mientras esperamos a vivir, la vida pasa',
    keyword: 'pasa',
    attribution: 'Séneca',
  },
  {
    text: '¿Cuánto de lo que te preocupa realmente ha sucedido?',
    keyword: 'preocupa',
    attribution: 'Séneca',
  },
  {
    text: 'Si quieres ser libre, vive con sencillez',
    keyword: 'libre',
    attribution: 'Epicteto',
  },
  {
    text: 'Todo lo que necesitas está dentro de ti',
    keyword: 'dentro',
    attribution: 'Marco Aurelio',
  },
  {
    text: 'El mundo entero se aparta cuando ve pasar a un hombre que sabe adónde va',
    keyword: 'adónde va',
    attribution: 'Séneca',
  },
]

export function getDailyPrompt(date = new Date()) {
  const dayOfYear = Math.floor(
    (date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  )
  const index = dayOfYear % stoicPrompts.length
  return stoicPrompts[index]
}

export function parsePromptWithKeyword(prompt) {
  const { text, keyword } = prompt
  const keywordIndex = text.toLowerCase().indexOf(keyword.toLowerCase())
  if (keywordIndex === -1) return { before: text, keyword: '', after: '' }

  return {
    before: text.slice(0, keywordIndex),
    keyword: text.slice(keywordIndex, keywordIndex + keyword.length),
    after: text.slice(keywordIndex + keyword.length),
  }
}

export default stoicPrompts
