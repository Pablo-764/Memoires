import { DEMO_ME, EMPTY_ME } from '../servicios/app-store'
import { completitud, cuantoSube, pesoVisibilidad, piezas } from './completitud'

describe('completitud', () => {
  it('un perfil vacío solo suma la disponibilidad', () => {
    expect(completitud(EMPTY_ME)).toBe(5)
  })

  it('suma 100 con 6 fotos, 3 prompts, 5 intereses, test, preferencias y disponibilidad', () => {
    const p = {
      ...DEMO_ME,
      photo: 'a',
      gallery: ['b', 'c', 'd', 'e', 'f'],
      prompts: [1, 2, 3].map((n) => ({ q: `q${n}`, a: 'sí' })),
      interests: ['a', 'b', 'c', 'd', 'e'],
      personality: [0, 0, 0, 0] as [number, number, number, number],
      intents: ['friend' as const],
      intentPrefs: { friend: { sizes: [], people: 'any' as const, genders: [] } },
    }
    expect(completitud(p)).toBe(100)
  })

  it('dice cuánto sube cada pieza que falta', () => {
    const test = piezas(EMPTY_ME).find((x) => x.key === 'test')!
    expect(cuantoSube(test)).toBe(10)
  })

  it('pesa la visibilidad en los bordes: 49, 50, 79 y 80 %', () => {
    expect(pesoVisibilidad(49)).toBe(0.6)
    expect(pesoVisibilidad(50)).toBe(1)
    expect(pesoVisibilidad(79)).toBe(1)
    expect(pesoVisibilidad(80)).toBe(1.25)
  })

  it('calcula exacto en los bordes de 50 y 80 %', () => {
    const vacio = { ...EMPTY_ME, availability: '', prompts: [] as { q: string; a: string }[] }
    const dosFotos = { ...vacio, photo: 'a', gallery: ['b'] }
    const tresPrompts = [1, 2, 3].map((n) => ({ q: `q${n}`, a: 'sí' }))
    expect(completitud({ ...dosFotos, prompts: tresPrompts })).toBe(50)
    expect(completitud({ ...dosFotos, prompts: tresPrompts.slice(0, 2), availability: 'Fines de semana', interests: [] })).toBe(45)
    const ochenta = { ...dosFotos, prompts: tresPrompts, interests: ['a', 'b', 'c', 'd', 'e'], personality: [0, 0, 0, 0] as [number, number, number, number], availability: 'Fines de semana', intents: ['friend' as const], intentPrefs: { friend: { sizes: [], people: 'any' as const, genders: [] } } }
    expect(completitud(ochenta)).toBe(80)
    expect(completitud({ ...ochenta, intentPrefs: {} })).toBe(75)
  })
})
