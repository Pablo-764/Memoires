import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { Field } from './field'

describe('Field', () => {
  let component: Field
  let fixture: ComponentFixture<Field>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Field],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Field)
    component = fixture.componentInstance
    fixture.componentRef.setInput('for', 'nombre')
    fixture.componentRef.setInput('label', 'Nombre')
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
