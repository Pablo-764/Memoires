import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { TierCards } from './tier-cards'

describe('TierCards', () => {
  let component: TierCards
  let fixture: ComponentFixture<TierCards>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TierCards],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(TierCards)
    component = fixture.componentInstance
    fixture.componentRef.setInput('ctaLabel', () => 'Elegir')
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
