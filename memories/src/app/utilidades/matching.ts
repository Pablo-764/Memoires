import type { Person } from '../datos/mock'
import type { Intent } from '../modelos/intents'
import { usesGender, usesGroups, type IntentPrefs } from '../modelos/plan-formats'
import { pesoVisibilidad } from './completitud'

/** Lo que suma el impulso de pago al puntaje (aparte del peso de completitud). */
export const IMPULSO = 12
/** Tope de perfiles impulsados: no más de 1 de cada 10 sugerencias. */
export const TOPE_IMPULSO = 10

export interface Filters {
  intent: Intent | 'any'
  ageMin: number
  ageMax: number
  minShared: number
  availability: Person['availability'] | 'any'
  language: string | 'any'
  verifiedOnly: boolean
  /** Filtros marcados como innegociables: excluyen. Los demás solo ordenan. */
  strict?: Partial<Record<FiltroAfinable, boolean>>
}

export type FiltroAfinable = 'age' | 'interests' | 'availability' | 'language' | 'verified'

export const DEFAULT_FILTERS: Filters = {
  intent: 'any',
  ageMin: 18,
  ageMax: 60,
  minShared: 0,
  availability: 'any',
  language: 'any',
  verifiedOnly: false,
  strict: {},
}

export interface Me {
  city: string
  intents: Intent[]
  interests: string[]
  age?: number
  intentPrefs?: Partial<Record<Intent, IntentPrefs>>
}

export interface Suggestion {
  person: Person
  sharedIntents: Intent[]
  sharedInterests: string[]
  score: number
  /** Filtros no innegociables que no cumple: ordena después de quien sí cumple. */
  fallas?: number
  /** Peso por perfil completo (0.6, 1 o 1.25), igual pague o no. */
  peso?: number
  /** Impulso de pago aplicado (lleva la marca "Impulsado"). */
  impulsado?: boolean
}

/**
 * Árbol de decisión determinista:
 * 1. Filtros duros: bloqueados, suspendidos, ya decididos, otra ciudad, sin intención en común.
 * 2. Filtros del usuario (según su plan): los innegociables excluyen; los demás solo ordenan
 *    (quien no cumple va después de quien sí). Las preferencias de cada intención excluyen.
 * 3. Orden por puntaje: intereses en común (10 c/u), intenciones en común (5 c/u), perfil verificado (2),
 *    multiplicado por el peso de perfil completo (0.6 / 1 / 1.25; igual para quien paga y quien no).
 *    El impulso de pago suma aparte, se marca y no pasa de 1 de cada 10 sugerencias.
 * Sin verificar no se aparece a nadie.
 * El mismo input siempre produce el mismo orden.
 */
function fitsPrefs(person: Person, intent: Intent, me: Me, sharedCount: number) {
  const prefs = me.intentPrefs?.[intent]
  if (!prefs) return true
  if (usesGender(intent) && prefs.genders.length && !(person.gender && prefs.genders.includes(person.gender))) return false
  if (usesGroups(intent)) {
    if (prefs.sizes.length && !person.groupSizes?.some((s) => prefs.sizes.includes(s))) return false
    if (prefs.people === 'interests' && sharedCount === 0) return false
    if (prefs.people === 'verified' && !person.verified) return false
    if (prefs.people === 'age' && me.age !== undefined && Math.abs(person.age - me.age) > 5) return false
  }
  return true
}

export function rankSuggestions(
  me: Me,
  people: Person[],
  excluded: Set<string>,
  filters: Filters,
): Suggestion[] {
  const myInterests = new Set(me.interests)
  const myIntents = new Set(me.intents)
  const out: Suggestion[] = []

  for (const person of people) {
    if (excluded.has(person.id)) continue
    if (person.city !== me.city) continue
    if (!person.verified) continue

    const sharedIntents = person.intents.filter((i) => myIntents.has(i))
    if (sharedIntents.length === 0) continue
    if (filters.intent !== 'any' && !sharedIntents.includes(filters.intent)) continue
    const sharedInterests = person.interests.filter((i) => myInterests.has(i))
    const falla: Record<FiltroAfinable, boolean> = {
      age: person.age < filters.ageMin || person.age > filters.ageMax,
      availability: filters.availability !== 'any' && person.availability !== filters.availability && person.availability !== 'Cualquier día',
      language: filters.language !== 'any' && !person.languages.includes(filters.language),
      verified: filters.verifiedOnly && !person.verified,
      interests: sharedInterests.length < filters.minShared,
    }
    const fallas = (Object.keys(falla) as FiltroAfinable[]).filter((k) => falla[k])
    if (fallas.some((k) => filters.strict?.[k])) continue

    // Cada intención en común aplica sus propias preferencias
    const validIntents = sharedIntents.filter((i) => fitsPrefs(person, i, me, sharedInterests.length))
    if (validIntents.length === 0) continue
    if (filters.intent !== 'any' && !validIntents.includes(filters.intent)) continue

    const base = sharedInterests.length * 10 + validIntents.length * 5 + (person.verified ? 2 : 0)
    const peso = pesoVisibilidad(person.completo ?? 60)
    const score = Math.round(base * peso * 100) / 100
    out.push({ person, sharedIntents: validIntents, sharedInterests, score, fallas: fallas.length, peso, impulsado: !!person.impulsado })
  }

  const orden = (a: Suggestion, b: Suggestion) => a.person.id.localeCompare(b.person.id)
  const conImpulso = (s: Suggestion) => s.score + (s.impulsado ? IMPULSO : 0)
  const sorted = out.sort((a, b) => (a.fallas ?? 0) - (b.fallas ?? 0) || conImpulso(b) - conImpulso(a) || orden(a, b))

  // Tope: en cada tramo de 10 sugerencias solo un perfil conserva el impulso
  const usados = new Set<number>()
  for (const s of sorted) {
    if (!s.impulsado) continue
    const tramo = Math.floor(sorted.indexOf(s) / TOPE_IMPULSO)
    if (usados.has(tramo)) s.impulsado = false
    else usados.add(tramo)
  }
  return sorted.sort((a, b) => (a.fallas ?? 0) - (b.fallas ?? 0) || conImpulso(b) - conImpulso(a) || orden(a, b))
}

export function countWords(text: string) {
  const t = text.trim()
  return t ? t.split(/\s+/).length : 0
}
