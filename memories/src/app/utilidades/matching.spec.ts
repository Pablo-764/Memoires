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

describe('rankSuggestions: verificación y perfil completo', () => {
  const me = { city: 'Guadalajara', intents: ['friend' as const], interests: ['Café', 'Correr'] }
  const base = PEOPLE[0]
  const persona = (id: string, extra: Partial<typeof base>) => ({ ...base, id, intents: ['friend' as const], interests: ['Café'], impulsado: false, ...extra })

  it('quien no se verificó no aparece en las sugerencias de otros', () => {
    const r = rankSuggestions(me, [persona('x1', { verified: false }), persona('x2', { verified: true })], new Set(), DEFAULT_FILTERS)
    expect(r.map((s) => s.person.id)).toEqual(['x2'])
  })

  it('el orden aplica el peso de perfil completo', () => {
    const r = rankSuggestions(me, [persona('a-baja', { completo: 40 }), persona('b-alta', { completo: 90 }), persona('c-media', { completo: 60 })], new Set(), DEFAULT_FILTERS)
    expect(r.map((s) => s.person.id)).toEqual(['b-alta', 'c-media', 'a-baja'])
    expect(r.map((s) => s.peso)).toEqual([1.25, 1, 0.6])
  })

  it('pagar no da el peso de completitud: un perfil incompleto que paga va después', () => {
    const r = rankSuggestions(me, [persona('paga', { completo: 30, tier: 'lucidite' }), persona('gratis', { completo: 85, tier: 'free' })], new Set(), DEFAULT_FILTERS)
    expect(r[0].person.id).toBe('gratis')
    expect(r.find((s) => s.person.id === 'paga')?.peso).toBe(0.6)
  })

  it('el impulso se marca y no pasa de 1 de cada 10 sugerencias', () => {
    const gente = Array.from({ length: 10 }, (_, i) => persona('q' + i, { impulsado: i < 3 }))
    const r = rankSuggestions(me, gente, new Set(), DEFAULT_FILTERS)
    expect(r.filter((s) => s.impulsado).length).toBe(1)
  })
})
