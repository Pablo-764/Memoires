import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { Chat } from './chat'
import { AppStore, DEMO_ME } from '../../servicios/app-store'
import { palabrasDelicadas } from '../../utilidades/cuidado'

describe('Chat', () => {
  let component: Chat
  let fixture: ComponentFixture<Chat>
  let store: AppStore

  beforeEach(async () => {
    localStorage.clear()
    await TestBed.configureTestingModule({
      imports: [Chat],
      providers: [provideRouter([])],
    }).compileComponents()

    store = TestBed.inject(AppStore)
    store.completeSignup({ ...DEMO_ME, verified: true })
    fixture = TestBed.createComponent(Chat)
    fixture.componentRef.setInput('id', 'p3')
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('las imágenes llegan difuminadas y se ven con un toque', async () => {
    const el = fixture.nativeElement as HTMLElement
    expect(el.querySelector('.img-wrap.is-blur')).toBeTruthy()
    ;[...el.querySelectorAll('button')].find((b) => b.textContent?.includes('Ver imagen'))!.click()
    await fixture.whenStable()
    expect(el.querySelector('.img-wrap.is-blur')).toBeNull()
  })

  it('pregunta antes de enviar palabras que pueden lastimar', async () => {
    const api = component as unknown as { text: { set(v: string): void }; submit(force?: boolean): void }
    const antes = store.messages()['p3'].length
    api.text.set('Eres un idiota')
    api.submit()
    await fixture.whenStable()
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('¿Seguro que quieres enviar esto?')
    expect(store.messages()['p3'].length).toBe(antes)
    api.submit(true)
    expect(store.messages()['p3'].length).toBe(antes + 1)
  })

  it('los primeros pasos se responden con un toque', async () => {
    const el = fixture.nativeElement as HTMLElement
    const b = el.querySelector('.apertura') as HTMLButtonElement
    b.click()
    await fixture.whenStable()
    expect((el.querySelector('#msg') as HTMLTextAreaElement).value).toContain(b.textContent!.trim())
  })
})

describe('palabrasDelicadas', () => {
  it('detecta sin importar acentos ni mayúsculas', () => {
    expect(palabrasDelicadas('¡Eres un IMBÉCIL!')).toEqual(['imbecil'])
    expect(palabrasDelicadas('Qué buena foto')).toEqual([])
  })
})
