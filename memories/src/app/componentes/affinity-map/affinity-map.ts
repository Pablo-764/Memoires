import { Component, DestroyRef, ElementRef, afterNextRender, computed, inject, input, output, signal } from '@angular/core'
import { INTENTS, INTENT_ORDER, type Intent } from '../../modelos/intents'
import type { Suggestion } from '../../utilidades/matching'

const MAX = 12
const GOLDEN = Math.PI * (3 - Math.sqrt(5))

export interface Leaving {
  id: string
  kind: 'like' | 'pass'
}

interface MapNode {
  id: string
  name: string
  age: number
  intent: Intent
  shared: string[]
  x: number
  y: number
  r: number
  angle: number
  label: string
}

/**
 * Mapa de afinidad de Descubre: tú al centro y cada persona a una distancia que depende
 * de cuánto comparten (más cerca, más afinidad); el tamaño del nodo es cuántas
 * intenciones coinciden. Alrededor de ti, el dial de intenciones filtra. Al pasar el
 * cursor o enfocar un nodo, los intereses en común se dibujan como hilos.
 */
@Component({
  selector: 'app-affinity-map',
  styleUrl: './affinity-map.css',
  templateUrl: './affinity-map.html',
  host: { class: 'block' },
})
export class AffinityMap {
  readonly suggestions = input.required<Suggestion[]>()
  readonly selected = input<string | null>(null)
  readonly intentOf = input.required<(s: Suggestion) => Intent>()
  readonly myIntents = input.required<Intent[]>()
  readonly filter = input<Intent | 'any'>('any')
  readonly leaving = input<Leaving | null>(null)
  readonly pick = output<string>()
  readonly filterChange = output<Intent | 'any'>()

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  protected readonly w = signal(900)
  protected readonly h = signal(640)
  protected readonly hover = signal<string | null>(null)
  protected readonly intents = INTENTS
  protected readonly cx = computed(() => this.w() / 2)
  protected readonly cy = computed(() => this.h() / 2)
  protected readonly dialR = 64
  protected readonly Math = Math

  protected readonly nodes = computed<MapNode[]>(() => {
    const list = this.suggestions().slice(0, MAX)
    const max = Math.max(1, ...list.map((s) => s.score))
    const rMin = this.dialR + 70
    const rMax = Math.max(rMin + 60, Math.min(this.w(), this.h()) / 2 - 58)
    return list.map((s, i) => {
      const aff = s.score / max
      const d = rMax - aff * (rMax - rMin)
      const angle = -Math.PI / 2 + i * GOLDEN
      const shared = s.sharedInterests
      return {
        id: s.person.id,
        name: s.person.name,
        age: s.person.age,
        intent: this.intentOf()(s),
        shared,
        x: this.cx() + Math.cos(angle) * d,
        y: this.cy() + Math.sin(angle) * d,
        r: 13 + s.sharedIntents.length * 5,
        angle,
        label: `${s.person.name}, ${s.person.age}. ${shared.length ? 'Comparten ' + shared.slice(0, 3).join(', ') : 'Buscan lo mismo'}`,
      }
    })
  })

  // Posición en pantalla: la elegida se acerca a ti; al decidir, se anuda o se aleja
  protected place(n: MapNode) {
    const l = this.leaving()
    const near = this.dialR + 104
    if (l?.id === n.id) {
      const d = l.kind === 'like' ? this.dialR - 4 : Math.max(this.w(), this.h())
      return { x: this.cx() + Math.cos(n.angle) * d, y: this.cy() + Math.sin(n.angle) * d, s: l.kind === 'like' ? 0.55 : 0.6, o: l.kind === 'like' ? 1 : 0 }
    }
    if (this.selected() === n.id) return { x: this.cx() + Math.cos(n.angle) * near, y: this.cy() + Math.sin(n.angle) * near, s: 1.2, o: 1 }
    return { x: n.x, y: n.y, s: 1, o: 1 }
  }

  // Hilos con los intereses en común: de la persona enfocada (o la elegida)
  protected readonly threadFor = computed(() => {
    const id = this.hover() ?? this.selected()
    return this.nodes().find((n) => n.id === id) ?? null
  })

  // Dial: un arco por intención alrededor de ti
  protected readonly arcs = computed(() =>
    INTENT_ORDER.map((intent, i) => {
      const gap = 0.12
      const a0 = -Math.PI / 2 + (i * Math.PI) / 2 + gap
      const a1 = a0 + Math.PI / 2 - gap * 2
      const r = this.dialR
      const p = (a: number) => `${(this.cx() + Math.cos(a) * r).toFixed(1)} ${(this.cy() + Math.sin(a) * r).toFixed(1)}`
      const mid = (a0 + a1) / 2
      return {
        intent,
        d: `M ${p(a0)} A ${r} ${r} 0 0 1 ${p(a1)}`,
        lx: this.cx() + Math.cos(mid) * (r + 22),
        ly: this.cy() + Math.sin(mid) * (r + 22) + 4,
        enabled: this.myIntents().includes(intent),
      }
    }),
  )

  constructor() {
    const destroyRef = inject(DestroyRef)
    afterNextRender(() => {
      const ro = new ResizeObserver(([e]) => {
        this.w.set(Math.max(320, e.contentRect.width))
        this.h.set(Math.max(320, e.contentRect.height))
      })
      ro.observe(this.host)
      destroyRef.onDestroy(() => ro.disconnect())
    })
  }

  protected key(e: KeyboardEvent, run: () => void) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      run()
    }
  }

  protected point(n: MapNode, t: number) {
    const p = this.place(n)
    return { x: this.cx() + (p.x - this.cx()) * t, y: this.cy() + (p.y - this.cy()) * t }
  }
}
