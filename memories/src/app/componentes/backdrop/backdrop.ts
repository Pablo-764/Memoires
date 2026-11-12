import { Component, DestroyRef, ElementRef, ViewEncapsulation, afterNextRender, computed, inject, signal, viewChild, viewChildren } from '@angular/core'
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
  'mémoires / Arleth / mémoires / Arleth',
  'correr / cocinar / karaoke / ajedrez / viajes',
  'hoy busco / hoy busco / hoy busco',
  'alguien con quien ir / alguien con quien hablar',
  'flores para Arleth / estrellas / atardeceres / Arleth',
]
const TONES = ['romance', 'friend', 'plan', 'hobby', 'accent']

// Cada palabra alterna entre la grotesca ancha y la cursiva serif
const ROWS: Row[] = LINES.map((line, i) => ({
  words: line.split(' / ').map((text, j) => ({ text, serif: (i + j) % 2 === 1 })),
  tone: `var(--color-${TONES[i % TONES.length]})`,
  speed: 80 + ((i * 17) % 45),
  dir: i % 2 ? 1 : -1,
}))

// Radio de la ventana de color (px)
const R = 210

/**
 * Fondo tipográfico: un muro de palabras gigantes en contorno que se desliza en diagonal.
 * Con mouse, una ventana sin borde deja ver las mismas palabras rellenas de color;
 * al desplazar la página las filas se recorren y se inclinan con la velocidad.
 * Rendimiento: todo se mueve con transform escrito directo en cada elemento (sin variables
 * heredadas que recalculen estilos), y la capa de color solo existe con puntero fino.
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
  protected readonly lens = signal(false)
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private readonly rowEls = viewChildren<ElementRef<HTMLElement>>('row')
  private readonly lensBox = viewChild<ElementRef<HTMLElement>>('lensBox')
  private readonly lensInner = viewChild<ElementRef<HTMLElement>>('lensInner')

  protected readonly glow = computed(() => {
    const tone = this.store.backdropTone() ?? (this.store.loggedIn() ? this.store.preferredIntent() : 'hobby')
    return `var(--color-${tone})`
  })

  constructor() {
    const destroyRef = inject(DestroyRef)
    afterNextRender(() => {
      const fine = matchMedia('(hover: hover) and (pointer: fine)')
      const still = matchMedia('(prefers-reduced-motion: reduce)')
      const syncLens = () => this.lens.set(fine.matches && !still.matches)
      syncLens()

      const target = { x: innerWidth / 2, y: innerHeight * 0.35 }
      const pos = { ...target }
      let scroll = scrollY
      let shown = scrollY
      let skew = 0
      let frame = 0

      const paint = () => {
        frame = 0
        const reduced = still.matches
        pos.x += (target.x - pos.x) * (reduced ? 1 : 0.18)
        pos.y += (target.y - pos.y) * (reduced ? 1 : 0.18)
        const prev = shown
        shown += (scroll - shown) * (reduced ? 1 : 0.14)
        skew += (Math.max(-12, Math.min(12, (shown - prev) * 0.45)) - skew) * 0.2
        if (Math.abs(skew) < 0.02) skew = 0

        // Filas: recorrido por scroll e inclinación por velocidad, directo en cada fila
        if (!reduced) {
          this.rowEls().forEach(({ nativeElement: el }, i) => {
            const dir = ROWS[i % ROWS.length].dir
            el.style.transform = `translate3d(${(shown * dir * 0.3).toFixed(1)}px, 0, 0) skewX(${skew.toFixed(2)}deg)`
          })
        }

        // Ventana: se mueve con el cursor y su interior en sentido contrario
        const box = this.lensBox()?.nativeElement
        const inner = this.lensInner()?.nativeElement
        if (box && inner) {
          const x = pos.x - R
          const y = pos.y - R
          box.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
          inner.style.transform = `translate3d(${(-x).toFixed(1)}px, ${(-y).toFixed(1)}px, 0)`
        }

        const moving =
          Math.abs(target.x - pos.x) > 0.3 || Math.abs(target.y - pos.y) > 0.3 || Math.abs(scroll - shown) > 0.3 || skew !== 0
        if (moving) frame = requestAnimationFrame(paint)
      }
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(paint)
      }

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return
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
      const onMedia = () => {
        syncLens()
        schedule()
      }

      schedule()
      addEventListener('pointermove', onMove, { passive: true })
      addEventListener('scroll', onScroll, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
      fine.addEventListener('change', onMedia)
      still.addEventListener('change', onMedia)
      destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame)
        removeEventListener('pointermove', onMove)
        removeEventListener('scroll', onScroll)
        document.documentElement.removeEventListener('pointerleave', onLeave)
        fine.removeEventListener('change', onMedia)
        still.removeEventListener('change', onMedia)
      })
    })
  }
}
