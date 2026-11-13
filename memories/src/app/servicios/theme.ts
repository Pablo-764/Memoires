import { ApplicationRef, Injectable, computed, inject, signal } from '@angular/core'
import { planInk, prepareInk, takeInk } from './ink'

export type ThemeChoice = 'light' | 'dark' | 'system'
const KEY = 'memoires-theme'

// Respaldo mientras se generan las siluetas fibrosas (o si el canvas falla)
const INK_BLOTS_URL = [
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M174.8 95.3C176.5 107.3 173.7 128.5 165.4 139.2C157.1 149.9 136.2 152.4 125.0 159.4C113.7 166.4 109.0 182.3 97.9 181.4C86.8 180.5 70.1 165.5 58.4 154.0C46.7 142.5 32.2 125.6 27.7 112.2C23.2 98.8 26.3 84.3 31.4 73.7C36.5 63.1 48.3 57.7 58.3 48.5C68.2 39.2 78.4 21.8 91.0 18.4C103.5 15.0 122.6 19.9 133.3 28.0C144.1 36.2 148.7 56.2 155.6 67.4C162.5 78.6 173.2 83.3 174.8 95.3Z'/%3E%3Ccircle cx='178' cy='40' r='7'/%3E%3Ccircle cx='190' cy='62' r='3.5'/%3E%3Ccircle cx='22' cy='170' r='5'/%3E%3C/svg%3E`,
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M175.3 99.1C175.8 111.9 166.4 129.9 161.1 140.5C155.7 151.0 150.8 157.2 143.0 162.6C135.3 168.0 126.8 170.9 114.5 172.8C102.2 174.8 79.5 177.9 69.1 174.3C58.8 170.7 60.1 158.9 52.6 151.1C45.0 143.2 26.1 138.5 23.8 126.9C21.5 115.4 35.4 96.8 38.7 81.8C42.0 66.9 37.7 46.3 43.8 37.2C50.0 28.2 65.7 27.6 75.5 27.5C85.3 27.4 92.2 33.4 102.4 36.7C112.7 40.0 127.6 42.8 136.9 47.3C146.1 51.8 151.6 55.2 158.0 63.8C164.4 72.5 174.8 86.4 175.3 99.1Z'/%3E%3Ccircle cx='24' cy='30' r='6'/%3E%3Ccircle cx='36' cy='16' r='3'/%3E%3Ccircle cx='182' cy='176' r='4.5'/%3E%3C/svg%3E`,
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M170.0 100.8C168.4 116.1 158.3 136.9 148.7 148.2C139.0 159.6 127.0 164.3 112.0 168.9C96.9 173.5 71.3 181.9 58.4 175.6C45.4 169.3 38.8 147.0 34.5 131.2C30.2 115.3 26.3 96.3 32.7 80.4C39.1 64.6 59.1 44.5 72.7 36.0C86.3 27.6 100.1 26.1 114.3 29.5C128.6 32.9 148.9 44.6 158.1 56.5C167.4 68.3 171.6 85.5 170.0 100.8Z'/%3E%3Ccircle cx='186' cy='120' r='6'/%3E%3Ccircle cx='14' cy='92' r='4'/%3E%3Ccircle cx='160' cy='190' r='3'/%3E%3C/svg%3E`,
]

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
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#110a1d' : '#f7f2e8')
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
    const from = this.mode()
    const to = next === 'system' ? (this.systemDark() ? 'dark' : 'light') : next
    // "Sistema", sin soporte, con movimiento reducido o sin cambio de modo: cambio directo
    if (!document.startViewTransition || reduce || !origin || next === 'system' || from === to) {
      commit()
      return
    }

    // Mancha de tinta: al ir a oscuro, la tinta se esparce desde el botón (primero caen
    // gotas y luego la mancha se las traga); al volver a claro, se retira hacia el botón y
    // deja unas gotas que se evaporan. Un anillo delgado marca la orilla mojada.
    const { x, y } = origin
    const root = document.documentElement
    const spread = to === 'dark'
    const url = takeInk() ?? INK_BLOTS_URL[Math.floor(Math.random() * INK_BLOTS_URL.length)]
    const plan = planInk(url, x, y, innerWidth, innerHeight, spread)
    root.style.setProperty('--ink-layers', plan.layers)
    root.style.setProperty('--ink-ring-layers', plan.ringLayers)
    root.classList.add('theme-switching', spread ? 'ink-spread' : 'ink-retract')

    // El ícono del botón se aplasta al clic y rebota cuando la tinta ya salió
    const icon = document.elementFromPoint(x, y)?.closest('button')?.querySelector<HTMLElement>('app-icon, svg')
    icon?.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(0.9)', offset: 0.2 },
        { transform: 'scale(0.9)', offset: 0.5 },
        { transform: 'scale(1.08)', offset: 0.72 },
        { transform: 'scale(1)' },
      ],
      { duration: 600, easing: 'ease-out' },
    )

    let ring: HTMLElement | null = null
    // Las animaciones se cancelan al terminar: con fill 'both' se quedarían pegadas a la raíz
    // y afectarían el siguiente cambio de tema
    const running: Animation[] = []
    const transition = document.startViewTransition(() => {
      commit()
      // Anillo de la orilla mojada: existe solo durante la transición, encima de todo
      ring = document.createElement('div')
      ring.className = `ink-ring ${spread ? 'is-dark' : 'is-light'}`
      ring.setAttribute('aria-hidden', 'true')
      document.body.appendChild(ring)
    })
    const clear = () => {
      root.classList.remove('theme-switching', 'ink-spread', 'ink-retract')
      root.style.removeProperty('--ink-layers')
      root.style.removeProperty('--ink-ring-layers')
      ring?.remove()
      for (const anim of running) anim.cancel()
    }
    transition.finished.then(clear, clear)
    transition.ready.then(() => {
      const opts = { duration: plan.duration, easing: 'linear', fill: 'both' as const }
      running.push(
        root.animate(plan.root, { ...opts, pseudoElement: spread ? '::view-transition-new(root)' : '::view-transition-old(root)' }),
        root.animate(plan.ring, { ...opts, pseudoElement: '::view-transition-new(ink-ring)' }),
      )
    }, () => undefined)
  }

  /** Prepara las siluetas de tinta antes del primer clic (botón de tema o Ajustes). */
  prepare() {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) void prepareInk()
  }
}
