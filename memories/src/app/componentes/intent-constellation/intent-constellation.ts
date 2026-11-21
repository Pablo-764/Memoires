import { Component, computed, input } from '@angular/core'
import { INTENTS, INTENT_ORDER, type Intent } from '../../modelos/intents'

interface Node {
  intent: Intent
  x: number
  y: number
  people: { x: number; y: number }[]
}

// Azar con semilla: la constelación sale igual en cada visita
function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const C = 200
const NODES: Node[] = (() => {
  const rnd = seeded(7)
  return INTENT_ORDER.map((intent, i) => {
    const a = -Math.PI / 2 + (Math.PI * 2 * i) / 4 + Math.PI / 4
    const x = C + Math.cos(a) * 112
    const y = C + Math.sin(a) * 112
    const people = Array.from({ length: 4 }, (_, k) => {
      const b = a + (k - 1.5) * 0.24 + (rnd() - 0.5) * 0.1
      const r = 46 + rnd() * 28
      return { x: x + Math.cos(b) * r, y: y + Math.sin(b) * r }
    })
    return { intent, x, y, people }
  })
})()

// Constelación de la portada: tú al centro (el punto de la É), las cuatro
// intenciones alrededor y personas en cada una. La intención activa se enciende.
@Component({
  selector: 'app-intent-constellation',
  styleUrl: './intent-constellation.css',
  templateUrl: './intent-constellation.html',
  host: { role: 'img', '[attr.aria-label]': 'label()' },
})
export class IntentConstellation {
  readonly active = input<Intent | null>(null)

  protected readonly nodes = NODES
  protected readonly c = C
  protected readonly intents = INTENTS
  protected readonly label = computed(() => {
    const a = this.active()
    return a
      ? `Tú al centro, unido por un hilo a las personas que buscan ${INTENTS[a].label.toLowerCase()}.`
      : 'Tú al centro, unido por hilos a pareja, amistad, un plan y un pasatiempo.'
  })
}
