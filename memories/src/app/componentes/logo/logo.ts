import { Component, input } from '@angular/core'

// Dos arcos que se enciman forman la "m": dos personas, dos recuerdos. Donde se tocan,
// las tintas se mezclan como en una impresión risográfica. El rombo es el acento de la "é".
@Component({
  selector: 'app-logo',
  styleUrl: './logo.css',
  templateUrl: './logo.html',
  host: { class: 'inline-flex items-center gap-2', translate: 'no', '[class.logo-draw]': 'draw()', '[class.logo-bright]': 'bright()' },
})
export class Logo {
  readonly mark = input(true)
  readonly bright = input(false)
  readonly draw = input(false)
}
