import { Component, input } from '@angular/core'

@Component({
  selector: 'button[appChip]',
  styleUrl: './choice-chip.css',
  templateUrl: './choice-chip.html',
  host: {
    type: 'button',
    class: 'btn min-h-10 px-4 text-sm font-medium',
    '[attr.aria-pressed]': 'selected()',
    '[class]': "selected() ? 'bg-accent text-on-accent' : 'bg-surface text-ink shadow-[inset_0_0_0_1.5px_var(--color-line)]'",
  },
})
export class ChoiceChip {
  readonly selected = input.required<boolean>()
}
