import { Component, computed, input } from '@angular/core'

@Component({
  selector: 'app-meter',
  styleUrl: './meter.css',
  templateUrl: './meter.html',
  host: { class: 'block' },
})
export class Meter {
  readonly used = input.required<number>()
  readonly total = input.required<number>()
  readonly label = input.required<string>()

  protected readonly unlimited = computed(() => !Number.isFinite(this.total()))
  protected readonly pct = computed(() => (this.unlimited() ? 100 : Math.min(100, (this.used() / this.total()) * 100)))
  protected readonly leftLabel = computed(() =>
    this.unlimited() ? 'Ilimitado' : `${Math.max(0, this.total() - this.used()).toLocaleString('es-MX')} disponibles`,
  )
}
