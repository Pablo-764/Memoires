import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { Subscription } from './subscription'
import { AppStore } from '../../servicios/app-store'

describe('Subscription', () => {
  let component: Subscription
  let fixture: ComponentFixture<Subscription>
  let store: AppStore

  beforeEach(async () => {
    localStorage.clear()
    await TestBed.configureTestingModule({
      imports: [Subscription],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Subscription)
    component = fixture.componentInstance
    store = TestBed.inject(AppStore)
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('fuera del bloque honesto, la página no ofrece matches', () => {
    const el = fixture.nativeElement as HTMLElement
    const copia = el.cloneNode(true) as HTMLElement
    copia.querySelectorAll('app-que-compras').forEach((n) => n.remove())
    expect(copia.textContent).not.toMatch(/match/i)
  })

  it('muestra “Qué compras y qué no” antes de los botones de pago', async () => {
    const buttons = [...fixture.nativeElement.querySelectorAll('button')] as HTMLButtonElement[]
    buttons.find((b) => b.textContent?.includes('Cambiar a Grand'))!.click()
    await fixture.whenStable()
    const dialog = document.querySelector('[role="dialog"]') as HTMLElement
    const bloque = dialog.querySelector('app-que-compras') as HTMLElement
    const pagar = [...dialog.querySelectorAll('button')].find((b) => b.textContent?.includes('PayPal'))!
    expect(bloque.textContent).toContain('No garantiza matches, respuestas ni citas')
    expect(bloque.compareDocumentPosition(pagar) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('cancelar toma dos toques', async () => {
    store.setTier('grand')
    await fixture.whenStable()
    const find = (t: string) => ([...fixture.nativeElement.querySelectorAll('button')] as HTMLButtonElement[]).find((b) => b.textContent?.trim() === t)
    find('Cancelar suscripción')!.click()
    await fixture.whenStable()
    expect(store.tier()).toBe('grand')
    find('Sí, cancelar')!.click()
    await fixture.whenStable()
    expect(store.tier()).toBe('free')
  })
})
