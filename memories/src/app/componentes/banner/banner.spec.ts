import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { Banner } from './banner'

describe('Banner', () => {
  let component: Banner
  let fixture: ComponentFixture<Banner>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Banner],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Banner)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
