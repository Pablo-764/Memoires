import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DiscoverGraph } from './discover-graph'
import { PEOPLE } from '../../datos/mock'
import type { Suggestion } from '../../utilidades/matching'

describe('DiscoverGraph', () => {
  let fixture: ComponentFixture<DiscoverGraph>
  const suggestions: Suggestion[] = PEOPLE.slice(0, 3).map((person) => ({
    person,
    sharedIntents: [person.intents[0]],
    sharedInterests: person.interests.slice(0, 2),
    score: 1,
  }))

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DiscoverGraph] }).compileComponents()
    fixture = TestBed.createComponent(DiscoverGraph)
    fixture.componentRef.setInput('interests', ['Correr', 'Café', 'Lectura'])
    fixture.componentRef.setInput('suggestions', suggestions)
    fixture.componentRef.setInput('intentOf', (s: Suggestion) => s.sharedIntents[0])
    await fixture.whenStable()
  })

  it('dibuja un nodo enfocable por persona con su descripción', () => {
    const nodes = fixture.nativeElement.querySelectorAll('[role="button"]') as NodeListOf<SVGGElement>
    expect(nodes.length).toBe(3)
    expect(nodes[0].getAttribute('tabindex')).toBe('0')
    expect(nodes[0].getAttribute('aria-label')).toContain(PEOPLE[0].name)
  })

  it('avisa qué persona se eligió con teclado', () => {
    let picked = ''
    fixture.componentInstance.pick.subscribe((id) => (picked = id))
    const node = fixture.nativeElement.querySelector('[role="button"]') as SVGGElement
    node.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(picked).toBe(PEOPLE[0].id)
  })
})
