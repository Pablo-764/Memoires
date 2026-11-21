import type { Person } from '../datos/mock'
import type { Intent } from '../modelos/intents'
import { usesGender, usesGroups, type IntentPrefs } from '../modelos/plan-formats'

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
}

/**
 * Árbol de decisión determinista:
 * 1. Filtros duros: bloqueados, suspendidos, ya decididos, otra ciudad, sin intención en común.
 * 2. Filtros del usuario (según su plan): los innegociables excluyen; los demás solo ordenan
 *    (quien no cumple va después de quien sí). Las preferencias de cada intención excluyen.
 * 3. Orden por puntaje: intereses en común (10 c/u), intenciones en común (5 c/u), perfil verificado (2).
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

    const score = sharedInterests.length * 10 + validIntents.length * 5 + (person.verified ? 2 : 0)
    out.push({ person, sharedIntents: validIntents, sharedInterests, score, fallas: fallas.length })
  }

  return out.sort((a, b) => (a.fallas ?? 0) - (b.fallas ?? 0) || b.score - a.score || a.person.id.localeCompare(b.person.id))
}

export function countWords(text: string) {
  const t = text.trim()
  return t ? t.split(/\s+/).length : 0
}
