import { Component, computed, input } from '@angular/core'
import { frameOf } from '../../modelos/decor'

@Component({
  selector: 'app-avatar',
  styleUrls: ['./avatar.css', './avatar-ornamentos.css'],
  templateUrl: './avatar.html',
  host: {
    class: 'relative inline-grid shrink-0 place-items-center rounded-full font-display text-white',
    'aria-hidden': 'true',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    '[style.font-size.px]': 'size() * 0.42',
    '[style.--s.px]': 'size()',
  },
})
export class Avatar {
  readonly name = input.required<string>()
  readonly hue = input.required<number>()
  readonly size = input(48)
  readonly frame = input<string | undefined>('none')
  readonly photo = input<string | undefined>()

  protected readonly initial = computed(() => this.name().trim()[0]?.toUpperCase() ?? '?')
  protected readonly background = computed(() => `oklch(0.52 0.1 ${this.hue()})`)
  // OKLCH: todos los tonos con la misma luminosidad percibida, así ninguna inicial se lee peor
  protected readonly frameInfo = computed(() => frameOf(this.frame()))
  protected readonly thickness = computed(() => Math.max(2, this.size() * this.frameInfo().width))
  // Color de lunas, destellos y ondas: el propio si lo tiene, si no el del aro cuando es liso
  protected readonly accent = computed(() => {
    const { accent, bg } = this.frameInfo()
    return accent ?? (bg.startsWith('#') || bg.startsWith('light-dark') ? bg : '#ffffff')
  })
  protected readonly sparks = [0, 1, 2, 3, 4]
  // Segundo color de los ornamentos: punta de la llama, borde del ala, interior de la oreja
  protected readonly accent2 = computed(() => this.frameInfo().accent2 ?? this.accent())
  // Posiciones fijas alrededor del aro (en grados) para cada tipo de ornamento
  protected readonly ring10 = Array.from({ length: 10 }, (_, i) => i * 36)
  protected readonly ring8 = Array.from({ length: 8 }, (_, i) => i * 45 + 22.5)
  protected readonly ring6 = Array.from({ length: 6 }, (_, i) => i * 60)
  protected readonly glyphs = 'ΨΩΔΛΞΦΣΘΠΓΨΩ'.split('')
}
