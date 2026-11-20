import { Component, inject } from '@angular/core'
import { ThemeService } from '../../servicios/theme'
import { Icon } from '../icon/icon'

@Component({
  selector: 'button[appThemeIcon]',
  imports: [Icon],
  styleUrl: './theme-icon-button.css',
  templateUrl: './theme-icon-button.html',
  host: {
    class: 'btn btn-icon',
    '[attr.aria-label]': "theme.mode() === 'dark' ? 'Activar modo claro' : 'Activar modo nocturno'",
    '(pointerenter)': 'theme.prepare()',
    '(focus)': 'theme.prepare()',
    '(click)': "theme.set(theme.mode() === 'dark' ? 'light' : 'dark', { x: $event.clientX, y: $event.clientY })",
  },
})
export class ThemeIconButton {
  protected readonly theme = inject(ThemeService)
}
