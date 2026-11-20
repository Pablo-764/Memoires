import type { Message, Person, Plan } from '../datos/mock'
import type { Intent } from '../modelos/intents'

export type Etapa = 'nueva' | 'hablando' | 'acordado' | 'cumplido'

export const ETAPAS: { key: Etapa; label: string; hint: string }[] = [
  { key: 'nueva', label: 'Nueva', hint: 'Conectaron y nadie ha escrito' },
  { key: 'hablando', label: 'Hablando', hint: 'Ya se escriben' },
  { key: 'acordado', label: 'Plan acordado', hint: 'Tienen un plan en puerta' },
  { key: 'cumplido', label: 'Plan cumplido', hint: 'Ya se vieron' },
]

export interface PlanPropuesto {
  title: string
  when: string
  place: string
  intent: Intent
  status: 'propuesto' | 'aceptado' | 'movido'
}

/**
 * Etapa de una conexión según lo que pasó: un plan acordado (propuesto y aceptado en el
 * chat, o un plan al que van los dos), un plan ya cumplido juntos, conversación de ida
 * y vuelta, o nueva. La etapa elegida a mano (al arrastrar) tiene prioridad.
 */
export function etapaDe(id: string, mensajes: Message[], planes: Plan[], cumplidos: { people: string[] }[], manual?: Etapa): Etapa {
  if (manual) return manual
  // Un plan en puerta manda sobre los que ya se cumplieron
  const aceptado = mensajes.some((m) => m.plan?.status === 'aceptado')
  const juntos = planes.some((p) => p.attendees.includes('me') && (p.attendees.includes(id) || p.hostId === id))
  if (aceptado || juntos) return 'acordado'
  if (cumplidos.some((p) => p.people.includes(id))) return 'cumplido'
  const mios = mensajes.some((m) => m.from === 'me')
  const suyos = mensajes.some((m) => m.from !== 'me')
  return mios && suyos ? 'hablando' : 'nueva'
}

/** Grosor del hilo (1 a 8): cuánto han hablado y cuántos planes cumplieron juntos. */
export function grosorHilo(mensajes: number, cumplidos: number) {
  return Math.min(8, 1 + Math.round(Math.log2(1 + mensajes) * 1.4) + cumplidos * 2)
}

const IDEAS: Record<string, { title: string; place: string }> = {
  Café: { title: 'Café en la Americana', place: 'Café La Mesa, Chapultepec' },
  Correr: { title: 'Correr 5 km', place: 'Bosque Los Colomos' },
  'Juegos de mesa': { title: 'Noche de juegos de mesa', place: 'Café La Mesa, Chapultepec' },
  Lectura: { title: 'Club de lectura', place: 'Biblioteca Iberoamericana' },
  Conciertos: { title: 'Concierto en vivo', place: 'Teatro Diana' },
  'Música en vivo': { title: 'Música en vivo', place: 'Teatro Diana' },
  Cine: { title: 'Función de cine', place: 'Cineteca FICG' },
  Fotografía: { title: 'Paseo para tomar fotos', place: 'Centro Histórico' },
  Senderismo: { title: 'Caminata corta', place: 'Bosque Los Colomos' },
  Cocina: { title: 'Mercado y cocinar juntos', place: 'Mercado de Abastos' },
}

/** Sugerencias de plan dentro del chat a partir de los intereses en común. */
export function ideasDePlan(me: string[], persona: Person, intent: Intent): Omit<PlanPropuesto, 'status'>[] {
  const comunes = persona.interests.filter((i) => me.includes(i))
  const cuando = ['Sábado 11:00', 'Domingo 9:00', 'Viernes 19:30']
  const ideas = comunes.flatMap((i) => (IDEAS[i] ? [IDEAS[i]] : []))
  if (!ideas.length) ideas.push({ title: 'Tacos y caminata por el Centro', place: 'Centro Histórico' })
  return ideas.slice(0, 3).map((x, k) => ({ ...x, when: cuando[k % cuando.length], intent }))
}
