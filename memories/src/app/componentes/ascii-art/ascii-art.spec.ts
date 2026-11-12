import { TestBed } from '@angular/core/testing'
import { AsciiArt } from './ascii-art'
import { parseLine } from '../../datos/ascii'

describe('AsciiArt', () => {
  it('describe la pieza para lectores de pantalla y oculta los símbolos', async () => {
    const fixture = TestBed.createComponent(AsciiArt)
    fixture.componentRef.setInput('piece', 'taza')
    await fixture.whenStable()
    const el: HTMLElement = fixture.nativeElement
    expect(el.querySelector('pre')?.getAttribute('aria-hidden')).toBe('true')
    expect(el.textContent).toContain('Ilustración: una taza de café con vapor')
    expect(el.getAttribute('data-intent')).toBe('friend')
    expect(el.querySelectorAll('.ascii-line').length).toBe(6)
  })

  it('separa las marcas de intención y de detalle', () => {
    expect(parseLine('a{b}c«d»')).toEqual([
      { t: 'a', k: '' },
      { t: 'b', k: 'a' },
      { t: 'c', k: '' },
      { t: 'd', k: 'd' },
    ])
  })
})
