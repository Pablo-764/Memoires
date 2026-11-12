import type { Intent } from '../modelos/intents'
import type { InfladoShape } from '../utilidades/inflado-render'

/**
 * Formas y frases del objeto inflado. Frases cortas y bonitas, con Arleth entre ellas
 * (su nombre se pinta en su propio color). Solo alfabeto latino, que Space Mono cubre.
 */
export const SHAPE_BY_INTENT: Record<Intent, InfladoShape> = {
  romance: 'heart',
  friend: 'cup',
  plan: 'ticket',
  hobby: 'star',
}

const CORAZON = [
  'Arleth', 'eres mi lugar favorito', 'me gustas', 'flores para Arleth', 'contigo todo es bonito', 'luz de mis días',
  'mi persona favorita', 'Arleth', 'te pienso bonito', 'mariposas', 'tu risa es mi canción', 'cielo lleno de estrellas',
  'Arleth y las flores', 'abrazos tibios', 'me encantas', 'girasoles', 'todo es más lindo contigo', 'Arleth',
  'mi sol de la mañana', 'je t\'aime bien', 'mi piaci', 'I like you', 'corazón contento', 'Arleth brilla',
]

const TAZA = [
  'Arleth', 'un café contigo', 'risas compartidas', 'amistad bonita', 'aquí estoy', 'tardes tranquilas',
  'Arleth y su café', 'pan dulce', 'pláticas largas', 'qué bonito encontrarte', 'Arleth', 'amigos de verdad',
  'galletas y chocolate', 'te guardo una taza', 'abrazos de domingo', 'Arleth sonríe', 'calma y canela', '¿amigos?',
]

const BOLETO = [
  '¿vamos, Arleth?', 'un atardecer juntos', 'picnic entre flores', 'ver el mar', 'estrellas en la noche',
  'Arleth', 'boletos para dos', 'paseo bajo la lluvia', 'un viaje bonito', 'helado de fresa', 'Arleth',
  'concierto a la luz de la luna', 'bailar sin prisa', 'un jardín secreto', 'primera fila', '¿vamos?', 'Arleth',
]

export const PHRASES: Record<Exclude<Intent, 'hobby'>, string[]> = {
  romance: CORAZON,
  friend: TAZA,
  plan: BOLETO,
}

export const LABELS: Record<Intent, (n: number) => string> = {
  romance: () => 'Corazón cubierto de palabras bonitas para Arleth',
  friend: () => 'Taza cubierta de palabras bonitas para Arleth',
  plan: () => 'Boleto cubierto de planes bonitos con Arleth',
  hobby: () => 'Estrella cubierta de intereses y del nombre de Arleth',
}

/** Frases para una intención; pasatiempo usa los intereses que se le pasen, con Arleth entre ellos. */
export function phrasesFor(intent: Intent, interests: string[] = []) {
  if (intent !== 'hobby') return PHRASES[intent]
  const base = interests.length ? interests : ['Juegos de mesa', 'Lectura', 'Música en vivo', 'Fotografía']
  return base.flatMap((x, i) => (i % 2 === 0 ? [x, 'Arleth'] : [x]))
}
