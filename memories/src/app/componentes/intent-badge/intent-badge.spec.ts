import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { IntentBadge } from './intent-badge'

describe('IntentBadge', () => {
  let component: IntentBadge
  let fixture: ComponentFixture<IntentBadge>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntentBadge],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(IntentBadge)
    component = fixture.componentInstance
    fixture.componentRef.setInput('intent', 'friend')
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
