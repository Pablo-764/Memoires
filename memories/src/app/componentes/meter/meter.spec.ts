import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { Meter } from './meter'

describe('Meter', () => {
  let component: Meter
  let fixture: ComponentFixture<Meter>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Meter],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Meter)
    component = fixture.componentInstance
    fixture.componentRef.setInput('used', 3)
    fixture.componentRef.setInput('total', 15)
    fixture.componentRef.setInput('label', 'Matches')
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
