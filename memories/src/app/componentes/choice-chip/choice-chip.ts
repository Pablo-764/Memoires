import { Component, input } from '@angular/core'

// Chip de selección: lavado de la intención y borde de su tinta cuando está elegido
@Component({
  selector: 'button[appChip]',
  styleUrl: './choice-chip.css',
  templateUrl: './choice-chip.html',
  host: {
    type: 'button',
    class: 'choice-chip',
    '[attr.aria-pressed]': 'selected()',
  },
})
export class ChoiceChip {
  readonly selected = input.required<boolean>()
}
