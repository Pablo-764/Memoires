import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { Rest } from './rest'

describe('Rest', () => {
  let component: Rest
  let fixture: ComponentFixture<Rest>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rest],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Rest)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
