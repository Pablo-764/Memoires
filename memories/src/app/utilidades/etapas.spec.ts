import { etapaDe, grosorHilo, ideasDePlan } from './etapas'
import { PEOPLE, type Message } from '../datos/mock'

const msg = (from: string, plan?: Message['plan']): Message => ({ id: Math.random().toString(), from, text: 'hola', at: 0, plan })

describe('etapas', () => {
  it('nueva, hablando, acordado y cumplido según lo que pasó', () => {
    expect(etapaDe('p1', [], [], [])).toBe('nueva')
    expect(etapaDe('p1', [msg('me'), msg('p1')], [], [])).toBe('hablando')
    const aceptado = msg('me', { title: 'Café', when: 'Sábado', place: 'Centro', intent: 'friend', status: 'aceptado' })
    expect(etapaDe('p1', [aceptado], [], [{ people: ['me', 'p1'] }])).toBe('acordado')
    expect(etapaDe('p1', [msg('me'), msg('p1')], [], [{ people: ['me', 'p1'] }])).toBe('cumplido')
  })

  it('la etapa elegida a mano tiene prioridad', () => {
    expect(etapaDe('p1', [], [], [], 'hablando')).toBe('hablando')
  })

  it('el hilo engorda con la conversación y los planes cumplidos, hasta 8', () => {
    expect(grosorHilo(0, 0)).toBe(1)
    expect(grosorHilo(10, 1)).toBeGreaterThan(grosorHilo(10, 0))
    expect(grosorHilo(1000, 5)).toBe(8)
  })

  it('sugiere planes a partir de los intereses en común', () => {
    const mariana = PEOPLE.find((p) => p.id === 'p1')!
    const ideas = ideasDePlan(['Café', 'Correr'], mariana, 'friend')
    expect(ideas.map((i) => i.title)).toContain('Café en la Americana')
  })
})
