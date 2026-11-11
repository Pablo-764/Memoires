import { Component, computed, input } from '@angular/core'
import { bannerOf } from '../../modelos/decor'

// Fondo de perfil: una decoración del catálogo o la imagen que subió la persona
@Component({
  selector: 'app-banner',
  styleUrl: './banner.css',
  templateUrl: './banner.html',
  host: { class: 'absolute inset-0 block overflow-hidden', 'aria-hidden': 'true' },
})
export class Banner {
  readonly decoration = input<string | undefined>('none')
  readonly custom = input<string | undefined>()

  protected readonly info = computed(() => bannerOf(this.decoration()))
}
