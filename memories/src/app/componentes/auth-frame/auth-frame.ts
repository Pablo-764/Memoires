import { Component, inject, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { Logo } from '../logo/logo'
import { ThemeIconButton } from '../theme-icon-button/theme-icon-button'

@Component({
  selector: 'app-auth-frame',
  imports: [RouterLink, Logo, ThemeIconButton],
  styleUrl: './auth-frame.css',
  templateUrl: './auth-frame.html',
})
export class AuthFrame {
  protected readonly store = inject(AppStore)
  readonly title = input.required<string>()
  readonly subtitle = input.required<string>()
}
