import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { PEOPLE } from '../../datos/mock'
import { SwipeCard } from './swipe-card'

describe('SwipeCard', () => {
  let component: SwipeCard
  let fixture: ComponentFixture<SwipeCard>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwipeCard],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(SwipeCard)
    component = fixture.componentInstance
    fixture.componentRef.setInput('s', { person: PEOPLE[0], sharedIntents: ['friend'], sharedInterests: ['Café'], score: 15 })
    fixture.componentRef.setInput('intent', 'friend')
    fixture.componentRef.setInput('canLike', () => true)
    fixture.componentRef.setInput('decide', () => true)
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
