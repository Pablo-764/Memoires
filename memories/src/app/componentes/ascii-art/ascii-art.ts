import { Component, DestroyRef, afterNextRender, computed, inject, input, signal } from '@angular/core'
import { ASCII, parseLine } from '../../datos/ascii'
import type { Intent } from '../../modelos/intents'

/**
 * Pinta una pieza de arte ASCII con los colores del tema. Los lectores de pantalla
 * reciben solo la descripción ("Ilustración: …"), nunca los símbolos.
 *   mode 'static' muestra el primer cuadro; 'loop' recorre los cuadros en bucle lento;
 *   'grow' los recorre una sola vez; 'hover' cambia al último cuadro al pasar el cursor;
 *   'decode' escribe el dibujo carácter por carácter: cada uno pasa por . : + * y se fija.
 * Con movimiento reducido se muestra el último cuadro.
 */
const SCRAMBLE = '.:+*'

@Component({
  selector: 'app-ascii',
  template: `
    <pre class="ascii-pre" aria-hidden="true">@for (line of lines(); track $index) {<span class="ascii-line">@for (seg of line; track $index) {<span [class]="seg.k">{{ seg.t }}</span>}</span>}</pre>
    @if (!decorative()) {
      <span class="sr-only">Ilustración: {{ info().label }}</span>
    }
  `,
  styleUrl: './ascii-art.css',
  host: {
    class: 'ascii',
    '[attr.data-size]': 'size()',
    '[attr.data-intent]': 'intent() ?? info().intent',
    '[attr.aria-hidden]': 'decorative() || null',
    '(pointerenter)': 'hover(true)',
    '(pointerleave)': 'hover(false)',
  },
})
export class AsciiArt {
  readonly piece = input.required<string>()
  readonly intent = input<Intent | null>(null)
  readonly size = input<'sm' | 'md' | 'lg'>('md')
  readonly mode = input<'static' | 'loop' | 'grow' | 'hover' | 'decode'>('static')
  // Adorno junto a un texto que ya lo dice: no se describe
  readonly decorative = input(false)

  protected readonly info = computed(() => ASCII[this.piece()] ?? ASCII['maceta'])
  private readonly frame = signal<number | null>(null)
  private readonly still = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

  // Avance del modo decodificar (cuántos caracteres van); null = completo
  private readonly decoded = signal<number | null>(null)

  protected readonly lines = computed(() => {
    const frames = this.info().frames
    const i = this.frame() ?? (this.still && this.mode() !== 'static' && this.mode() !== 'decode' ? frames.length - 1 : 0)
    const lines = frames[Math.min(i, frames.length - 1)].map(parseLine)
    const step = this.decoded()
    if (step === null) return lines
    // En el orden del trazo (de arriba abajo, de izquierda a derecha)
    let k = 0
    return lines.map((segs) =>
      segs.map((seg) => ({
        ...seg,
        t: [...seg.t]
          .map((ch) => {
            if (ch === ' ') return ch
            const age = step - k++
            return age >= SCRAMBLE.length ? ch : age >= 0 ? SCRAMBLE[age] : ' '
          })
          .join(''),
      })),
    )
  })

  constructor() {
    let timer = 0
    afterNextRender(() => {
      const n = this.info().frames.length
      const mode = this.mode()
      if (mode === 'decode' && !this.still) {
        const total = this.info().frames[0].join('').replace(/[\s{}«»]/g, '').length
        const per = Math.max(1, Math.ceil(total / 45))
        let step = 0
        this.decoded.set(0)
        timer = window.setInterval(() => {
          step += per
          if (step >= total + SCRAMBLE.length) {
            this.decoded.set(null)
            window.clearInterval(timer)
            return
          }
          this.decoded.set(step)
        }, 28)
        return
      }
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
