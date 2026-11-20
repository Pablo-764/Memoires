import { Component, DestroyRef, ElementRef, afterNextRender, computed, inject, input, output, signal } from '@angular/core'
import { INTENTS, INTENT_ORDER, type Intent } from '../../modelos/intents'

interface Nebula {
  intent: Intent
  // Posición base en fracción del lienzo y radio en px
  fx: number
  fy: number
  r: number
  count: number
}

const BASE: Record<Intent, { fx: number; fy: number }> = {
  friend: { fx: 0.2, fy: 0.28 },
  romance: { fx: 0.48, fy: 0.2 },
  plan: { fx: 0.8, fy: 0.3 },
  hobby: { fx: 0.74, fy: 0.68 },
}

/**
 * Héroe de la portada: una constelación viva. El cursor es "tú", un punto que lo sigue
 * con inercia; las cuatro intenciones son nebulosas de su color, del tamaño del número
 * real de personas que las buscan. Arrastrar un hilo de "tú" a una nebulosa (o tocarla)
 * la elige. El equivalente accesible son los botones que pinta la página.
 */
@Component({
  selector: 'app-hero-constellation',
  styleUrl: './hero-constellation.css',
  templateUrl: './hero-constellation.html',
  host: { 'aria-hidden': 'true' },
})
export class HeroConstellation {
  readonly counts = input.required<Record<Intent, number>>()
  readonly active = input<Intent | null>(null)
  readonly chosen = output<Intent>()

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  protected readonly w = signal(1200)
  protected readonly h = signal(800)
  protected readonly me = signal({ x: 600, y: 400 })
  protected readonly thread = signal<{ x: number; y: number } | null>(null)
  protected readonly hover = signal<Intent | null>(null)
  protected readonly knot = signal<Intent | null>(null)
  protected readonly labels = INTENTS
  protected readonly Math = Math

  protected readonly nebulae = computed<(Nebula & { x: number; y: number })[]>(() => {
    const c = this.counts()
    const max = Math.max(...INTENT_ORDER.map((i) => c[i] || 1))
    const unit = Math.min(this.w(), this.h()) * 0.2
    return INTENT_ORDER.map((intent) => {
      const b = BASE[intent]
      const r = unit * (0.45 + 0.55 * Math.sqrt((c[intent] || 1) / max))
      return { intent, fx: b.fx, fy: b.fy, r, count: c[intent] ?? 0, x: b.fx * this.w(), y: b.fy * this.h() }
    })
  })

  // Estrellas de fondo con semilla fija
  protected readonly stars = Array.from({ length: 70 }, (_, i) => {
    const s = Math.sin(i * 91.17) * 43758.5453
    const t = Math.sin(i * 12.9898) * 15731.743
    return { fx: s - Math.floor(s), fy: t - Math.floor(t), r: 0.6 + ((i * 7) % 5) * 0.25 }
  })

  constructor() {
    const destroyRef = inject(DestroyRef)
    afterNextRender(() => {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
      const ro = new ResizeObserver(([e]) => {
        this.w.set(e.contentRect.width)
        this.h.set(e.contentRect.height)
        if (!this.thread()) this.me.set({ x: e.contentRect.width * 0.5, y: e.contentRect.height * 0.46 })
      })
      ro.observe(this.host)

      // "Tú" sigue al cursor con inercia (sin movimiento reducido)
      let target = { ...this.me() }
      let frame = 0
      const tick = () => {
        const m = this.me()
        const nx = m.x + (target.x - m.x) * 0.08
        const ny = m.y + (target.y - m.y) * 0.08
        if (Math.abs(nx - m.x) + Math.abs(ny - m.y) > 0.2) this.me.set({ x: nx, y: ny })
        frame = requestAnimationFrame(tick)
      }
      if (!reduce) frame = requestAnimationFrame(tick)

      const local = (e: PointerEvent) => {
        const r = this.host.getBoundingClientRect()
        return { x: e.clientX - r.left, y: e.clientY - r.top }
      }
      const hit = (p: { x: number; y: number }) => this.nebulae().find((n) => Math.hypot(n.x - p.x, n.y - p.y) < n.r)?.intent ?? null

      const move = (e: PointerEvent) => {
        const p = local(e)
        this.hover.set(hit(p))
        if (this.thread()) this.thread.set(p)
        else if (e.pointerType === 'mouse') target = p
      }
      const down = (e: PointerEvent) => {
        const p = local(e)
        const n = hit(p)
        if (n && e.pointerType !== 'mouse') return this.choose(n)
        this.thread.set(p)
      }
      const up = (e: PointerEvent) => {
        if (!this.thread()) return
        const n = hit(local(e))
        this.thread.set(null)
        if (n) this.choose(n)
      }
      const leave = () => this.hover.set(null)
      this.host.addEventListener('pointermove', move)
      this.host.addEventListener('pointerdown', down)
      this.host.addEventListener('pointerleave', leave)
      addEventListener('pointerup', up)
      destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame)
        ro.disconnect()
        this.host.removeEventListener('pointermove', move)
        this.host.removeEventListener('pointerdown', down)
        this.host.removeEventListener('pointerleave', leave)
        removeEventListener('pointerup', up)
      })
    })
  }

  /** El hilo se tensa hasta la nebulosa, se anuda y avisa la elección. */
  choose(intent: Intent) {
    this.knot.set(intent)
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    setTimeout(() => this.chosen.emit(intent), reduce ? 0 : 650)
  }

  protected target(i: Intent) {
    return this.nebulae().find((n) => n.intent === i)!
  }
}
