import { Component, DestroyRef, ElementRef, ViewEncapsulation, afterNextRender, computed, inject, viewChildren } from '@angular/core'
import { AppStore } from '../../servicios/app-store'
import type { Intent } from '../../modelos/intents'

type Kind = 'arch' | 'drop' | 'leaf' | 'diamond' | 'ring' | 'half'

interface Shape {
  kind: Kind
  tone: Intent | 'accent'
  // Posición y tamaño en unidades de la ventana
  x: string
  y: string
  size: string
  // Cuánto se desplaza con el cursor (paralaje) y cuánto tarda su deriva
  depth: number
  drift: number
  delay: number
  turn: number
}

// Figuras grandes en las orillas: no estorban la lectura del contenido
const SHAPES: Shape[] = [
  { kind: 'arch', tone: 'accent', x: '-6vw', y: '58vh', size: 'clamp(220px, 26vw, 420px)', depth: 26, drift: 26, delay: 0, turn: -6 },
  { kind: 'drop', tone: 'romance', x: '82vw', y: '-8vh', size: 'clamp(200px, 22vw, 360px)', depth: 34, drift: 31, delay: -8, turn: 12 },
  { kind: 'leaf', tone: 'plan', x: '88vw', y: '64vh', size: 'clamp(180px, 18vw, 300px)', depth: 20, drift: 23, delay: -4, turn: -14 },
  { kind: 'diamond', tone: 'friend', x: '44vw', y: '86vh', size: 'clamp(70px, 7vw, 120px)', depth: 48, drift: 19, delay: -11, turn: 45 },
  { kind: 'ring', tone: 'hobby', x: '20vw', y: '-10vh', size: 'clamp(160px, 17vw, 280px)', depth: 16, drift: 29, delay: -15, turn: 0 },
  { kind: 'half', tone: 'friend', x: '60vw', y: '30vh', size: 'clamp(90px, 9vw, 150px)', depth: 58, drift: 21, delay: -6, turn: 30 },
  { kind: 'diamond', tone: 'hobby', x: '6vw', y: '22vh', size: 'clamp(40px, 4vw, 70px)', depth: 70, drift: 17, delay: -3, turn: 45 },
]

const STAMP_KINDS: Kind[] = ['arch', 'drop', 'leaf', 'diamond', 'half']
const STAMP_TONES: Intent[] = ['romance', 'friend', 'plan', 'hobby']
const INTERACTIVE = 'a, button, input, textarea, select, label, summary, [role="button"], [role="tab"], [role="radio"], [contenteditable], .card, app-modal'

/** Fondo vivo: puntos que se encienden bajo el cursor, figuras de tinta que se separan al acercarse y un sello al hacer clic. */
@Component({
  selector: 'app-backdrop',
  styleUrl: './backdrop.css',
  templateUrl: './backdrop.html',
  encapsulation: ViewEncapsulation.None,
  host: { 'aria-hidden': 'true', '[style.--glow]': 'glow()', '[style.background-color]': "store.ambient() ?? 'var(--color-mist)'" },
})
export class Backdrop {
  protected readonly store = inject(AppStore)
  protected readonly shapes = SHAPES
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private readonly shapeEls = viewChildren<ElementRef<HTMLElement>>('shape')

  protected readonly glow = computed(() => {
    const tone = this.store.backdropTone() ?? (this.store.loggedIn() ? this.store.preferredIntent() : 'hobby')
    return `var(--color-${tone})`
  })

  constructor() {
    const destroyRef = inject(DestroyRef)
    afterNextRender(() => {
      const fine = matchMedia('(hover: hover) and (pointer: fine)')
      const still = matchMedia('(prefers-reduced-motion: reduce)')
      const target = { x: innerWidth / 2, y: innerHeight * 0.3 }
      const pos = { ...target }
      let centers: { x: number; y: number; r: number }[] = []
      let frame = 0

      const measure = () => {
        centers = this.shapeEls().map(({ nativeElement: el }) => {
          const r = el.getBoundingClientRect()
          return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: Math.max(r.width, r.height) / 2 }
        })
      }

      const paint = () => {
        frame = 0
        const k = still.matches ? 1 : 0.12
        pos.x += (target.x - pos.x) * k
        pos.y += (target.y - pos.y) * k
        const s = this.host.style
        s.setProperty('--mx', `${pos.x.toFixed(1)}px`)
        s.setProperty('--my', `${pos.y.toFixed(1)}px`)
        s.setProperty('--px', ((pos.x / innerWidth) * 2 - 1).toFixed(3))
        s.setProperty('--py', ((pos.y / innerHeight) * 2 - 1).toFixed(3))
        // Cercanía de cada figura al cursor: 0 lejos, 1 encima
        this.shapeEls().forEach(({ nativeElement: el }, i) => {
          const c = centers[i]
          if (!c) return
          const d = Math.hypot(pos.x - c.x, pos.y - c.y)
          const near = Math.max(0, Math.min(1, 1 - (d - c.r * 0.5) / (c.r + 220)))
          el.style.setProperty('--near', (near * near).toFixed(3))
        })
        if (Math.abs(target.x - pos.x) > 0.5 || Math.abs(target.y - pos.y) > 0.5) frame = requestAnimationFrame(paint)
      }
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(paint)
      }

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse' || !fine.matches) return
        this.host.classList.add('is-live')
        target.x = e.clientX
        target.y = e.clientY
        schedule()
      }
      const onLeave = () => this.host.classList.remove('is-live')

      // Clic en una zona vacía: queda un sello de tinta que se desvanece
      const onDown = (e: PointerEvent) => {
        if (e.button !== 0 || still.matches) return
        const t = e.target as Element | null
        if (!t || t.closest(INTERACTIVE) || getSelection()?.toString()) return
        const stamp = document.createElement('span')
        stamp.className = 'bd-stamp'
        stamp.dataset['shape'] = STAMP_KINDS[Math.floor(Math.random() * STAMP_KINDS.length)]
        stamp.style.left = `${e.clientX}px`
        stamp.style.top = `${e.clientY}px`
        stamp.style.setProperty('--tone', `var(--color-${STAMP_TONES[Math.floor(Math.random() * STAMP_TONES.length)]})`)
        stamp.style.setProperty('--spin', `${Math.round(Math.random() * 120 - 60)}deg`)
        stamp.addEventListener('animationend', () => stamp.remove(), { once: true })
        this.host.appendChild(stamp)
      }

      measure()
      paint()
      addEventListener('pointermove', onMove, { passive: true })
      addEventListener('pointerdown', onDown, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
      addEventListener('resize', measure, { passive: true })
      destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame)
        removeEventListener('pointermove', onMove)
        removeEventListener('pointerdown', onDown)
        document.documentElement.removeEventListener('pointerleave', onLeave)
        removeEventListener('resize', measure)
      })
    })
  }
}
