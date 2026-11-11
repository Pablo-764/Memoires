import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { InterestPicker } from './interest-picker'

describe('InterestPicker', () => {
  let component: InterestPicker
  let fixture: ComponentFixture<InterestPicker>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestPicker],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(InterestPicker)
    component = fixture.componentInstance
    fixture.componentRef.setInput('selected', [])
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
