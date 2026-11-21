import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Router, provideRouter } from '@angular/router'
import { Signup, edadDe } from './signup'
import { AppStore } from '../../servicios/app-store'
import { INTERESTS } from '../../modelos/intents'
import { REGLAS } from './signup-data'

// Acceso a la API interna del componente para recorrer el flujo
interface Api {
  b: () => { paso: number; prompts: { q: string }[] }
  password: { set(v: string): void }
  set(c: object): void
  valido: () => boolean
  siguiente(saltar?: boolean): void
  toggle(k: string, v: string, max?: number): void
  togglePrompt(q: string): void
  answer(q: string, a: string): void
  catalogo: () => string[]
  fotosEjemplo(): void
  setRespuesta(i: number, v: number): void
  verificar(): void
}

function hace(anios: number) {
  const d = new Date()
  d.setFullYear(d.getFullYear() - anios)
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

describe('Signup', () => {
  let fixture: ComponentFixture<Signup>
  let api: Api
  let store: AppStore

  beforeEach(async () => {
    localStorage.clear()
    vi.useFakeTimers()
    await TestBed.configureTestingModule({
      imports: [Signup],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(Signup)
    api = fixture.componentInstance as unknown as Api
    store = TestBed.inject(AppStore)
    vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true)
    fixture.detectChanges()
  })

  afterEach(() => vi.useRealTimers())

  function hasta(paso: number) {
    expect(api.b().paso).toBe(paso)
  }

  function primerosPasos() {
    api.set({ contacto: 'ana@ejemplo.mx' })
    api.password.set('una-clave-segura')
    api.siguiente()
    hasta(2)
    api.set({ nombre: 'Ana', nacimiento: hace(27) })
    api.siguiente()
    hasta(3)
    api.toggle('intenciones', 'friend')
    api.siguiente()
    api.siguiente() // 4: opcional
    hasta(5)
    api.set({ zona: 'Centro' })
    api.siguiente()
    INTERESTS.slice(0, 5).forEach((i) => api.toggle('intereses', i))
    api.siguiente()
    hasta(7)
    api.catalogo().slice(0, 3).forEach((q) => {
      api.togglePrompt(q)
      api.answer(q, 'Una respuesta')
    })
    api.siguiente()
    hasta(8)
    api.fotosEjemplo()
    api.siguiente()
    hasta(9)
  }

  function terminar() {
    hasta(10)
    api.verificar()
    vi.advanceTimersByTime(1000)
    api.siguiente()
    hasta(11)
    ;['¿Café o té para un primer plan?', '¿Qué serie recomiendas sin dudar?', '¿Qué pasatiempo quieres aprender?'].forEach((a) => api.toggle('aperturas', a, 3))
    api.siguiente()
    hasta(12)
    REGLAS.forEach((r) => api.toggle('reglas', r.key))
    api.siguiente()
    hasta(13)
    api.siguiente()
    vi.advanceTimersByTime(1200)
  }

  it('crea la cuenta completa con el test de personalidad', () => {
    primerosPasos()
    for (let i = 0; i < 12; i++) {
      api.setRespuesta(i, i % 2 ? 2 : -1)
      api.siguiente()
    }
    terminar()
    expect(store.loggedIn()).toBe(true)
    expect(store.onboarded()).toBe(true)
    const me = store.me()
    expect(me.name).toBe('Ana')
    expect(me.age).toBe(27)
    expect(me.personality).toHaveLength(4)
    expect(me.verified).toBe(true)
    expect(me.openers).toHaveLength(3)
    expect(me.prompts).toHaveLength(3)
    expect(localStorage.getItem('memoires-registro')).toBeNull()
  })

  it('crea la cuenta saltando el test', () => {
    primerosPasos()
    api.siguiente(true)
    terminar()
    expect(store.loggedIn()).toBe(true)
    expect(store.me().personality).toBeUndefined()
  })

  it('rechaza a menores de 18 años', () => {
    api.set({ contacto: 'ana@ejemplo.mx' })
    api.password.set('una-clave-segura')
    api.siguiente()
    api.set({ nombre: 'Ana', nacimiento: hace(17) })
    fixture.detectChanges()
    expect(api.valido()).toBe(false)
    api.siguiente()
    hasta(2)
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('solo para mayores de 18')
  })

  it('guarda el borrador sin la contraseña para volver después', () => {
    api.set({ contacto: 'ana@ejemplo.mx' })
    api.password.set('una-clave-segura')
    api.siguiente()
    fixture.detectChanges()
    const raw = localStorage.getItem('memoires-registro')!
    expect(JSON.parse(raw).paso).toBe(2)
    expect(raw).not.toContain('una-clave-segura')
  })

  it('calcula la edad sin contar el cumpleaños que no ha llegado', () => {
    expect(edadDe('2000-06-15', new Date('2026-06-14'))).toBe(25)
    expect(edadDe('2000-06-15', new Date('2026-06-15'))).toBe(26)
  })
})
