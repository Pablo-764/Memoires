import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Backdrop } from './backdrop'

describe('Backdrop', () => {
  let fixture: ComponentFixture<Backdrop>

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Backdrop] }).compileComponents()
    fixture = TestBed.createComponent(Backdrop)
    await fixture.whenStable()
  })

  it('dibuja las figuras de tinta', () => {
    const el: HTMLElement = fixture.nativeElement
    expect(el.querySelectorAll('.bd-shape').length).toBeGreaterThan(4)
    expect(el.getAttribute('aria-hidden')).toBe('true')
  })
})
