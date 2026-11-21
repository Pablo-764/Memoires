import { PEOPLE } from '../datos/mock'
import { DEFAULT_FILTERS, rankSuggestions } from './matching'

const ME = { city: 'Guadalajara', intents: ['friend', 'plan', 'hobby', 'romance'] as const, interests: ['Café', 'Correr'] }

describe('rankSuggestions: filtros innegociables', () => {
  const me = { ...ME, intents: [...ME.intents] }

  it('un filtro sin marcar solo ordena: quien no lo cumple sigue apareciendo, al final', () => {
    const todas = rankSuggestions(me, PEOPLE, new Set(), DEFAULT_FILTERS)
    const r = rankSuggestions(me, PEOPLE, new Set(), { ...DEFAULT_FILTERS, ageMin: 30 })
    expect(r.length).toBe(todas.length)
    const primeroJoven = r.findIndex((s) => s.person.age < 30)
    const ultimoMayor = r.map((s) => s.person.age >= 30).lastIndexOf(true)
    expect(ultimoMayor).toBeLessThan(primeroJoven)
  })

  it('marcado como innegociable, excluye', () => {
    const r = rankSuggestions(me, PEOPLE, new Set(), { ...DEFAULT_FILTERS, ageMin: 30, strict: { age: true } })
    expect(r.every((s) => s.person.age >= 30)).toBe(true)
  })

  it('solo verificados innegociable deja fuera a quien no se verificó', () => {
    const r = rankSuggestions(me, PEOPLE, new Set(), { ...DEFAULT_FILTERS, verifiedOnly: true, strict: { verified: true } })
    expect(r.length).toBeGreaterThan(0)
    expect(r.every((s) => s.person.verified)).toBe(true)
  })
})
