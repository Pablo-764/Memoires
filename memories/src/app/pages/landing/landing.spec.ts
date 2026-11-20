import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Router, provideRouter } from '@angular/router'
import { Landing } from './landing'

describe('Landing', () => {
  let component: Landing
  let fixture: ComponentFixture<Landing>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Landing],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Landing)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('ofrece las 4 intenciones como botones (equivalente accesible del hilo) y abre el registro con la elegida', async () => {
    const router = TestBed.inject(Router)
    const spy = vi.spyOn(router, 'navigate').mockResolvedValue(true)
    const buttons = fixture.nativeElement.querySelectorAll('.hero-intent') as NodeListOf<HTMLButtonElement>
    expect(buttons.length).toBe(4)
    buttons[1].click()
    expect(spy).toHaveBeenCalledWith(['/registro'], { queryParams: { intencion: 'plan' } })
  })
})
