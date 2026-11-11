import { DOCUMENT, Injectable, inject } from '@angular/core'

// Lo que atrae un poco al cursor, como un imán
const MAGNETIC = '.btn-primary, .glass-icon, [data-magnetic]'
// Lo que recibe un brillo que sigue al cursor
const SPOT = '.card, .size-tile, .spot'

/** Interacciones de cursor para toda la app: brillo en tarjetas y botones que se inclinan hacia el puntero. */
@Injectable({ providedIn: 'root' })
export class HoverFx {
  private magnet: HTMLElement | null = null
  private frame = 0
  private last: PointerEvent | null = null

  constructor() {
    const doc = inject(DOCUMENT)
    const win = doc.defaultView
    if (!win?.matchMedia) return
    const fine = win.matchMedia('(hover: hover) and (pointer: fine)')
    const still = win.matchMedia('(prefers-reduced-motion: reduce)')

    win.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType !== 'mouse' || !fine.matches) return
        this.last = e
        if (!this.frame) this.frame = win.requestAnimationFrame(() => this.apply(still.matches))
      },
      { passive: true },
    )
    doc.documentElement.addEventListener('pointerleave', () => this.release())
  }

  private apply(reduced: boolean) {
    this.frame = 0
    const e = this.last
    const t = e?.target
    if (!e || !(t instanceof Element)) return

    const spot = t.closest<HTMLElement>(SPOT)
    if (spot) {
      const r = spot.getBoundingClientRect()
      spot.style.setProperty('--cx', `${(e.clientX - r.left).toFixed(0)}px`)
      spot.style.setProperty('--cy', `${(e.clientY - r.top).toFixed(0)}px`)
    }

    const magnet = reduced ? null : t.closest<HTMLElement>(MAGNETIC)
    if (magnet !== this.magnet) this.release()
    this.magnet = magnet
    if (magnet && !(magnet as HTMLButtonElement).disabled) {
      const r = magnet.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height
      magnet.style.translate = `${(dx * 7).toFixed(1)}px ${(dy * 5).toFixed(1)}px`
    }
  }

  private release() {
    if (this.magnet) this.magnet.style.translate = ''
    this.magnet = null
  }
}
