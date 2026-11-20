import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ProfileQr } from './profile-qr'

describe('ProfileQr', () => {
  let fixture: ComponentFixture<ProfileQr>

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ProfileQr] }).compileComponents()
    fixture = TestBed.createComponent(ProfileQr)
    fixture.componentRef.setInput('url', 'https://ejemplo.mx/app/persona/me')
    await fixture.whenStable()
  })

  it('dibuja tres ojos cuadrados y los módulos como puntos', () => {
    const el: HTMLElement = fixture.nativeElement
    expect(el.querySelectorAll('.qr-eye-ring').length).toBe(3)
    expect(el.querySelectorAll('.qr-dot').length).toBeGreaterThan(100)
  })

  it('tiene nombre accesible', () => {
    const svg = fixture.nativeElement.querySelector('svg') as SVGElement
    expect(svg.getAttribute('role')).toBe('img')
    expect(svg.getAttribute('aria-label')).toContain('QR')
  })
})
