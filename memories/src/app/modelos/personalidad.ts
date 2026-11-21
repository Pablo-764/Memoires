// Test de personalidad (Boo, sin marcas): 12 afirmaciones, 3 por eje, respuesta de -2 a 2
export const EJES = [
  { izq: 'Reservado', der: 'Sociable' },
  { izq: 'Improvisación', der: 'Plan' },
  { izq: 'Actividad', der: 'Conversación' },
  { izq: 'Rutina', der: 'Novedad' },
] as const

export const AFIRMACIONES: { texto: string; eje: 0 | 1 | 2 | 3 }[] = [
  { texto: 'Me recargo estando con mucha gente', eje: 0 },
  { texto: 'Hablo primero cuando no conozco a nadie', eje: 0 },
  { texto: 'Un grupo grande me emociona más que cansarme', eje: 0 },
  { texto: 'Me gusta saber la hora y el lugar con días de anticipación', eje: 1 },
  { texto: 'Prefiero un plan cerrado a ver qué sale', eje: 1 },
  { texto: 'Hago listas aunque sea para el fin de semana', eje: 1 },
  { texto: 'Una buena plática vale más que cualquier actividad', eje: 2 },
  { texto: 'Me gusta conocer a alguien sentados con un café', eje: 2 },
  { texto: 'Prefiero platicar a jugar o hacer deporte', eje: 2 },
  { texto: 'Me aburro si repito el mismo plan', eje: 3 },
  { texto: 'Me gusta probar lugares que nadie me recomendó', eje: 3 },
  { texto: 'Cambio de rutina sin que me cueste', eje: 3 },
]

/** De 12 respuestas (-2 a 2) a 4 ejes de -1 a 1. */
export function ejesDe(respuestas: number[]): [number, number, number, number] {
  const out = [0, 0, 0, 0]
  AFIRMACIONES.forEach((a, i) => (out[a.eje] += respuestas[i] ?? 0))
  return out.map((v) => Math.round((v / 6) * 100) / 100) as [number, number, number, number]
}
