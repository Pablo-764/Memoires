// "Primeros pasos" (Bumble): preguntas de apertura que otros contestan con un toque
export const APERTURAS = [
  '¿Café o té para un primer plan?',
  '¿Cuál es tu lugar favorito de la ciudad?',
  '¿Qué fue lo último que te hizo reír?',
  '¿Qué plan harías este fin de semana?',
  '¿Qué serie recomiendas sin dudar?',
  '¿Qué pasatiempo quieres aprender?',
]

/** Las 3 preguntas de apertura de una persona de la demostración (fijas por persona). */
export function aperturasDe(id: string) {
  const n = [...id].reduce((t, c) => t + c.charCodeAt(0), 0)
  return [0, 2, 4].map((k) => APERTURAS[(n + k) % APERTURAS.length])
}
