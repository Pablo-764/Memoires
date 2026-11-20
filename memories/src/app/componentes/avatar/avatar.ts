import { Component, computed, input } from '@angular/core'
import { frameOf, type FrameFx } from '../../modelos/decor'

type Ring = 'none' | 'plain' | 'glow' | 'orbit' | 'double' | 'dash'

// Los marcos del catálogo se dibujan con cinco variantes del sistema nuevo
const RING: Record<FrameFx, Ring> = {
  none: 'plain', glow: 'glow', shimmer: 'plain', sparkle: 'glow', ripple: 'glow',
  orbit: 'orbit', atom: 'orbit', void: 'orbit',
  double: 'double', angel: 'double', wings: 'double', crystals: 'double', gems: 'double', runes: 'double',
  dash: 'dash', electric: 'dash', glitch: 'dash', flames: 'glow', horns: 'double', ears: 'double', vines: 'dash',
}

@Component({
  selector: 'app-avatar',
  styleUrl: './avatar.css',
  templateUrl: './avatar.html',
  host: {
    class: 'relative inline-grid shrink-0 place-items-center rounded-full',
    'aria-hidden': 'true',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    '[style.font-size.px]': 'size() * 0.42',
    '[style.--s.px]': 'size()',
    '[class.has-ring]': 'ring()',
  },
})
export class Avatar {
  readonly name = input.required<string>()
  readonly hue = input.required<number>()
  readonly size = input(48)
  readonly frame = input<string | undefined>('none')
  readonly photo = input<string | undefined>()
  /** Anillo del color de la intención activa (la del contenedor más cercano). */
  readonly ring = input(false)
  /** Sello de verificación en la esquina. */
  readonly verified = input(false)

  protected readonly initial = computed(() => this.name().trim()[0]?.toUpperCase() ?? '?')
  // OKLCH: todos los tonos con la misma luminosidad percibida, así ninguna inicial se lee peor
  protected readonly background = computed(() => `oklch(0.5 0.09 ${this.hue()})`)
  protected readonly frameInfo = computed(() => frameOf(this.frame()))
  protected readonly frameRing = computed<Ring>(() => (this.frameInfo().key === 'none' ? 'none' : RING[this.frameInfo().fx]))
  protected readonly thickness = computed(() => Math.max(2, this.size() * Math.min(this.frameInfo().width || 0.06, 0.08)))
  protected readonly accent = computed(() => {
    const { accent, bg } = this.frameInfo()
    return accent ?? (bg.startsWith('#') || bg.startsWith('light-dark') ? bg : 'var(--color-paper)')
  })
}
