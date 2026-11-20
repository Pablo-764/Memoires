import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TagField } from './tag-field'

describe('TagField', () => {
  let fixture: ComponentFixture<TagField>
  let last: string[] = []

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TagField] }).compileComponents()
    fixture = TestBed.createComponent(TagField)
    fixture.componentRef.setInput('label', 'Idiomas')
    fixture.componentRef.setInput('values', ['Español'])
    fixture.componentRef.setInput('options', ['Español', 'Inglés', 'Francés'])
    fixture.componentInstance.changed.subscribe((v) => (last = v))
    await fixture.whenStable()
  })

  it('muestra las elegidas como etiquetas que se quitan', () => {
    const x = fixture.nativeElement.querySelector('.tag-x') as HTMLButtonElement
    expect(x.getAttribute('aria-label')).toBe('Quitar Español')
    x.click()
    expect(last).toEqual([])
  })

  it('busca entre las opciones y agrega con Enter', async () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement
    input.value = 'ingl'
    input.dispatchEvent(new Event('input'))
    await fixture.whenStable()
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(last).toEqual(['Español', 'Inglés'])
  })
})
