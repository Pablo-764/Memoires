import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { ThemeIconButton } from './theme-icon-button'

describe('ThemeIconButton', () => {
  let component: ThemeIconButton
  let fixture: ComponentFixture<ThemeIconButton>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeIconButton],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(ThemeIconButton)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
