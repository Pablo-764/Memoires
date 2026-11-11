import { Component, DestroyRef, ElementRef, ViewEncapsulation, afterNextRender, computed, inject } from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import { AppStore } from '../../servicios/app-store'

interface Word {
  text: string
  serif: boolean
}

interface Row {
  words: Word[]
  tone: string
  // Segundos que tarda en recorrer media fila y hacia dónde va
  speed: number
  dir: 1 | -1
}

const LINES = [
  'pareja / amistad / un plan / pasatiempo',
  'café / conciertos / senderismo / cine / lectura',
  'di qué buscas / conoce a quien busca lo mismo',
  'juegos de mesa / fotografía / yoga / museos',
  'mémoires / mémoires / mémoires',
  'correr / cocinar / karaoke / ajedrez / viajes',
  'hoy busco / hoy busco / hoy busco',
  'pintura / baile / series / voluntariado / anime',
  'alguien con quien ir / alguien con quien hablar',
]
const TONES = ['romance', 'friend', 'plan', 'hobby', 'accent']

// Cada palabra alterna entre la grotesca ancha y la cursiva serif
const ROWS: Row[] = LINES.map((line, i) => ({
  words: line.split(' / ').map((text, j) => ({ text, serif: (i + j) % 2 === 1 })),
  tone: `var(--color-${TONES[i % TONES.length]})`,
  speed: 70 + ((i * 17) % 45),
  dir: i % 2 ? 1 : -1,
}))

const INTERACTIVE = 'a, button, input, textarea, select, label, summary, [role="button"], [role="tab"], [role="radio"], [contenteditable], .card, app-modal'

/**
 * Fondo tipográfico: un muro de palabras gigantes en contorno que se desliza en diagonal.
 * Bajo el cursor, una lupa revela las mismas palabras rellenas de color; al desplazar la
 * página las filas se recorren y se inclinan con la velocidad; un clic abre la lupa.
 */
@Component({
  selector: 'app-backdrop',
  imports: [NgTemplateOutlet],
  styleUrl: './backdrop.css',
  templateUrl: './backdrop.html',
  encapsulation: ViewEncapsulation.None,
  host: { 'aria-hidden': 'true', '[style.--glow]': 'glow()', '[style.background-color]': "store.ambient() ?? 'var(--color-mist)'" },
})
export class Backdrop {
  protected readonly store = inject(AppStore)
  protected readonly rows = ROWS
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement

  protected readonly glow = computed(() => {
    const tone = this.store.backdropTone() ?? (this.store.loggedIn() ? this.store.preferredIntent() : 'hobby')
    return `var(--color-${tone})`
  })

  constructor() {
    const destroyRef = inject(DestroyRef)
    afterNextRender(() => {
      const fine = matchMedia('(hover: hover) and (pointer: fine)')
      const still = matchMedia('(prefers-reduced-motion: reduce)')
      const s = this.host.style
      const target = { x: innerWidth / 2, y: innerHeight * 0.35 }
      const pos = { ...target }
      let scroll = scrollY
      let shown = scrollY
      let skew = 0
      let frame = 0

      const paint = () => {
        frame = 0
        const k = still.matches ? 1 : 0.16
        pos.x += (target.x - pos.x) * k
        pos.y += (target.y - pos.y) * k
        // El desplazamiento se suaviza; la inclinación sale de la velocidad
        const prev = shown
        shown += (scroll - shown) * (still.matches ? 1 : 0.12)
        const v = shown - prev
        skew += (Math.max(-14, Math.min(14, v * 0.5)) - skew) * 0.2
        s.setProperty('--mx', `${pos.x.toFixed(1)}px`)
        s.setProperty('--my', `${pos.y.toFixed(1)}px`)
        s.setProperty('--sy', shown.toFixed(1))
        s.setProperty('--skew', `${still.matches ? 0 : skew.toFixed(2)}deg`)
        const moving =
          Math.abs(target.x - pos.x) > 0.4 || Math.abs(target.y - pos.y) > 0.4 || Math.abs(scroll - shown) > 0.4 || Math.abs(skew) > 0.05
        if (moving) frame = requestAnimationFrame(paint)
      }
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(paint)
      }

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse' || !fine.matches) return
        this.host.classList.add('is-live')
        target.x = e.clientX
        target.y = e.clientY
        schedule()
      }
      const onLeave = () => this.host.classList.remove('is-live')
      const onScroll = () => {
        scroll = scrollY
        schedule()
      }
      // Clic en una zona vacía: la lupa se abre un instante
      let burst = 0
      const onDown = (e: PointerEvent) => {
        if (e.button !== 0 || still.matches) return
        const t = e.target as Element | null
        if (!t || t.closest(INTERACTIVE) || getSelection()?.toString()) return
        target.x = e.clientX
        target.y = e.clientY
        this.host.classList.add('is-live', 'is-burst')
        schedule()
        clearTimeout(burst)
        burst = window.setTimeout(() => this.host.classList.remove('is-burst'), 520)
      }

      paint()
      addEventListener('pointermove', onMove, { passive: true })
      addEventListener('pointerdown', onDown, { passive: true })
      addEventListener('scroll', onScroll, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
      destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame)
        clearTimeout(burst)
        removeEventListener('pointermove', onMove)
        removeEventListener('pointerdown', onDown)
        removeEventListener('scroll', onScroll)
        document.documentElement.removeEventListener('pointerleave', onLeave)
      })
    })
  }
}
