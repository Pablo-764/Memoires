import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { ChoiceChip } from './choice-chip'

describe('ChoiceChip', () => {
  let component: ChoiceChip
  let fixture: ComponentFixture<ChoiceChip>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoiceChip],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(ChoiceChip)
    component = fixture.componentInstance
    fixture.componentRef.setInput('selected', false)
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
