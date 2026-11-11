import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { AuthFrame } from './auth-frame'

describe('AuthFrame', () => {
  let component: AuthFrame
  let fixture: ComponentFixture<AuthFrame>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthFrame],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(AuthFrame)
    component = fixture.componentInstance
    fixture.componentRef.setInput('title', 'Qué gusto verte')
    fixture.componentRef.setInput('subtitle', 'Inicia sesión')
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
