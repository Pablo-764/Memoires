import { Component, computed, inject, input } from '@angular/core'
import { TextAlbum } from '../../servicios/text-album'
import { effectOf } from '../../modelos/decor'
import { Icon } from '../icon/icon'
import { Inflado } from '../inflado/inflado'
import type { Intent } from '../../modelos/intents'

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
  imports: [Icon, Inflado],
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
  protected readonly inflado = computed(() => {
    const { key, colors, dir } = this.info()
    if (dir !== 'inflado') return null
    const shape: Intent = key.endsWith('corazon') ? 'romance' : key.endsWith('taza') ? 'friend' : key.endsWith('boleto') ? 'plan' : 'hobby'
    return { shape, colors: { body0: colors[0], body1: colors[1], rim: colors[2], text: colors[3] } }
  })
  protected readonly glyphs = '01{}<>/=+*#;'
  protected readonly textAlbum = inject(TextAlbum)
  protected readonly textGlyphs = '*+.o*~'

  protected readonly info = computed(() => effectOf(this.effect()))
  protected readonly particles = computed(() => {
    const { key, colors, dir } = this.info()
    if (key === 'none' || dir === 'inflado') return []
    const [base, spread] = TIMING[dir] ?? [5, 5]
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
