import { Component, DestroyRef, ElementRef, afterNextRender, inject, input } from '@angular/core'

// Trazos a mano: uno corto y ondulado para unir dos avatares y uno largo que baja por una sección
const PATHS = {
  short: 'M3 22c14-15 26 9 40-2s22-14 34 2 20 12 34-2 22-10 36 3',
  long: 'M30 4c-26 60 30 92 4 160s-30 110 10 170 34 120-8 190-20 120 16 176',
  wide: 'M4 30 c50 -15 93 15 143 2 c44 -18 81 18 125 -2 c43 -18 81 18 124 -6 c53 -15 98 15 150 -5 c52 -21 97 21 150 -5 c47 -19 88 19 136 5 c56 -17 104 17 160 6 c43 -21 80 21 123 -3 c46 -15 85 15 130 -2 c62 -15 115 15 177 1 c58 -17 107 17 165 1 c44 -14 81 14 124 -4 c59 -17 109 17 168 -2 c56 -18 105 18 161 -2 c61 -20 114 20 176 -3',
}

const BOXES = { short: '0 0 150 32', long: '0 0 60 700', wide: '0 0 2100 50' }

/**
 * Hilo que une a dos personas. Se dibuja solo la primera vez que entra en pantalla;
 * su color es el de la intención activa (--intent-c) o el acento del tema.
 */
@Component({
  selector: 'app-thread',
  template: `
    <svg [attr.viewBox]="boxes[variant()]" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path [attr.d]="paths[variant()]" pathLength="1" />
    </svg>
  `,
  styleUrl: './thread.css',
  host: {
    '[attr.data-variant]': 'variant()',
    '[class.is-linked]': 'progress() !== null',
    '[style.--left]': 'progress() === null ? null : 1 - progress()!',
  },
})
export class Thread {
  readonly variant = input<'short' | 'long' | 'wide'>('short')
  // Si se pasa, el trazo sigue este avance (0 a 1) en vez de dibujarse solo
  readonly progress = input<number | null>(null)
  protected readonly paths = PATHS
  protected readonly boxes = BOXES

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
    if (typeof IntersectionObserver === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-drawn')
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.classList.add('is-drawn')
        observer.disconnect()
      },
      { threshold: 0.4 },
    )
    afterNextRender(() => observer.observe(el))
    inject(DestroyRef).onDestroy(() => observer.disconnect())
  }
}
