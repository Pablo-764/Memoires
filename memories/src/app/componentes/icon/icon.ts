import { Component, ElementRef, effect, inject, input } from '@angular/core'
import { ICONS, type IconName } from './icons'

@Component({
  selector: 'app-icon',
  styleUrl: './icon.css',
  templateUrl: './icon.html',
  host: { class: 'inline-flex shrink-0', 'aria-hidden': 'true' },
})
export class Icon {
  readonly name = input.required<IconName>()
  readonly size = input(24)
  readonly filled = input(false)

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
    effect(() => {
      const s = this.size()
      host.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="${this.filled() ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[this.name()]}</svg>`
    })
  }
}
