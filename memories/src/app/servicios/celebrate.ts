import { Injectable } from '@angular/core'
import type { Intent } from '../modelos/intents'

export type CelebrationTheme = Intent | 'pass' | 'block' | 'report' | 'save' | 'grand' | 'lucidite' | 'send' | 'wellbeing' | 'welcome'

const INTENTS: Intent[] = ['romance', 'friend', 'plan', 'hobby']
const SVG = 'http://www.w3.org/2000/svg'
const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)'
const EASE_IN_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)'
const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

/** Tinta de cada celebración, leída de los tokens (nunca colores sueltos). */
function inkOf(theme: CelebrationTheme) {
  const css = getComputedStyle(document.documentElement)
  const v = (name: string) => css.getPropertyValue(name).trim()
  if ((INTENTS as string[]).includes(theme)) return v(`--${theme}-tint`)
  if (theme === 'lucidite' || theme === 'grand') return v('--color-lila')
  if (theme === 'block' || theme === 'report') return v('--color-danger')
  if (theme === 'pass') return v('--color-ink-3')
  if (theme === 'wellbeing') return v('--hobby-tint')
  return v('--tint')
}

/**
 * Microinteracciones de mémoires (dis-071 y dis-059):
 * - Gigante (conexión): dos hilos llegan desde los lados, se anudan al centro y el
 *   nudo vuela a Conexiones; el ícono de Conexiones rebota al recibirlo.
 * - Desde un elemento: una pequeña constelación de puntos y hilos sale del botón.
 * - Seguridad (bloquear, reportar): el sello cae y se asienta.
 * Con movimiento reducido todo pasa a un desvanecido breve.
 */
@Injectable({ providedIn: 'root' })
export class Celebrate {
  private readonly reduce = window.matchMedia('(prefers-reduced-motion: reduce)')

  play(theme: CelebrationTheme, opts: { at?: Element | null; giant?: boolean } = {}): Promise<void> {
    const ink = inkOf(theme)
    const layer = document.createElement('div')
    layer.setAttribute('aria-hidden', 'true')
    layer.style.cssText = 'position:fixed;inset:0;z-index:70;overflow:hidden;pointer-events:none'
    document.body.append(layer)
    const done = (anims: Animation[]) => Promise.allSettled(anims.map((a) => a.finished)).then(() => layer.remove())

    if (this.reduce.matches) {
      const veil = this.veil(layer, ink, 0.18)
      return done([veil.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], { duration: opts.giant ? 600 : 240 })]).then(() => undefined)
    }

    if (opts.giant && theme === 'wellbeing') return done(this.breathe(layer, ink)).then(() => undefined)
    if (opts.giant) {
      const knot = this.knot(layer, ink)
      const flies = (INTENTS as string[]).includes(theme)
      return done(knot).then(() => (flies ? this.flyToConnections(ink) : undefined))
    }
    if (theme === 'block' || theme === 'report') return done(this.stamp(layer, ink)).then(() => undefined)
    const origin = opts.at?.getBoundingClientRect() ?? new DOMRect(innerWidth / 2 - 20, innerHeight - 120, 40, 40)
    return done(this.spark(layer, ink, origin, theme === 'pass' ? 5 : 8)).then(() => undefined)
  }

  private veil(layer: HTMLElement, ink: string, alpha: number) {
    const veil = document.createElement('div')
    veil.style.cssText = `position:absolute;inset:0;background:color-mix(in oklab, ${ink} ${alpha * 100}%, transparent)`
    layer.append(veil)
    return veil
  }

  /** Momento firma de "conectar": dos hilos se anudan al centro. */
  private knot(layer: HTMLElement, ink: string) {
    const veil = this.veil(layer, ink, 0.12)
    const w = innerWidth
    const h = innerHeight
    const cx = w / 2
    const cy = h / 2
    const r = Math.min(w, h) * 0.07
    const svg = document.createElementNS(SVG, 'svg')
    svg.setAttribute('width', String(w))
    svg.setAttribute('height', String(h))
    svg.style.cssText = 'position:absolute;inset:0'
    const thread = (d: string) => {
      const p = document.createElementNS(SVG, 'path')
      p.setAttribute('d', d)
      p.setAttribute('fill', 'none')
      p.setAttribute('stroke', ink)
      p.setAttribute('stroke-width', '4')
      p.setAttribute('stroke-linecap', 'round')
      p.setAttribute('pathLength', '1')
      p.style.strokeDasharray = '1'
      p.style.strokeDashoffset = '1'
      svg.append(p)
      return p
    }
    // Cada hilo entra por un lado, da una vuelta alrededor del centro y se cruza con el otro
    const left = thread(`M -20 ${cy + r * 2} C ${cx * 0.5} ${cy + r * 2}, ${cx - r * 2} ${cy - r * 1.6}, ${cx} ${cy - r} S ${cx + r * 1.4} ${cy + r * 1.2}, ${cx + r * 0.2} ${cy + r * 0.4}`)
    const right = thread(`M ${w + 20} ${cy - r * 2} C ${cx * 1.5} ${cy - r * 2}, ${cx + r * 2} ${cy + r * 1.6}, ${cx} ${cy + r} S ${cx - r * 1.4} ${cy - r * 1.2}, ${cx - r * 0.2} ${cy - r * 0.4}`)
    const dot = document.createElementNS(SVG, 'circle')
    dot.setAttribute('cx', String(cx))
    dot.setAttribute('cy', String(cy))
    dot.setAttribute('r', String(r * 0.55))
    dot.setAttribute('fill', ink)
    dot.style.transformOrigin = `${cx}px ${cy}px`
    svg.append(dot)
    layer.append(svg)

    const draw = { duration: 650, easing: EASE_IN_OUT, fill: 'forwards' as const }
    return [
      veil.animate([{ opacity: 0 }, { opacity: 1, offset: 0.2 }, { opacity: 1, offset: 0.75 }, { opacity: 0 }], { duration: 1250, fill: 'forwards' }),
      left.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], draw),
      right.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { ...draw, delay: 60 }),
      svg.animate([{ opacity: 1 }, { opacity: 1, offset: 0.75 }, { opacity: 0 }], { duration: 1250, fill: 'forwards' }),
      dot.animate(
        [
          { transform: 'scale(0)', offset: 0 },
          { transform: 'scale(0)', offset: 0.48 },
          { transform: 'scale(1.25)', offset: 0.62, easing: SPRING },
          { transform: 'scale(1)', offset: 0.75 },
          { transform: 'scale(0.4)' },
        ],
        { duration: 1250, fill: 'forwards' },
      ),
    ]
  }

  /** El nudo vuela hasta Conexiones (FLIP sin clonar: un punto que viaja) y el ícono rebota. */
  private flyToConnections(ink: string): Promise<void> {
    const target = [...document.querySelectorAll<HTMLElement>('a[href="/app/conexiones"]')].find((a) => a.getBoundingClientRect().width > 0)
    if (!target) return Promise.resolve()
    const to = target.getBoundingClientRect()
    const size = 22
    const dot = document.createElement('div')
    dot.setAttribute('aria-hidden', 'true')
    dot.style.cssText = `position:fixed;left:0;top:0;z-index:71;width:${size}px;height:${size}px;border-radius:50%;background:${ink};pointer-events:none`
    document.body.append(dot)
    const fx = innerWidth / 2 - size / 2
    const fy = innerHeight / 2 - size / 2
    const tx = to.left + to.width / 2 - size / 2
    const ty = to.top + to.height / 2 - size / 2
    const mx = (fx + tx) / 2
    const my = Math.min(fy, ty) - 80
    const fly = dot.animate(
      [
        { transform: `translate(${fx}px, ${fy}px) scale(1)` },
        { transform: `translate(${mx}px, ${my}px) scale(0.9)`, offset: 0.5 },
        { transform: `translate(${tx}px, ${ty}px) scale(0.4)`, opacity: 0.6 },
      ],
      { duration: 520, easing: EASE_IN_OUT, fill: 'forwards' },
    )
    return fly.finished.then(() => {
      dot.remove()
      const icon = target.querySelector<HTMLElement>('app-icon') ?? target
      icon.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35)', offset: 0.35 }, { transform: 'scale(0.92)', offset: 0.65 }, { transform: 'scale(1)' }], {
        duration: 420,
        easing: 'ease-out',
      })
    })
  }

  /** Pequeña constelación que sale de un botón: puntos unidos por hilos. */
  private spark(layer: HTMLElement, ink: string, origin: DOMRect, count: number) {
    const ox = origin.left + origin.width / 2
    const oy = origin.top + origin.height / 2
    const w = innerWidth
    const h = innerHeight
    const svg = document.createElementNS(SVG, 'svg')
    svg.setAttribute('width', String(w))
    svg.setAttribute('height', String(h))
    svg.style.cssText = 'position:absolute;inset:0;overflow:visible'
    layer.append(svg)
    const anims: Animation[] = []
    for (let i = 0; i < count; i++) {
      const a = (-Math.PI / 2) + ((i - (count - 1) / 2) * Math.PI) / (count + 1)
      const d = 46 + (i % 3) * 18
      const x = ox + Math.cos(a) * d
      const y = oy + Math.sin(a) * d
      const line = document.createElementNS(SVG, 'line')
      line.setAttribute('x1', String(ox))
      line.setAttribute('y1', String(oy))
      line.setAttribute('x2', String(x))
      line.setAttribute('y2', String(y))
      line.setAttribute('stroke', ink)
      line.setAttribute('stroke-width', '1.5')
      line.setAttribute('pathLength', '1')
      line.style.strokeDasharray = '1'
      const c = document.createElementNS(SVG, 'circle')
      c.setAttribute('cx', String(x))
      c.setAttribute('cy', String(y))
      c.setAttribute('r', String(3 + (i % 2) * 1.5))
      c.setAttribute('fill', ink)
      c.style.transformOrigin = `${x}px ${y}px`
      svg.append(line, c)
      anims.push(
        line.animate([{ strokeDashoffset: 1, opacity: 1 }, { strokeDashoffset: 0, opacity: 0.8, offset: 0.5 }, { strokeDashoffset: 0, opacity: 0 }], {
          duration: 560,
          delay: i * 18,
          easing: EASE_OUT,
          fill: 'both',
        }),
        c.animate([{ transform: 'scale(0)', opacity: 1 }, { transform: 'scale(1)', opacity: 1, offset: 0.45, easing: SPRING }, { transform: 'scale(0.6)', opacity: 0 }], {
          duration: 620,
          delay: 120 + i * 18,
          fill: 'both',
        }),
      )
    }
    return anims
  }

  /** El sello de seguridad cae y se asienta: bloquear y reportar se sienten firmes. */
  private stamp(layer: HTMLElement, ink: string) {
    const size = Math.min(innerWidth, innerHeight) * 0.22
    const svg = document.createElementNS(SVG, 'svg')
    svg.setAttribute('viewBox', '0 0 40 40')
    svg.setAttribute('width', String(size))
    svg.setAttribute('height', String(size))
    svg.style.cssText = `position:absolute;left:${(innerWidth - size) / 2}px;top:${(innerHeight - size) / 2}px`
    const pts: string[] = []
    for (let i = 0; i < 32; i++) {
      const a = (Math.PI * i) / 16 - Math.PI / 2
      const r = i % 2 ? 17.2 : 19.4
      pts.push(`${(20 + r * Math.cos(a)).toFixed(2)} ${(20 + r * Math.sin(a)).toFixed(2)}`)
    }
    const edge = document.createElementNS(SVG, 'path')
    edge.setAttribute('d', `M${pts.join('L')}Z`)
    edge.setAttribute('fill', 'none')
    edge.setAttribute('stroke', ink)
    edge.setAttribute('stroke-width', '1.6')
    const shield = document.createElementNS(SVG, 'path')
    shield.setAttribute('d', 'M20 10l7 3v6c0 5-3 8.5-7 10-4-1.5-7-5-7-10v-6z')
    shield.setAttribute('fill', 'none')
    shield.setAttribute('stroke', ink)
    shield.setAttribute('stroke-width', '1.6')
    shield.setAttribute('stroke-linejoin', 'round')
    svg.append(edge, shield)
    layer.append(svg)
    return [
      svg.animate(
        [
          { transform: 'scale(1.6) rotate(-12deg)', opacity: 0 },
          { transform: 'scale(1) rotate(0deg)', opacity: 1, offset: 0.35, easing: SPRING },
          { transform: 'scale(1)', opacity: 1, offset: 0.75 },
          { transform: 'scale(0.96)', opacity: 0 },
        ],
        { duration: 900, fill: 'forwards' },
      ),
    ]
  }

  /** Bienestar: un círculo que respira lento antes de cerrar la sesión. */
  private breathe(layer: HTMLElement, ink: string) {
    const veil = this.veil(layer, ink, 0.1)
    const size = Math.min(innerWidth, innerHeight) * 0.4
    const c = document.createElement('div')
    c.style.cssText = `position:absolute;left:${(innerWidth - size) / 2}px;top:${(innerHeight - size) / 2}px;width:${size}px;height:${size}px;border-radius:50%;border:2px solid ${ink}`
    layer.append(c)
    return [
      veil.animate([{ opacity: 0 }, { opacity: 1, offset: 0.2 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], { duration: 2000, fill: 'forwards' }),
      c.animate(
        [
          { transform: 'scale(0.5)', opacity: 0 },
          { transform: 'scale(1)', opacity: 1, offset: 0.45 },
          { transform: 'scale(0.85)', opacity: 1, offset: 0.8 },
          { transform: 'scale(1.1)', opacity: 0 },
        ],
        { duration: 2000, easing: EASE_IN_OUT, fill: 'forwards' },
      ),
    ]
  }
}
