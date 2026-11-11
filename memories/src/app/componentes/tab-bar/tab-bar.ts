import { Component, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import type { NavItem } from '../../modelos/navegacion'
import { Icon } from '../icon/icon'

// Barra flotante inferior en celular
@Component({
  selector: 'app-tab-bar',
  imports: [RouterLink, Icon],
  styleUrl: './tab-bar.css',
  templateUrl: './tab-bar.html',
  host: { class: 'contents' },
})
export class TabBar {
  readonly items = input.required<NavItem[]>()
  readonly active = input.required<number>()
}
