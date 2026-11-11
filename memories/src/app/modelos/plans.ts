export type Tier = 'free' | 'grand' | 'lucidite'

export interface TierInfo {
  name: string
  priceUsd: number
  priceMxn: number
  weeklyMatches: number // Infinity = ilimitado
  weeklyWords: number
  filters: FilterKey[]
  decorations: 'none' | 'some' | 'all'
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
    weeklyMatches: 15,
    weeklyWords: 4000,
    filters: ['intent', 'city'],
    decorations: 'none',
    summary: 'Todo lo esencial para conocer gente, con seguridad completa.',
  },
  grand: {
    name: 'Grand',
    priceUsd: 5,
    priceMxn: 92.5,
    weeklyMatches: 45,
    weeklyWords: 12000,
    filters: ['intent', 'city', 'age', 'interests'],
    decorations: 'some',
    summary: 'El triple de matches y mensajes, más filtros y algunas decoraciones.',
  },
  lucidite: {
    name: 'Lucidité',
    priceUsd: 10,
    priceMxn: 185,
    weeklyMatches: Infinity,
    weeklyWords: Infinity,
    filters: ['intent', 'city', 'age', 'interests', 'availability', 'languages', 'verified'],
    decorations: 'all',
    summary: 'Sin límites: todos los filtros, todas las decoraciones y acceso total.',
  },
}

export const TIER_ORDER: Tier[] = ['free', 'grand', 'lucidite']

export const mxn = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })

export function formatLimit(n: number, unit: string) {
  return Number.isFinite(n) ? `${n.toLocaleString('es-MX')} ${unit}` : `${unit[0].toUpperCase()}${unit.slice(1)} ilimitados`
}
