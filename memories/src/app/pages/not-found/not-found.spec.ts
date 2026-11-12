import { TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { NotFound } from './not-found'

describe('NotFound', () => {
  it('avisa que la página no existe y lleva a la portada', async () => {
    await TestBed.configureTestingModule({ imports: [NotFound], providers: [provideRouter([])] }).compileComponents()
    const fixture = TestBed.createComponent(NotFound)
    await fixture.whenStable()
    const el: HTMLElement = fixture.nativeElement
    expect(el.querySelector('h1')?.textContent).toContain('Esta página no existe')
    expect(el.textContent).toContain('Ilustración: una flor que se endereza')
  })
})
