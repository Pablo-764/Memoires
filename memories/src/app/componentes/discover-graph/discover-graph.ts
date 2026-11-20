import { Component, computed, input, output } from '@angular/core'
import type { Intent } from '../../modelos/intents'
import type { Suggestion } from '../../utilidades/matching'

const C = 300
const R_INTEREST = 132
const R_PERSON = 238
const MAX_INTERESTS = 8
const MAX_PEOPLE = 8

interface InterestNode {
  name: string
  x: number
  y: number
  a: number
  lx: number
  ly: number
  anchor: 'start' | 'middle' | 'end'
}

interface PersonNode {
  id: string
  name: string
  initial: string
  intent: Intent
  x: number
  y: number
  lx: number
  ly: number
  anchor: 'start' | 'middle' | 'end'
  links: { x: number; y: number }[]
  label: string
  order: number
}

const TAU = Math.PI * 2
const norm = (a: number) => ((a % TAU) + TAU) % TAU
const anchorFor = (a: number): 'start' | 'middle' | 'end' => {
  const c = Math.cos(a)
  return c > 0.35 ? 'start' : c < -0.35 ? 'end' : 'middle'
}

/** Separa ángulos en un círculo para que ningún par quede más cerca que `gap`. */
function spread(angles: number[], gap: number) {
  const out = angles.map(norm)
  for (let it = 0; it < 60; it++) {
    const idx = out.map((a, i) => ({ a, i })).sort((p, q) => p.a - q.a)
    let moved = false
    for (let k = 0; k < idx.length && idx.length > 1; k++) {
      const p = idx[k]
      const q = idx[(k + 1) % idx.length]
      let d = q.a - p.a
      if (k === idx.length - 1) d += TAU
      if (d < gap) {
        const push = (gap - d) / 2
        out[p.i] = norm(out[p.i] - push)
        out[q.i] = norm(out[q.i] + push)
        moved = true
      }
    }
    if (!moved) break
  }
  return out
}

// Grafo radial de Descubre (idea de la lámina de LinNeo, hecho desde cero):
// tú al centro, tus intereses en anillo y las personas sugeridas afuera, cada una
// unida por hilos a los intereses que comparte contigo.
@Component({
  selector: 'app-discover-graph',
  styleUrl: './discover-graph.css',
  templateUrl: './discover-graph.html',
  host: { class: 'block' },
})
export class DiscoverGraph {
  readonly interests = input.required<string[]>()
  readonly suggestions = input.required<Suggestion[]>()
  readonly selected = input<string | null>(null)
  readonly intentOf = input.required<(s: Suggestion) => Intent>()
  readonly pick = output<string>()

  protected readonly c = C

  protected readonly ring = computed<InterestNode[]>(() => {
    const list = this.interests().slice(0, MAX_INTERESTS)
    return list.map((name, i) => {
      const a = -Math.PI / 2 + (TAU * i) / list.length
      const x = C + Math.cos(a) * R_INTEREST
      const y = C + Math.sin(a) * R_INTEREST
      return { name, a, x, y, lx: C + Math.cos(a) * (R_INTEREST + 18), ly: C + Math.sin(a) * (R_INTEREST + 18) + 4, anchor: anchorFor(a) }
    })
  })

  protected readonly people = computed<PersonNode[]>(() => {
    const ring = this.ring()
    const list = this.suggestions().slice(0, MAX_PEOPLE)
    if (!list.length) return []
    const byName = new Map(ring.map((n) => [n.name, n]))
    // Ángulo deseado: el promedio circular de sus intereses en común
    const desired = list.map((s, i) => {
      const nodes = s.sharedInterests.map((n) => byName.get(n)).filter((n): n is InterestNode => !!n)
      if (!nodes.length) return -Math.PI / 2 + (TAU * (i + 0.5)) / list.length
      const sx = nodes.reduce((t, n) => t + Math.cos(n.a), 0)
      const sy = nodes.reduce((t, n) => t + Math.sin(n.a), 0)
      return Math.atan2(sy, sx)
    })
    const angles = spread(desired, Math.min(TAU / list.length, 0.62) * 0.92)
    return list.map((s, i) => {
      const a = angles[i]
      const x = C + Math.cos(a) * R_PERSON
      const y = C + Math.sin(a) * R_PERSON
      const links = s.sharedInterests.map((n) => byName.get(n)).filter((n): n is InterestNode => !!n).map((n) => ({ x: n.x, y: n.y }))
      const shared = s.sharedInterests.slice(0, 3).join(', ')
      return {
        id: s.person.id,
        name: s.person.name,
        initial: s.person.name[0],
        intent: this.intentOf()(s),
        x,
        y,
        lx: C + Math.cos(a) * (R_PERSON + 30),
        ly: C + Math.sin(a) * (R_PERSON + 30) + 5,
        anchor: anchorFor(a),
        links: links.length ? links : [{ x: C, y: C }],
        label: `${s.person.name}, ${s.person.age}${shared ? `. Comparten ${shared}` : ''}`,
        order: i,
      }
    })
  })

  protected onKey(e: KeyboardEvent, id: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this.pick.emit(id)
    }
  }
}
