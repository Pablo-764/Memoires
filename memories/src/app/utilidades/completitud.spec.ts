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

  it('pesa la visibilidad igual para todos: 0.6, 1 y 1.25', () => {
    expect(pesoVisibilidad(49)).toBe(0.6)
    expect(pesoVisibilidad(50)).toBe(1)
    expect(pesoVisibilidad(80)).toBe(1.25)
  })
})
