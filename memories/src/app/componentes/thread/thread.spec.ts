import { TestBed } from '@angular/core/testing'
import { Thread } from './thread'

describe('Thread', () => {
  it('dibuja el trazo corto por defecto', async () => {
    const fixture = TestBed.createComponent(Thread)
    await fixture.whenStable()
    const el: HTMLElement = fixture.nativeElement
    expect(el.getAttribute('data-variant')).toBe('short')
    expect(el.querySelector('path')?.getAttribute('pathLength')).toBe('1')
  })

  it('usa el trazo largo cuando se pide', async () => {
    const fixture = TestBed.createComponent(Thread)
    fixture.componentRef.setInput('variant', 'long')
    await fixture.whenStable()
    expect(fixture.nativeElement.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 60 700')
  })
})
