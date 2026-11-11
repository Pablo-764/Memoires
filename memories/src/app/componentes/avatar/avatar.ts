import { Component, computed, input } from '@angular/core'
import { frameOf } from '../../modelos/decor'

@Component({
  selector: 'app-avatar',
  styleUrl: './avatar.css',
  templateUrl: './avatar.html',
  host: {
    class: 'relative inline-grid shrink-0 place-items-center rounded-full font-display text-white',
    'aria-hidden': 'true',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    '[style.font-size.px]': 'size() * 0.42',
  },
})
export class Avatar {
  readonly name = input.required<string>()
  readonly hue = input.required<number>()
  readonly size = input(48)
  readonly frame = input<string | undefined>('none')
  readonly photo = input<string | undefined>()

  protected readonly initial = computed(() => this.name().trim()[0]?.toUpperCase() ?? '?')
  protected readonly background = computed(() => `hsl(${this.hue()} 38% 46%)`)
  protected readonly frameInfo = computed(() => frameOf(this.frame()))
  protected readonly thickness = computed(() => Math.max(2, this.size() * this.frameInfo().width))
}
