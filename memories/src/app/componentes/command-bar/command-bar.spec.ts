import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { CommandBar } from './command-bar'
import { NAV_ITEMS } from '../../modelos/navegacion'
import { Mando } from '../../servicios/mando'

describe('CommandBar', () => {
  let fixture: ComponentFixture<CommandBar>

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CommandBar], providers: [provideRouter([])] }).compileComponents()
    fixture = TestBed.createComponent(CommandBar)
    fixture.componentRef.setInput('items', NAV_ITEMS)
    fixture.componentRef.setInput('active', 1)
    await fixture.whenStable()
  })

  it('muestra los 4 destinos y marca el actual', () => {
    const links = fixture.nativeElement.querySelectorAll('.cmd-link') as NodeListOf<HTMLAnchorElement>
    expect(links.length).toBe(4)
    expect(links[1].getAttribute('aria-current')).toBe('page')
  })

  it('Ctrl+K abre la paleta de comandos', () => {
    const mando = TestBed.inject(Mando)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
    expect(mando.paletaAbierta()).toBe(true)
  })
})
