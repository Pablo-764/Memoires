import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { Effect } from './effect'

describe('Effect', () => {
  let component: Effect
  let fixture: ComponentFixture<Effect>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Effect],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Effect)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
