import { Component, computed, input, output, signal } from '@angular/core'
import { INTEREST_GROUPS } from '../../modelos/intents'
import { matches } from '../../utilidades/text-search'
import { ChoiceChip } from '../choice-chip/choice-chip'
import { Icon } from '../icon/icon'

@Component({
  selector: 'app-interest-picker',
  imports: [ChoiceChip, Icon],
  styleUrl: './interest-picker.css',
  templateUrl: './interest-picker.html',
  host: { class: 'block' },
})
export class InterestPicker {
  readonly selected = input.required<string[]>()
  readonly toggled = output<string>()

  protected readonly query = signal('')
  protected readonly groups = computed(() => {
    const q = this.query().trim()
    if (!q) return INTEREST_GROUPS
    return INTEREST_GROUPS.map((g) => ({ name: g.name, items: g.items.filter((i) => matches(i, q)) })).filter((g) => g.items.length)
  })
}
