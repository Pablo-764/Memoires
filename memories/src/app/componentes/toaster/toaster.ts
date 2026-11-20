import { Component, effect, inject, signal } from '@angular/core'
import { AppStore } from '../../servicios/app-store'

interface Anchor {
  x: number
  y: number
}

/**
 * Confirmaciones en el lugar de la acción: si el aviso llega justo después de tocar
 * un botón, aparece encima de ese botón como "Listo" en vez de abajo de la pantalla.
 * Los errores, o lo que no viene de un toque, se quedan como aviso inferior.
 */
@Component({
  selector: 'app-toaster',
  styleUrl: './toaster.css',
  templateUrl: './toaster.html',
  host: { '(document:pointerdown)': 'remember($event)', '(document:keydown.enter)': 'remember($event)' },
})
export class Toaster {
  protected readonly store = inject(AppStore)
  protected readonly anchors = signal<Record<number, Anchor>>({})
  private last: { el: Element; at: number } | null = null

  constructor() {
    effect(() => {
      const known = this.anchors()
      const fresh = this.store.toasts().filter((t) => !(t.id in known))
      if (!fresh.length) return
      const next = { ...known }
      for (const t of fresh) {
        const el = this.last && performance.now() - this.last.at < 2500 && t.tone !== 'danger' ? this.last.el : null
        const r = el?.isConnected ? el.getBoundingClientRect() : null
        if (r && r.width) next[t.id] = { x: Math.min(Math.max(r.left + r.width / 2, 120), innerWidth - 120), y: Math.max(r.top - 10, 60) }
        else next[t.id] = { x: -1, y: -1 }
      }
      this.anchors.set(next)
    })
  }

  protected remember(e: Event) {
    const el = (e.target as Element | null)?.closest?.('button, a, [role="button"]')
    if (el) this.last = { el, at: performance.now() }
  }
}
