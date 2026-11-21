export type Tier = 'free' | 'grand' | 'lucidite'

/**
 * Planes de mémoires. Se vende comodidad, visibilidad medida y herramientas; nunca
 * resultados con otras personas: una conexión depende de que la otra persona también
 * quiera, y eso el sistema no lo controla. Los límites de conexiones y de palabras
 * desaparecieron: cobrar por hablar con tus conexiones no es justo.
 */
export interface TierInfo {
  name: string
  priceUsd: number
  priceMxn: number
  likesPerDay: number // "me interesa" por día (también Lucidité tiene tope: protege la calidad)
  goldenPerWeek: number // hilos dorados por semana
  seeWhoLiked: boolean
  undo: boolean
  filters: FilterKey[]
  travelPerMonth: number // modo viaje "Voy a…"; Infinity = sin tope
  boostsPerMonth: number // impulsos de 30 minutos
  decorations: 'none' | 'some' | 'all'
  incognito: boolean
  groupPlansPerMonth: number // Infinity = sin tope
  summary: string
}

export type FilterKey = 'intent' | 'city' | 'age' | 'interests' | 'availability' | 'languages' | 'verified'
export type DecorationKey = string

export const FILTER_LABELS: Record<FilterKey, string> = {
  intent: 'Intención',
  city: 'Ciudad',
  age: 'Rango de edad',
  interests: 'Intereses en común',
  availability: 'Disponibilidad',
  languages: 'Idiomas',
  verified: 'Solo perfiles verificados',
}

export const TIERS: Record<Tier, TierInfo> = {
  free: {
    name: 'Gratuito',
    priceUsd: 0,
    priceMxn: 0,
    likesPerDay: 20,
    goldenPerWeek: 1,
    seeWhoLiked: false,
    undo: false,
    filters: ['intent', 'city'],
    travelPerMonth: 0,
    boostsPerMonth: 0,
    decorations: 'none',
    incognito: false,
    groupPlansPerMonth: 2,
    summary: 'Todo lo esencial para conocer gente, con la seguridad completa y la conversación sin límites.',
  },
  grand: {
    name: 'Grand',
    priceUsd: 5,
    priceMxn: 92.5,
    likesPerDay: 50,
    goldenPerWeek: 3,
    seeWhoLiked: true,
    undo: true,
    filters: ['intent', 'city', 'age', 'interests'],
    travelPerMonth: 1,
    boostsPerMonth: 1,
    decorations: 'some',
    incognito: false,
    groupPlansPerMonth: 6,
    summary: 'Más herramientas: más "me interesa" al día, ver quién te dio uno, deshacer y un impulso al mes.',
  },
  lucidite: {
    name: 'Lucidité',
    priceUsd: 10,
    priceMxn: 185,
    likesPerDay: 100,
    goldenPerWeek: 7,
    seeWhoLiked: true,
    undo: true,
    filters: ['intent', 'city', 'age', 'interests', 'availability', 'languages', 'verified'],
    travelPerMonth: Infinity,
    boostsPerMonth: 4,
    decorations: 'all',
    incognito: true,
    groupPlansPerMonth: Infinity,
    summary: 'Todas las herramientas: todos los filtros, modo incógnito, cuatro impulsos al mes y todos los estilos.',
  },
}

export const TIER_ORDER: Tier[] = ['free', 'grand', 'lucidite']

/** Lo que nunca se cobra. */
export const SIEMPRE_GRATIS = [
  'Seguridad: verificación, reportes, bloqueo e imágenes difuminadas',
  'Chatear con tus conexiones, sin límite de palabras',
  'Tu hilo del día y la recomendación explicada',
  'Unirte a planes',
]

/** Lo que el sistema sí puede garantizar, y cómo compensa si no cumple. */
export const GARANTIAS = [
  'El impulso te muestra a al menos 40 personas que cumplen tus filtros en 30 minutos; si tu zona no tiene suficientes, se devuelve y te decimos cuántas lo vieron.',
  'El hilo dorado aparece primero en la bandeja de la otra persona. No garantiza respuesta.',
  '"Quién te dio me interesa" es la lista completa y actualizada.',
  'Cancelas en dos toques y conservas el plan hasta el fin del periodo pagado.',
  'Te avisamos 3 días antes de cada cobro.',
  'Si en los primeros 7 días no usaste nada de pago, te devolvemos todo con un toque.',
]

export const mxn = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })

export function formatCount(n: number, unit: string) {
  return Number.isFinite(n) ? `${n.toLocaleString('es-MX')} ${unit}` : `Sin tope de ${unit}`
}
