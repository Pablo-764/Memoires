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
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#16140f' : '#f7f5f0')
  }

  /** Cambia el tema. Con origen, un círculo se abre desde ese punto (View Transition). */
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
      this.appRef.tick()
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const from = this.mode()
    const to = next === 'system' ? (this.systemDark() ? 'dark' : 'light') : next
    if (!document.startViewTransition || reduce || !origin || from === to) {
      commit()
      return
    }

    const { x, y } = origin
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const root = document.documentElement
    root.classList.add('theme-switching')
    const transition = document.startViewTransition(commit)
    const clear = () => root.classList.remove('theme-switching')
    transition.finished.then(clear, clear)
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 520, easing: 'cubic-bezier(.65, 0, .35, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    }, () => undefined)
  }

  /** Se conserva por compatibilidad: ya no hay nada que preparar. */
  prepare() {}
}
