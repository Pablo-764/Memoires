import type { Profile } from '../servicios/app-store'

/**
 * Perfil completo (0 a 100). Completar el perfil hace que aparezcas a más personas,
 * igual para quien paga y para quien no. Pesos de la regla de André (2026-11-20).
 */
export interface Pieza {
  key: string
  label: string
  puntos: number // lo que suma al completarse
  hecho: number // lo que ya suma
  paso: 'sobre' | 'intereses' | 'busca' | 'momentos'
}

const MAX = 20 + 4 * 5 + 30 + 10 + 10 + 5 + 5 // fotos (2 + 4 extra), prompts, intereses, test, preferencias, disponibilidad

export function piezas(p: Profile): Pieza[] {
  const fotos = (p.photo ? 1 : 0) + p.gallery.length
  const prompts = p.prompts.filter((x) => x.a.trim()).length
  const prefs = p.intents.some((i) => p.intentPrefs[i])
  return [
    { key: 'fotos', label: 'dos fotos', puntos: 20, hecho: fotos >= 2 ? 20 : 0, paso: 'momentos' },
    { key: 'fotos-extra', label: 'más fotos (hasta 6)', puntos: 20, hecho: Math.min(4, Math.max(0, fotos - 2)) * 5, paso: 'momentos' },
    { key: 'prompts', label: 'tres preguntas respondidas', puntos: 30, hecho: Math.min(3, prompts) * 10, paso: 'sobre' },
    { key: 'intereses', label: '5 intereses o más', puntos: 10, hecho: p.interests.length >= 5 ? 10 : 0, paso: 'intereses' },
    { key: 'test', label: 'el test de personalidad', puntos: 10, hecho: p.personality ? 10 : 0, paso: 'sobre' },
    { key: 'prefs', label: 'preferencias por intención', puntos: 5, hecho: prefs ? 5 : 0, paso: 'busca' },
    { key: 'disponibilidad', label: 'tu disponibilidad', puntos: 5, hecho: p.availability ? 5 : 0, paso: 'sobre' },
  ]
}

export function completitud(p: Profile) {
  const total = piezas(p).reduce((t, x) => t + x.hecho, 0)
  return Math.round((total / MAX) * 100)
}

/** Peso en el orden de sugerencias: menos de 50 % → 0.6; 50 a 79 % → 1; 80 % o más → 1.25. */
export function pesoVisibilidad(pct: number) {
  return pct >= 80 ? 1.25 : pct >= 50 ? 1 : 0.6
}

export function textoVisibilidad(pct: number) {
  return pct >= 80
    ? 'Apareces a más personas y puedes estar en “Tu hilo del día” de otros.'
    : pct >= 50
      ? 'Apareces a un número normal de personas. Con 80 % o más, aparecerías a más.'
      : 'Apareces a menos personas. Completa tu perfil para llegar al 50 %.'
}

/** Cuánto sube cada pieza que falta, en puntos de porcentaje. */
export function cuantoSube(x: Pieza) {
  return Math.round(((x.puntos - x.hecho) / MAX) * 100)
}
