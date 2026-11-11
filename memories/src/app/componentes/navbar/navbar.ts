import { Component, computed, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { TIERS } from '../../modelos/plans'
import { Icon } from '../icon/icon'
import { Logo } from '../logo/logo'
import { ThemeIconButton } from '../theme-icon-button/theme-icon-button'

// Cabecera superior en celular
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, Icon, Logo, ThemeIconButton],
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
  host: { class: 'contents' },
})
export class Navbar {
  protected readonly store = inject(AppStore)
  protected readonly tierInfo = computed(() => TIERS[this.store.tier()])
}
