import { Component, computed, inject, output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { type Filters } from '../../utilidades/matching'
import { FILTER_LABELS, TIERS, type FilterKey } from '../../modelos/plans'
import { Icon } from '../icon/icon'
import { PillGroup } from '../../directivas/pill-group'

@Component({
  selector: 'app-filters-panel',
  imports: [FormsModule, Icon, PillGroup],
  styleUrl: './filters-panel.css',
  templateUrl: './filters-panel.html',
})
export class FiltersPanel {
  readonly closed = output<void>()

  protected readonly store = inject(AppStore)
  private readonly router = inject(Router)
  protected readonly labels = FILTER_LABELS
  protected readonly filters = this.store.filters
  protected readonly allowed = computed(() => new Set<FilterKey>(TIERS[this.store.tier()].filters))
  protected readonly sharedOptions = [0, 1, 2, 3]
  protected readonly availability = ['any', 'Entre semana', 'Fines de semana'] as const
  protected readonly languages = ['any', 'Inglés', 'Francés', 'Japonés']

  protected set(f: Partial<Filters>) {
    this.store.setFilters(f)
  }

  protected setAgeMin(value: number) {
    this.set({ ageMin: Math.min(Number(value), this.filters().ageMax - 1) })
  }

  protected setAgeMax(value: number) {
    this.set({ ageMax: Math.max(Number(value), this.filters().ageMin + 1) })
  }

  protected trackLeft() {
    return ((this.filters().ageMin - 18) / 42) * 100
  }

  protected trackRight() {
    return 100 - ((this.filters().ageMax - 18) / 42) * 100
  }

  protected tierFor(k: FilterKey) {
    return k === 'age' || k === 'interests' ? 'Grand' : 'Lucidité'
  }

  protected upgrade() {
    this.closed.emit()
    this.router.navigateByUrl('/app/suscripcion')
  }

  protected reset() {
    this.set({ ageMin: 18, ageMax: 60, minShared: 0, availability: 'any', language: 'any', verifiedOnly: false })
  }
}
