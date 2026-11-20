import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PlanMosaic, type MosaicItem } from './plan-mosaic'

describe('PlanMosaic', () => {
  let fixture: ComponentFixture<PlanMosaic>
  const items: MosaicItem[] = [
    { id: 'a', note: 'café', tone: 'friend', date: '2026-10-18 10:30', people: ['TÚ', 'M'] },
    { id: 'b', note: 'corrimos', tone: 'plan' },
    { id: 'c', note: 'juegos', tone: 'hobby' },
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PlanMosaic] }).compileComponents()
    fixture = TestBed.createComponent(PlanMosaic)
    fixture.componentRef.setInput('items', items)
    await fixture.whenStable()
  })

  it('pone una pieza por plan cumplido y la primera grande', () => {
    const tiles = fixture.nativeElement.querySelectorAll('.tile') as NodeListOf<HTMLElement>
    expect(tiles.length).toBe(3)
    expect(tiles[0].style.gridColumn).toContain('span 2')
  })

  it('el acomodo no cambia entre una vista y otra', () => {
    const first = [...fixture.nativeElement.querySelectorAll('.tile')].map((t) => (t as HTMLElement).style.gridRow)
    fixture.componentRef.setInput('items', [...items])
    fixture.detectChanges()
    const again = [...fixture.nativeElement.querySelectorAll('.tile')].map((t) => (t as HTMLElement).style.gridRow)
    expect(again).toEqual(first)
  })
})
