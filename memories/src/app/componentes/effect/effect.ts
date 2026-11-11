import { Component, computed, input } from '@angular/core'
import { effectOf } from '../../modelos/decor'
import { Icon } from '../icon/icon'

const noise = (n: number) => {
  const v = Math.sin(n * 91.17) * 43758.5453
  return v - Math.floor(v)
}

// Partículas decorativas del perfil; la posición depende del índice para que no salten al repintar
@Component({
  selector: 'app-effect',
  imports: [Icon],
  styleUrl: './effect.css',
  templateUrl: './effect.html',
  host: { class: 'pointer-events-none absolute inset-0 block overflow-hidden', 'aria-hidden': 'true' },
})
export class Effect {
  readonly effect = input<string | undefined>('none')
  readonly count = input(12)

  protected readonly info = computed(() => effectOf(this.effect()))
  protected readonly particles = computed(() => {
    const { key, colors } = this.info()
    if (key === 'none') return []
    return Array.from({ length: this.count() }, (_, i) => ({
      left: noise(i + 1) * 96,
      top: noise(i + 40) * 90,
      color: colors[i % colors.length],
      delay: -noise(i + 80) * 9,
      duration: 5 + noise(i + 120) * 6,
      size: 11 + noise(i + 160) * 15,
    }))
  })
}
