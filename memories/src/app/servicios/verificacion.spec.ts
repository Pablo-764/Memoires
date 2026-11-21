import { TestBed } from '@angular/core/testing'
import { AppStore, EMPTY_ME } from './app-store'
import { PEOPLE } from '../datos/mock'

describe('Verificación obligatoria para conectar', () => {
  let store: AppStore

  beforeEach(() => {
    localStorage.clear()
    store = TestBed.inject(AppStore)
    store.completeSignup({ ...EMPTY_ME, name: 'Ana', email: 'ana@ejemplo.mx', age: 25, intents: ['friend'], verified: false })
  })

  it('sin verificar no puede decir “me interesa”, escribir ni unirse a planes', () => {
    expect(store.decide(PEOPLE[0].id, 'like')).toBe('unverified')
    expect(store.sendMessage(PEOPLE[0].id, 'hola')).toBe('unverified')
    expect(store.toggleJoin(store.plans()[0].id)).toBe('unverified')
  })

  it('sin verificar sí puede pasar y explorar', () => {
    expect(store.decide(PEOPLE[0].id, 'pass')).not.toBe('unverified')
  })

  it('al verificarse ya puede conectar', () => {
    store.verify()
    expect(store.verified()).toBe(true)
    expect(store.decide(PEOPLE[0].id, 'like')).not.toBe('unverified')
  })
})

describe('Hilo dorado', () => {
  let store: AppStore

  beforeEach(() => {
    localStorage.clear()
    store = TestBed.inject(AppStore)
    store.completeSignup({ ...EMPTY_ME, name: 'Ana', email: 'ana@ejemplo.mx', age: 25, intents: ['friend'], verified: true })
  })

  it('uno gratis por semana; el comentario llega como primer mensaje si es mutuo', () => {
    expect(store.goldenLeft()).toBe(1)
    const mutuo = PEOPLE.find((p) => p.likesYou)!
    expect(store.likeWith(mutuo.id, 'su foto', 'Qué buena luz', true)).toBe('match')
    expect(store.goldenLeft()).toBe(0)
    expect(store.messages()[mutuo.id]?.at(-1)?.text).toContain('Qué buena luz')
    const otro = PEOPLE.find((p) => p.id !== mutuo.id)!
    expect(store.likeWith(otro.id, 'su foto', 'Hola', true)).toBe('no-golden')
  })
})
