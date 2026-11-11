import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { Toaster } from './toaster'

describe('Toaster', () => {
  let component: Toaster
  let fixture: ComponentFixture<Toaster>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toaster],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Toaster)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
