import { Component, computed, input } from '@angular/core'
import { effectOf } from '../../modelos/decor'
import { Icon } from '../icon/icon'

const noise = (n: number) => {
  const v = Math.sin(n * 91.17) * 43758.5453
  return v - Math.floor(v)
}

// Cuánto dura cada tipo de movimiento (base y variación, en segundos)
const TIMING: Record<string, [number, number]> = {
  up: [5, 6],
  down: [5, 6],
  twinkle: [2.4, 2.6],
  drift: [6, 5],
  orbit: [7, 6],
  burst: [2.4, 1.6],
  float: [3, 2.5],
  rain: [0.8, 0.6],
  bubble: [4.5, 4],
  flip: [4.5, 4],
}

/**
 * Partículas decorativas del perfil. Cada una tiene dos capas: la de afuera viaja
 * (sube, cae, orbita, estalla) y la de adentro se balancea o gira, así el movimiento
 * nunca se ve mecánico. La posición depende del índice para que no salte al repintar.
 */
@Component({
  selector: 'app-effect',
  imports: [Icon],
  styleUrl: './effect.css',
  templateUrl: './effect.html',
  host: { class: 'pointer-events-none absolute inset-0 block overflow-hidden', 'aria-hidden': 'true', '[class.is-preview]': 'preview()' },
})
export class Effect {
  readonly effect = input<string | undefined>('none')
  readonly count = input(12)
  // Miniatura del selector: quieta hasta que se pasa el cursor
  readonly preview = input(false)
  // Nombre que cubre los efectos inflados
  readonly name = input('mémoires')
  protected readonly glyphs = '01{}<>/=+*#;'

  protected readonly info = computed(() => effectOf(this.effect()))
  protected readonly dirClass = computed(() => 'fx-' + (this.info().dir === 'inflado' ? 'float' : this.info().dir))
  protected readonly particles = computed(() => {
    const { key, colors, dir } = this.info()
    if (key === 'none') return []
    // Los efectos inflados de antes flotan como el resto
    const [base, spread] = TIMING[dir === 'inflado' ? 'float' : dir] ?? [5, 5]
    const total = this.count()
    return Array.from({ length: total }, (_, i) => {
      const duration = base + noise(i + 120) * spread
      return {
        left: noise(i + 1) * 96,
        top: noise(i + 40) * 90,
        color: colors[i % colors.length],
        delay: -noise(i + 80) * duration * 1.5,
        duration,
        size: 11 + noise(i + 160) * 15,
        // Ángulo y radio para órbitas y estallidos (en % del lado menor)
        angle: (i / total) * 360 + noise(i + 200) * 30,
        radius: 16 + noise(i + 240) * 30,
        sway: 1.4 + noise(i + 280) * 1.6,
      }
    })
  })
}
