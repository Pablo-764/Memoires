import { ApplicationRef, Injectable, computed, inject, signal } from '@angular/core'

export type ThemeChoice = 'light' | 'dark' | 'system'
const KEY = 'memoires-theme'

function read(): ThemeChoice {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : 'system'
  } catch {
    return 'system'
  }
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly appRef = inject(ApplicationRef)
  private readonly media = window.matchMedia('(prefers-color-scheme: dark)')
  private readonly systemDark = signal(this.media.matches)

  readonly choice = signal<ThemeChoice>(read())
  readonly mode = computed<'light' | 'dark'>(() => {
    const c = this.choice()
    return c === 'system' ? (this.systemDark() ? 'dark' : 'light') : c
  })

  constructor() {
    this.apply()
    this.media.addEventListener('change', (e) => {
      this.systemDark.set(e.matches)
      this.apply()
    })
  }

  private apply() {
    const dark = this.mode() === 'dark'
    document.documentElement.classList.toggle('dark', dark)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#07121d' : '#f3efe7')
  }

  set(next: ThemeChoice, origin?: { x: number; y: number }) {
    const commit = () => {
      this.choice.set(next)
      try {
        if (next === 'system') localStorage.removeItem(KEY)
        else localStorage.setItem(KEY, next)
      } catch {
        /* almacenamiento no disponible: el tema dura solo esta visita */
      }
      this.apply()
      // La captura de la transición necesita el DOM ya actualizado
      this.appRef.tick()
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduce || !origin) {
      commit()
      return
    }

    // Un círculo que crece desde el botón hasta cubrir toda la pantalla
    const { x, y } = origin
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const root = document.documentElement
    root.classList.add('theme-switching')
    const transition = document.startViewTransition(commit)
    const clear = () => root.classList.remove('theme-switching')
    transition.finished.then(clear, clear)
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 520, easing: 'cubic-bezier(0.77, 0, 0.175, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    }, () => {})
  }
}
