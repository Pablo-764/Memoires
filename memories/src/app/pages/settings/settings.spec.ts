import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { Settings } from './settings'

describe('Settings', () => {
  let component: Settings
  let fixture: ComponentFixture<Settings>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Settings],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Settings)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

describe('Ajustes: cada opción explica su efecto', () => {
  it('pausar el perfil cambia el texto de quién puede verte', async () => {
    localStorage.clear()
    await TestBed.configureTestingModule({ imports: [Settings], providers: [provideRouter([])] }).compileComponents()
    const fixture = TestBed.createComponent(Settings)
    await fixture.whenStable()
    const el = fixture.nativeElement as HTMLElement
    expect(el.textContent).toContain('Quién puede verte: personas verificadas')
    ;(el.querySelector('input[value="nadie"]') as HTMLInputElement).click()
    await fixture.whenStable()
    expect(el.textContent).toContain('Tu perfil está en pausa')
  })
})
