// Benefits of journaling - focused on memory and capturing moments
// Inspired by "Homework for Life" by Matthew Dicks

const benefits = [
  "Sin registro, el 95% de tus días se vuelven indistinguibles en la memoria.",
  "Los momentos pequeños suelen convertirse en las mejores historias años después.",
  "La mayoría de los recuerdos significativos vienen de días que parecían ordinarios.",
  "Elegir 'el momento del día' te entrena para notar más mientras vives.",
  "Tu yo de 10 años recordará este día solo si lo escribes hoy.",
  "Los días no registrados se fusionan. Los registrados permanecen nítidos.",
  "Escribir un momento lo graba en tu memoria de forma permanente.",
  "Las pequeñas cosas definen tu vida más que los grandes eventos.",
  "Sin documentar, una década puede sentirse como un año.",
  "Cada entrada es evidencia de que este día existió.",
  "La vida pasa rápido. Escribir la desacelera.",
  "Un año son solo 365 momentos. ¿Cuántos recordarás?",
  "Lo que no se registra, se olvida. Lo que se olvida, nunca existió.",
  "Tus días ordinarios son el material de tu autobiografía.",
  "Recordar es revivir. Escribir es recordar.",
]

export function getRandomBenefit() {
  return benefits[Math.floor(Math.random() * benefits.length)]
}

export function getBenefitByIndex(index) {
  return benefits[index % benefits.length]
}

export default benefits
