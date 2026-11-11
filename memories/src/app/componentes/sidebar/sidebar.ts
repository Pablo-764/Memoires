import { Component, computed, inject, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import type { NavItem } from '../../modelos/navegacion'
import { TIERS } from '../../modelos/plans'
import { Avatar } from '../avatar/avatar'
import { Icon } from '../icon/icon'
import { Logo } from '../logo/logo'
import { ThemeSegmented, type ThemeOption } from '../theme-segmented/theme-segmented'

// Panel lateral nocturno de escritorio
@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, Avatar, Icon, Logo, ThemeSegmented],
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
  host: { class: 'contents' },
})
export class Sidebar {
  readonly items = input.required<NavItem[]>()
  readonly active = input.required<number>()

  protected readonly store = inject(AppStore)
  protected readonly themes: ThemeOption[] = [
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Nocturno' },
  ]
  protected readonly tierInfo = computed(() => TIERS[this.store.tier()])
  protected readonly limit = computed(() => this.tierInfo().weeklyMatches)
  protected readonly left = computed(() => (Number.isFinite(this.limit()) ? Math.max(0, this.limit() - this.store.matchesUsed()) : null))
  protected readonly displayName = computed(() => this.store.me().name || 'Tú')
}
