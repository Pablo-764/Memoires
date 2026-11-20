import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { CommandPalette } from './command-palette'

describe('CommandPalette', () => {
  let fixture: ComponentFixture<CommandPalette>

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CommandPalette], providers: [provideRouter([])] }).compileComponents()
    fixture = TestBed.createComponent(CommandPalette)
    await fixture.whenStable()
  })

  it('sin texto ofrece destinos y acciones', () => {
    const text = fixture.nativeElement.textContent as string
    expect(text).toContain('Descubre')
    expect(text).toContain('Acciones')
  })

  it('filtra sin importar acentos', async () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement
    input.value = 'suscripcion'
    input.dispatchEvent(new Event('input'))
    await fixture.whenStable()
    const options = fixture.nativeElement.querySelectorAll('[role="option"]')
    expect(options.length).toBeGreaterThan(0)
    expect(options[0].textContent).toContain('suscripción')
  })
})
