import { Component, DestroyRef, ElementRef, afterNextRender, computed, inject, input } from '@angular/core'
import { bannerOf } from '../../modelos/decor'

/**
 * Fondo de perfil: una escena animada del catálogo o la imagen que subió la persona.
 * Las animaciones solo corren mientras el fondo está en pantalla; al pasar el cursor
 * por la tarjeta que lo contiene, las capas se desplazan con profundidad y cruza un destello.
 */
@Component({
  selector: 'app-banner',
  styleUrls: ['./banner.css', './banner-temas.css', './banner-colecciones.css'],
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
  protected readonly scene = computed(() => (this.custom() ? 'photo' : this.info().scene))
  // Columnas de caracteres para la escena de terminal (siempre las mismas)
  protected readonly codeColumns = Array.from({ length: 12 }, (_, i) => ({
    left: i * 8.4 + 1,
    speed: 3 + ((i * 37) % 5),
    delay: -((i * 53) % 7),
    text: Array.from({ length: 16 }, (_, j) => '01{}<>/=+*#;$'[(i * 7 + j * 5) % 13]).join(''),
  }))
  // Piezas de las escenas de colección (siempre las mismas, sin azar al repintar)
  protected readonly runeOuter = 'ΨΩΔΛΞΦΣΘΠΓΨΩΔΛΞΦ'.split('')
  protected readonly runeInner = 'ΣΘΠΓΛΞΦΩ'.split('')
  protected readonly petals = [0, 1, 2, 3, 4, 5, 6, 7]
  protected readonly shards = [0, 1, 2, 3, 4, 5, 6]
  protected readonly bubbles = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  // Onomatopeya de la escena de historieta, distinta por fondo
  protected readonly popWord = computed(() => (this.info().key === 'sabado' ? '¡JA!' : '¡ZAS!'))
  protected readonly color = (i: number) => {
    const c = this.info().colors
    return c.length ? c[i % c.length] : '#ffffff'
  }

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
    const destroyRef = inject(DestroyRef)
    afterNextRender(() => {
      // Pausa lo que no se ve: en Conexiones puede haber decenas de fondos
      const io = new IntersectionObserver(([entry]) => host.classList.toggle('is-off', !entry.isIntersecting), { rootMargin: '80px' })
      io.observe(host)

      const fine = matchMedia('(hover: hover) and (pointer: fine)')
      const zone = host.parentElement?.closest<HTMLElement>('a, button, article, .card, [data-banner-zone]') ?? host.parentElement
      if (!zone) return () => io.disconnect()
      const enter = () => fine.matches && host.classList.add('is-hover')
      const leave = () => {
        host.classList.remove('is-hover')
        host.style.removeProperty('--hx')
        host.style.removeProperty('--hy')
      }
      const move = (e: PointerEvent) => {
        if (!fine.matches) return
        const r = host.getBoundingClientRect()
        host.style.setProperty('--hx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
        host.style.setProperty('--hy', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
      }
      zone.addEventListener('pointerenter', enter)
      zone.addEventListener('pointerleave', leave)
      zone.addEventListener('pointermove', move, { passive: true })
      destroyRef.onDestroy(() => {
        io.disconnect()
        zone.removeEventListener('pointerenter', enter)
        zone.removeEventListener('pointerleave', leave)
        zone.removeEventListener('pointermove', move)
      })
      return undefined
    })
  }
}
