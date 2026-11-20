import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { Dock } from './dock'
import { NAV_ITEMS } from '../../modelos/navegacion'
import { Mando } from '../../servicios/mando'

describe('Dock', () => {
  let fixture: ComponentFixture<Dock>

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Dock], providers: [provideRouter([])] }).compileComponents()
    fixture = TestBed.createComponent(Dock)
    fixture.componentRef.setInput('items', NAV_ITEMS)
    fixture.componentRef.setInput('active', 0)
    await fixture.whenStable()
  })

  it('pone dos destinos a cada lado del botón central', () => {
    expect(fixture.nativeElement.querySelectorAll('.dock-link').length).toBe(4)
    expect(fixture.nativeElement.querySelector('.dock-main')?.textContent).toContain('Conectar')
  })

  it('el botón central dispara la acción principal de la pantalla', () => {
    let ran = false
    const quitar = TestBed.inject(Mando).declarar({ label: 'Crear plan', run: () => (ran = true) })
    fixture.detectChanges()
    ;(fixture.nativeElement.querySelector('.dock-main') as HTMLButtonElement).click()
    expect(ran).toBe(true)
    quitar()
  })
})
