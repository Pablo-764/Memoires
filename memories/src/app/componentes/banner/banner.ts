import { Component, DestroyRef, ElementRef, afterNextRender, computed, inject, input } from '@angular/core'
import { bannerOf, type BannerScene } from '../../modelos/decor'

type Overlay = 'none' | 'stars' | 'blobs' | 'asanoha' | 'threads' | 'lines'

// Cada escena del catálogo se dibuja con una de cinco capas del sistema nuevo,
// sobre el color base propio del fondo.
const OVERLAY: Record<BannerScene, Overlay> = {
  static: 'none',
  stars: 'stars', galaxy: 'stars', aurora: 'stars', blackhole: 'stars', portal: 'stars', hyper: 'stars', planet: 'stars', anime: 'stars',
  mesh: 'blobs', sun: 'blobs', flow: 'blobs', waves: 'blobs', lava: 'blobs', caustics: 'blobs', spotlight: 'blobs', fog: 'blobs', rings: 'blobs',
  pattern: 'asanoha', hexgrid: 'asanoha', crystal: 'asanoha', royal: 'asanoha', runes: 'asanoha', sumi: 'asanoha', frost: 'asanoha', castle: 'asanoha',
  code: 'lines', crt: 'lines', synth: 'lines', glitch: 'lines', pixel: 'lines', rain: 'lines', lightning: 'lines', noir: 'lines', film: 'lines', comic: 'lines', city: 'lines',
  garden: 'threads', 'garden-grow': 'threads',
}

// Hilos de constelación del fondo (en % del ancho y alto)
const STARS = [
  [8, 62], [20, 30], [34, 54], [47, 22], [58, 48], [71, 18], [83, 40], [93, 70],
] as const

/**
 * Fondo de perfil: el color del catálogo o la imagen que subió la persona, con una
 * capa animada muy discreta. La animación se pausa cuando el fondo no está en pantalla.
 */
@Component({
  selector: 'app-banner',
  styleUrl: './banner.css',
  templateUrl: './banner.html',
  host: {
    class: 'absolute inset-0 block overflow-hidden',
    'aria-hidden': 'true',
    '[class.is-preview]': 'preview()',
  },
})
export class Banner {
  readonly decoration = input<string | undefined>('none')
  readonly custom = input<string | undefined>()
  // Miniatura del selector: quieta hasta que se pasa el cursor encima
  readonly preview = input(false)

  protected readonly info = computed(() => bannerOf(this.decoration()))
  protected readonly overlay = computed<Overlay | 'photo'>(() => (this.custom() ? 'photo' : OVERLAY[this.info().scene] ?? 'none'))
  protected readonly stars = STARS
  protected readonly links = STARS.slice(1).map((p, i) => ({ a: STARS[i], b: p }))
  protected readonly color = (i: number) => {
    const c = this.info().colors
    return c.length ? c[i % c.length] : 'rgb(255 255 255 / 0.8)'
  }

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
    const destroyRef = inject(DestroyRef)
    afterNextRender(() => {
      // Pausa lo que no se ve: en Conexiones puede haber decenas de fondos
      const io = new IntersectionObserver(([entry]) => host.classList.toggle('is-off', !entry.isIntersecting), { rootMargin: '80px' })
      io.observe(host)
      destroyRef.onDestroy(() => io.disconnect())
    })
  }
}
