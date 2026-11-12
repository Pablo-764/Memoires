import { Component, DestroyRef, afterNextRender, computed, inject, input, signal } from '@angular/core'
import { ASCII, parseLine } from '../../datos/ascii'
import type { Intent } from '../../modelos/intents'

/**
 * Pinta una pieza de arte ASCII con los colores del tema. Los lectores de pantalla
 * reciben solo la descripción ("Ilustración: …"), nunca los símbolos.
 *   mode 'static' muestra el primer cuadro; 'loop' recorre los cuadros en bucle lento;
 *   'grow' los recorre una sola vez; 'hover' cambia al último cuadro al pasar el cursor.
 * Con movimiento reducido se muestra el último cuadro.
 */
@Component({
  selector: 'app-ascii',
  template: `
    <pre class="ascii-pre" aria-hidden="true">@for (line of lines(); track $index) {<span class="ascii-line">@for (seg of line; track $index) {<span [class]="seg.k">{{ seg.t }}</span>}</span>}</pre>
    <span class="sr-only">Ilustración: {{ info().label }}</span>
  `,
  styleUrl: './ascii-art.css',
  host: {
    class: 'ascii',
    '[attr.data-size]': 'size()',
    '[attr.data-intent]': 'intent() ?? info().intent',
    '(pointerenter)': 'hover(true)',
    '(pointerleave)': 'hover(false)',
  },
})
export class AsciiArt {
  readonly piece = input.required<string>()
  readonly intent = input<Intent | null>(null)
  readonly size = input<'sm' | 'md' | 'lg'>('md')
  readonly mode = input<'static' | 'loop' | 'grow' | 'hover'>('static')

  protected readonly info = computed(() => ASCII[this.piece()] ?? ASCII['maceta'])
  private readonly frame = signal<number | null>(null)
  private readonly still = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

  protected readonly lines = computed(() => {
    const frames = this.info().frames
    const i = this.frame() ?? (this.still && this.mode() !== 'static' ? frames.length - 1 : 0)
    return frames[Math.min(i, frames.length - 1)].map(parseLine)
  })

  constructor() {
    let timer = 0
    afterNextRender(() => {
      const n = this.info().frames.length
      const mode = this.mode()
      if (this.still || n < 2 || (mode !== 'loop' && mode !== 'grow')) return
      let i = 0
      timer = window.setInterval(() => {
        i++
        if (mode === 'grow' && i >= n - 1) {
          this.frame.set(n - 1)
          window.clearInterval(timer)
          return
        }
        this.frame.set(i % n)
      }, mode === 'grow' ? 520 : 700)
    })
    inject(DestroyRef).onDestroy(() => window.clearInterval(timer))
  }

  protected hover(on: boolean) {
    if (this.mode() !== 'hover' || this.still) return
    this.frame.set(on ? this.info().frames.length - 1 : 0)
  }
}
