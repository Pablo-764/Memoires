import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Backdrop } from './backdrop'

describe('Backdrop', () => {
  let fixture: ComponentFixture<Backdrop>

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Backdrop] }).compileComponents()
    fixture = TestBed.createComponent(Backdrop)
    await fixture.whenStable()
  })

  it('dibuja el muro de palabras', () => {
    const el: HTMLElement = fixture.nativeElement
    expect(el.querySelectorAll('.kt-row').length).toBeGreaterThan(8)
    expect(el.getAttribute('aria-hidden')).toBe('true')
  })
})
