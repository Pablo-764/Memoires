import { Component, ElementRef, inject, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { Pressure } from '../../directivas/pressure'
import { Logo } from '../logo/logo'
import { ThemeIconButton } from '../theme-icon-button/theme-icon-button'

// Fotos del collage: posición en %, giro y profundidad para el paralaje
const PHOTOS = [
  { src: 'fotos/cafe.webp', note: 'el café de los martes', x: 8, y: 10, r: -6, depth: 22 },
  { src: 'fotos/concierto.webp', note: '¡primera fila!', x: 50, y: 4, r: 5, depth: 34 },
  { src: 'fotos/correr.webp', note: '5 km y desayuno', x: 30, y: 42, r: -3, depth: 14 },
  { src: 'fotos/juegos.webp', note: 'revancha pendiente', x: 60, y: 52, r: 8, depth: 28 },
]

@Component({
  selector: 'app-auth-frame',
  imports: [RouterLink, Logo, Pressure, ThemeIconButton],
  styleUrl: './auth-frame.css',
  templateUrl: './auth-frame.html',
})
export class AuthFrame {
  protected readonly store = inject(AppStore)
  readonly title = input.required<string>()
  readonly subtitle = input.required<string>()
  protected readonly photos = PHOTOS
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement

  // Paralaje del collage: una sola variable en el contenedor, cada foto se mueve según su profundidad
  protected tilt(e: PointerEvent | null) {
    const el = this.host.querySelector<HTMLElement>('.auth-board')
    if (!el || (e && e.pointerType !== 'mouse')) return
    if (!e) {
      el.style.setProperty('--px', '0')
      el.style.setProperty('--py', '0')
      return
    }
    const r = el.getBoundingClientRect()
    el.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
    el.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
  }
}
