import { Injectable } from '@angular/core'
import type { Intent } from '../modelos/intents'
import { ICONS, type IconName } from '../componentes/icon/icons'

export type CelebrationTheme = Intent | 'pass' | 'block' | 'report' | 'save' | 'grand' | 'lucidite' | 'send' | 'wellbeing' | 'welcome'

interface Theme {
  main: IconName
  icons: IconName[]
  backdrop: string
  colors: string[]
  filled: boolean
}

const THEMES: Record<CelebrationTheme, Theme> = {
  romance: { main: 'heart', icons: ['heart'], backdrop: '#9f3b59', colors: ['#ffffff', '#ffd1e0', '#ff9fb6'], filled: true },
  friend: { main: 'handshake', icons: ['handshake', 'smile', 'users', 'coffee'], backdrop: '#b46a12', colors: ['#ffffff', '#fff1b8', '#ffe08a'], filled: false },
  plan: { main: 'ticket', icons: ['ticket', 'calendar-check', 'map-pin', 'footprints'], backdrop: '#007b63', colors: ['#ffffff', '#c9f2e6', '#59dac1'], filled: false },
  hobby: { main: 'gamepad-2', icons: ['gamepad-2', 'puzzle', 'dices', 'palette', 'music'], backdrop: '#6e4ea5', colors: ['#ffffff', '#dfe2ff', '#cab0ff'], filled: false },
  pass: { main: 'x', icons: ['x'], backdrop: '#3c4958', colors: ['#97a3b1', '#bec8d4'], filled: false },
  block: { main: 'ban', icons: ['shield-check', 'ban'], backdrop: '#13202f', colors: ['#ffa392', '#af2c1f'], filled: false },
  report: { main: 'flag', icons: ['flag', 'shield-check'], backdrop: '#13202f', colors: ['#ffba67', '#ffa392'], filled: false },
  save: { main: 'sparkles', icons: ['sparkles', 'star'], backdrop: '#1b5296', colors: ['#ffba67', '#cab0ff', '#ff9fb6'], filled: true },
  grand: { main: 'star', icons: ['star', 'sparkles'], backdrop: '#1b5296', colors: ['#ffffff', '#ffba67', '#cab0ff'], filled: true },
  lucidite: { main: 'moon-star', icons: ['moon-star', 'star', 'sparkles', 'gem'], backdrop: '#0e2743', colors: ['#ffffff', '#ffba67', '#bae1fb'], filled: true },
  send: { main: 'send', icons: ['send'], backdrop: '#1b5296', colors: ['#cab0ff', '#59dac1'], filled: false },
  wellbeing: { main: 'leaf', icons: ['leaf', 'flower-2', 'feather'], backdrop: '#007b63', colors: ['#ffffff', '#c9f2e6', '#d4fc79'], filled: false },
  welcome: { main: 'sparkles', icons: ['heart', 'handshake', 'ticket', 'gamepad-2', 'star'], backdrop: '#1b5296', colors: ['#ff9fb6', '#ffba67', '#59dac1', '#cab0ff'], filled: false },
}

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <T>(list: T[]) => list[Math.floor(Math.random() * list.length)]
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'

@Injectable({ providedIn: 'root' })
export class Celebrate {
  private readonly reduce = window.matchMedia('(prefers-reduced-motion: reduce)')

  /** Sin `at` y sin `giant` llueven desde abajo; con `at` estallan desde ese elemento. */
  play(themeKey: CelebrationTheme, opts: { at?: Element | null; giant?: boolean } = {}): Promise<void> {
    const theme = THEMES[themeKey]
    if (this.reduce.matches && !opts.giant) return Promise.resolve()

    const layer = document.createElement('div')
    layer.setAttribute('aria-hidden', 'true')
    layer.style.cssText = 'position:fixed;inset:0;z-index:70;overflow:hidden;pointer-events:none'
    document.body.append(layer)

    const animations: Animation[] = []
    if (opts.giant) {
      animations.push(...this.giant(layer, theme))
      if (!this.reduce.matches) animations.push(...this.rise(layer, theme, 42))
    } else if (opts.at) {
      animations.push(...this.burst(layer, theme, opts.at.getBoundingClientRect()))
    } else {
      animations.push(...this.rise(layer, theme, 24))
    }

    Promise.allSettled(animations.map((a) => a.finished)).then(() => layer.remove())
    const wait = this.reduce.matches ? 700 : opts.giant ? 2150 : 700
    return new Promise((resolve) => window.setTimeout(resolve, wait))
  }

  private glyph(layer: HTMLElement, icon: IconName, size: number, color: string, filled: boolean) {
    const el = document.createElement('div')
    el.style.cssText = `position:absolute;left:0;top:0;width:${size}px;height:${size}px;color:${color}`
    el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="${filled ? 0 : 1.6}" stroke-linecap="round" stroke-linejoin="round">${ICONS[icon]}</svg>`
    layer.append(el)
    return el
  }

  private giant(layer: HTMLElement, theme: Theme) {
    const veil = document.createElement('div')
    veil.style.cssText = `position:absolute;inset:0;background:${theme.backdrop}`
    layer.append(veil)
    const fade = veil.animate(
      [{ opacity: 0 }, { opacity: 0.94, offset: 0.14 }, { opacity: 0.94, offset: 0.72 }, { opacity: 0 }],
      { duration: 2600, easing: 'ease', fill: 'forwards' },
    )

    const size = Math.min(window.innerWidth, window.innerHeight) * 0.62
    const main = this.glyph(layer, theme.main, size, '#ffffff', theme.filled)
    const x = (window.innerWidth - size) / 2
    const y = (window.innerHeight - size) / 2
    const at = (s: number) => `translate(${x}px, ${y}px) scale(${s})`
    const beat = main.animate(
      [
        { transform: at(0.25), opacity: 0, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
        { transform: at(1.08), opacity: 1, offset: 0.2 },
        { transform: at(0.94), offset: 0.3 },
        { transform: at(1.12), offset: 0.4 },
        { transform: at(0.98), offset: 0.5 },
        { transform: at(1.04), opacity: 1, offset: 0.72, easing: 'ease-in' },
        { transform: at(1.5), opacity: 0 },
      ],
      { duration: 2600, fill: 'forwards' },
    )
    return [fade, beat]
  }

  private rise(layer: HTMLElement, theme: Theme, count: number) {
    const w = window.innerWidth
    const h = window.innerHeight
    return Array.from({ length: count }, () => {
      const size = rand(18, 74)
      const el = this.glyph(layer, pick(theme.icons), size, pick(theme.colors), theme.filled)
      const x = rand(-20, w - 20)
      const sway = rand(30, 110) * (Math.random() < 0.5 ? -1 : 1)
      const spin = rand(-40, 40)
      const pos = (px: number, py: number, deg: number) => `translate(${px}px, ${py}px) rotate(${deg}deg)`
      return el.animate(
        [
          { transform: pos(x, h + 90, 0), opacity: 0 },
          { transform: pos(x + sway, h * 0.72, spin * 0.4), opacity: 1, offset: 0.25 },
          { transform: pos(x - sway * 0.6, h * 0.36, -spin * 0.5), opacity: 1, offset: 0.62 },
          { transform: pos(x + sway * 0.4, -110, spin), opacity: 0 },
        ],
        { duration: rand(1500, 2900), delay: rand(0, 1050), easing: 'linear', fill: 'both' },
      )
    })
  }

  private burst(layer: HTMLElement, theme: Theme, origin: DOMRect) {
    const ox = origin.left + origin.width / 2
    const oy = origin.top + origin.height / 2
    return Array.from({ length: 18 }, () => {
      const size = rand(14, 40)
      const el = this.glyph(layer, pick(theme.icons), size, pick(theme.colors), theme.filled)
      const angle = rand(-165, -15) * (Math.PI / 180)
      const dist = rand(110, 360)
      const px = ox - size / 2
      const py = oy - size / 2
      const tx = px + Math.cos(angle) * dist
      const ty = py + Math.sin(angle) * dist
      const pos = (a: number, b: number, s: number, deg: number) => `translate(${a}px, ${b}px) rotate(${deg}deg) scale(${s})`
      const spin = rand(-120, 120)
      return el.animate(
        [
          { transform: pos(px, py, 0.3, 0), opacity: 0, easing: EASE_OUT },
          { transform: pos(tx, ty, 1, spin * 0.7), opacity: 1, offset: 0.55, easing: 'ease-in' },
          { transform: pos(tx + rand(-30, 30), ty + rand(70, 150), 0.7, spin), opacity: 0 },
        ],
        { duration: rand(1000, 1650), delay: rand(0, 160), fill: 'both' },
      )
    })
  }
}
