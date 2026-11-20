import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Backdrop } from './backdrop'

describe('Backdrop', () => {
  let fixture: ComponentFixture<Backdrop>

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Backdrop] }).compileComponents()
    fixture = TestBed.createComponent(Backdrop)
    await fixture.whenStable()
  })

  it('dibuja el asanoha y las dos luces, oculto para lectores de pantalla', () => {
    const el: HTMLElement = fixture.nativeElement
    expect(el.querySelector('.asanoha')).toBeTruthy()
    expect(el.querySelectorAll('.light').length).toBe(2)
    expect(el.getAttribute('aria-hidden')).toBe('true')
  })

  it('sin sesión deja la tinta de la marca (sin data-intent)', () => {
    expect(document.documentElement.dataset['intent']).toBeUndefined()
  })
})
