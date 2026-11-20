import { ComponentFixture, TestBed } from '@angular/core/testing'
import { AffinityMap } from './affinity-map'
import { PEOPLE } from '../../datos/mock'
import type { Suggestion } from '../../utilidades/matching'

describe('AffinityMap', () => {
  let fixture: ComponentFixture<AffinityMap>
  const suggestions: Suggestion[] = PEOPLE.slice(0, 3).map((person, i) => ({
    person,
    sharedIntents: [person.intents[0]],
    sharedInterests: person.interests.slice(0, 3 - i),
    score: 30 - i * 10,
  }))

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AffinityMap] }).compileComponents()
    fixture = TestBed.createComponent(AffinityMap)
    fixture.componentRef.setInput('suggestions', suggestions)
    fixture.componentRef.setInput('intentOf', (s: Suggestion) => s.sharedIntents[0])
    fixture.componentRef.setInput('myIntents', ['friend', 'plan'])
    await fixture.whenStable()
  })

  it('pone a quien comparte más más cerca de ti', () => {
    const map = fixture.componentInstance as unknown as { nodes: () => { x: number; y: number }[]; cx: () => number; cy: () => number }
    const d = map.nodes().map((n) => Math.hypot(n.x - map.cx(), n.y - map.cy()))
    expect(d[0]).toBeLessThan(d[2])
  })

  it('cada persona es un nodo enfocable que avisa al elegirlo con teclado', () => {
    let picked = ''
    fixture.componentInstance.pick.subscribe((id) => (picked = id))
    const node = fixture.nativeElement.querySelector('.node') as SVGGElement
    expect(node.getAttribute('tabindex')).toBe('0')
    node.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(picked).toBe(PEOPLE[0].id)
  })

  it('el dial solo deja filtrar por tus intenciones', () => {
    const arcs = fixture.nativeElement.querySelectorAll('.arc-btn[role="button"]')
    expect(arcs.length).toBe(2)
  })
})
