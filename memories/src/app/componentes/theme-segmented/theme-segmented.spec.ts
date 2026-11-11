import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { ThemeSegmented } from './theme-segmented'

describe('ThemeSegmented', () => {
  let component: ThemeSegmented
  let fixture: ComponentFixture<ThemeSegmented>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeSegmented],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(ThemeSegmented)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
