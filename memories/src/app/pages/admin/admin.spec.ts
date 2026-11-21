import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { Admin, prioridadDe } from './admin'

describe('Admin', () => {
  let component: Admin
  let fixture: ComponentFixture<Admin>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Admin],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Admin)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

describe('prioridadDe', () => {
  it('acoso y posibles menores van antes que el spam', () => {
    const base = { reporter: 'x', detail: '', at: Date.now(), status: 'pendiente' as const }
    const acoso = { ...base, id: 'a', reportedId: 'p1', reason: 'Mensajes ofensivos o acoso' }
    const spam = { ...base, id: 'b', reportedId: 'p2', reason: 'Spam o publicidad' }
    expect(prioridadDe(acoso, [acoso, spam]).nivel).toBe('alta')
    expect(prioridadDe(spam, [acoso, spam]).nivel).toBe('baja')
  })
})
