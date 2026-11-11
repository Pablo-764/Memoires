import { Component, computed, input } from '@angular/core'
import { INTENTS, type Intent } from '../../modelos/intents'

@Component({
  selector: 'app-intent-badge',
  styleUrl: './intent-badge.css',
  templateUrl: './intent-badge.html',
  host: { class: 'inline-flex items-center gap-1.5 rounded-full font-semibold', '[class]': 'hostClass()' },
})
export class IntentBadge {
  readonly intent = input.required<Intent>()
  readonly size = input<'sm' | 'md'>('sm')

  protected readonly info = computed(() => INTENTS[this.intent()])
  protected readonly hostClass = computed(
    () => `${this.info().soft} ${this.info().text} ${this.size() === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`,
  )
}
