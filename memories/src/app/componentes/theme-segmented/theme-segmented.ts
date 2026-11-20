import { Component, computed, inject, input } from '@angular/core'
import { ThemeService, type ThemeChoice } from '../../servicios/theme'

export interface ThemeOption {
  value: ThemeChoice
  label: string
}

const THEME_OPTIONS: ThemeOption[] = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Nocturno' },
  { value: 'system', label: 'Sistema' },
]

@Component({
  selector: 'app-theme-segmented',
  styleUrl: './theme-segmented.css',
  templateUrl: './theme-segmented.html',
  host: { class: 'block' },
})
export class ThemeSegmented {
  readonly options = input(THEME_OPTIONS)

  protected readonly theme = inject(ThemeService)
  // Si no se ofrece "Sistema", se marca el modo que se está viendo
  protected readonly current = computed(() =>
    this.options().some((o) => o.value === this.theme.choice()) ? this.theme.choice() : this.theme.mode(),
  )
  protected readonly index = computed(() => Math.max(0, this.options().findIndex((o) => o.value === this.current())))
}
