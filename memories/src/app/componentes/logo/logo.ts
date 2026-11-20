import { Component, input } from '@angular/core'

// Logotipo: MÉMOIRES en Mémoires Display (Blackout Midnight ampliada con Fontificar).
// El acento de la É es un punto de la tinta activa: la persona que une los hilos.
@Component({
  selector: 'app-logo',
  styleUrl: './logo.css',
  templateUrl: './logo.html',
  host: {
    class: 'logo',
    translate: 'no',
    '[class.logo-draw]': 'draw()',
    '[class.logo-bright]': 'bright()',
    '[attr.data-size]': 'size()',
  },
})
export class Logo {
  /** Compatibilidad: el logotipo ya no lleva marca aparte. */
  readonly mark = input(true)
  readonly bright = input(false)
  /** Florece letra por letra (solo en la portada). */
  readonly draw = input(false)
  readonly size = input<'sm' | 'md' | 'lg' | 'hero'>('md')
  readonly letters = ['M', 'E', 'M', 'O', 'I', 'R', 'E', 'S']
}
