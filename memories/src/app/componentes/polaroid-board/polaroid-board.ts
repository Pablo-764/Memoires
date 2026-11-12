import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChildren } from '@angular/core'

interface Snap {
  photo: string
  note: string
  tone: string
  // Posición inicial en % del tablero y giro
  x: number
  y: number
  r: number
}

const SNAPS: Snap[] = [
  { photo: 'fotos/cafe.webp', note: 'café con Abril, sábado', tone: 'friend', x: 6, y: 10, r: -7 },
  { photo: 'fotos/correr.webp', note: 'corrimos 8 km (yo 5)', tone: 'plan', x: 30, y: 30, r: 5 },
  { photo: 'fotos/concierto.webp', note: 'el concierto que nadie quería ir', tone: 'romance', x: 55, y: 6, r: -4 },
  { photo: 'fotos/juegos.webp', note: 'noche de juegos: gané', tone: 'hobby', x: 74, y: 34, r: 8 },
  { photo: 'fotos/biblioteca.webp', note: 'club de lectura, cap. 3', tone: 'accent', x: 16, y: 52, r: 3 },
]

interface Body {
  el: HTMLElement
  x: number
  y: number
  vx: number
  vy: number
  r: number
  vr: number
}

/**
 * Tablero de polaroids: se pueden arrastrar y lanzar; siguen con inercia, giran un poco
 * según la velocidad y rebotan en los bordes. Todo se mueve con transform.
 */
@Component({
  selector: 'app-polaroid-board',
  styleUrl: './polaroid-board.css',
  templateUrl: './polaroid-board.html',
  host: { class: 'block' },
})
export class PolaroidBoard {
  protected readonly snaps = SNAPS
  private readonly board = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private readonly cards = viewChildren<ElementRef<HTMLElement>>('card')

  constructor() {
    const destroyRef = inject(DestroyRef)
    afterNextRender(() => {
      const still = matchMedia('(prefers-reduced-motion: reduce)').matches
      const area = this.board.querySelector<HTMLElement>('.pb-area')!
      let bounds = area.getBoundingClientRect()
      const bodies: Body[] = this.cards().map(({ nativeElement: el }, i) => {
        const s = SNAPS[i]
        return { el, x: (s.x / 100) * bounds.width, y: (s.y / 100) * bounds.height, vx: 0, vy: 0, r: s.r, vr: 0 }
      })
      let z = 10
      let frame = 0
      let dragging: { b: Body; dx: number; dy: number; lx: number; ly: number; lt: number } | null = null

      const place = (b: Body) => {
        b.el.style.transform = `translate3d(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px, 0) rotate(${b.r.toFixed(2)}deg)`
      }
      bodies.forEach(place)

      const step = () => {
        frame = 0
        let moving = false
        for (const b of bodies) {
          if (dragging?.b === b) continue
          if (Math.abs(b.vx) + Math.abs(b.vy) + Math.abs(b.vr) < 0.05) continue
          moving = true
          b.x += b.vx
          b.y += b.vy
          b.r += b.vr
          b.vx *= 0.93
          b.vy *= 0.93
          b.vr *= 0.9
          const w = b.el.offsetWidth
          const h = b.el.offsetHeight
          // Rebote suave en los bordes del tablero
          if (b.x < -w * 0.2) (b.x = -w * 0.2), (b.vx = Math.abs(b.vx) * 0.6)
          if (b.x > bounds.width - w * 0.8) (b.x = bounds.width - w * 0.8), (b.vx = -Math.abs(b.vx) * 0.6)
          if (b.y < -h * 0.1) (b.y = -h * 0.1), (b.vy = Math.abs(b.vy) * 0.6)
          if (b.y > bounds.height - h * 0.85) (b.y = bounds.height - h * 0.85), (b.vy = -Math.abs(b.vy) * 0.6)
          place(b)
        }
        if (moving) frame = requestAnimationFrame(step)
      }

      const down = (e: PointerEvent) => {
        const el = (e.target as Element).closest<HTMLElement>('.pb-card')
        const b = bodies.find((x) => x.el === el)
        if (!b) return
        e.preventDefault()
        bounds = area.getBoundingClientRect()
        b.el.setPointerCapture(e.pointerId)
        b.el.style.zIndex = String(++z)
        b.el.classList.add('is-held')
        dragging = { b, dx: e.clientX - bounds.left - b.x, dy: e.clientY - bounds.top - b.y, lx: e.clientX, ly: e.clientY, lt: performance.now() }
        b.vx = b.vy = b.vr = 0
      }
      const move = (e: PointerEvent) => {
        if (!dragging) return
        const { b } = dragging
        const now = performance.now()
        const dt = Math.max(1, now - dragging.lt)
        b.vx = ((e.clientX - dragging.lx) / dt) * 16
        b.vy = ((e.clientY - dragging.ly) / dt) * 16
        b.x = e.clientX - bounds.left - dragging.dx
        b.y = e.clientY - bounds.top - dragging.dy
        // Se inclina hacia donde va, como una foto que se arrastra por la mesa
        b.r += (Math.max(-14, Math.min(14, b.vx * 0.8)) - b.r) * 0.25
        dragging.lx = e.clientX
        dragging.ly = e.clientY
        dragging.lt = now
        place(b)
      }
      const up = () => {
        if (!dragging) return
        const { b } = dragging
        b.el.classList.remove('is-held')
        b.vr = still ? 0 : b.vx * 0.15
        if (still) b.vx = b.vy = 0
        dragging = null
        if (!frame) frame = requestAnimationFrame(step)
      }
      const resize = () => (bounds = area.getBoundingClientRect())

      area.addEventListener('pointerdown', down)
      area.addEventListener('pointermove', move)
      area.addEventListener('pointerup', up)
      area.addEventListener('pointercancel', up)
      addEventListener('resize', resize, { passive: true })
      destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame)
        removeEventListener('resize', resize)
      })
    })
  }
}
