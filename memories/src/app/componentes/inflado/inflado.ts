import { Component, DestroyRef, ElementRef, afterNextRender, computed, effect, inject, input, untracked, viewChild } from '@angular/core'
import type { Intent } from '../../modelos/intents'
import { LABELS, SHAPE_BY_INTENT, phrasesFor } from '../../datos/inflados'
import { InfladoRenderer, parseColor, type InfladoColors } from '../../utilidades/inflado-render'
import { ThemeService } from '../../servicios/theme'

const TURN_MS = 11000
const FILL_MS = 2000
const SWAY_MS = 9000
const STILL_ANGLE = 0.35

/**
 * Objeto inflado cubierto de texto, dibujado con letras (ASCII): cada celda muestra la letra de las
 * frases que cae en ese punto de la superficie, así se lee entero. Al aparecer, las frases se escriben hasta llenarlo;
 * luego gira despacio (al pasar el cursor se frena). Al cambiar de intención se desinfla,
 * cambia de forma y se vuelve a llenar. Con movimiento reducido o en equipos modestos
 * se muestra un cuadro fijo, ya lleno y girado unos 20°.
 */
@Component({
  selector: 'app-inflado',
  template: `<canvas
    #cv
    [attr.role]="decorative() ? null : 'img'"
    [attr.aria-label]="decorative() ? null : label()"
    [attr.aria-hidden]="decorative() || null"
  ></canvas>`,
  styles: `
    :host { display: block; aspect-ratio: 1; }
    canvas { display: block; width: 100%; height: 100%; }
  `,
  host: {
    '[attr.data-intent]': 'intent()',
    '(pointerenter)': 'hover = true',
    '(pointerleave)': 'hover = false',
  },
})
export class Inflado {
  readonly intent = input.required<Intent>()
  // Frases propias (por ejemplo, el nombre de la persona); si no, las de la intención
  readonly phrases = input<string[] | null>(null)
  readonly interests = input<string[]>([])
  // fill: se llena y gira; spin: gira ya lleno; still: cuadro fijo
  readonly mode = input<'fill' | 'spin' | 'still'>('fill')
  // Vueltas después de llenarse (Infinity = sin fin)
  readonly turns = input(Number.POSITIVE_INFINITY)
  // Colores propios (coleccionables); si no, los del tema
  readonly colors = input<Partial<InfladoColors> | null>(null)
  readonly decorative = input(false)
  readonly res = input(240)
  // ascii: letras legibles (por defecto); cromo: el globo liso con el texto como textura
  readonly look = input<'ascii' | 'cromo'>('ascii')
  // Palabras que van en su propio color (siempre "Arleth")
  readonly special = input<string[]>(['Arleth'])

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('cv')
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private readonly theme = inject(ThemeService)

  protected hover = false
  protected readonly list = computed(() => this.phrases() ?? phrasesFor(this.intent(), this.interests()))
  protected readonly label = computed(() => LABELS[this.intent()](this.list().length))

  private renderer: InfladoRenderer | null = null
  private still = false
  private draw = () => undefined as void

  constructor() {
    const destroyRef = inject(DestroyRef)

    afterNextRender(() => {
      const nav = navigator as Navigator & { connection?: { saveData?: boolean } }
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
      const modest = (navigator.hardwareConcurrency ?? 8) <= 4 || !!nav.connection?.saveData
      this.still = this.mode() === 'still' || reduce || modest
      const ascii = this.look() === 'ascii'
      const view = this.canvas().nativeElement
      // En ASCII la geometría se calcula aparte y las letras se pintan en el canvas visible
      const geo = ascii ? (typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(1, 1) : document.createElement('canvas')) : view
      const r = new InfladoRenderer(geo, this.res())
      this.renderer = r
      r.setShape(SHAPE_BY_INTENT[this.intent()])
      r.setPhrases(this.list())
      this.readColors()

      let angle = this.still ? (ascii ? 0.12 : STILL_ANGLE) : ascii ? 0 : -0.5
      let phase = 0
      let fill = this.still || this.mode() === 'spin' ? 1 : 0
      let inflate = 1
      let spun = 0
      let last = 0
      let frame = 0
      let visible = true
      // Cambio de forma en curso: 0 → 1 (desinflar y volver a inflar)
      let morph = -1
      let pending: { shape: Intent; list: string[] } | null = null

      const vctx = view.getContext('2d')!
      let w = 0
      const size = () => {
        const dpr = Math.min(2, devicePixelRatio || 1)
        w = Math.max(80, this.host.clientWidth)
        view.width = Math.round(w * dpr)
        view.height = Math.round(w * dpr)
        vctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      if (ascii) size()
      const paint = () => {
        if (!ascii) return r.render(angle, fill, inflate)
        const cell = Math.max(8, Math.min(15, w / 32))
        r.paintAscii(vctx, w, cell, angle, fill, inflate, this.palette, this.special())
      }
      this.draw = paint

      const tick = (now: number) => {
        frame = 0
        if (!visible || document.hidden) return
        const dt = last ? Math.min(100, now - last) : 16
        if (now - last < 32) {
          frame = requestAnimationFrame(tick)
          return
        }
        last = now
        if (morph >= 0) {
          morph += dt / 600
          if (morph < 0.37) inflate = 1 - morph / 0.37
          else {
            if (pending) {
              r.setShape(SHAPE_BY_INTENT[pending.shape])
              r.setPhrases(pending.list)
              pending = null
              fill = 0.15
            }
            inflate = Math.min(1, (morph - 0.37) / 0.63)
            fill = Math.min(1, 0.15 + (morph - 0.37) * 1.4)
          }
          if (morph >= 1) {
            morph = -1
            inflate = 1
            fill = 1
          }
        } else if (fill < 1) {
          fill = Math.min(1, fill + dt / FILL_MS)
        }
        if (ascii) {
          // En letras se mece en lugar de girar completo, para que el texto siga legible
          phase += ((Math.PI * 2) / SWAY_MS) * dt * (this.hover ? 0.2 : 1)
          angle = Math.sin(phase) * 0.38
        } else if (spun < this.turns()) {
          const step = ((Math.PI * 2) / TURN_MS) * dt * (this.hover ? 0.2 : 1)
          angle += step
          spun += step / (Math.PI * 2)
        } else {
          // Termina de girar y se queda de frente, un poco ladeado
          const target = Math.round(angle / (Math.PI * 2)) * Math.PI * 2 + STILL_ANGLE
          angle += (target - angle) * 0.12
        }
        paint()
        frame = requestAnimationFrame(tick)
      }
      const start = () => {
        if (!frame && !this.still) frame = requestAnimationFrame(tick)
      }

      // Cambia de intención: desinfla, cambia de forma y se vuelve a llenar
      this.change = (shape: Intent, list: string[]) => {
        if (this.still) {
          r.setShape(SHAPE_BY_INTENT[shape])
          r.setPhrases(list)
          paint()
          return
        }
        pending = { shape, list }
        morph = 0
        start()
      }

      paint()
      start()
      // El texto se vuelve a pintar cuando ya cargó Space Mono
      document.fonts?.load('700 12px "Space Mono"').then(() => {
        r.setPhrases(untracked(this.list))
        paint()
      }, () => undefined)

      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting
        if (visible) {
          last = 0
          start()
        }
      })
      io.observe(this.host)
      const ro = new ResizeObserver(() => {
        if (!ascii || Math.abs(this.host.clientWidth - w) < 2) return
        size()
        paint()
      })
      ro.observe(this.host)
      const onVis = () => {
        if (!document.hidden) {
          last = 0
          start()
        }
      }
      document.addEventListener('visibilitychange', onVis)
      destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame)
        io.disconnect()
        ro.disconnect()
        document.removeEventListener('visibilitychange', onVis)
      })
    })

    // Intención o frases nuevas
    let first = true
    effect(() => {
      const intent = this.intent()
      const list = this.list()
      if (first) {
        first = false
        return
      }
      untracked(() => this.change(intent, list))
    })

    // El cromo se vuelve a armar con los colores del tema
    effect(() => {
      this.theme.mode()
      this.colors()
      untracked(() => {
        if (!this.renderer) return
        // La clase del tema ya cambió; se lee en el siguiente cuadro
        requestAnimationFrame(() => {
          this.readColors()
          this.draw()
        })
      })
    })
  }

  private change: (shape: Intent, list: string[]) => void = () => undefined

  // Colores de las letras: sombra, luz, palabras especiales y celdas aún sin escribir
  private palette = { dark: '#2e1f46', light: '#6e3ead', special: '#93506c', empty: '#8b7e6d' }

  private readColors() {
    const css = getComputedStyle(this.host)
    const v = (name: string) => css.getPropertyValue(name).trim()
    const dark = document.documentElement.classList.contains('dark')
    const own = this.colors() ?? {}
    const intent = v('--intent-c') || v('--color-accent')
    // En el oscuro el cuerpo es claro (naranja y durazno): el texto de la intención se oscurece para leerse
    let text = intent
    if (dark) {
      const ctx = document.createElement('canvas').getContext('2d')!
      const [r, g, b] = parseColor(ctx, intent)
      const [r2, g2, b2] = parseColor(ctx, v('--color-on-accent'))
      text = `rgb(${Math.round(r * 0.45 + r2 * 0.55)} ${Math.round(g * 0.45 + g2 * 0.55)} ${Math.round(b * 0.45 + b2 * 0.55)})`
    }
    const own2 = this.colors()
    this.palette = own2
      ? { dark: own2.body1 ?? '#333', light: own2.body0 ?? '#999', special: own2.text ?? '#000', empty: own2.body0 ?? '#999' }
      : dark
        ? { dark: v('--color-accent'), light: v('--color-ink'), special: v('--color-romance'), empty: v('--color-line-strong') }
        : { dark: v('--color-ink'), light: v('--color-accent'), special: v('--color-romance'), empty: v('--color-line-strong') }
    this.renderer?.setColors({
      body0: own.body0 ?? (dark ? v('--color-ink-soft') : v('--color-lila')),
      body1: own.body1 ?? v('--color-accent'),
      rim: own.rim ?? (dark ? v('--color-accent-hover') : v('--color-surface')),
      text: own.text ?? text,
    })
  }
}
